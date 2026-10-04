import { useState } from "react";
import { Check, Dumbbell } from "lucide-react";
import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Section } from "../../../shared/ui/Section.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import { MetricStrip } from "../../../shared/ui/MetricStrip.jsx";
import { WeightChart } from "../../../shared/ui/WeightChart.jsx";
import { formatNumber } from "../../../shared/lib/format.js";
import React from "react";

export function ProgressView({ ctx }) {
  const [selected, setSelected] = useState("");
  return (
    <>
      <PageTitle
        title={
          ctx.user.role === "PT" ? "Tiến trình học viên" : "Kết quả tập luyện"
        }
        description={
          ctx.user.role === "PT"
            ? (ctx.data.clients.find((c) => String(c.id) === selected)?.name ||
                "Học viên mẫu") +
              " / chỉ số minh họa chung, chưa có hồ sơ đo riêng."
            : "So sánh các lần đo và thành tích gần đây."
        }
        action={
          ctx.user.role === "PT" && (
            <select
              className="g-filter-select"
              aria-label="Chọn học viên xem tiến trình"
              value={selected}
              onChange={(e) => setSelected(e.target.value)}
            >
              <option value="">Học viên mẫu</option>
              {ctx.data.clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          )
        }
      />
      <div className="g-prototype-note">
        <Sample>Mẫu</Sample>
        <span>Chỉ số InBody và thành tích chưa có API.</span>
      </div>
      <MetricStrip
        items={[
          {
            title: "Cân nặng",
            value: "66,4",
            unit: "kg",
            note: "Giảm 2 kg qua 6 lần đo",
            sample: true,
          },
          {
            title: "Tỷ lệ mỡ",
            value: "24,6",
            unit: "%",
            note: "Giảm 1,8 điểm phần trăm",
            sample: true,
          },
          {
            title: "Khối lượng cơ",
            value: "26,8",
            unit: "kg",
            note: "Lần đo gần nhất",
            sample: true,
          },
        ]}
      />
      <div className="g-progress-layout">
        <Section title="Cân nặng qua các lần đo">
          <WeightChart />
        </Section>
        <Section title="Thành tích cá nhân">
          <div className="g-pr-records">
            {[
              ["Squat", 55, 5],
              ["Bench press", 30, 2.5],
              ["Deadlift", 65, 5],
            ].map(([name, kg, gain]) => (
              <div key={name}>
                <Dumbbell size={22} />
                <span>
                  {name}
                  <small>Tăng {formatNumber(gain)} kg</small>
                </span>
                <strong>
                  {kg}
                  <small> kg</small>
                </strong>
              </div>
            ))}
          </div>
        </Section>
      </div>
      <Section title="Nhịp tập trong tuần" action={<Sample>Mẫu</Sample>}>
        <div className="g-consistency-grid">
          {Array.from(
            {
              length: 28,
            },
            (_, i) => (
              <div
                key={i}
                className={
                  [0, 2, 5, 7, 9, 12, 14, 16, 19, 21, 23, 26].includes(i)
                    ? "trained"
                    : ""
                }
                title={"Ngày " + (i + 1)}
              >
                {[0, 2, 5, 7, 9, 12, 14, 16, 19, 21, 23, 26].includes(i) && (
                  <Check size={15} />
                )}
              </div>
            ),
          )}
        </div>
        <p className="g-small-note">
          12 buổi trong 4 tuần gần nhất. Mỗi ô là một ngày.
        </p>
      </Section>
    </>
  );
}
