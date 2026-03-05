from pydantic import BaseModel


class BuildingInput(BaseModel):
    width: float
    length: float
    floors: int
    apartments_per_floor: int
    rooms_per_apartment: int


class Wall(BaseModel):
    x1: float
    y1: float
    x2: float
    y2: float


class Room(BaseModel):
    name: str
    x: float
    y: float
    width: float
    height: float


class Door(BaseModel):
    x: float
    y: float
    width: float = 1.0


class FloorPlan(BaseModel):
    walls: list[Wall]
    rooms: list[Room]
    doors: list[Door]


class BuildingPlan(BaseModel):
    floors: list[FloorPlan]
    building_input: BuildingInput


class AISuggestRequest(BaseModel):
    plan: BuildingPlan


class AISuggestResponse(BaseModel):
    suggestions: str
