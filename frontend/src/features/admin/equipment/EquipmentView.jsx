import { useState } from "react";
import { Check, Dumbbell, Clock3 } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import { Table } from "../../../shared/ui/Table.jsx";
import { Tag } from "../../../shared/ui/Tag.jsx";
import React from "react";

export function EquipmentView({ ctx }) {
  const [filter, setFilter] = useState("ALL");
  const rows = ctx.sample.equipment.filter(
    (e) =>
      filter === "ALL" ||
      (filter === "MAINTENANCE" ? e.maintenance : !e.maintenance),
  );
  return (
    <>
      <PageTitle
        title="Thiết bị phòng tập"
        description="Tình trạng sử dụng và lịch bảo trì."
      />
      <div className="g-prototype-note">
        <Sample>Mẫu</Sample>
        <span>Cập nhật tình trạng để thử quy trình bảo trì.</span>
      </div>
      <div className="g-equipment-header">
        <Dumbbell size={32} />
        <strong>
          {ctx.sample.equipment.length}
          <small> thiết bị</small>
        </strong>
        <span>
          {ctx.sample.equipment.filter((e) => e.maintenance).length} cần bảo trì
        </span>
        <select
          aria-label="Lọc tình trạng thiết bị"
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
        >
          <option value="ALL">Tất cả</option>
          <option value="MAINTENANCE">Cần bảo trì</option>
          <option value="ACTIVE">Hoạt động</option>
        </select>
      </div>
      <Table
        rows={rows}
        columns={[
          {
            key: "name",
            label: "Thiết bị",
            render: (r) => <b>{r.name}</b>,
          },
          {
            key: "zone",
            label: "Khu vực",
          },
          {
            key: "due",
            label: "Lịch bảo trì mẫu",
          },
          {
            key: "maintenance",
            label: "Tình trạng",
            render: (r) => (
              <Tag active={!r.maintenance}>
                {r.maintenance ? "Cần bảo trì" : "Hoạt động"}
              </Tag>
            ),
          },
          {
            key: "action",
            label: "",
            sortable: false,
            render: (r) => (
              <Button
                quiet
                icon={r.maintenance ? Check : Clock3}
                onClick={() =>
                  ctx.setSample((s) => ({
                    ...s,
                    equipment: s.equipment.map((e) =>
                      e.id === r.id
                        ? {
                            ...e,
                            maintenance: !e.maintenance,
                          }
                        : e,
                    ),
                  }))
                }
              >
                {r.maintenance ? "Đã bảo trì" : "Báo bảo trì"}
              </Button>
            ),
          },
        ]}
      />
    </>
  );
}
