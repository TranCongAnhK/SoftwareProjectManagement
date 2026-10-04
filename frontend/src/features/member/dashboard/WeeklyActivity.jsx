import { Check } from "lucide-react";
import { TextLink } from "../../../shared/ui/TextLink.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import React from "react";

export function Week({ ctx }) {
  const count = ctx.sample.workoutFinished ? 4 : 3;
  return (
    <section className="s-week">
      <header>
        <h2>Tuần này</h2>
        <Sample>Mẫu</Sample>
      </header>
      <div className="s-week-count">
        <strong>
          0{count}
          <span>/04</span>
        </strong>
        <p>buổi tập hoàn thành</p>
      </div>
      <div className="s-week-track">
        {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d, i) => (
          <div key={d}>
            <b
              className={
                [0, 2, 3, ...(count === 4 ? [5] : [])].includes(i) ? "done" : ""
              }
            >
              {[0, 2, 3, ...(count === 4 ? [5] : [])].includes(i) ? (
                <Check size={15} />
              ) : (
                <span />
              )}
            </b>
            <small>{d}</small>
          </div>
        ))}
      </div>
      <p className="s-week-note">
        {count === 4
          ? "Đủ bốn buổi. Dành thời gian nghỉ ngơi nhé."
          : "Thêm một buổi là đủ mục tiêu tuần này."}
      </p>
      <TextLink onClick={() => ctx.go("progress")}>
        Theo dõi tiến trình
      </TextLink>
    </section>
  );
}
