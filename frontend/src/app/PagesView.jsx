import { MemberWorkoutView } from "../features/member/workout/MemberWorkoutView.jsx";
import { ProgramBuilderView } from "../features/pt/programs/ProgramBuilderView.jsx";
import { PageTitle } from "../shared/ui/PageTitle.jsx";
import { Sample } from "../shared/ui/Sample.jsx";
import { HomeView } from "./HomeView.jsx";
import { Agenda } from "../features/schedule/Agenda.jsx";
import { DirectoryView } from "../features/admin/management/DirectoryView.jsx";
import { AssignmentsView } from "../features/admin/assignments/AssignmentsView.jsx";
import { ClientsView } from "../features/pt/clients/ClientsView.jsx";
import { MembershipView } from "../features/member/membership/MembershipView.jsx";

import { NutritionView } from "../features/member/nutrition/NutritionView.jsx";
import { ProgressView } from "../features/training/progress/ProgressView.jsx";
import { FinanceView } from "../features/admin/finance/FinanceView.jsx";
import { ReportsView } from "../features/admin/reports/ReportsView.jsx";
import { EquipmentView } from "../features/admin/equipment/EquipmentView.jsx";
import { LibraryView } from "../features/training/exercises/LibraryView.jsx";
import { CheckinView } from "../features/checkin/CheckinView.jsx";
import { NotificationsView } from "../features/notifications/NotificationsView.jsx";
import { SettingsView } from "../features/account/SettingsView.jsx";
import React from "react";

export function PagesView({ page, ctx }) {
  if (page === "home") return <HomeView ctx={ctx} />;
  if (["members", "trainers", "staff", "packages"].includes(page))
    return <DirectoryView key={page} kind={page} ctx={ctx} />;
  if (page === "assignments") return <AssignmentsView ctx={ctx} />;
  if (page === "clients") return <ClientsView ctx={ctx} />;
  if (page === "membership") return <MembershipView ctx={ctx} />;
  if (page === "schedule")
    return (
      <>
        <PageTitle
          title={ctx.user.role === "PT" ? "Lịch huấn luyện" : "Lịch lớp & hẹn"}
          description="Khung giờ, huấn luyện viên và sức chứa từng lớp."
        />
        <div className="g-prototype-note">
          <Sample>Mẫu</Sample>
          <span>Đặt chỗ và thay đổi lịch chỉ lưu trong lần xem này.</span>
        </div>
        <Agenda ctx={ctx} />
      </>
    );
  if (page === "workout") return <MemberWorkoutView ctx={ctx} />;
  if (page === "builder") return <ProgramBuilderView ctx={ctx} />;
  if (page === "nutrition") return <NutritionView ctx={ctx} />;
  if (page === "progress") return <ProgressView ctx={ctx} />;
  if (["billing", "revenue"].includes(page))
    return <FinanceView page={page} ctx={ctx} />;
  if (page === "reports") return <ReportsView />;
  if (page === "equipment") return <EquipmentView ctx={ctx} />;
  if (page === "exercises") return <LibraryView ctx={ctx} />;
  if (page === "checkin") return <CheckinView ctx={ctx} />;
  if (page === "notifications") return <NotificationsView ctx={ctx} />;
  return <SettingsView ctx={ctx} />;
}
