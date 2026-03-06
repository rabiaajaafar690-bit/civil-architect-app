/**
 * Client-side geometry engine — mirrors the backend Python geometry_engine.py
 * so that building plans can be generated without a running backend server.
 */

const ROOM_NAMES = [
  "Salon",
  "Chambre 1",
  "Chambre 2",
  "Cuisine",
  "SDB",
  "Bureau",
  "Rangement",
  "Balcon",
];

/**
 * Generate a complete building plan from user parameters.
 * @param {{ width: number, length: number, floors: number, apartments_per_floor: number, rooms_per_apartment: number }} input
 * @returns {{ floors: Array, building_input: object }}
 */
export function generatePlanLocal(input) {
  const { width, length, floors, apartments_per_floor, rooms_per_apartment } =
    input;
  const floorPlans = [];
  const aptWidth = width / apartments_per_floor;

  for (let f = 0; f < floors; f++) {
    const walls = [];
    const rooms = [];
    const doors = [];

    // Exterior walls
    walls.push({ x1: 0, y1: 0, x2: width, y2: 0 });
    walls.push({ x1: width, y1: 0, x2: width, y2: length });
    walls.push({ x1: width, y1: length, x2: 0, y2: length });
    walls.push({ x1: 0, y1: length, x2: 0, y2: 0 });

    // Divider walls between apartments
    for (let a = 1; a < apartments_per_floor; a++) {
      const x = a * aptWidth;
      walls.push({ x1: x, y1: 0, x2: x, y2: length });
    }

    // Rooms within each apartment
    for (let a = 0; a < apartments_per_floor; a++) {
      const aptX = a * aptWidth;
      const cols = Math.ceil(Math.sqrt(rooms_per_apartment));
      const rowCount = Math.ceil(rooms_per_apartment / cols);
      const roomW = aptWidth / cols;
      const roomH = length / rowCount;

      for (let r = 0; r < rooms_per_apartment; r++) {
        const col = r % cols;
        const row = Math.floor(r / cols);
        const rx = aptX + col * roomW;
        const ry = row * roomH;
        const name = ROOM_NAMES[r % ROOM_NAMES.length];

        rooms.push({ name, x: rx, y: ry, width: roomW, height: roomH });

        // Interior wall segments between rooms (horizontal)
        if (row > 0) {
          walls.push({ x1: rx, y1: ry, x2: rx + roomW, y2: ry });
        }
        // Interior wall segments between rooms (vertical)
        if (col > 0) {
          walls.push({ x1: rx, y1: ry, x2: rx, y2: ry + roomH });
        }

        // Door — placed at the bottom-center of each room
        const doorY = ry + roomH;
        const doorX = rx + roomW / 2;
        doors.push({ x: doorX, y: doorY, width: 0.9 });
      }
    }

    floorPlans.push({ walls, rooms, doors });
  }

  return { floors: floorPlans, building_input: input };
}
