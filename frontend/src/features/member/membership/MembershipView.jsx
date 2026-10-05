import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Section } from "../../../shared/ui/Section.jsx";
import { Tag } from "../../../shared/ui/Tag.jsx";
import { Avatar } from "../../../shared/ui/Avatar.jsx";
import { Empty } from "../../../shared/ui/Empty.jsx";
import { currency } from "../../../shared/lib/format.js";
import { dateLabel, dayKey } from "../../../shared/lib/date.js";
import React from "react";

export function MembershipView({ ctx }) {
  return (
    <>
      <PageTitle
        title="Gói tập & PT"
        description="Thời hạn gói và huấn luyện viên đang đồng hành."
      />
      <div className="g-membership-layout">
        <Section title="Gói của bạn">
          {ctx.data.overview.subscriptions.length ? (
            ctx.data.overview.subscriptions.map((s) => (
              <div className="g-subscription" key={s.id}>
                <div>
                  <span>{s.category}</span>
                  <h3>{s.name}</h3>
                  <p>
                    {dateLabel(s.starts_on)} - {dateLabel(s.ends_on)}
                  </p>
                </div>
                <Tag active={s.ends_on >= dayKey()}>
                  {s.ends_on >= dayKey() ? "Còn hiệu lực" : "Đã hết hạn"}
                </Tag>
              </div>
            ))
          ) : (
            <Empty title="Bạn chưa có gói tập" />
          )}
        </Section>
        <Section title="Huấn luyện viên">
          {ctx.data.overview.trainers.length ? (
            ctx.data.overview.trainers.map((t) => (
              <div className="g-trainer-inline" key={t.id}>
                <Avatar name={t.name} size="large" />
                <h3>{t.name}</h3>
                <p>Chuyên môn {t.specialty}</p>
              </div>
            ))
          ) : (
            <Empty title="Chưa phân công PT" />
          )}
        </Section>
      </div>
      <Section title="Các gói đang bán">
        <div className="g-package-grid">
          {ctx.data.packages
            .filter((p) => p.active)
            .map((p) => (
              <article key={p.id}>
                <span>{p.category}</span>
                <h2>{p.name}</h2>
                <p>{p.description}</p>
                <strong>{currency(p.price)}</strong>
                <small>{p.duration_days} ngày</small>
                <footer>
                  <span>Đăng ký tại quầy lễ tân</span>
                </footer>
              </article>
            ))}
        </div>
        {!ctx.data.packages.length && <Empty title="Chưa có gói mở bán" />}
      </Section>
    </>
  );
}
