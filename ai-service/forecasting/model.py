
from __future__ import annotations

from datetime import date
from math import ceil, isfinite, pi, sin, cos
from typing import Any

import numpy as np
from sklearn.dummy import DummyRegressor
from sklearn.linear_model import LinearRegression
from sklearn.metrics import mean_absolute_error
from sklearn.pipeline import Pipeline
from sklearn.preprocessing import StandardScaler

from forecasting.service import prepare_daily_records


MINIMUM_TRAINING_OBSERVATIONS = 10
MINIMUM_TEST_OBSERVATIONS = 2


def _date_features(forecast_date: str) -> list[float]:
    """Create calendar and trend features from an ISO date."""
    parsed = date.fromisoformat(forecast_date)

    day_of_week = parsed.weekday()
    day_of_year = parsed.timetuple().tm_yday

    # Cyclical encoding preserves the relationship between adjacent
    # weekdays and between the end and beginning of a calendar year.
    return [
        sin(2 * pi * day_of_week / 7),
        cos(2 * pi * day_of_week / 7),
        sin(2 * pi * day_of_year / 365.2425),
        cos(2 * pi * day_of_year / 365.2425),
        float(parsed.toordinal()),
    ]


def _build_features(
    records: list[dict[str, Any]],
) -> np.ndarray:
    return np.asarray(
        [
            _date_features(record["forecast_date"])
            for record in records
        ],
        dtype=float,
    )


def _validate_training_data(
    records: list[dict[str, Any]],
    target_field: str,
    minimum_observations: int,
) -> tuple[list[dict[str, Any]], np.ndarray]:
    """Validate records and prepare one numeric target."""
    if (
        isinstance(minimum_observations, bool)
        or not isinstance(minimum_observations, int)
        or minimum_observations < 3
    ):
        raise ValueError(
            "minimum_observations must be an integer of at least 3."
        )

    prepared = prepare_daily_records(records)

    if not prepared:
        raise ValueError("No historical records were supplied.")

    service_ids = {record["service_id"] for record in prepared}

    if len(service_ids) != 1:
        raise ValueError(
            "Train one service at a time. Records contain multiple services."
        )

    eligible = []

    for record in prepared:
        value = record[target_field]

        if isinstance(value, bool) or not isinstance(value, (int, float)):
            continue

        if not isfinite(value) or value < 0:
            continue

        if (
            target_field == "average_wait_minutes"
            and record["completed_transactions"] == 0
        ):
            continue

        eligible.append(record)

    if len(eligible) < minimum_observations:
        raise ValueError(
            f"Insufficient observations for {target_field}: "
            f"found {len(eligible)}, need at least "
            f"{minimum_observations}."
        )

    targets = np.asarray(
        [float(record[target_field]) for record in eligible],
        dtype=float,
    )

    return eligible, targets


def _make_regression_model() -> Pipeline:
    return Pipeline(
        [
            ("scaler", StandardScaler()),
            ("regressor", LinearRegression()),
        ]
    )


def evaluate_daily_target(
    records: list[dict[str, Any]],
    target_field: str,
    minimum_observations: int = MINIMUM_TRAINING_OBSERVATIONS,
) -> dict[str, Any]:
    """Compare regression with a mean baseline using chronological holdout."""
    allowed_targets = {
        "total_transactions",
        "average_wait_minutes",
    }

    if target_field not in allowed_targets:
        raise ValueError(
            "target_field must be total_transactions "
            "or average_wait_minutes."
        )

    eligible, targets = _validate_training_data(
        records,
        target_field,
        minimum_observations,
    )

    features = _build_features(eligible)

    test_count = max(
        MINIMUM_TEST_OBSERVATIONS,
        ceil(len(eligible) * 0.2),
    )
    train_count = len(eligible) - test_count

    if train_count < 2:
        raise ValueError(
            "Insufficient training observations after chronological split."
        )

    x_train = features[:train_count]
    x_test = features[train_count:]
    y_train = targets[:train_count]
    y_test = targets[train_count:]

    regression_model = _make_regression_model()
    baseline_model = DummyRegressor(strategy="mean")

    regression_model.fit(x_train, y_train)
    baseline_model.fit(x_train, y_train)

    regression_predictions = regression_model.predict(x_test)
    baseline_predictions = baseline_model.predict(x_test)

    regression_mae = float(
        mean_absolute_error(y_test, regression_predictions)
    )
    baseline_mae = float(
        mean_absolute_error(y_test, baseline_predictions)
    )

    return {
        "service_id": eligible[0]["service_id"],
        "target": target_field,
        "model_name": "LinearRegression",
        "evaluation_method": "chronological_holdout",
        "training_observations": train_count,
        "test_observations": test_count,
        "training_start_date": eligible[0]["forecast_date"],
        "training_end_date": eligible[train_count - 1]["forecast_date"],
        "test_start_date": eligible[train_count]["forecast_date"],
        "test_end_date": eligible[-1]["forecast_date"],
        "linear_regression_mae": regression_mae,
        "mean_baseline_mae": baseline_mae,
        "beats_baseline": regression_mae < baseline_mae,
        "model_fitted": True,
        "model_saved": False,
        "production_ready": False,
    }


def fit_daily_target(
    records: list[dict[str, Any]],
    target_field: str,
    minimum_observations: int = MINIMUM_TRAINING_OBSERVATIONS,
) -> dict[str, Any]:
    """Fit an in-memory model; this does not save a model artifact."""
    allowed_targets = {
        "total_transactions",
        "average_wait_minutes",
    }

    if target_field not in allowed_targets:
        raise ValueError(
            "target_field must be total_transactions "
            "or average_wait_minutes."
        )

    eligible, targets = _validate_training_data(
        records,
        target_field,
        minimum_observations,
    )

    model = _make_regression_model()
    model.fit(_build_features(eligible), targets)

    return {
        "model": model,
        "service_id": eligible[0]["service_id"],
        "target": target_field,
        "observation_count": len(eligible),
        "training_start_date": eligible[0]["forecast_date"],
        "training_end_date": eligible[-1]["forecast_date"],
    }


def predict_daily_target(
    fitted_model: dict[str, Any],
    forecast_date: str,
) -> float | int:
    """Predict a future target, enforcing valid non-negative output."""
    if not isinstance(forecast_date, str):
        raise ValueError(
            "forecast_date must be a valid ISO date (YYYY-MM-DD)."
        )

    try:
        parsed_date = date.fromisoformat(forecast_date)
    except ValueError:
        raise ValueError(
            "forecast_date must be a valid ISO date (YYYY-MM-DD)."
        ) from None

    if parsed_date.isoformat() != forecast_date:
        raise ValueError(
            "forecast_date must use the YYYY-MM-DD format."
        )

    model = fitted_model.get("model")

    if model is None:
        raise ValueError("A fitted model is required.")

    prediction = float(
        model.predict(
            np.asarray([_date_features(forecast_date)], dtype=float)
        )[0]
    )

    if not isfinite(prediction):
        raise ValueError("The model produced a non-finite prediction.")

    prediction = max(0.0, prediction)

    if fitted_model.get("target") == "total_transactions":
        return int(round(prediction))

    return prediction
