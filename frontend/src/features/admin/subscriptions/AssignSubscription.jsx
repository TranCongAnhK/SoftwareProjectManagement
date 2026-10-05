import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { Modal } from "../../../shared/ui/Modal.jsx";
import { Select } from "../../../shared/ui/Select.jsx";
import { currency, shortName } from "../../../shared/lib/format.js";
import React from "react";

export function AssignSubscription({ member, ctx, onClose }) {
  const [id, setId] = useState(""),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    try {
      if (ctx.user.demo) {
        ctx.setData((d) => ({
          ...d,
          members: d.members.map((r) =>
            r.id === member.id
              ? {
                  ...r,
                  plan: d.packages.find((p) => p.id === Number(id))?.name,
                }
              : r,
          ),
        }));
        ctx.flash("Đã gán gói trong dữ liệu mẫu.");
      } else {
        await ctx.api("/admin/subscriptions", {
          method: "POST",
          body: JSON.stringify({
            member_id: member.id,
            package_id: Number(id),
          }),
        });
        ctx.reload();
        ctx.flash("Đã gán gói cho hội viên.");
      }
      onClose();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  return (
    <Modal
      title={"Gán gói cho " + shortName(member.name)}
      description="Gói có hiệu lực từ hôm nay."
      onClose={onClose}
    >
      <form className="g-form" onSubmit={submit}>
        <Select
          label="Chọn gói tập"
          required
          value={id}
          onChange={(e) => setId(e.target.value)}
        >
          <option value="">Chọn gói đang bán</option>
          {ctx.data.packages
            .filter((p) => p.active)
            .map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} / {currency(p.price)}
              </option>
            ))}
        </Select>
        {error && <p className="g-error">{error}</p>}
        <Button type="submit" icon={Check} disabled={busy}>
          Gán gói tập
        </Button>
      </form>
    </Modal>
  );
}
