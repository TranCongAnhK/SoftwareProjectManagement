import { useState } from "react";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import { Modal } from "../../../shared/ui/Modal.jsx";
import { Table } from "../../../shared/ui/Table.jsx";
import { Person } from "../../../shared/ui/Person.jsx";
import { MetricStrip } from "../../../shared/ui/MetricStrip.jsx";
import React from "react";

export function ClientsView({ ctx }) {
  const [selected, setSelected] = useState(null);
  return (
    <>
      <PageTitle
        title="Học viên của bạn"
        description="Thông tin liên hệ và hồ sơ tập luyện."
      />
      <MetricStrip
        items={[
          {
            title: "Học viên phụ trách",
            value: ctx.data.clients.length,
            note: "Được quản trị viên phân công",
          },
          {
            title: "Buổi tập tuần này",
            value: 18,
            unit: "buổi",
            sample: true,
            note: "Đã ghi trong nhật ký mẫu",
          },
          {
            title: "Cần trao đổi thêm",
            value: 1,
            unit: "học viên",
            sample: true,
            note: "Vắng hai buổi gần nhất",
          },
        ]}
      />
      <Table
        rows={ctx.data.clients}
        columns={[
          {
            key: "name",
            label: "Học viên",
            get: (r) => r.name + " " + r.email,
            render: (r) => <Person name={r.name} detail={r.email} />,
          },
          {
            key: "phone",
            label: "Điện thoại",
          },
          {
            key: "actions",
            label: "",
            sortable: false,
            render: (r) => (
              <Button quiet icon={ArrowUpRight} onClick={() => setSelected(r)}>
                Xem hồ sơ
              </Button>
            ),
          },
        ]}
      />
      {selected && (
        <Modal
          title={selected.name}
          description={
            ctx.user.demo
              ? "Hồ sơ và chỉ số tập luyện mẫu."
              : "Thông tin liên hệ thực; chỉ số tập luyện bên dưới là dữ liệu mẫu."
          }
          onClose={() => setSelected(null)}
        >
          <div className="g-client-detail">
            <Person name={selected.name} detail={selected.email} />
            <p>{selected.phone || "Chưa cung cấp số điện thoại"}</p>
            <div>
              <Sample>Mẫu</Sample>
              <h3>Mục tiêu: tăng sức mạnh</h3>
              <p>4 buổi mỗi tuần. Cân nặng gần nhất 66,4 kg, tỷ lệ mỡ 24,6%.</p>
            </div>
            <Button
              icon={ArrowRight}
              onClick={() => {
                ctx.setSample((s) => ({
                  ...s,
                  programClient: String(selected.id),
                }));
                setSelected(null);
                ctx.go("builder");
              }}
            >
              Soạn giáo án
            </Button>
          </div>
        </Modal>
      )}
    </>
  );
}
