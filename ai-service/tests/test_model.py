
import unittest
from datetime import date, timedelta

from forecasting.model import (
    _date_features,
    evaluate_daily_target,
    fit_daily_target,
    predict_daily_target,
)


def make_records(count=20, service_id=1):
    start = date(2026, 1, 1)
    records = []

    for offset in range(count):
        current_date = start + timedelta(days=offset)

        records.append(
            {
                "service_id": service_id,
                "forecast_date": current_date.isoformat(),
                "total_transactions": 20 + offset,
                "completed_transactions": 18 + offset,
                "average_wait_minutes": 10.0 + offset * 0.5,
                "average_service_minutes": 6.0,
                "peak_hour": 14,
            }
        )

    return records


class ForecastingModelTests(unittest.TestCase):
    def test_evaluation_uses_chronological_holdout(self):
        result = evaluate_daily_target(
            make_records(),
            "total_transactions",
        )

        self.assertEqual(
            result["evaluation_method"],
            "chronological_holdout",
        )
        self.assertGreater(result["training_observations"], 0)
        self.assertGreater(result["test_observations"], 0)
        self.assertLess(
            result["training_end_date"],
            result["test_start_date"],
        )
        self.assertFalse(result["production_ready"])
        self.assertFalse(result["model_saved"])

    def test_wait_time_model_can_be_evaluated(self):
        result = evaluate_daily_target(
            make_records(),
            "average_wait_minutes",
        )

        self.assertEqual(
            result["target"],
            "average_wait_minutes",
        )
        self.assertGreaterEqual(
            result["linear_regression_mae"],
            0,
        )
        self.assertGreaterEqual(
            result["mean_baseline_mae"],
            0,
        )

    def test_insufficient_data_is_rejected(self):
        with self.assertRaisesRegex(
            ValueError,
            "Insufficient observations",
        ):
            evaluate_daily_target(
                make_records(count=5),
                "total_transactions",
            )

    def test_multiple_services_are_rejected(self):
        records = make_records()
        records += make_records(service_id=2)

        with self.assertRaisesRegex(
            ValueError,
            "one service at a time",
        ):
            evaluate_daily_target(
                records,
                "total_transactions",
            )

    def test_fitted_model_predicts_non_negative_count(self):
        fitted = fit_daily_target(
            make_records(),
            "total_transactions",
        )

        prediction = predict_daily_target(
            fitted,
            "2026-01-21",
        )

        self.assertGreaterEqual(prediction, 0)
        self.assertIsInstance(prediction, int)

    def test_wait_time_prediction_is_non_negative(self):
        fitted = fit_daily_target(
            make_records(),
            "average_wait_minutes",
        )

        prediction = predict_daily_target(
            fitted,
            "2026-01-21",
        )

        self.assertGreaterEqual(prediction, 0)
        self.assertIsInstance(prediction, float)

    def test_invalid_prediction_date_is_rejected(self):
        fitted = fit_daily_target(
            make_records(),
            "total_transactions",
        )

        with self.assertRaisesRegex(
            ValueError,
            "valid ISO date",
        ):
            predict_daily_target(fitted, "not-a-date")

    def test_unsupported_target_is_rejected(self):
        with self.assertRaisesRegex(
            ValueError,
            "target_field must be",
        ):
            evaluate_daily_target(
                make_records(),
                "peak_hour",
            )

    def test_weekday_features_are_cyclical(self):
        monday = _date_features("2026-01-05")
        next_monday = _date_features("2026-01-12")

        self.assertAlmostEqual(monday[0], next_monday[0])
        self.assertAlmostEqual(monday[1], next_monday[1])

    def test_zero_completed_transactions_are_excluded_from_wait_model(self):
        records = make_records()

        for record in records[:3]:
            record["completed_transactions"] = 0

        fitted = fit_daily_target(
            records,
            "average_wait_minutes",
        )

        self.assertEqual(fitted["observation_count"], 17)

    def test_zero_completed_transactions_do_not_supply_wait_observations(self):
        records = make_records(count=12)

        for record in records:
            record["completed_transactions"] = 0

        with self.assertRaisesRegex(
            ValueError,
            "Insufficient observations",
        ):
            fit_daily_target(
                records,
                "average_wait_minutes",
            )


if __name__ == "__main__":
    unittest.main()
