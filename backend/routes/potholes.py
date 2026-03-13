from fastapi import APIRouter
from utils.response import success, error
from services.dynamo_service import get_all_incidents

router = APIRouter()

@router.get("/potholes")
def get_potholes():
    try:
        incidents = get_all_incidents()
        return success(incidents, "Potholes fetched successfully")
    except Exception as e:
        return error(str(e))