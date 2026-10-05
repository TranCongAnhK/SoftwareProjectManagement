import { ArrowUpRight } from "lucide-react";
import { TextLink } from "../../../shared/ui/TextLink.jsx";
import { Person } from "../../../shared/ui/Person.jsx";
import { Empty } from "../../../shared/ui/Empty.jsx";
import { Agenda } from "../../schedule/Agenda.jsx";
import { Hero } from "../../../shared/components/TrainingHero.jsx";
import React from "react";

export function Coach({ ctx }) {
  const client = ctx.data.clients[0];
  function prepare(c) {
    ctx.setSample((s) => ({
      ...s,
      programClient: String(c?.id || ""),
    }));
    ctx.go("builder");
  }
  return (
    <>
      <div className="s-feature-grid">
        <Hero
          ctx={ctx}
          label="Buổi hẹn mẫu tiếp theo"
          title="09:00 / 10:00"
          description={
            ctx.user.demo ? client?.name || "Học viên mẫu" : "Buổi tập sức mạnh"
          }
          meta={
            <>
              <span>Chân & core</span>
              <span>Khu tạ tự do</span>
            </>
          }
          action="Chuẩn bị giáo án"
          onAction={() => prepare(client)}
        />
        <section className="s-coach-list">
          <header>
            <h2>Học viên</h2>
            <span>{String(ctx.data.clients.length).padStart(2, "0")}</span>
          </header>
          {ctx.data.clients.slice(0, 4).map((c) => (
            <button key={c.id} onClick={() => prepare(c)}>
              <Person name={c.name} detail="Chuẩn bị giáo án" />
              <ArrowUpRight size={18} />
            </button>
          ))}
          {!ctx.data.clients.length && <Empty title="Chưa có học viên" />}
          <TextLink onClick={() => ctx.go("clients")}>Xem tất cả</TextLink>
        </section>
      </div>
      <div className="s-lower">
        <div className="s-agenda">
          <div className="s-section-index">01 / LỊCH CỦA BẠN</div>
          <Agenda ctx={ctx} compact />
        </div>
        <section className="s-program">
          <div className="s-section-index">02 / GIÁO ÁN ĐANG SOẠN</div>
          <h2>{ctx.sample.programName}</h2>
          <p>
            {ctx.sample.exercises.length} bài tập ·{" "}
            {ctx.sample.exercises.reduce((n, e) => n + Number(e.sets), 0)} hiệp
          </p>
          {ctx.sample.exercises.slice(0, 3).map((e, i) => (
            <div key={e.id}>
              <small>0{i + 1}</small>
              <b>{e.name}</b>
              <span>
                {e.sets} × {e.reps}
              </span>
            </div>
          ))}
          <TextLink onClick={() => ctx.go("builder")}>Chỉnh giáo án</TextLink>
        </section>
      </div>
    </>
  );
}
