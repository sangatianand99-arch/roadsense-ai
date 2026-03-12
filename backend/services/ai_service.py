def analyze_image(image):
    """
    Simulates pothole severity detection based on image size.
    """

    try:
        # read image bytes
        image_bytes = image.file.read()
        file_size = len(image_bytes)

        # simple logic based on image size
        if file_size < 200000:
            severity = "LOW"
        elif file_size < 500000:
            severity = "MEDIUM"
        elif file_size < 1000000:
            severity = "HIGH"
        else:
            severity = "CRITICAL"

        confidence = 85

    except Exception:
        severity = "MEDIUM"
        confidence = 70

    return {
        "severity": severity,
        "confidence": confidence,
        "incident_type": "pothole"
    }


def generate_complaint(location, severity, latitude, longitude):
    """
    Generates a complaint message for authorities.
    """

    complaint = f"""
Subject: Urgent pothole repair request

Location: {location}
Severity: {severity}
Coordinates: {latitude}, {longitude}

A pothole has been detected at the above location and poses a risk to vehicles and pedestrians.

Kindly arrange for immediate repair to prevent accidents and traffic disruption.

Reported by RoadSense AI system.
"""

    return complaint