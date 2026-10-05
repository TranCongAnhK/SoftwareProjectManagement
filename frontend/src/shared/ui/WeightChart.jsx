import { useState } from "react";
import { formatNumber } from "../lib/format.js";
import { Sample } from "./Sample.jsx";
import React from "react";

export function WeightChart() {
  const values = [68.4, 68.1, 67.5, 67.2, 66.8, 66.4];
  const [selected, setSelected] = useState(5);
  const pts = values.map((v, i) => [36 + i * 102, 160 - (v - 65.8) * 45]);
  return (
    <div className="g-weight-chart">
      <div className="g-chart-reading">
        <strong>
          {formatNumber(values[selected])}
          <small>kg</small>
        </strong>
        <span>
          Lần đo {selected + 1} <Sample>Mẫu</Sample>
        </span>
      </div>
      <svg
        viewBox="0 0 585 220"
        role="img"
        aria-label="Biểu đồ cân nặng mẫu giảm từ 68,4 xuống 66,4 kg"
      >
        {[50, 100, 150].map((y) => (
          <line key={y} x1="30" x2="560" y1={y} y2={y} />
        ))}
        <polyline points={pts.map((p) => p.join(",")).join(" ")} />
        {pts.map(([x, y], i) => (
          <g key={i}>
            <circle cx={x} cy={y} r={selected === i ? 6 : 3} />
            <text x={x} y="201" textAnchor="middle">
              {["04/08", "16/08", "28/08", "09/09", "21/09", "01/10"][i]}
            </text>
          </g>
        ))}
      </svg>
      <div className="g-chart-selector">
        {values.map((_, i) => (
          <button
            key={i}
            className={i === selected ? "selected" : ""}
            onClick={() => setSelected(i)}
          >
            Lần {i + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
