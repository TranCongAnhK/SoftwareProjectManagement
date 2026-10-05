import { ArrowUpRight, Plus, Clock3, Dumbbell } from "lucide-react";
import { TextLink } from "../../../shared/ui/TextLink.jsx";
import { Section } from "../../../shared/ui/Section.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import { WeightChart } from "../../../shared/ui/WeightChart.jsx";
import { formatNumber } from "../../../shared/lib/format.js";
import { dayKey, dateLabel } from "../../../shared/lib/date.js";
import { Agenda } from "../../schedule/Agenda.jsx";
import { Hero } from "../../../shared/components/TrainingHero.jsx";
import { Week } from "./WeeklyActivity.jsx";
import React from "react";

export function Member({ ctx }) {
  const { sample, data } = ctx;
  const current = data.overview.subscriptions.find(
    (s) => s.ends_on >= dayKey(),
  );
  return (
    <>
      <div className="s-feature-grid">
        <Hero
          ctx={ctx}
          label="Kế hoạch hôm nay"
          title={sample.programName}
          description="Khởi động nhẹ, rồi bắt đầu với mức tạ vừa sức."
          meta={
            <>
              <span>
                <Clock3 size={14} />
                50 phút
              </span>
              <span>
                <Dumbbell size={14} />
                {sample.exercises.length} bài tập
              </span>
              <span>Sức mạnh</span>
            </>
          }
          action={sample.workoutFinished ? "Xem kết quả" : "Mở buổi tập"}
          onAction={() => ctx.go("workout")}
        />
        <aside className="s-rail">
          <Week ctx={ctx} />
          <button className="s-pass" onClick={() => ctx.go("membership")}>
            <span>
              THẺ HỘI VIÊN <ArrowUpRight size={20} />
            </span>
            <strong>{current?.name || "Khám phá gói tập"}</strong>
            <small>
              {current
                ? "Đến " + dateLabel(current.ends_on)
                : "Chọn gói phù hợp với bạn"}
            </small>
            <div className="s-pass-bottom">
              <b>OPTIGYM CLUB</b>
              <i aria-hidden="true" />
            </div>
          </button>
        </aside>
      </div>
      <div className="s-vitals">
        <div className="s-vitals-label">
          <span>NHẬT KÝ HÔM NAY</span>
          <Sample>Dữ liệu mẫu</Sample>
        </div>
        <button onClick={() => ctx.go("progress")}>
          <span>Cân nặng</span>
          <strong>
            66,4 <small>kg</small>
          </strong>
          <p>
            ↓ 2 kg qua 6 lần đo <ArrowUpRight size={16} />
          </p>
        </button>
        <button onClick={() => ctx.go("nutrition")}>
          <span>Năng lượng</span>
          <strong>
            {formatNumber(
              sample.meals.reduce((n, m) => n + Number(m.calories), 0),
            )}{" "}
            <small>kcal</small>
          </strong>
          <p>
            {sample.meals.length} bữa đã ghi <ArrowUpRight size={16} />
          </p>
        </button>
        <div className="s-water">
          <span>Nước uống</span>
          <strong>
            {formatNumber(sample.water / 1000)} <small>/ 2,5 lít</small>
          </strong>
          <button
            aria-label="Ghi thêm 250 ml nước"
            onClick={() =>
              ctx.setSample((s) => ({
                ...s,
                water: s.water + 250,
              }))
            }
          >
            <Plus size={14} />
            250 ml
          </button>
        </div>
      </div>
      <div className="s-lower">
        <div className="s-agenda">
          <div className="s-section-index">01 / CÙNG NHAU TẬP</div>
          <Agenda ctx={ctx} compact />
        </div>
        <section className="s-measure">
          <div className="s-section-index">02 / TỪNG CHÚT TIẾN BỘ</div>
          <Section
            title="Nhìn lại kết quả"
            action={
              <TextLink onClick={() => ctx.go("progress")}>Chi tiết</TextLink>
            }
          >
            <WeightChart />
          </Section>
          <p className="s-caption">
            Sáu lần đo, một hành trình. Cứ tiếp tục theo nhịp của bạn.
          </p>
        </section>
      </div>
    </>
  );
}
