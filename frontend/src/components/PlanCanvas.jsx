import { useEffect, useRef } from "react";

/* ── colour palette per room type ────────────────────────────────── */
const ROOM_TYPE_COLORS = {
  Salon:       "#e8f0fe",
  "Chambre 1": "#fef3c7",
  "Chambre 2": "#fef9c3",
  Cuisine:     "#d1fae5",
  SDB:         "#dbeafe",
  Bureau:      "#ede9fe",
  Rangement:   "#f3f4f6",
  Balcon:      "#ccfbf1",
  // fallbacks for English names coming from backend
  living_room: "#e8f0fe",
  bedroom_1:   "#fef3c7",
  bedroom_2:   "#fef9c3",
  kitchen:     "#d1fae5",
  bathroom:    "#dbeafe",
  study:       "#ede9fe",
  storage:     "#f3f4f6",
  balcony:     "#ccfbf1",
};

const FALLBACK_COLORS = [
  "#e0f2fe", "#fef3c7", "#d1fae5", "#ede9fe",
  "#fce7f3", "#fef9c3", "#ccfbf1", "#e0e7ff",
];

/* ── helpers ─────────────────────────────────────────────────────── */

function roomColor(name, index) {
  return ROOM_TYPE_COLORS[name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length];
}

function drawThickWall(ctx, x1, y1, x2, y2, thickness) {
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return;
  const nx = (-dy / len) * thickness / 2;
  const ny = (dx / len) * thickness / 2;

  ctx.beginPath();
  ctx.moveTo(x1 + nx, y1 + ny);
  ctx.lineTo(x2 + nx, y2 + ny);
  ctx.lineTo(x2 - nx, y2 - ny);
  ctx.lineTo(x1 - nx, y1 - ny);
  ctx.closePath();
  ctx.fillStyle = "#1e293b";
  ctx.fill();
}

function drawDoorArc(ctx, x, y, radius, startAngle) {
  ctx.save();
  // door opening (white gap in wall)
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(x - radius * 0.05, y - radius, radius * 0.1, radius);

  // arc
  ctx.strokeStyle = "#475569";
  ctx.lineWidth = 1;
  ctx.setLineDash([3, 3]);
  ctx.beginPath();
  ctx.arc(x, y, radius, startAngle, startAngle + Math.PI / 2);
  ctx.stroke();

  // door leaf
  ctx.setLineDash([]);
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(x, y);
  const leafX = x + Math.cos(startAngle + Math.PI / 2) * radius;
  const leafY = y + Math.sin(startAngle + Math.PI / 2) * radius;
  ctx.lineTo(leafX, leafY);
  ctx.stroke();
  ctx.restore();
}

function drawDimension(ctx, x1, y1, x2, y2, value, offset) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const isHoriz = Math.abs(y2 - y1) < 1;

  ctx.save();
  ctx.strokeStyle = "#94a3b8";
  ctx.fillStyle = "#64748b";
  ctx.lineWidth = 0.5;
  ctx.font = "9px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  if (isHoriz) {
    const oy = y1 + offset;
    // line
    ctx.beginPath();
    ctx.moveTo(x1, oy);
    ctx.lineTo(x2, oy);
    ctx.stroke();
    // ticks
    ctx.beginPath();
    ctx.moveTo(x1, oy - 3);
    ctx.lineTo(x1, oy + 3);
    ctx.moveTo(x2, oy - 3);
    ctx.lineTo(x2, oy + 3);
    ctx.stroke();
    // text
    ctx.fillText(`${value.toFixed(1)} m`, mx, oy - 6);
  } else {
    const ox = x1 + offset;
    ctx.beginPath();
    ctx.moveTo(ox, y1);
    ctx.lineTo(ox, y2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(ox - 3, y1);
    ctx.lineTo(ox + 3, y1);
    ctx.moveTo(ox - 3, y2);
    ctx.lineTo(ox + 3, y2);
    ctx.stroke();
    ctx.save();
    ctx.translate(ox - 6, my);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${value.toFixed(1)} m`, 0, 0);
    ctx.restore();
  }
  ctx.restore();
}

/* ── furniture hints (simple icons per room type) ────────────────── */
function drawFurniture(ctx, room, x, y, w, h) {
  ctx.save();
  ctx.strokeStyle = "#94a3b8";
  ctx.lineWidth = 0.7;
  ctx.fillStyle = "#cbd5e1";

  const name = room.name.toLowerCase();
  const cx = x + w / 2;
  const cy = y + h / 2;

  if (name.includes("chambre") || name.includes("bedroom")) {
    // bed
    const bw = Math.min(w * 0.5, 40);
    const bh = Math.min(h * 0.35, 30);
    ctx.fillRect(cx - bw / 2, cy - bh / 2, bw, bh);
    ctx.strokeRect(cx - bw / 2, cy - bh / 2, bw, bh);
    // pillow
    ctx.fillStyle = "#e2e8f0";
    ctx.fillRect(cx - bw / 2 + 2, cy - bh / 2 + 2, bw * 0.3, bh - 4);
  } else if (name.includes("cuisine") || name.includes("kitchen")) {
    // counter along one wall
    const cw = w * 0.15;
    ctx.fillRect(x + 3, y + 3, cw, h - 6);
    ctx.strokeRect(x + 3, y + 3, cw, h - 6);
    // sink circle
    const sr = Math.min(cw * 0.35, 5);
    ctx.beginPath();
    ctx.arc(x + 3 + cw / 2, cy, sr, 0, Math.PI * 2);
    ctx.stroke();
  } else if (name.includes("sdb") || name.includes("bathroom")) {
    // bathtub
    const tw = Math.min(w * 0.6, 35);
    const th = Math.min(h * 0.25, 15);
    ctx.strokeRect(cx - tw / 2, y + h * 0.1, tw, th);
    // sink
    ctx.beginPath();
    ctx.arc(cx, y + h * 0.6, Math.min(5, w * 0.08), 0, Math.PI * 2);
    ctx.stroke();
    // toilet
    ctx.beginPath();
    ctx.ellipse(cx + w * 0.25, y + h * 0.65, 3, 4, 0, 0, Math.PI * 2);
    ctx.stroke();
  } else if (name.includes("salon") || name.includes("living")) {
    // sofa
    const sw = Math.min(w * 0.5, 45);
    const sh = Math.min(h * 0.15, 12);
    ctx.fillRect(cx - sw / 2, cy + h * 0.1, sw, sh);
    ctx.strokeRect(cx - sw / 2, cy + h * 0.1, sw, sh);
    // table
    const tw = Math.min(w * 0.2, 20);
    ctx.strokeRect(cx - tw / 2, cy - tw / 3, tw, tw * 0.6);
  } else if (name.includes("bureau") || name.includes("study")) {
    // desk
    const dw = Math.min(w * 0.5, 30);
    const dh = Math.min(h * 0.15, 10);
    ctx.fillRect(cx - dw / 2, cy - dh / 2, dw, dh);
    ctx.strokeRect(cx - dw / 2, cy - dh / 2, dw, dh);
  }
  ctx.restore();
}

/* ── main component ──────────────────────────────────────────────── */

export default function PlanCanvas({ floorPlan, floorIndex }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!floorPlan) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const padding = 60;
    const maxX = Math.max(
      ...floorPlan.rooms.map((r) => r.x + r.width),
      ...floorPlan.walls.map((w) => Math.max(w.x1, w.x2))
    );
    const maxY = Math.max(
      ...floorPlan.rooms.map((r) => r.y + r.height),
      ...floorPlan.walls.map((w) => Math.max(w.y1, w.y2))
    );

    const scaleX = (canvas.width - padding * 2) / maxX;
    const scaleY = (canvas.height - padding * 2) / maxY;
    const scale = Math.min(scaleX, scaleY);
    const ox = padding;
    const oy = padding;

    // helpers
    const sx = (v) => ox + v * scale;
    const sy = (v) => oy + v * scale;
    const sd = (v) => v * scale;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // White background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // ── rooms (fill + interior walls + labels) ──
    floorPlan.rooms.forEach((room, i) => {
      const rx = sx(room.x);
      const ry = sy(room.y);
      const rw = sd(room.width);
      const rh = sd(room.height);

      // fill
      ctx.fillStyle = roomColor(room.name, i);
      ctx.fillRect(rx, ry, rw, rh);

      // interior border (thin)
      ctx.strokeStyle = "#cbd5e1";
      ctx.lineWidth = 0.5;
      ctx.strokeRect(rx, ry, rw, rh);

      // furniture hints
      drawFurniture(ctx, room, rx, ry, rw, rh);

      // room label
      const fontSize = Math.max(9, Math.min(13, rw / 5));
      ctx.fillStyle = "#1e293b";
      ctx.font = `600 ${fontSize}px sans-serif`;
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";

      const label = room.name.replace(/_/g, " ");
      const area = (room.width * room.height).toFixed(1);
      ctx.fillText(label, rx + rw / 2, ry + rh / 2 - fontSize * 0.6);

      // area
      ctx.fillStyle = "#64748b";
      ctx.font = `${fontSize - 1}px sans-serif`;
      ctx.fillText(`${area} m²`, rx + rw / 2, ry + rh / 2 + fontSize * 0.5);

      // dimensions inside room
      ctx.fillStyle = "#94a3b8";
      ctx.font = `${Math.max(7, fontSize - 3)}px sans-serif`;
      ctx.fillText(
        `${room.width.toFixed(1)} × ${room.height.toFixed(1)} m`,
        rx + rw / 2,
        ry + rh / 2 + fontSize * 1.3
      );
    });

    // ── thick exterior & divider walls ──
    const wallThickness = Math.max(3, scale * 0.25);
    floorPlan.walls.forEach((wall) => {
      drawThickWall(
        ctx,
        sx(wall.x1), sy(wall.y1),
        sx(wall.x2), sy(wall.y2),
        wallThickness
      );
    });

    // ── doors (arcs) ──
    floorPlan.doors.forEach((door) => {
      const dx = sx(door.x);
      const dy = sy(door.y);
      const radius = sd(door.width || 0.9);
      drawDoorArc(ctx, dx, dy, radius, -Math.PI);
    });

    // ── outer dimension annotations ──
    drawDimension(ctx, sx(0), sy(maxY), sx(maxX), sy(maxY), maxX, 18);
    drawDimension(ctx, sx(maxX), sy(0), sx(maxX), sy(maxY), maxY, 18);

    // ── title bar ──
    ctx.fillStyle = "#1e293b";
    ctx.font = "bold 12px sans-serif";
    ctx.textAlign = "left";
    ctx.textBaseline = "top";
    ctx.fillText(`Floor ${floorIndex + 1}  —  ${maxX.toFixed(1)} × ${maxY.toFixed(1)} m`, ox, 8);

    // ── scale reference ──
    const refLen = sd(1); // 1 m
    const refX = canvas.width - padding - refLen;
    const refY = canvas.height - 14;
    ctx.strokeStyle = "#334155";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(refX, refY);
    ctx.lineTo(refX + refLen, refY);
    ctx.moveTo(refX, refY - 3);
    ctx.lineTo(refX, refY + 3);
    ctx.moveTo(refX + refLen, refY - 3);
    ctx.lineTo(refX + refLen, refY + 3);
    ctx.stroke();
    ctx.fillStyle = "#334155";
    ctx.font = "9px sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.fillText("1 m", refX + refLen / 2, refY - 4);
  }, [floorPlan, floorIndex]);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Floor {floorIndex + 1} — Plan
      </h3>
      <canvas
        ref={canvasRef}
        width={900}
        height={700}
        className="w-full border border-gray-200 rounded-lg"
      />
    </div>
  );
}
