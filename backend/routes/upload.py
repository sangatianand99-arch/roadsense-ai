from fastapi import APIRouter, UploadFile, File, Form
from utils.response import success, error
from services.aws_service import upload_to_s3
from services.bedrock_service import analyze_image_with_bedrock
from services.dynamo_service import save_incident
from config import settings
import io

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

        # Read image bytes once
        image_bytes = await image.read()

        # REAL AI ANALYSIS via Bedrock Vision
        ai_result = analyze_image_with_bedrock(image_bytes)

        # UPLOAD TO S3
        s3_result = upload_to_s3(io.BytesIO(image_bytes), image.content_type)

        # SAVE TO DYNAMODB
        incident = save_incident(
            latitude=latitude,
            longitude=longitude,
            severity=ai_result["severity"],
            image_url=s3_result["image_url"],
            ai_result=ai_result
        )

        return success(incident, "Incident recorded successfully")

    except Exception as e:
        return error(str(e))