import json
import logging
import os

from .schemas import BuildingPlan

logger = logging.getLogger(__name__)


def get_ai_suggestions(plan: BuildingPlan) -> str:
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        return (
            "GEMINI_API_KEY is not configured. "
            "Please set the GEMINI_API_KEY environment variable to enable AI suggestions."
        )

    try:
        import google.generativeai as genai
    except ImportError:
        logger.error("google-generativeai package is not installed")
        return (
            "The google-generativeai package is not installed. "
            "Run: pip install google-generativeai"
        )

    try:
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
    except Exception:
        logger.exception("AI suggestion failed")
        return "Unable to generate AI suggestions at this time."
