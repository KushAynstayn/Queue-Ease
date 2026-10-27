
import unittest
from datetime import date, timedelta

from app import app


def make_records(count=20, service_id=1):
    """Create synthetic daily records for endpoint tests."""
    start = date(2026, 1, 1)
    records = []

    for offset in range(count):
        current_date = start + timedelta(days=offset)

        records.append({
            "service_id": service_id,
            "forecast_date": current_date.isoformat(),
            "total_transactions": 20 + offset,
            "completed_transactions": 18 + offset,
            "average_wait_minutes": 10.0 + offset * 0.5,
            "average_service_minutes": 6.0,
            "peak_hour": 14,
        })

    return records


class FlaskEndpointTests(unittest.TestCase):
    def setUp(self):
        app.config["TESTING"] = True
        self.client = app.test_client()

    def test_health_endpoint(self):
        response = self.client.get("/health")

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["status"], "ok")

    def test_validate_endpoint_accepts_valid_records(self):
        response = self.client.post(
            "/forecasting/validate",
            json={"records": make_records(3)},
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["status"], "success")
        self.assertEqual(response.json["record_count"], 3)
        self.assertFalse(response.json["model_training_performed"])

    def test_readiness_endpoint_reports_insufficient_data(self):
        response = self.client.post(
            "/forecasting/readiness",
            json={
                "records": make_records(5),
                "minimum_observations": 10,
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertFalse(response.json["production_ready"])
        self.assertEqual(
            response.json["services"][0]["status"],
            "insufficient_data",
        )

    def test_evaluate_endpoint_succeeds(self):
        response = self.client.post(
            "/forecasting/evaluate",
            json={
                "records": make_records(),
                "target": "total_transactions",
                "minimum_observations": 10,
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["status"], "success")
        self.assertFalse(response.json["model_saved"])
        self.assertFalse(response.json["production_ready"])
        self.assertEqual(
            response.json["result"]["test_observations"],
            4,
        )

    def test_predict_endpoint_succeeds(self):
        response = self.client.post(
            "/forecasting/predict",
            json={
                "records": make_records(),
                "target": "total_transactions",
                "forecast_date": "2026-01-21",
                "minimum_observations": 10,
            },
        )

        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json["status"], "success")
        self.assertEqual(response.json["predicted_value"], 40)
        self.assertFalse(response.json["model_saved"])
        self.assertFalse(response.json["production_ready"])

    def test_invalid_target_is_rejected(self):
        response = self.client.post(
            "/forecasting/evaluate",
            json={
                "records": make_records(),
                "target": "peak_hour",
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["status"], "error")

    def test_insufficient_data_is_rejected(self):
        response = self.client.post(
            "/forecasting/predict",
            json={
                "records": make_records(5),
                "target": "total_transactions",
                "forecast_date": "2026-01-21",
                "minimum_observations": 10,
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "Insufficient observations",
            response.json["message"],
        )

    def test_malformed_request_is_rejected(self):
        response = self.client.post(
            "/forecasting/validate",
            json={"wrong_field": []},
        )

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json["status"], "error")

    def test_invalid_forecast_date_is_rejected(self):
        response = self.client.post(
            "/forecasting/predict",
            json={
                "records": make_records(),
                "target": "total_transactions",
                "forecast_date": "not-a-date",
                "minimum_observations": 10,
            },
        )

        self.assertEqual(response.status_code, 400)
        self.assertIn(
            "valid ISO date",
            response.json["message"],
        )


if __name__ == "__main__":
    unittest.main()
