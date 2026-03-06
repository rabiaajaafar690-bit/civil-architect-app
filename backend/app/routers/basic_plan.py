from fastapi import APIRouter

from ..schemas import HousePlan, HousePlanWall

router = APIRouter(prefix="/api")


@router.get("/generate-basic-plan", response_model=HousePlan)
def generate_basic_plan() -> HousePlan:
    """Return a mathematically-generated basic house with 4 exterior walls
    and an interior partition creating two rooms."""

    W = 10.0   # house width  (metres)
    L = 8.0    # house length (metres)
    T = 0.2    # wall thickness
    H = 2.8    # wall height

    walls: list[HousePlanWall] = [
        # Exterior walls
        HousePlanWall(x1=0, y1=0, x2=W, y2=0, thickness=T, height=H),       # bottom
        HousePlanWall(x1=W, y1=0, x2=W, y2=L, thickness=T, height=H),       # right
        HousePlanWall(x1=W, y1=L, x2=0, y2=L, thickness=T, height=H),       # top
        HousePlanWall(x1=0, y1=L, x2=0, y2=0, thickness=T, height=H),       # left
        # Interior partition (vertical, splits house into 2 rooms)
        HousePlanWall(x1=W / 2, y1=0, x2=W / 2, y2=L, thickness=T, height=H),
    ]

    return HousePlan(walls=walls)
