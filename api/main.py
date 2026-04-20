from fastapi import FastAPI
from api.routes import predict

app = FastAPI(
    title="Industrial AI API",
    description="Predictive Maintenance API for Automation Systems",
    version="1.0"
)

app.include_router(predict.router, prefix="/api/v1")

@app.get("/")
def root():
    return {"message": "Industrial AI API is running"}