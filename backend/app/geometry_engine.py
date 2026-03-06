import math

from .schemas import BuildingInput, BuildingPlan, Door, FloorPlan, Room, Wall

ROOM_NAMES = [
    "living_room",
    "bedroom_1",
    "bedroom_2",
    "kitchen",
    "bathroom",
    "study",
    "storage",
    "balcony",
]


def generate_plan(building_input: BuildingInput) -> BuildingPlan:
    floors: list[FloorPlan] = []

    apt_width = building_input.width / building_input.apartments_per_floor

    for _ in range(building_input.floors):
        walls: list[Wall] = []
        rooms: list[Room] = []
        doors: list[Door] = []

        # Exterior walls
        walls.append(Wall(x1=0, y1=0, x2=building_input.width, y2=0))
        walls.append(Wall(x1=building_input.width, y1=0, x2=building_input.width, y2=building_input.length))
        walls.append(Wall(x1=building_input.width, y1=building_input.length, x2=0, y2=building_input.length))
        walls.append(Wall(x1=0, y1=building_input.length, x2=0, y2=0))

        # Divider walls between apartments
        for a in range(1, building_input.apartments_per_floor):
            x = a * apt_width
            walls.append(Wall(x1=x, y1=0, x2=x, y2=building_input.length))

        # Rooms within each apartment
        for a in range(building_input.apartments_per_floor):
            apt_x = a * apt_width
            cols = math.ceil(math.sqrt(building_input.rooms_per_apartment))
            rows = math.ceil(building_input.rooms_per_apartment / cols)
            room_w = apt_width / cols
            room_h = building_input.length / rows

            for r in range(building_input.rooms_per_apartment):
                col = r % cols
                row = r // cols
                rx = apt_x + col * room_w
                ry = row * room_h
                name = ROOM_NAMES[r % len(ROOM_NAMES)]

                rooms.append(
                    Room(name=name, x=rx, y=ry, width=room_w, height=room_h)
                )

                # Door at the midpoint of the room's left wall
                door_y = ry + room_h / 2
                doors.append(Door(x=rx, y=door_y))

        floors.append(FloorPlan(walls=walls, rooms=rooms, doors=doors))

    return BuildingPlan(floors=floors, building_input=building_input)
