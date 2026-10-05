import { useState } from "react";
import { Plus, X } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Section } from "../../../shared/ui/Section.jsx";
import { Select } from "../../../shared/ui/Select.jsx";
import { Table } from "../../../shared/ui/Table.jsx";
import { Person } from "../../../shared/ui/Person.jsx";
import React from "react";

export function AssignmentsView({ ctx }) {
  const [pt, setPt] = useState(""),
    [member, setMember] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    try {
      const payload = {
        pt_id: Number(pt),
        member_id: Number(member),
      };
      if (ctx.user.demo) {
        ctx.setData((d) => ({
          ...d,
          assignments: d.assignments.some(
            (a) =>
              a.pt_id === payload.pt_id && a.member_id === payload.member_id,
          )
            ? d.assignments
            : [
                ...d.assignments,
                {
                  ...payload,
                  pt_name: d.trainers.find((x) => x.id === payload.pt_id).name,
                  member_name: d.members.find((x) => x.id === payload.member_id)
                    .name,
                },
              ],
        }));
      } else {
        await ctx.api("/admin/assignments", {
          method: "POST",
          body: JSON.stringify(payload),
        });
        ctx.reload();
      }
      ctx.flash("Đã phân công" + (ctx.user.demo ? " trong dữ liệu mẫu." : "."));
      setPt("");
      setMember("");
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove(a) {
    try {
      if (ctx.user.demo) {
        ctx.setData((d) => ({
          ...d,
          assignments: d.assignments.filter(
            (x) => !(x.pt_id === a.pt_id && x.member_id === a.member_id),
          ),
        }));
      } else {
        await ctx.api(`/admin/assignments/${a.pt_id}/${a.member_id}`, {
          method: "DELETE",
        });
        ctx.reload();
      }
      ctx.flash("Đã gỡ phân công.");
    } catch (e) {
      ctx.flash(e.message);
    }
  }
  return (
    <>
      <PageTitle
        title="Phân công PT"
        description="Chọn huấn luyện viên và hội viên cần đồng hành."
      />
      <Section title="Phân công mới">
        <form className="g-assignment-form" onSubmit={submit}>
          <Select
            label="Huấn luyện viên"
            required
            value={pt}
            onChange={(e) => setPt(e.target.value)}
          >
            <option value="">Chọn PT</option>
            {ctx.data.trainers
              .filter((t) => t.status === "ACTIVE" && t.email_verified)
              .map((t) => (
                <option value={t.id} key={t.id}>
                  {t.name} / {t.specialty}
                </option>
              ))}
          </Select>
          <Select
            label="Hội viên"
            required
            value={member}
            onChange={(e) => setMember(e.target.value)}
          >
            <option value="">Chọn hội viên</option>
            {ctx.data.members
              .filter((t) => t.status === "ACTIVE" && t.email_verified)
              .map((t) => (
                <option value={t.id} key={t.id}>
                  {t.name}
                </option>
              ))}
          </Select>
          <Button type="submit" icon={Plus} disabled={busy}>
            Phân công
          </Button>
        </form>
        {error && <p className="g-error">{error}</p>}
      </Section>
      <Section title="Đang phụ trách">
        <Table
          rows={ctx.data.assignments.map((a, i) => ({
            ...a,
            id: i,
          }))}
          columns={[
            {
              key: "pt_name",
              label: "Huấn luyện viên",
              render: (r) => <Person name={r.pt_name} />,
            },
            {
              key: "member_name",
              label: "Hội viên",
            },
            {
              key: "actions",
              label: "",
              sortable: false,
              render: (r) => (
                <Button quiet icon={X} onClick={() => remove(r)}>
                  Gỡ phân công
                </Button>
              ),
            },
          ]}
        />
      </Section>
    </>
  );
}
