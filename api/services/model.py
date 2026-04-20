import joblib
import numpy as np
import os

base_dir = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = base_dir+"/../../models/model.pkl"

class ModelService:
    def __init__(self):
        if os.path.exists(MODEL_PATH):
            self.model = joblib.load(MODEL_PATH)
        else:
            print("None Is FOuxndsrg" + MODEL_PATH)
            self.model = None

    def predict(self, data):
        if not self.model:
            return {"error": "Model not loaded"}

        features = np.array([[ 
            data.temperature,
            data.vibration,
            data.pressure,
            data.runtime_hours
        ]])

        prediction = self.model.predict(features)[0]

        return {
            "failure_risk": int(prediction),
            "status": "HIGH RISK" if prediction == 1 else "NORMAL"
        }

model_service = ModelService()