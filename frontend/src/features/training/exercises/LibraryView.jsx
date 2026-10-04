import { useState } from "react";
import { Plus, ArrowRight, ArrowUpRight, Dumbbell } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { PageTitle } from "../../../shared/ui/PageTitle.jsx";
import { Sample } from "../../../shared/ui/Sample.jsx";
import { Modal } from "../../../shared/ui/Modal.jsx";
import { Table } from "../../../shared/ui/Table.jsx";
import { exerciseSeed } from "../demo/exercises.js";
import React from "react";

export function LibraryView({ ctx }) {
  const [group, setGroup] = useState("ALL"),
    [selected, setSelected] = useState(null);
  const rows = exerciseSeed.filter((e) => group === "ALL" || e.group === group);
  return (
    <>
      <PageTitle
        title="Thư viện bài tập"
        description="Bài tập, nhóm cơ và thiết bị sử dụng."
      />
      <div className="g-prototype-note">
        <Sample>Mẫu</Sample>
        <span>Danh mục minh họa cho giáo án.</span>
      </div>
      <div className="g-library-layout">
        <aside>
          <span>Nhóm cơ</span>
          {["ALL", ...new Set(exerciseSeed.map((e) => e.group))].map((g) => (
            <button
              key={g}
              className={g === group ? "active" : ""}
              onClick={() => setGroup(g)}
            >
              {g === "ALL" ? "Tất cả bài tập" : g}
              <ArrowRight size={14} />
            </button>
          ))}
        </aside>
        <div>
          <Table
            rows={rows}
            columns={[
              {
                key: "name",
                label: "Bài tập",
                render: (e) => (
                  <div className="g-library-name">
                    <Dumbbell size={22} />
                    <b>{e.name}</b>
                  </div>
                ),
              },
              {
                key: "group",
                label: "Nhóm cơ",
              },
              {
                key: "equipment",
                label: "Thiết bị",
              },
              {
                key: "action",
                label: "",
                sortable: false,
                render: (e) => (
                  <Button
                    quiet
                    icon={ArrowUpRight}
                    onClick={() => setSelected(e)}
                  >
                    Hướng dẫn
                  </Button>
                ),
              },
            ]}
          />
        </div>
      </div>
      {selected && (
        <Modal
          title={selected.name}
          description={selected.group + " / " + selected.equipment}
          onClose={() => setSelected(null)}
        >
          <div className="g-exercise-guide">
            <p>
              {selected.name === "Plank"
                ? "Chống khuỷu tay dưới vai. Giữ lưng thẳng, siết bụng và thở đều."
                : selected.name === "Goblet squat"
                  ? "Giữ tạ trước ngực, bàn chân rộng bằng vai. Hạ hông có kiểm soát, giữ gối theo hướng mũi chân."
                  : selected.name === "Romanian deadlift"
                    ? "Giữ lưng trung lập. Đẩy hông ra sau, hạ tạ sát chân rồi siết mông để đứng lên."
                    : selected.name === "Lat pulldown"
                      ? "Giữ ngực mở, kéo tay cầm về phía ngực trên. Hạn chế ngả người và thả tạ chậm."
                      : "Nằm trên ghế, giữ vai ổn định. Đẩy tạ lên có kiểm soát, không khóa khuỷu tay quá mạnh."}
            </p>
            <strong>
              {selected.sets} hiệp / {selected.reps}{" "}
              {selected.seconds ? "giây" : "lần"}
            </strong>
            {ctx.user.role === "PT" && (
              <Button
                icon={Plus}
                disabled={ctx.sample.exercises.some(
                  (e) => e.id === selected.id,
                )}
                onClick={() => {
                  ctx.setSample((s) => ({
                    ...s,
                    exercises: [...s.exercises, selected],
                    programSaved: false,
                  }));
                  setSelected(null);
                  ctx.flash("Đã thêm vào giáo án mẫu.");
                }}
              >
                Thêm vào giáo án
              </Button>
            )}
          </div>
        </Modal>
      )}
    </>
  );
}
