from fastapi import APIRouter
from api.schemas.sensor import SensorData
from api.services.model import model_service
from api.services.data_pipeline import generate_sensor_data

router = APIRouter()

@router.post("/predict")
def predict(sensor: SensorData):
    # Predict failure risk based on sensor data
    result = model_service.predict(sensor)
    return {
        "input": sensor,
        "prediction": result
    }

@router.get("/simulate")
def simulate():
    # Generate random sensor data and predict failure risk :: PLC Data Simulation
    data = generate_sensor_data()
    result = model_service.predict(type("obj", (object,), data))
    
    return {
        "simulated_data": data,
        "prediction": result
    }