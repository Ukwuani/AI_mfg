from fastapi import APIRouter
from api.schemas.sensor import SensorData
from api.services.model import model_service
from api.services.data_pipeline import generate_sensor_data

router = APIRouter()

@router.post("/predict")
def predict(sensor: SensorData):
    result = model_service.predict(sensor)
    return {
        "input": sensor,
        "prediction": result
    }

@router.get("/simulate")
def simulate():
    data = generate_sensor_data()
    result = model_service.predict(type("obj", (object,), data))
    
    return {
        "simulated_data": data,
        "prediction": result
    }