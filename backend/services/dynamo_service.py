import boto3
import uuid
from datetime import datetime
from botocore.exceptions import ClientError
from config import settings

dynamodb = boto3.resource(
    "dynamodb",
    aws_access_key_id=settings.AWS_ACCESS_KEY,
    aws_secret_access_key=settings.AWS_SECRET_KEY,
    region_name=settings.AWS_REGION
)

table = dynamodb.Table(settings.DYNAMODB_TABLE)

def save_incident(latitude: float, longitude: float, severity: str, image_url: str) -> dict:
    incident_id = str(uuid.uuid4())
    timestamp = datetime.utcnow().isoformat()

    item = {
        "incident_id": incident_id,
        "timestamp": timestamp,
        "latitude": str(latitude),
        "longitude": str(longitude),
        "severity": severity,
        "image_url": image_url,
        "status": "reported"
    }

    try:
        table.put_item(Item=item)
        return item
    except ClientError as e:
        raise Exception(f"DynamoDB save failed: {str(e)}")


def get_all_incidents() -> list:
    try:
        response = table.scan()
        return response.get("Items", [])
    except ClientError as e:
        raise Exception(f"DynamoDB fetch failed: {str(e)}")
