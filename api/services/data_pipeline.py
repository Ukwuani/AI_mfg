import random

def generate_sensor_data():
    return {
        "temperature": random.uniform(20, 100),
        "vibration": random.uniform(0, 10),
        "pressure": random.uniform(1, 10),
        "runtime_hours": random.uniform(0, 5000)
    }