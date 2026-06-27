from google import genai
import os
from dotenv import load_dotenv

load_dotenv()

def get_health_prediction(full_name, glucose, haemoglobin, cholesterol):
    client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

    prompt = f"""
    You are a medical AI assistant. Based on the following blood test results for a patient, 
    provide a brief health assessment and possible health risks. Keep it under 100 words, 
    use simple language, and always recommend consulting a doctor.

    Patient Name: {full_name}
    Glucose Level: {glucose} mg/dL
    Haemoglobin: {haemoglobin} g/dL
    Cholesterol: {cholesterol} mg/dL

    Provide a short health prediction and risk assessment based on these values.
    """

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt
    )

    return response.text