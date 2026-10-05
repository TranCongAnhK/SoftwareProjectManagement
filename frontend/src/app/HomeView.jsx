import { ArrowUpRight, CalendarDays } from "lucide-react";
import { shortName } from "../shared/lib/format.js";
import { today } from "../shared/lib/today.js";
import { Member } from "../features/member/dashboard/MemberDashboard.jsx";
import { Admin } from "../features/admin/dashboard/AdminDashboard.jsx";
import { Coach } from "../features/pt/dashboard/PtDashboard.jsx";
import React from "react";

export function HomeView({ ctx }) {
  const role = ctx.user.role;
  return (
    <div className="s-home">
      <header className="s-intro">
        <div>
          <p>
            <span className="s-live" />
            Chào {shortName(ctx.user.name)}
            <span className="s-intro-separator">/</span>
            {today()}
          </p>
          <h1>
            {role === "MEMBER" ? (
              <>
                Thời gian <em>cho bạn.</em>
              </>
            ) : role === "ADMIN" ? (
              <>
                Một ngày <em>ở OptiGym.</em>
              </>
            ) : (
              <>
                Sẵn sàng <em>buổi tập mới.</em>
              </>
            )}
          </h1>
        </div>
        <button className="s-calendar" onClick={() => ctx.go("schedule")}>
          <CalendarDays size={19} />
          <span>Lịch của bạn</span>
          <ArrowUpRight size={18} />
        </button>
      </header>
      {role === "MEMBER" ? (
        <Member ctx={ctx} />
      ) : role === "ADMIN" ? (
        <Admin ctx={ctx} />
      ) : (
        <Coach ctx={ctx} />
      )}
    </div>
  );
}
