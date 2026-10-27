
import unittest

from forecasting.service import prepare_daily_records
from forecasting.validation import validate_daily_records


def make_record(**overrides):
    record = {
        "service_id": 1,
        "forecast_date": "2026-10-20",
        "total_transactions": 10,
        "completed_transactions": 8,
        "average_wait_minutes": 12.5,
        "average_service_minutes": 6.0,
        "peak_hour": 14,
    }
    record.update(overrides)
    return record


class ValidationTests(unittest.TestCase):
    def test_accepts_valid_record(self):
        result = validate_daily_records([make_record()])

        self.assertEqual(len(result), 1)
        self.assertEqual(result[0]["service_id"], 1)
        self.assertEqual(result[0]["forecast_date"], "2026-10-20")

    def test_rejects_missing_field(self):
        record = make_record()
        del record["total_transactions"]

        with self.assertRaisesRegex(ValueError, "missing fields"):
            validate_daily_records([record])

    def test_rejects_negative_transaction_count(self):
        with self.assertRaisesRegex(ValueError, "cannot be negative"):
            validate_daily_records(
                [make_record(total_transactions=-1)]
            )

    def test_rejects_completed_greater_than_total(self):
        with self.assertRaisesRegex(ValueError, "between zero and"):
            validate_daily_records(
                [make_record(total_transactions=5, completed_transactions=6)]
            )

    def test_rejects_invalid_peak_hour(self):
        with self.assertRaisesRegex(ValueError, "between 0 and 23"):
            validate_daily_records([make_record(peak_hour=24)])

    def test_rejects_negative_wait(self):
        with self.assertRaisesRegex(ValueError, "non-negative"):
            validate_daily_records(
                [make_record(average_wait_minutes=-2)]
            )

    def test_rejects_duplicate_service_date(self):
        with self.assertRaisesRegex(ValueError, "duplicate date"):
            validate_daily_records(
                [make_record(), make_record()]
            )

    def test_service_sorts_records_by_date(self):
        records = [
            make_record(forecast_date="2026-10-22"),
            make_record(forecast_date="2026-10-20"),
        ]

        result = prepare_daily_records(records)

        self.assertEqual(
            [item["forecast_date"] for item in result],
            ["2026-10-20", "2026-10-22"],
        )


if __name__ == "__main__":
    unittest.main()
