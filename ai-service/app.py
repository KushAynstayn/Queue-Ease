
from flask import Flask, jsonify, request

from forecasting.model import (
    evaluate_daily_target,
    fit_daily_target,
    predict_daily_target,
)
from forecasting.service import (
    assess_training_readiness,
    prepare_daily_records,
)

app = Flask(__name__)

# Limit incoming JSON requests to 1 MB.
app.config["MAX_CONTENT_LENGTH"] = 1 * 1024 * 1024


@app.get("/health")
def health():
    return jsonify({
        "status": "ok",
        "service": "Queue Ease AI Forecasting",
        "message": "AI service is running.",
    }), 200


def get_records_from_request():
    """Validate the top-level JSON structure."""
    payload = request.get_json(silent=True)

    if not isinstance(payload, dict):
        raise ValueError("Request body must be a JSON object.")

    records = payload.get("records")

    if not isinstance(records, list):
        raise ValueError("The 'records' field must be a list.")

    return payload, records


def get_target(payload):
    """Validate the requested forecasting target."""
    target = payload.get("target")

    allowed_targets = {
        "total_transactions",
        "average_wait_minutes",
    }

    if target not in allowed_targets:
        raise ValueError(
            "The 'target' field must be total_transactions "
            "or average_wait_minutes."
        )

    return target


def get_minimum_observations(payload):
    """Validate the requested minimum training sample size."""
    minimum = payload.get("minimum_observations", 10)

    if (
        isinstance(minimum, bool)
        or not isinstance(minimum, int)
        or minimum < 3
    ):
        raise ValueError(
            "'minimum_observations' must be an integer of at least 3."
        )

    return minimum


@app.post("/forecasting/validate")
def validate_forecasting_data():
    """Validate historical records without training a model."""
    try:
        _, records = get_records_from_request()
        prepared = prepare_daily_records(records)

        return jsonify({
            "status": "success",
            "message": "Historical records validated successfully.",
            "record_count": len(prepared),
            "records": prepared,
            "model_training_performed": False,
        }), 200

    except ValueError as error:
        return jsonify({
            "status": "error",
            "message": str(error),
        }), 400


@app.post("/forecasting/readiness")
def check_forecasting_readiness():
    """Check whether each service has enough daily observations."""
    try:
        payload, records = get_records_from_request()

        minimum = payload.get("minimum_observations", 30)

        result = assess_training_readiness(
            records,
            minimum_observations=minimum,
        )

        return jsonify({
            "status": "success",
            "message": "Training readiness assessed successfully.",
            **result,
        }), 200

    except ValueError as error:
        return jsonify({
            "status": "error",
            "message": str(error),
        }), 400


@app.post("/forecasting/evaluate")
def evaluate_forecasting_model():
    """
    Compare regression with a baseline using historical holdout data.

    This endpoint does not save a model or forecast result.
    """
    try:
        payload, records = get_records_from_request()
        target = get_target(payload)
        minimum = get_minimum_observations(payload)

        result = evaluate_daily_target(
            records,
            target,
            minimum_observations=minimum,
        )

        return jsonify({
            "status": "success",
            "message": "Experimental model evaluation completed.",
            "result": result,
            "production_ready": False,
            "model_saved": False,
        }), 200

    except ValueError as error:
        return jsonify({
            "status": "error",
            "message": str(error),
        }), 400


@app.post("/forecasting/predict")
def predict_forecasting_target():
    """
    Fit a temporary model and predict a target for a requested date.

    Predictions are experimental. No model or result is persisted.
    """
    try:
        payload, records = get_records_from_request()
        target = get_target(payload)
        minimum = get_minimum_observations(payload)
        forecast_date = payload.get("forecast_date")

        if not isinstance(forecast_date, str):
            raise ValueError(
                "'forecast_date' must be a string in YYYY-MM-DD format."
            )

        fitted = fit_daily_target(
            records,
            target,
            minimum_observations=minimum,
        )

        prediction = predict_daily_target(
            fitted,
            forecast_date,
        )

        return jsonify({
            "status": "success",
            "message": "Experimental prediction generated.",
            "service_id": fitted["service_id"],
            "target": target,
            "forecast_date": forecast_date,
            "predicted_value": prediction,
            "training_observations": fitted["observation_count"],
            "training_start_date": fitted["training_start_date"],
            "training_end_date": fitted["training_end_date"],
            "model_name": "LinearRegression",
            "model_saved": False,
            "production_ready": False,
            "warning": (
                "Experimental prediction only. Accuracy on genuine "
                "Queue Ease operational data has not been established."
            ),
        }), 200

    except ValueError as error:
        return jsonify({
            "status": "error",
            "message": str(error),
        }), 400


@app.errorhandler(413)
def request_too_large(_error):
    return jsonify({
        "status": "error",
        "message": "Request body exceeds the 1 MB limit.",
    }), 413


@app.errorhandler(500)
def internal_server_error(_error):
    app.logger.exception("Unexpected internal server error.")

    return jsonify({
        "status": "error",
        "message": "An unexpected internal server error occurred.",
    }), 500


if __name__ == "__main__":
    app.run(
        host="127.0.0.1",
        port=5001,
        debug=False,
    )
