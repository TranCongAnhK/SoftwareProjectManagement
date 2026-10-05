import { Check, CalendarDays } from "lucide-react";
import { Button } from "../../shared/ui/Button.jsx";
import { PageTitle } from "../../shared/ui/PageTitle.jsx";
import { Section } from "../../shared/ui/Section.jsx";
import { Sample } from "../../shared/ui/Sample.jsx";
import { Tag } from "../../shared/ui/Tag.jsx";
import React from "react";

export function NotificationsView({ ctx }) {
  return (
    <>
      <PageTitle
        title="Thông báo"
        description="Lịch hẹn và lời nhắc trong bản xem thử."
        action={
          <Button
            quiet
            icon={Check}
            onClick={() =>
              ctx.setSample((s) => ({
                ...s,
                readNotifications: true,
              }))
            }
          >
            Đánh dấu đã đọc
          </Button>
        }
      />
      <Section title="Gần đây" action={<Sample>Mẫu</Sample>}>
        <div className="g-notification-list">
          {[
            [
              "Lịch tập với PT lúc 17:30",
              "Buổi tập đã được xác nhận. Hãy đến trước 10 phút.",
            ],
            ["Lớp Yoga buổi sáng", "Lớp bắt đầu lúc 06:30 ở phòng Yoga."],
            [
              "Gói tập sắp đến hạn",
              "Xem thời hạn gói và liên hệ lễ tân nếu cần gia hạn.",
            ],
          ].map(([title, description], i) => (
            <article key={title}>
              <span>
                <CalendarDays size={21} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
                <small>{i + 1} giờ trước / mẫu</small>
              </div>
              {!ctx.sample.readNotifications && <Tag active>Mới</Tag>}
            </article>
          ))}
        </div>
      </Section>
    </>
  );
}
