import { useState } from "react";
import { Check, ArrowUpRight, Download } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { IconButton } from "../../../shared/ui/IconButton.jsx";
import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Section } from "../../../shared/ui/Section.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import { Modal } from "../../../shared/ui/Modal.jsx";
import { Table } from "../../../shared/ui/Table.jsx";
import { Tag } from "../../../shared/ui/Tag.jsx";
import { MetricStrip } from "../../../shared/ui/MetricStrip.jsx";
import { BarChart } from "../../../shared/ui/BarChart.jsx";
import { Person } from "../../../shared/ui/Person.jsx";
import { currency, formatNumber } from "../../../shared/lib/format.js";
import { dateLabel } from "../../../shared/lib/date.js";
import { exportCSV } from "../../../shared/lib/exportCSV.js";
import React from "react";

export function FinanceView({ ctx, page }) {
  const [filter, setFilter] = useState("ALL"),
    [selected, setSelected] = useState(null);
  const rows = ctx.sample.invoices.filter(
    (i) => filter === "ALL" || (filter === "PAID" ? i.paid : !i.paid),
  );
  const total = ctx.sample.invoices
      .filter((i) => i.paid)
      .reduce((a, i) => a + i.amount, 0),
    unpaid = ctx.sample.invoices
      .filter((i) => !i.paid)
      .reduce((a, i) => a + i.amount, 0);
  return (
    <>
      <PageTitle
        title={page === "revenue" ? "Doanh thu" : "Hóa đơn & dịch vụ"}
        description="Khoản thu và trạng thái thanh toán của phòng tập."
        action={
          <Button
            quiet
            icon={Download}
            onClick={() =>
              exportCSV("optigym-hoa-don-mau.csv", [
                ["Hóa đơn", "Hội viên", "Dịch vụ", "Số tiền", "Trạng thái"],
                ...ctx.sample.invoices.map((i) => [
                  i.id,
                  i.name,
                  i.service,
                  i.amount,
                  i.paid ? "Đã thu" : "Chờ thu",
                ]),
              ])
            }
          >
            Xuất CSV mẫu
          </Button>
        }
      />
      <div className="g-prototype-note">
        <Sample>Mẫu</Sample>
        <span>Giao dịch minh họa, không thực hiện thanh toán thật.</span>
      </div>
      <MetricStrip
        items={[
          {
            title: "Đã thu trong danh sách",
            value: formatNumber(total / 1000000),
            unit: "triệu",
            sample: true,
            note:
              ctx.sample.invoices.filter((i) => i.paid).length +
              " hóa đơn đã thanh toán",
          },
          {
            title: "Còn chờ thanh toán",
            value: currency(unpaid),
            sample: true,
            note:
              ctx.sample.invoices.filter((i) => !i.paid).length +
              " hóa đơn chưa thanh toán",
          },
          {
            title: "Hóa đơn mẫu",
            value: ctx.sample.invoices.length,
            unit: "hóa đơn",
            sample: true,
            note: "Trong hai ngày gần nhất",
          },
        ]}
      />
      {page === "revenue" && (
        <Section title="Khoản thu theo tháng">
          <BarChart />
        </Section>
      )}
      <Section
        title="Giao dịch gần đây"
        action={
          <select
            className="g-filter-select"
            value={filter}
            aria-label="Lọc hóa đơn"
            onChange={(e) => setFilter(e.target.value)}
          >
            <option value="ALL">Tất cả hóa đơn</option>
            <option value="PAID">Đã thanh toán</option>
            <option value="UNPAID">Chờ thanh toán</option>
          </select>
        }
      >
        <Table
          rows={rows}
          columns={[
            {
              key: "id",
              label: "Hóa đơn",
            },
            {
              key: "name",
              label: "Hội viên",
            },
            {
              key: "service",
              label: "Dịch vụ",
            },
            {
              key: "amount",
              label: "Số tiền",
              render: (i) => <b>{currency(i.amount)}</b>,
            },
            {
              key: "paid",
              label: "Trạng thái",
              render: (i) => (
                <Tag active={i.paid}>
                  {i.paid ? "Đã thanh toán" : "Chờ thanh toán"}
                </Tag>
              ),
            },
            {
              key: "action",
              label: "",
              sortable: false,
              render: (i) => (
                <IconButton
                  icon={ArrowUpRight}
                  label={"Xem " + i.id}
                  onClick={() => setSelected(i)}
                />
              ),
            },
          ]}
        />
      </Section>
      {selected && (
        <Modal
          title={"Hóa đơn " + selected.id}
          description="Chi tiết giao dịch mẫu."
          onClose={() => setSelected(null)}
        >
          <div className="g-invoice-detail">
            <Person name={selected.name} />
            <dl>
              <div>
                <dt>Dịch vụ</dt>
                <dd>{selected.service}</dd>
              </div>
              <div>
                <dt>Ngày tạo</dt>
                <dd>{dateLabel(selected.date)}</dd>
              </div>
              <div>
                <dt>Số tiền</dt>
                <dd>{currency(selected.amount)}</dd>
              </div>
              <div>
                <dt>Trạng thái</dt>
                <dd>{selected.paid ? "Đã thanh toán" : "Chờ thanh toán"}</dd>
              </div>
            </dl>
            {!selected.paid && (
              <Button
                icon={Check}
                onClick={() => {
                  ctx.setSample((s) => ({
                    ...s,
                    invoices: s.invoices.map((i) =>
                      i.id === selected.id
                        ? {
                            ...i,
                            paid: true,
                          }
                        : i,
                    ),
                  }));
                  setSelected(null);
                  ctx.flash("Đã đánh dấu thanh toán trong dữ liệu mẫu.");
                }}
              >
                Đánh dấu đã thu (mẫu)
              </Button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
