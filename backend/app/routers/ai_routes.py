from fastapi import APIRouter

from ..ai_assistant import get_ai_suggestions
from ..schemas import AISuggestRequest, AISuggestResponse

router = APIRouter(prefix="/ai")


@router.post("/suggest", response_model=AISuggestResponse)
def suggest(request: AISuggestRequest) -> AISuggestResponse:
    suggestions = get_ai_suggestions(request.plan)
    return AISuggestResponse(suggestions=suggestions)
