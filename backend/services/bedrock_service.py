import boto3
import json
import base64
from config import settings
import os
bedrock = boto3.client(
    "bedrock-runtime",
    aws_access_key_id=settings.AWS_ACCESS_KEY,
    aws_secret_access_key=settings.AWS_SECRET_KEY,
    region_name=os.getenv("BEDROCK_REGION", "us-east-1")
)

def analyze_image_with_bedrock(image_bytes: bytes) -> dict:
    image_b64 = base64.standard_b64encode(image_bytes).decode("utf-8")

    prompt = """Analyze this road image for potholes or road damage.
    Respond ONLY in this exact JSON format, nothing else:
    {
        "severity": "LOW or MEDIUM or HIGH or CRITICAL",
        "confidence": <number 0-100>,
        "size_estimate": "small/medium/large/very large",
        "risk_level": "LOW or MEDIUM or HIGH or CRITICAL",
        "description": "one sentence description"
    }"""

    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 300,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": "image/jpeg",
                            "data": image_b64
                        }
                    },
                    {
                        "type": "text",
                        "text": prompt
                    }
                ]
            }
        ]
    })

    try:
        response = bedrock.invoke_model(
            modelId="anthropic.claude-3-haiku-20240307-v1:0",
            body=body,
            contentType="application/json",
            accept="application/json"
        )
        result = json.loads(response["body"].read())
        text = result["content"][0]["text"]
        # parse JSON from response
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])
    except Exception as e:
        # fallback if bedrock fails
        print(f"BEDROCK ERROR: {str(e)}")
        return {
            "severity": "MEDIUM",
            "confidence": 70,
            "size_estimate": "medium",
            "risk_level": "MEDIUM",
            "description": "Road damage detected."
        }


def generate_complaint(latitude: str, longitude: str, severity: str, image_url: str, street_name: str = "Unknown location") -> str:
    prompt = f"""Generate a formal BBMP complaint letter for a pothole:
    Street: {street_name}
    Coordinates: {latitude}, {longitude}
    Severity: {severity}
    Photo: {image_url}
    
    Write a professional 4-5 line complaint requesting immediate repair. Sign off as RoadSense AI System."""

    body = json.dumps({
        "anthropic_version": "bedrock-2023-05-31",
        "max_tokens": 300,
        "messages": [{"role": "user", "content": prompt}]
    })

    try:
        response = bedrock.invoke_model(
            modelId="anthropic.claude-3-haiku-20240307-v1:0",
            body=body,
            contentType="application/json",
            accept="application/json"
        )
        result = json.loads(response["body"].read())
        return result["content"][0]["text"]
    except Exception as e:
        return f"Formal complaint: A {severity} severity pothole has been detected at coordinates {latitude}, {longitude}. Immediate repair is requested."