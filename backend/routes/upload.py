from fastapi import APIRouter, UploadFile, File, Form
from utils.response import success, error
from services.aws_service import upload_to_s3
from services.integration_service import mock_ai_analysis
from services.dynamo_service import save_incident
from config import settings

router = APIRouter()

@router.post("/upload")
async def upload_incident(
    image: UploadFile = File(...),
    latitude: float = Form(...),
    longitude: float = Form(...)
):
    try:
        if image.content_type not in settings.ALLOWED_TYPES:
            return error("Invalid file type")

        # AI ANALYSIS (mock for now)
        ai_result = mock_ai_analysis()

        # UPLOAD TO S3
        s3_result = upload_to_s3(image.file, image.content_type)

        # SAVE TO DYNAMODB
        incident = save_incident(
            latitude=latitude,
            longitude=longitude,
            severity=ai_result["severity"],
            image_url=s3_result["image_url"]
        )

        return success(incident, "Incident recorded successfully")

    except Exception as e:
        return error(str(e))
