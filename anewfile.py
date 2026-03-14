from fastapi import FastAPI
from pymongo import MongoClient

app = FastAPI(title="Road AI API")

# ----------------------------
# MongoDB Connection
# ----------------------------
client = MongoClient("mongodb://localhost:27017")
db = client["road_ai"]
pothole_collection = db["potholes"]

# ----------------------------
# API 1: Test Database
# ----------------------------
@app.get("/db/test")
def test_database():
    count = pothole_collection.count_documents({})
    return {
        "status": "Database connected",
        "pothole_records": count
    }

# ----------------------------
# API 2: Report Pothole
# ----------------------------
@app.post("/pothole/report")
def report_pothole(location: str, severity: int):

    pothole = {
        "location": location,
        "severity": severity
    }

    pothole_collection.insert_one(pothole)

    return {
        "message": "Pothole stored successfully",
        "data": pothole
    }

# ----------------------------
# API 3: Get Statistics
# ----------------------------
@app.get("/stats")
def get_stats():

    total = pothole_collection.count_documents({})
    severe = pothole_collection.count_documents({"severity": {"$gte": 3}})

    return {
        "total_potholes": total,
        "high_severity_potholes": severe
    }