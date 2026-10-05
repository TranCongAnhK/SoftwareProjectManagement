import { useState } from "react";
import {
  Plus,
  ArrowRight,
  Pencil,
  Trash2,
  Layers3,
  Dumbbell,
  Phone,
  Mail,
} from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { IconButton } from "../../../shared/ui/IconButton.jsx";
import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import { Modal } from "../../../shared/ui/Modal.jsx";
import { Table } from "../../../shared/ui/Table.jsx";
import { Person } from "../../../shared/ui/Person.jsx";
import { Tag } from "../../../shared/ui/Tag.jsx";
import { Avatar } from "../../../shared/ui/Avatar.jsx";
import { Empty } from "../../../shared/ui/Empty.jsx";
import { currency } from "../../../shared/lib/format.js";
import { dateLabel, dayKey } from "../../../shared/lib/date.js";
import { config } from "./directoryConfig.js";
import { status } from "./directoryStatus.js";
import { ManagerForm } from "./ManagerForm.jsx";
import { AssignSubscription } from "../subscriptions/AssignSubscription.jsx";
import React from "react";

export function DirectoryView({ kind, ctx }) {
  const cfg = config[kind],
    rows = ctx.data[cfg.key];
  const [filter, setFilter] = useState("ALL"),
    [modal, setModal] = useState(null),
    [removing, setRemoving] = useState(null),
    [assigning, setAssigning] = useState(null),
    [busy, setBusy] = useState(false),
    [error, setError] = useState("");
  const filtered = rows.filter(
    (r) =>
      filter === "ALL" ||
      (kind === "packages"
        ? filter === "ACTIVE"
          ? r.active
          : !r.active
        : filter === "UNVERIFIED"
          ? !r.email_verified
          : r.status === filter),
  );
  async function save(form) {
    setBusy(true);
    setError("");
    try {
      if (ctx.user.demo) {
        const { password, ...publicForm } = form;
        const record = {
          ...publicForm,
          id: modal.id || Date.now(),
          created_at: modal.created_at || dayKey(),
          email_verified: modal.id ? modal.email_verified : false,
        };
        ctx.setData((d) => ({
          ...d,
          [cfg.key]: modal.id
            ? d[cfg.key].map((r) => (r.id === modal.id ? record : r))
            : [record, ...d[cfg.key]],
        }));
        ctx.flash("Đã lưu trong dữ liệu mẫu.");
      } else {
        let path, method;
        if (kind === "members" && !modal.id) {
          path = "/admin/members";
          method = "POST";
        } else if (["members", "trainers"].includes(kind)) {
          path = "/admin/users/" + modal.id;
          method = "PATCH";
        } else {
          path = "/admin/" + kind + (modal.id ? "/" + modal.id : "");
          method = modal.id ? "PUT" : "POST";
        }
        const response = await ctx.api(path, {
          method,
          body: JSON.stringify(form),
        });
        ctx.flash(response.message || "Đã lưu thay đổi.");
        ctx.reload();
      }
      setModal(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  async function remove() {
    setBusy(true);
    setError("");
    try {
      if (ctx.user.demo) {
        ctx.setData((d) => ({
          ...d,
          [cfg.key]:
            kind === "packages"
              ? d[cfg.key].map((r) =>
                  r.id === removing.id
                    ? {
                        ...r,
                        active: false,
                      }
                    : r,
                )
              : d[cfg.key].filter((r) => r.id !== removing.id),
        }));
        ctx.flash(
          kind === "packages"
            ? "Đã ẩn gói trong dữ liệu mẫu."
            : "Đã xóa khỏi danh sách mẫu.",
        );
      } else {
        await ctx.api(
          "/admin/" +
            (["members", "trainers"].includes(kind) ? "users" : kind) +
            "/" +
            removing.id,
          {
            method: "DELETE",
          },
        );
        ctx.reload();
        ctx.flash(kind === "packages" ? "Đã ẩn gói tập." : "Đã xóa hồ sơ.");
      }
      setRemoving(null);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const actions = (r) => (
    <div className="g-row-actions">
      {kind === "members" && (
        <IconButton
          icon={Layers3}
          label={"Gán gói cho " + r.name}
          onClick={() => setAssigning(r)}
        />
      )}
      <IconButton
        icon={Pencil}
        label={"Sửa " + r.name}
        onClick={() => {
          setError("");
          setModal(r);
        }}
      />
      <IconButton
        icon={Trash2}
        label={(kind === "packages" ? "Ẩn " : "Xóa ") + r.name}
        onClick={() => {
          setError("");
          setRemoving(r);
        }}
      />
    </div>
  );
  const columns =
    kind === "members"
      ? [
          {
            key: "name",
            label: "Hội viên",
            get: (r) => r.name + " " + r.email,
            render: (r) => <Person name={r.name} detail={r.email} />,
          },
          {
            key: "phone",
            label: "Điện thoại",
          },
          {
            key: "created_at",
            label: "Ngày tham gia",
            render: (r) => (r.created_at ? dateLabel(r.created_at) : "-"),
          },
          {
            key: "status",
            label: "Trạng thái",
            render: (r) => (
              <Tag active={r.status === "ACTIVE" && r.email_verified}>
                {status(r, kind)}
              </Tag>
            ),
          },
          {
            key: "actions",
            label: "",
            sortable: false,
            render: actions,
          },
        ]
      : [
          {
            key: "name",
            label: "Nhân sự",
            get: (r) => r.name + " " + r.email,
            render: (r) => <Person name={r.name} detail={r.email} />,
          },
          {
            key: "position",
            label: "Vị trí",
          },
          {
            key: "phone",
            label: "Điện thoại",
          },
          {
            key: "status",
            label: "Trạng thái",
            render: (r) => (
              <Tag active={r.status === "ACTIVE"}>{status(r, kind)}</Tag>
            ),
          },
          {
            key: "actions",
            label: "",
            sortable: false,
            render: actions,
          },
        ];
  return (
    <>
      <PageTitle
        title={cfg.title}
        description={
          {
            members: "Hồ sơ, thông tin liên hệ và trạng thái tài khoản.",
            trainers: "Đội ngũ huấn luyện và hồ sơ cần xét duyệt.",
            staff: "Nhân sự và vị trí làm việc tại phòng tập.",
            packages: "Các gói tập đang bán và thời hạn sử dụng.",
          }[kind]
        }
        action={
          kind !== "trainers" && (
            <Button
              icon={Plus}
              onClick={() => {
                setError("");
                setModal({});
              }}
            >
              Thêm {cfg.singular}
            </Button>
          )
        }
      />
      <div className="g-directory-toolbar">
        <div>
          <strong>{rows.length}</strong>
          <span>{cfg.singular}</span>
          {ctx.user.demo && <Sample>Mẫu</Sample>}
        </div>
        <select
          aria-label="Lọc trạng thái"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="ACTIVE">
            {kind === "packages" ? "Đang bán" : "Hoạt động"}
          </option>
          {kind === "packages" ? (
            <option value="INACTIVE">Đã ẩn</option>
          ) : (
            <>
              <option value={kind === "staff" ? "INACTIVE" : "DISABLED"}>
                {kind === "staff" ? "Ngưng làm" : "Đã khóa"}
              </option>
              {kind === "trainers" && (
                <option value="PENDING">Chờ duyệt</option>
              )}
              {kind !== "staff" && (
                <option value="UNVERIFIED">Chờ xác thực</option>
              )}
            </>
          )}
        </select>
      </div>
      {["members", "staff"].includes(kind) ? (
        <Table rows={filtered} columns={columns} />
      ) : kind === "trainers" ? (
        <div className="g-trainer-grid">
          {filtered.map((r) => (
            <article key={r.id}>
              <div className="g-trainer-head">
                <Avatar name={r.name} size="large" />
                {actions(r)}
              </div>
              <h2>{r.name}</h2>
              <span className="g-trainer-specialty">
                {r.specialty} / Huấn luyện viên
              </span>
              <div className="g-trainer-contacts">
                <span>
                  <Mail size={14} />
                  {r.email}
                </span>
                <span>
                  <Phone size={14} />
                  {r.phone || "Chưa có số điện thoại"}
                </span>
              </div>
              <footer>
                <Tag active={r.status === "ACTIVE"}>{status(r, kind)}</Tag>
                {r.status === "PENDING" && (
                  <button
                    onClick={() => {
                      setError("");
                      setModal(r);
                    }}
                  >
                    Xét duyệt
                    <ArrowRight size={16} />
                  </button>
                )}
              </footer>
            </article>
          ))}
        </div>
      ) : (
        <div className="g-package-grid">
          {filtered.map((r) => (
            <article key={r.id}>
              <div>
                <span>{r.category}</span>
                {actions(r)}
              </div>
              <h2>{r.name}</h2>
              <p>{r.description}</p>
              <strong>{currency(r.price)}</strong>
              <small>{r.duration_days} ngày sử dụng</small>
              <footer>
                <Tag active={r.active}>{r.active ? "Đang bán" : "Đã ẩn"}</Tag>
                <Dumbbell size={25} />
              </footer>
            </article>
          ))}
        </div>
      )}
      {!filtered.length && ["trainers", "packages"].includes(kind) && (
        <Empty title="Chưa có hồ sơ phù hợp" />
      )}
      {modal !== null && (
        <Modal
          title={(modal.id ? "Chỉnh sửa " : "Thêm ") + cfg.singular}
          description={
            ctx.user.demo
              ? "Thay đổi chỉ lưu trong bản xem thử."
              : "Thông tin được lưu vào hệ thống OptiGym."
          }
          onClose={() => setModal(null)}
        >
          <ManagerForm
            kind={kind}
            record={modal}
            busy={busy}
            error={error}
            save={save}
          />
        </Modal>
      )}
      {removing && (
        <Modal
          title={kind === "packages" ? "Ẩn gói tập?" : "Xóa hồ sơ?"}
          description={
            ctx.user.demo
              ? "Thao tác trên dữ liệu mẫu của bản B."
              : kind === "packages"
                ? "Gói đã gán cho hội viên vẫn giữ lịch sử."
                : "Hồ sơ sẽ bị xóa khỏi hệ thống và không thể khôi phục bằng giao diện."
          }
          onClose={() => setRemoving(null)}
        >
          <p className="g-confirm-name">{removing.name}</p>
          {error && (
            <p role="alert" className="g-error">
              {error}
            </p>
          )}
          <div className="g-dialog-actions">
            <Button quiet onClick={() => setRemoving(null)}>
              Giữ lại
            </Button>
            <Button disabled={busy} icon={Trash2} onClick={remove}>
              {busy
                ? "Đang xử lý..."
                : kind === "packages"
                  ? "Ẩn gói"
                  : "Xóa hồ sơ"}
            </Button>
          </div>
        </Modal>
      )}
      {assigning && (
        <AssignSubscription
          member={assigning}
          ctx={ctx}
          onClose={() => setAssigning(null)}
        />
      )}
    </>
  );
}
