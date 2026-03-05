import json
import os

from .schemas import BuildingPlan


def get_ai_suggestions(plan: BuildingPlan) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return (
            "GEMINI_API_KEY is not configured. "
            "Please set the GEMINI_API_KEY environment variable to enable AI suggestions."
        )

    try:
        import google.generativeai as genai

        genai.configure(api_key=api_key)
        model = genai.GenerativeModel("gemini-pro")

        plan_json = json.dumps(plan.model_dump(), indent=2)
        prompt = (
            "Analyze this building layout and suggest improvements for "
            "natural lighting, circulation and space optimization. "
            f"Building: {plan_json}"
        )

        response = model.generate_content(prompt)
        return response.text
    except Exception as e:
        return f"AI suggestion failed: {e}"
