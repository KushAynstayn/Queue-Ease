
import unittest

from forecasting.service import (
    assess_training_readiness,
    prepare_daily_records,
)


def make_record(service_id, forecast_date):
    return {
        "service_id": service_id,
        "forecast_date": forecast_date,
        "total_transactions": 10,
        "completed_transactions": 8,
        "average_wait_minutes": 12.5,
        "average_service_minutes": 6.0,
        "peak_hour": 14,
    }


class ForecastingServiceTests(unittest.TestCase):
    def test_records_are_sorted_by_service_and_date(self):
        records = [
            make_record(2, "2026-10-22"),
            make_record(1, "2026-10-22"),
            make_record(1, "2026-10-20"),
        ]

        result = prepare_daily_records(records)

        self.assertEqual(
            [
                (item["service_id"], item["forecast_date"])
                for item in result
            ],
            [
                (1, "2026-10-20"),
                (1, "2026-10-22"),
                (2, "2026-10-22"),
            ],
        )

    def test_empty_dataset_is_not_ready(self):
        result = assess_training_readiness([])

        self.assertEqual(result["total_records"], 0)
        self.assertEqual(result["service_count"], 0)
        self.assertEqual(result["services"], [])
        self.assertFalse(result["model_training_performed"])
        self.assertFalse(result["production_ready"])

    def test_insufficient_observations_are_flagged(self):
        records = [
            make_record(1, "2026-10-20"),
            make_record(1, "2026-10-21"),
            make_record(1, "2026-10-22"),
        ]

        result = assess_training_readiness(records)

        service = result["services"][0]

        self.assertEqual(service["service_id"], 1)
        self.assertEqual(service["observation_count"], 3)
        self.assertEqual(service["status"], "insufficient_data")
        self.assertFalse(service["ready_for_initial_experiment"])

    def test_service_readiness_is_assessed_independently(self):
        records = [
            make_record(1, f"2026-09-{day:02d}")
            for day in range(1, 6)
        ]
        records += [
            make_record(2, f"2026-09-{day:02d}")
            for day in range(1, 4)
        ]

        result = assess_training_readiness(
            records,
            minimum_observations=5,
        )

        service_results = {
            item["service_id"]: item
            for item in result["services"]
        }

        self.assertTrue(
            service_results[1]["ready_for_initial_experiment"]
        )
        self.assertFalse(
            service_results[2]["ready_for_initial_experiment"]
        )

    def test_invalid_minimum_observations_are_rejected(self):
        with self.assertRaises(ValueError):
            assess_training_readiness(
                [],
                minimum_observations=1,
            )


if __name__ == "__main__":
    unittest.main()
