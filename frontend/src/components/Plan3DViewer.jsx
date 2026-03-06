import { Canvas } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";

/**
 * Render a single wall as a box (extruded from 2D coordinates).
 */
function WallMesh({ wall }) {
  const dx = wall.x2 - wall.x1;
  const dy = wall.y2 - wall.y1;
  const length = Math.sqrt(dx * dx + dy * dy);
  const thickness = wall.thickness || 0.2;
  const height = wall.height || 2.8;

  // centre position
  const cx = (wall.x1 + wall.x2) / 2;
  const cz = (wall.y1 + wall.y2) / 2;

  // rotation around Y axis — atan2(dx, dz) because Three.js Y-up convention
  // maps 2D x→X and 2D y→Z, so the angle is measured from the Z axis.
  const angle = Math.atan2(dx, dy);

  return (
    <mesh position={[cx, height / 2, cz]} rotation={[0, angle, 0]}>
      <boxGeometry args={[thickness, height, length]} />
      <meshStandardMaterial color="#94a3b8" />
    </mesh>
  );
}

/**
 * 3D house-plan viewer. Takes the same HousePlan JSON as the 2D viewer and
 * extrudes every wall into a 3D box. Includes basic lighting and OrbitControls.
 *
 * @param {{ walls: Array }} props.plan
 */
export default function Plan3DViewer({ plan }) {
  if (!plan || !plan.walls) return null;

  // Determine bounding box for camera positioning
  const xs = plan.walls.flatMap((w) => [w.x1, w.x2]);
  const zs = plan.walls.flatMap((w) => [w.y1, w.y2]);
  const maxH = Math.max(...plan.walls.map((w) => w.height || 2.8));
  const cx = (Math.min(...xs) + Math.max(...xs)) / 2;
  const cz = (Math.min(...zs) + Math.max(...zs)) / 2;
  const span = Math.max(Math.max(...xs) - Math.min(...xs), Math.max(...zs) - Math.min(...zs));
  const camDist = span * 1.6;

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Maquette 3D — Basic House
      </h3>
      <div
        className="border border-gray-200 rounded-lg overflow-hidden"
        style={{ height: 500 }}
      >
        <Canvas
          camera={{
            position: [cx + camDist, maxH + camDist * 0.5, cz + camDist],
            fov: 50,
          }}
        >
          <ambientLight intensity={0.5} />
          <directionalLight position={[10, 20, 10]} intensity={0.8} />

          {/* Floor slab */}
          <mesh position={[cx, -0.05, cz]} receiveShadow>
            <boxGeometry args={[span + 1, 0.1, span + 1]} />
            <meshStandardMaterial color="#e2e8f0" />
          </mesh>

          {/* Walls */}
          {plan.walls.map((wall, i) => (
            <WallMesh key={i} wall={wall} />
          ))}

          <OrbitControls target={[cx, maxH / 2, cz]} />
        </Canvas>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Click + drag to orbit · Scroll to zoom · Right-click to pan
      </p>
    </div>
  );
}
