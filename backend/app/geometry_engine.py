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


def generate_plan(input: BuildingInput) -> BuildingPlan:
    floors: list[FloorPlan] = []

    apt_width = input.width / input.apartments_per_floor

    for _ in range(input.floors):
        walls: list[Wall] = []
        rooms: list[Room] = []
        doors: list[Door] = []

        # Exterior walls
        walls.append(Wall(x1=0, y1=0, x2=input.width, y2=0))
        walls.append(Wall(x1=input.width, y1=0, x2=input.width, y2=input.length))
        walls.append(Wall(x1=input.width, y1=input.length, x2=0, y2=input.length))
        walls.append(Wall(x1=0, y1=input.length, x2=0, y2=0))

        # Divider walls between apartments
        for a in range(1, input.apartments_per_floor):
            x = a * apt_width
            walls.append(Wall(x1=x, y1=0, x2=x, y2=input.length))

        # Rooms within each apartment
        for a in range(input.apartments_per_floor):
            apt_x = a * apt_width
            cols = math.ceil(math.sqrt(input.rooms_per_apartment))
            rows = math.ceil(input.rooms_per_apartment / cols)
            room_w = apt_width / cols
            room_h = input.length / rows

            for r in range(input.rooms_per_apartment):
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

    return BuildingPlan(floors=floors, building_input=input)
