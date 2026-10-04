import { ArrowUpRight } from "lucide-react";
import { Sample } from "./Sample.jsx";
import React from "react";

export function MetricStrip({ items }) {
  return (
    <div className="g-metric-strip">
      {items.map(({ title, value, unit, note, sample, onClick }, i) => (
        <div key={title}>
          <span>
            {title}
            {sample && <Sample>Mẫu</Sample>}
          </span>
          <div>
            <strong>{value}</strong>
            {unit && <small>{unit}</small>}
          </div>
          {onClick ? (
            <button onClick={onClick}>
              {note}
              <ArrowUpRight size={13} />
            </button>
          ) : (
            <p>{note}</p>
          )}
        </div>
      ))}
    </div>
  );
}
