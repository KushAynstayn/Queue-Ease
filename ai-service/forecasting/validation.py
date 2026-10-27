
from datetime import date, datetime
from math import isfinite
from typing import Any


def validate_daily_records(records: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """
    Validate daily historical records before forecasting.

    Expected fields:
        service_id
        forecast_date
        total_transactions
        completed_transactions
        average_wait_minutes
        average_service_minutes
        peak_hour

    This function validates data only. It does not train a model or
    claim that the supplied records are genuine production data.
    """

    if not isinstance(records, list):
        raise ValueError("Records must be provided as a list.")

    validated_records: list[dict[str, Any]] = []
    seen_dates: set[tuple[int, date]] = set()

    required_fields = {
        "service_id",
        "forecast_date",
        "total_transactions",
        "completed_transactions",
        "average_wait_minutes",
        "average_service_minutes",
        "peak_hour",
    }

    for index, record in enumerate(records):
        if not isinstance(record, dict):
            raise ValueError(f"Record {index} must be an object.")

        missing = required_fields - record.keys()
        if missing:
            raise ValueError(
                f"Record {index} is missing fields: "
                f"{', '.join(sorted(missing))}."
            )

        service_id = record["service_id"]
        if (
            isinstance(service_id, bool)
            or not isinstance(service_id, int)
            or service_id <= 0
        ):
            raise ValueError(
                f"Record {index}: service_id must be a positive integer."
            )

        raw_date = record["forecast_date"]
        try:
            if isinstance(raw_date, datetime):
                parsed_date = raw_date.date()
            elif isinstance(raw_date, date):
                parsed_date = raw_date
            elif isinstance(raw_date, str):
                parsed_date = date.fromisoformat(raw_date)
            else:
                raise ValueError
        except (ValueError, TypeError):
            raise ValueError(
                f"Record {index}: forecast_date must be a valid ISO date "
                "(YYYY-MM-DD)."
            ) from None

        total = record["total_transactions"]
        completed = record["completed_transactions"]
        peak_hour = record["peak_hour"]

        for field_name, value in (
            ("total_transactions", total),
            ("completed_transactions", completed),
            ("peak_hour", peak_hour),
        ):
            if isinstance(value, bool) or not isinstance(value, int):
                raise ValueError(
                    f"Record {index}: {field_name} must be an integer."
                )

        if total < 0:
            raise ValueError(
                f"Record {index}: total_transactions cannot be negative."
            )

        if completed < 0 or completed > total:
            raise ValueError(
                f"Record {index}: completed_transactions must be between "
                "zero and total_transactions."
            )

        if not 0 <= peak_hour <= 23:
            raise ValueError(
                f"Record {index}: peak_hour must be between 0 and 23."
            )

        average_wait = _validate_non_negative_number(
            record["average_wait_minutes"],
            "average_wait_minutes",
            index,
        )
        average_service = _validate_non_negative_number(
            record["average_service_minutes"],
            "average_service_minutes",
            index,
        )

        key = (service_id, parsed_date)
        if key in seen_dates:
            raise ValueError(
                f"Record {index}: duplicate date for service {service_id}."
            )
        seen_dates.add(key)

        validated_records.append(
            {
                "service_id": service_id,
                "forecast_date": parsed_date.isoformat(),
                "total_transactions": total,
                "completed_transactions": completed,
                "average_wait_minutes": average_wait,
                "average_service_minutes": average_service,
                "peak_hour": peak_hour,
            }
        )

    return validated_records


def _validate_non_negative_number(
    value: Any,
    field_name: str,
    record_index: int,
) -> float:
    if isinstance(value, bool) or not isinstance(value, (int, float)):
        raise ValueError(
            f"Record {record_index}: {field_name} must be a number."
        )

    if not isfinite(value) or value < 0:
        raise ValueError(
            f"Record {record_index}: {field_name} must be finite "
            "and non-negative."
        )

    return float(value)
