import { ArrowUpRight, Plus } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { TextLink } from "../../../shared/ui/TextLink.jsx";
import { Section } from "../../../shared/ui/Section.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import { Person } from "../../../shared/ui/Person.jsx";
import { Tag } from "../../../shared/ui/Tag.jsx";
import { Table } from "../../../shared/ui/Table.jsx";
import { BarChart } from "../../../shared/ui/BarChart.jsx";
import { currency } from "../../../shared/lib/format.js";
import { dateLabel } from "../../../shared/lib/date.js";
import { Agenda } from "../../schedule/Agenda.jsx";
import React from "react";

export function Admin({ ctx }) {
  const unpaid = ctx.sample.invoices.filter((x) => !x.paid),
    maintenance = ctx.sample.equipment.filter((x) => x.maintenance);
  return (
    <>
      <div className="s-admin-strip">
        {[
          [
            "Hội viên đang hoạt động",
            ctx.data.members.filter(
              (x) => x.status === "ACTIVE" && x.email_verified,
            ).length,
            "members",
          ],
          ["Lớp trong lịch mẫu", ctx.sample.sessions.length, "schedule"],
          [
            "Thiết bị hoạt động",
            ctx.sample.equipment.length - maintenance.length,
            "equipment",
          ],
        ].map(([label, value, page]) => (
          <button key={page} onClick={() => ctx.go(page)}>
            <span>
              {label}
              <Sample>Mẫu</Sample>
            </span>
            <strong>{String(value).padStart(2, "0")}</strong>
            <ArrowUpRight size={23} />
          </button>
        ))}
      </div>
      <div className="s-operations">
        <section className="s-traffic">
          <div className="s-section-index">01 / NHỊP PHÒNG TẬP</div>
          <Section
            title="Lượt đến trong tuần"
            action={
              <TextLink onClick={() => ctx.go("reports")}>Báo cáo</TextLink>
            }
          >
            <BarChart
              series={[24, 31, 28, 36, 33, 41, 26]}
              labels={["T2", "T3", "T4", "T5", "T6", "T7", "CN"]}
              unit="lượt"
            />
          </Section>
        </section>
        <section className="s-tasks">
          <header>
            <h2>Việc cần làm</h2>
            <Sample>Mẫu</Sample>
          </header>
          <button onClick={() => ctx.go("billing")}>
            <span>01</span>
            <div>
              <b>{unpaid.length} hóa đơn chờ thu</b>
              <p>{currency(unpaid.reduce((n, i) => n + i.amount, 0))}</p>
            </div>
            <ArrowUpRight size={21} />
          </button>
          <button onClick={() => ctx.go("equipment")}>
            <span>02</span>
            <div>
              <b>{maintenance.length} thiết bị cần kiểm tra</b>
              <p>Cập nhật sau khi bảo trì</p>
            </div>
            <ArrowUpRight size={21} />
          </button>
          <Button icon={Plus} onClick={() => ctx.go("members")}>
            Quản lý hội viên
          </Button>
        </section>
      </div>
      <div className="s-lower">
        <div className="s-agenda">
          <div className="s-section-index">02 / LỊCH TRONG NGÀY</div>
          <Agenda ctx={ctx} compact />
        </div>
        <section className="s-club-photo">
          <img src="/studio/training.jpg" alt="Không gian tập tạ OptiGym" />
          <div>
            <span>OPTIGYM / TRAINING CLUB</span>
            <h2>
              Mỗi buổi tập,
              <br />
              đều được chăm chút.
            </h2>
            <TextLink onClick={() => ctx.go("equipment")}>
              Xem thiết bị
            </TextLink>
          </div>
        </section>
      </div>
      <Section
        title="Hội viên mới"
        action={
          <TextLink onClick={() => ctx.go("members")}>Tất cả hội viên</TextLink>
        }
      >
        <Table
          searchable={false}
          rows={ctx.data.members.slice(0, 4)}
          columns={[
            {
              key: "name",
              label: "Hội viên",
              render: (r) => <Person name={r.name} detail={r.email} />,
            },
            {
              key: "created_at",
              label: "Ngày tham gia",
              render: (r) => dateLabel(r.created_at),
            },
            {
              key: "status",
              label: "Trạng thái",
              render: (r) => (
                <Tag active={r.status === "ACTIVE" && r.email_verified}>
                  {!r.email_verified
                    ? "Chờ xác thực"
                    : r.status === "ACTIVE"
                      ? "Hoạt động"
                      : "Đã khóa"}
                </Tag>
              ),
            },
          ]}
        />
      </Section>
    </>
  );
}
