import random


def analyze_image(image):
    """
    Simulates pothole severity detection.
    """

    severities = ["LOW", "MEDIUM", "HIGH", "CRITICAL"]

    severity = random.choice(severities)

    confidence = random.randint(70, 95)

    return {
        "severity": severity,
        "confidence": confidence,
        "incident_type": "pothole"
    }


def generate_complaint(location, severity, latitude, longitude):
    """
    Generates a complaint text for municipal authorities.
    """

    complaint_text = f"""
Subject: Urgent pothole repair request

Location: {location}
Severity: {severity}
Coordinates: {latitude}, {longitude}

A pothole has been detected at the above location and poses a risk to vehicles and pedestrians.

Kindly arrange for immediate repair to prevent accidents and traffic disruption.
"""

    return complaint_text