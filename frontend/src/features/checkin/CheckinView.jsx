import { useState } from "react";
import { Check, Dumbbell } from "lucide-react";
import { Button } from "../../shared/ui/Button.jsx";
import { PageTitle } from "../../shared/ui/PageTitle.jsx";
import { Section } from "../../shared/ui/Section.jsx";
import { Sample } from "../../shared/ui/Sample.jsx";
import { Field } from "../../shared/ui/Field.jsx";
import { Table } from "../../shared/ui/Table.jsx";
import { Tag } from "../../shared/ui/Tag.jsx";
import { Person } from "../../shared/ui/Person.jsx";
import { Avatar } from "../../shared/ui/Avatar.jsx";
import React from "react";

export function CheckinView({ ctx }) {
  const [name, setName] = useState("");
  return (
    <>
      <PageTitle
        title={
          ctx.user.role === "MEMBER"
            ? "Thẻ & lịch sử ra vào"
            : "Check-in tại phòng tập"
        }
        description="Thông tin lượt đến và khu vực tập luyện."
      />
      <div className="g-prototype-note">
        <Sample>Mẫu</Sample>
        <span>Lịch sử và thao tác check-in chưa kết nối backend.</span>
      </div>
      {ctx.user.role === "MEMBER" ? (
        <div className="g-membership-card">
          <Avatar name={ctx.user.name} size="large" />
          <div>
            <span>OptiGym / Hội viên</span>
            <h2>{ctx.user.name}</h2>
            <p>Thông tin thẻ minh họa. Quét thẻ sẽ được kết nối sau.</p>
          </div>
          <Dumbbell size={56} strokeWidth={1.1} />
        </div>
      ) : (
        <form
          className="g-checkin-form"
          onSubmit={(e) => {
            e.preventDefault();
            ctx.setSample((s) => ({
              ...s,
              checkins: [
                {
                  id: "ci" + Date.now(),
                  name,
                  time: new Date().toLocaleTimeString("vi-VN", {
                    hour: "2-digit",
                    minute: "2-digit",
                    timeZone: "Asia/Ho_Chi_Minh",
                  }),
                  zone: "Gym",
                },
                ...s.checkins,
              ],
            }));
            ctx.flash("Đã ghi một lượt check-in mẫu.");
            setName("");
          }}
        >
          <Field
            label="Hội viên check-in mẫu"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Nhập tên hội viên"
          />
          <Button type="submit" icon={Check}>
            Ghi lượt vào
          </Button>
        </form>
      )}
      <Section title="Lịch sử gần đây">
        <Table
          rows={ctx.sample.checkins}
          columns={[
            {
              key: "name",
              label: "Hội viên",
              render: (c) => <Person name={c.name} />,
            },
            {
              key: "time",
              label: "Giờ vào",
            },
            {
              key: "zone",
              label: "Khu vực",
            },
            {
              key: "status",
              label: "Trạng thái",
              sortable: false,
              render: () => <Tag active>Đã check-in</Tag>,
            },
          ]}
        />
      </Section>
    </>
  );
}
