import { useState } from "react";
import { Download } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Section } from "../../../shared/ui/Section.jsx";
import { MetricStrip } from "../../../shared/ui/MetricStrip.jsx";
import { BarChart } from "../../../shared/ui/BarChart.jsx";
import { formatNumber } from "../../../shared/lib/format.js";
import { exportCSV } from "../../../shared/lib/exportCSV.js";
import React from "react";

export function ReportsView() {
  const [period, setPeriod] = useState("week");
  const series =
    period === "week" ? [24, 31, 28, 36, 33, 41, 26] : [112, 146, 128, 184];
  const labels =
    period === "week"
      ? ["T2", "T3", "T4", "T5", "T6", "T7", "CN"]
      : ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4"];
  return (
    <>
      <PageTitle
        title="Báo cáo hoạt động"
        description="Tần suất đến phòng tập theo khoảng thời gian."
        action={
          <Button
            icon={Download}
            onClick={() =>
              exportCSV("optigym-bao-cao-mau.csv", [
                ["Mốc", "Lượt đến", "Nguồn"],
                ...series.map((n, i) => [labels[i], n, "Dữ liệu mẫu"]),
              ])
            }
          >
            Xuất báo cáo mẫu
          </Button>
        }
      />
      <Section
        title="Lượt đến phòng tập"
        action={
          <div className="g-segmented">
            <button
              className={period === "week" ? "active" : ""}
              onClick={() => setPeriod("week")}
            >
              Tuần
            </button>
            <button
              className={period === "month" ? "active" : ""}
              onClick={() => setPeriod("month")}
            >
              Tháng
            </button>
          </div>
        }
      >
        <BarChart key={period} series={series} labels={labels} unit="lượt" />
      </Section>
      <MetricStrip
        items={[
          {
            title: "Tổng lượt trong kỳ",
            value: series.reduce((a, n) => a + n, 0),
            unit: "lượt",
            sample: true,
            note: "Số liệu tổng từ biểu đồ",
          },
          {
            title: "Trung bình mỗi mốc",
            value: formatNumber(
              Math.round(series.reduce((a, n) => a + n, 0) / series.length),
            ),
            unit: "lượt",
            sample: true,
            note: "Tính từ chuỗi dữ liệu mẫu",
          },
          {
            title: "Mốc đông nhất",
            value: labels[series.indexOf(Math.max(...series))],
            sample: true,
            note: Math.max(...series) + " lượt đến",
          },
        ]}
      />
    </>
  );
}
