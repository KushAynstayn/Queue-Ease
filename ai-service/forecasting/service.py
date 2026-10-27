
from collections import Counter
from typing import Any

from forecasting.validation import validate_daily_records


# This is a minimum threshold for attempting an initial model experiment.
# It does not guarantee that the data is sufficient for accurate forecasting.
MINIMUM_OBSERVATIONS_PER_SERVICE = 30


def prepare_daily_records(
    records: list[dict[str, Any]],
) -> list[dict[str, Any]]:
    """
    Validate and sort daily historical aggregates.

    Each record represents one service on one date.
    This function does not train a model or generate predictions.
    """
    validated = validate_daily_records(records)

    return sorted(
        validated,
        key=lambda record: (
            record["service_id"],
            record["forecast_date"],
        ),
    )


def assess_training_readiness(
    records: list[dict[str, Any]],
    minimum_observations: int = MINIMUM_OBSERVATIONS_PER_SERVICE,
) -> dict[str, Any]:
    """
    Assess whether each service has enough daily observations to attempt
    an initial model experiment.

    Passing this check does not mean a model is accurate or production-ready.
    """
    if (
        isinstance(minimum_observations, bool)
        or not isinstance(minimum_observations, int)
        or minimum_observations < 2
    ):
        raise ValueError(
            "minimum_observations must be an integer of at least 2."
        )

    prepared = prepare_daily_records(records)

    counts = Counter(
        record["service_id"] for record in prepared
    )

    services = []

    for service_id, observation_count in sorted(counts.items()):
        ready = observation_count >= minimum_observations

        services.append(
            {
                "service_id": service_id,
                "observation_count": observation_count,
                "minimum_observations": minimum_observations,
                "ready_for_initial_experiment": ready,
                "status": (
                    "eligible_for_experiment"
                    if ready
                    else "insufficient_data"
                ),
            }
        )

    return {
        "total_records": len(prepared),
        "service_count": len(counts),
        "minimum_observations": minimum_observations,
        "services": services,
        "model_training_performed": False,
        "production_ready": False,
    }
