import { useState } from "react";
import { formatNumber } from "../lib/format.js";
import { Sample } from "./Sample.jsx";
import React from "react";

export function BarChart({
  series = [18.6, 24.2, 21.8, 29.4, 26.5, 34.8],
  labels = ["T5", "T6", "T7", "T8", "T9", "T10"],
  unit = "triệu đồng",
}) {
  const [selected, setSelected] = useState(series.length - 1);
  const max = Math.max(...series) * 1.15;
  return (
    <div className="g-bar-chart">
      <div className="g-chart-reading">
        <strong>
          {formatNumber(series[selected])}
          <small>{unit}</small>
        </strong>
        <span>
          {labels[selected]} <Sample>Mẫu</Sample>
        </span>
      </div>
      <div className="g-bar-plot">
        <div className="g-bar-grid" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>
        {series.map((v, i) => (
          <button
            aria-label={`${labels[i]}: ${formatNumber(v)} ${unit}`}
            aria-pressed={selected === i}
            className={selected === i ? "selected" : ""}
            key={i}
            onClick={() => setSelected(i)}
          >
            <span
              style={{
                height: (v / max) * 100 + "%",
              }}
            />
            <small>{labels[i]}</small>
          </button>
        ))}
      </div>
    </div>
  );
}
