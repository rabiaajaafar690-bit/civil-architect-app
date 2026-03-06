import { useRef } from "react";
import { Stage, Layer, Line, Text } from "react-konva";

const SCALE = 50; // 1 metre = 50 px

/**
 * 2D floor-plan viewer using react-konva.
 * Supports mouse-wheel zoom and click-drag panning.
 *
 * @param {{ walls: Array<{x1:number,y1:number,x2:number,y2:number,thickness:number}> }} props.plan
 */
export default function Plan2DViewer({ plan }) {
  const stageRef = useRef(null);

  if (!plan || !plan.walls) return null;

  /* ---- zoom handler -------------------------------------------------- */
  function handleWheel(e) {
    e.evt.preventDefault();
    const stage = stageRef.current;
    const oldScale = stage.scaleX();
    const pointer = stage.getPointerPosition();

    const scaleBy = 1.08;
    const direction = e.evt.deltaY > 0 ? -1 : 1;
    const newScale = direction > 0 ? oldScale * scaleBy : oldScale / scaleBy;

    const mousePointTo = {
      x: (pointer.x - stage.x()) / oldScale,
      y: (pointer.y - stage.y()) / oldScale,
    };

    stage.scale({ x: newScale, y: newScale });
    stage.position({
      x: pointer.x - mousePointTo.x * newScale,
      y: pointer.y - mousePointTo.y * newScale,
    });
    stage.batchDraw();
  }

  return (
    <div className="bg-white rounded-2xl shadow-lg p-4">
      <h3 className="text-lg font-semibold text-gray-800 mb-2">
        Plan 2D — Basic House
      </h3>
      <div className="border border-gray-200 rounded-lg overflow-hidden">
        <Stage
          ref={stageRef}
          width={800}
          height={600}
          draggable
          onWheel={handleWheel}
          style={{ background: "#ffffff", cursor: "grab" }}
        >
          <Layer>
            {plan.walls.map((w, i) => {
              const dx = w.x2 - w.x1;
              const dy = w.y2 - w.y1;
              const len = Math.sqrt(dx * dx + dy * dy);
              if (len === 0) return null;

              // perpendicular offset for wall thickness
              const nx = (-dy / len) * ((w.thickness || 0.2) / 2) * SCALE;
              const ny = (dx / len) * ((w.thickness || 0.2) / 2) * SCALE;

              const x1 = w.x1 * SCALE + 40;
              const y1 = w.y1 * SCALE + 40;
              const x2 = w.x2 * SCALE + 40;
              const y2 = w.y2 * SCALE + 40;

              return (
                <Line
                  key={i}
                  points={[
                    x1 + nx, y1 + ny,
                    x2 + nx, y2 + ny,
                    x2 - nx, y2 - ny,
                    x1 - nx, y1 - ny,
                  ]}
                  closed
                  fill="#1e293b"
                  stroke="#0f172a"
                  strokeWidth={1}
                />
              );
            })}

            {/* Dimension annotations for each wall */}
            {plan.walls.map((w, i) => {
              const dx = w.x2 - w.x1;
              const dy = w.y2 - w.y1;
              const len = Math.sqrt(dx * dx + dy * dy);
              const mx = ((w.x1 + w.x2) / 2) * SCALE + 40;
              const my = ((w.y1 + w.y2) / 2) * SCALE + 40;

              return (
                <Text
                  key={`d${i}`}
                  x={mx - 20}
                  y={my - 16}
                  text={`${len.toFixed(1)} m`}
                  fontSize={11}
                  fill="#64748b"
                />
              );
            })}
          </Layer>
        </Stage>
      </div>
      <p className="text-xs text-gray-400 mt-2">
        Scroll to zoom · Drag to pan
      </p>
    </div>
  );
}
