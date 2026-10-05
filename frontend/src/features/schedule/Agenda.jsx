import { useState } from "react";
import {
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Plus,
  Check,
} from "lucide-react";
import { dayKey, dateLabel } from "../../shared/lib/date.js";
import { Button } from "../../shared/ui/Button.jsx";
import { IconButton } from "../../shared/ui/IconButton.jsx";
import { Section } from "../../shared/ui/Section.jsx";
import { Sample } from "../../shared/ui/Sample.jsx";
import { Avatar } from "../../shared/ui/Avatar.jsx";
import { TextLink } from "../../shared/ui/TextLink.jsx";
import { Empty } from "../../shared/ui/Empty.jsx";
import { CreateSession } from "./CreateSession.jsx";
import React from "react";

export function Agenda({ ctx, compact = false }) {
  const [offset, setOffset] = useState(0),
    [day, setDay] = useState((new Date().getDay() + 6) % 7),
    [sport, setSport] = useState("ALL"),
    [create, setCreate] = useState(false);
  const { sample, setSample, user } = ctx;
  const start = new Date();
  start.setDate(start.getDate() - ((start.getDay() + 6) % 7) + offset * 7);
  const dates = Array.from(
    {
      length: 7,
    },
    (_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return d;
    },
  );
  const key = dayKey(dates[day]);
  const rows = sample.sessions
    .filter(
      (s) =>
        (!s.date || s.date === key) && (sport === "ALL" || s.type === sport),
    )
    .filter((_, i) => (day === 6 ? i < 2 : true));
  const booking = (id) => key + ":" + id;
  function toggle(s) {
    setSample((old) => ({
      ...old,
      bookings: old.bookings.includes(booking(s.id))
        ? old.bookings.filter((x) => x !== booking(s.id))
        : [...old.bookings, booking(s.id)],
    }));
    ctx.flash(
      sample.bookings.includes(booking(s.id))
        ? "Đã hủy đặt chỗ mẫu."
        : "Đã đặt chỗ trong lịch mẫu.",
    );
  }
  return (
    <>
      <Section
        title={compact ? "Lịch hôm nay" : "Lịch trong tuần"}
        detail={
          compact
            ? "Các lớp và khung giờ đã lên lịch."
            : dateLabel(dates[0]) + " - " + dateLabel(dates[6])
        }
        action={
          <div className="g-inline-actions">
            <Sample>Mẫu</Sample>
            {!compact && user.role !== "MEMBER" && (
              <Button quiet icon={Plus} onClick={() => setCreate(true)}>
                Thêm lịch
              </Button>
            )}
            <IconButton
              icon={ChevronLeft}
              label="Tuần trước"
              onClick={() => setOffset((o) => o - 1)}
            />
            <IconButton
              icon={ChevronRight}
              label="Tuần sau"
              onClick={() => setOffset((o) => o + 1)}
            />
          </div>
        }
      >
        <div className="g-day-picker">
          {dates.map((d, i) => (
            <button
              key={i}
              className={i === day ? "selected" : ""}
              onClick={() => setDay(i)}
              aria-label={"Xem lịch " + dateLabel(d)}
            >
              <small>{["T2", "T3", "T4", "T5", "T6", "T7", "CN"][i]}</small>
              <strong>{d.getDate()}</strong>
              {d.toDateString() === new Date().toDateString() && (
                <span>Hôm nay</span>
              )}
            </button>
          ))}
        </div>
        {!compact && (
          <div className="g-segmented" aria-label="Lọc lịch theo bộ môn">
            {[
              ["ALL", "Tất cả"],
              ["GYM", "Gym"],
              ["YOGA", "Yoga"],
              ["BOXING", "Boxing"],
            ].map(([v, l]) => (
              <button
                key={v}
                className={sport === v ? "active" : ""}
                onClick={() => setSport(v)}
              >
                {l}
              </button>
            ))}
          </div>
        )}
        <div className="g-agenda">
          {rows.slice(0, compact ? 3 : rows.length).map((s, i) => {
            const booked = sample.bookings.includes(booking(s.id));
            return (
              <article key={s.id}>
                <div className="g-agenda-time">
                  <strong>{s.time}</strong>
                  <small>{s.end}</small>
                </div>
                <div className="g-agenda-track">
                  <span />
                </div>
                <div className="g-agenda-session">
                  <div>
                    <span className="g-session-type">{s.type}</span>
                    <h3>{s.name}</h3>
                    <p>
                      {s.room}
                      <span>/</span>
                      {s.duration} phút
                    </p>
                  </div>
                  <div className="g-agenda-coach">
                    <Avatar name={s.coach} size="small" />
                    <span>{s.coach}</span>
                  </div>
                </div>
                <div className="g-agenda-capacity">
                  <b>
                    {s.filled + (booked ? 1 : 0)}
                    <small> / {s.capacity}</small>
                  </b>
                  <span>
                    {s.capacity - s.filled - (booked ? 1 : 0)} chỗ trống
                  </span>
                </div>
                {user.role === "MEMBER" ? (
                  <Button
                    quiet={booked}
                    icon={booked ? Check : Plus}
                    aria-label={(booked ? "Hủy đặt chỗ " : "Đặt chỗ ") + s.name}
                    disabled={!booked && s.filled >= s.capacity}
                    onClick={() => toggle(s)}
                  >
                    {booked ? "Đã đặt" : "Đặt chỗ"}
                  </Button>
                ) : (
                  <IconButton
                    icon={ArrowUpRight}
                    label={"Xem chi tiết " + s.name}
                    onClick={() =>
                      ctx.flash(
                        `${s.name}: ${s.coach}, ${s.time}-${s.end}, ${s.room}. Lịch mẫu.`,
                      )
                    }
                  />
                )}
              </article>
            );
          })}
          {!rows.length && <Empty title="Không có lớp phù hợp" />}
        </div>
        {compact && (
          <div className="g-section-bottom">
            <TextLink onClick={() => ctx.go("schedule")}>
              Mở lịch đầy đủ
            </TextLink>
          </div>
        )}
      </Section>
      {create && (
        <CreateSession
          onClose={() => setCreate(false)}
          onSave={(session) => {
            setSample((old) => ({
              ...old,
              sessions: [
                ...old.sessions,
                {
                  ...session,
                  date: key,
                },
              ].sort((a, b) => a.time.localeCompare(b.time)),
            }));
            setCreate(false);
            ctx.flash("Đã thêm buổi vào lịch mẫu.");
          }}
        />
      )}
    </>
  );
}
