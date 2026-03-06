import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

const ROOM_COLORS = [
  "#93c5fd", // blue-300
  "#fcd34d", // amber-300
  "#6ee7b7", // emerald-300
  "#c4b5fd", // violet-300
  "#f9a8d4", // pink-300
  "#fde68a", // yellow-300
  "#5eead4", // teal-300
  "#a5b4fc", // indigo-300
];

function FloorMesh({ floorPlan, floorIndex }) {
  const y = floorIndex * 3.2; // vertical offset per floor

  return (
    <group position={[0, y, 0]}>
      {/* Rooms */}
      {floorPlan.rooms.map((room, i) => {
        const height = 2.8;
        const cx = room.x + room.width / 2;
        const cz = room.y + room.height / 2;
        return (
          <mesh key={i} position={[cx, height / 2, cz]}>
            <boxGeometry args={[room.width, height, room.height]} />
            <meshStandardMaterial
              color={ROOM_COLORS[i % ROOM_COLORS.length]}
              transparent
              opacity={0.6}
            />
          </mesh>
        );
      })}

      {/* Floor slab */}
      <mesh position={[floorPlan.rooms[0]?.x + 0.5 || 0, -0.05, floorPlan.rooms[0]?.y + 0.5 || 0]} receiveShadow>
        {(() => {
          const maxX = Math.max(...floorPlan.rooms.map((r) => r.x + r.width));
          const maxZ = Math.max(...floorPlan.rooms.map((r) => r.y + r.height));
          const cx = maxX / 2;
          const cz = maxZ / 2;
          return (
            <mesh position={[cx - (floorPlan.rooms[0]?.x + 0.5 || 0), 0, cz - (floorPlan.rooms[0]?.y + 0.5 || 0)]}>
              <boxGeometry args={[maxX, 0.1, maxZ]} />
              <meshStandardMaterial color="#d1d5db" />
            </mesh>
          );
        })()}
      </mesh>

      {/* Walls */}
      {floorPlan.walls.map((wall, i) => {
        const dx = wall.x2 - wall.x1;
        const dz = wall.y2 - wall.y1;
        const len = Math.sqrt(dx * dx + dz * dz);
        const cx = (wall.x1 + wall.x2) / 2;
        const cz = (wall.y1 + wall.y2) / 2;
        const angle = Math.atan2(dx, dz);
        return (
          <mesh key={`w${i}`} position={[cx, 1.4, cz]} rotation={[0, angle, 0]}>
            <boxGeometry args={[0.15, 2.8, len]} />
            <meshStandardMaterial color="#64748b" />
          </mesh>
        );
      })}
    </group>
  );
}

export default function Building3DView({ plan }) {
  if (!plan) return null;

  const maxX = Math.max(
    ...plan.floors.flatMap((f) => f.rooms.map((r) => r.x + r.width))
  );
  const maxZ = Math.max(
    ...plan.floors.flatMap((f) => f.rooms.map((r) => r.y + r.height))
  );
  const centerX = maxX / 2;
  const centerZ = maxZ / 2;
  const cameraDistance = Math.max(maxX, maxZ, plan.floors.length * 3.2) * 1.5;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        3D Building View
      </h3>
      <div className="w-full border border-gray-200 rounded-lg" style={{ height: 500 }}>
        <Canvas
          camera={{
            position: [centerX + cameraDistance, cameraDistance * 0.7, centerZ + cameraDistance],
            fov: 50,
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={0.8} />
          <OrbitControls target={[centerX, (plan.floors.length * 3.2) / 2, centerZ]} />
          {plan.floors.map((floor, i) => (
            <FloorMesh
              key={i}
              floorPlan={floor}
              floorIndex={i}
            />
          ))}
        </Canvas>
      </div>
    </div>
  );
}
