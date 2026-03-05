import { useEffect, useRef } from "react";

const ROOM_COLORS = [
  "#e0f2fe", // sky-100
  "#fef3c7", // amber-100
  "#d1fae5", // emerald-100
  "#ede9fe", // violet-100
  "#fce7f3", // pink-100
  "#fef9c3", // yellow-100
  "#ccfbf1", // teal-100
  "#e0e7ff", // indigo-100
];

export default function PlanCanvas({ floorPlan, floorIndex }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!floorPlan) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Determine scale so the plan fits within the canvas
    const padding = 40;
    const maxX = Math.max(...floorPlan.rooms.map((r) => r.x + r.width), ...floorPlan.walls.map((w) => Math.max(w.x1, w.x2)));
    const maxY = Math.max(...floorPlan.rooms.map((r) => r.y + r.height), ...floorPlan.walls.map((w) => Math.max(w.y1, w.y2)));

    const scaleX = (canvas.width - padding * 2) / maxX;
    const scaleY = (canvas.height - padding * 2) / maxY;
    const scale = Math.min(scaleX, scaleY);

    const offsetX = padding;
    const offsetY = padding;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw rooms
    floorPlan.rooms.forEach((room, i) => {
      const x = offsetX + room.x * scale;
      const y = offsetY + room.y * scale;
      const w = room.width * scale;
      const h = room.height * scale;

      ctx.fillStyle = ROOM_COLORS[i % ROOM_COLORS.length];
      ctx.fillRect(x, y, w, h);

      ctx.strokeStyle = "#94a3b8";
      ctx.lineWidth = 1;
      ctx.strokeRect(x, y, w, h);

      // Room label
      ctx.fillStyle = "#334155";
      ctx.font = `${Math.max(10, Math.min(14, w / 6))}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(room.name.replace(/_/g, " "), x + w / 2, y + h / 2 - 8);

      // Dimensions
      ctx.fillStyle = "#64748b";
      ctx.font = `${Math.max(9, Math.min(11, w / 7))}px sans-serif`;
      ctx.fillText(
        `${room.width.toFixed(1)}×${room.height.toFixed(1)}m`,
        x + w / 2,
        y + h / 2 + 8
      );
    });

    // Draw walls
    ctx.strokeStyle = "#1e293b";
    ctx.lineWidth = 3;
    floorPlan.walls.forEach((wall) => {
      ctx.beginPath();
      ctx.moveTo(offsetX + wall.x1 * scale, offsetY + wall.y1 * scale);
      ctx.lineTo(offsetX + wall.x2 * scale, offsetY + wall.y2 * scale);
      ctx.stroke();
    });

    // Draw doors
    ctx.fillStyle = "#f59e0b";
    floorPlan.doors.forEach((door) => {
      const dx = offsetX + door.x * scale;
      const dy = offsetY + door.y * scale - (door.width * scale) / 2;
      ctx.fillRect(dx - 2, dy, 4, door.width * scale);
    });
  }, [floorPlan]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Floor {floorIndex + 1}
      </h3>
      <canvas
        ref={canvasRef}
        width={800}
        height={600}
        className="w-full border border-gray-200 rounded-lg"
      />
    </div>
  );
}
