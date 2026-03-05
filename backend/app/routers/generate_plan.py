from fastapi import APIRouter

from ..geometry_engine import generate_plan
from ..schemas import BuildingInput, BuildingPlan

router = APIRouter()


@router.post("/generate-plan", response_model=BuildingPlan)
def create_plan(building_input: BuildingInput) -> BuildingPlan:
    return generate_plan(building_input)
