import { useEffect, useState } from "react";
import {
  Play,
  Pause,
  Check,
  Plus,
  ChevronDown,
  Dumbbell,
  Clock3,
  Save,
} from "lucide-react";
import { Button } from "../ui/Button.jsx";
import { PageTitle } from "../ui/PageTitle.jsx";
import { Sample } from "../ui/Sample.jsx";
import { Modal } from "../ui/Modal.jsx";
import { Field } from "../ui/Field.jsx";
import { Select } from "../ui/Select.jsx";
import { Empty } from "../ui/Empty.jsx";
import { exerciseSeed } from "../../features/training/demo/exercises.js";
import React from "react";

export function WorkoutView({ ctx, builder = false }) {
  const { sample, setSample } = ctx;
  const [expanded, setExpanded] = useState(sample.exercises[0]?.id),
    [add, setAdd] = useState(false),
    [rest, setRest] = useState(0);
  useEffect(() => {
    if (rest <= 0) return;
    const timer = setInterval(() => setRest((v) => Math.max(0, v - 1)), 1000);
    return () => clearInterval(timer);
  }, [rest > 0]);
  function edit(id, key, value) {
    setSample((s) => {
      const completedSets = {
        ...s.completedSets,
      };
      delete completedSets[id];
      return {
        ...s,
        programSaved: false,
        completedSets,
        done: s.done.filter((x) => x !== id),
        workoutFinished: false,
        exercises: s.exercises.map((e) =>
          e.id === id
            ? {
                ...e,
                [key]: value,
              }
            : e,
        ),
      };
    });
  }
  function completeSet(exercise, index) {
    const existing = (sample.completedSets || {})[exercise.id] || [];
    const next = existing.includes(index)
      ? existing.filter((i) => i !== index)
      : [...existing, index];
    const done =
      next.length >= exercise.sets
        ? [...new Set([...sample.done, exercise.id])]
        : sample.done.filter((id) => id !== exercise.id);
    setSample((s) => ({
      ...s,
      completedSets: {
        ...s.completedSets,
        [exercise.id]: next,
      },
      done,
      workoutFinished: false,
    }));
    if (next.length > existing.length) setRest(60);
  }
  const total = sample.exercises.reduce((sum, e) => sum + Number(e.sets), 0),
    completed = Object.values(sample.completedSets || {}).reduce(
      (a, sets) => a + sets.length,
      0,
    );
  return (
    <>
      <PageTitle
        title={builder ? "Soạn buổi tập" : sample.programName}
        description={
          builder
            ? "Chọn bài, thiết lập hiệp và mức tạ cho học viên."
            : "Khởi động 5 phút. Giữ kỹ thuật ổn định trong mỗi hiệp."
        }
        action={
          builder ? (
            <Button
              icon={Save}
              onClick={() => {
                setSample((s) => ({
                  ...s,
                  programSaved: true,
                }));
                ctx.flash("Đã lưu giáo án mẫu trong lần xem này.");
              }}
            >
              {sample.programSaved ? "Đã lưu bản mẫu" : "Lưu giáo án mẫu"}
            </Button>
          ) : (
            <Button
              icon={sample.workoutStarted ? Pause : Play}
              onClick={() =>
                setSample((s) =>
                  s.workoutFinished
                    ? {
                        ...s,
                        workoutStarted: true,
                        workoutFinished: false,
                        completedSets: {},
                        done: [],
                      }
                    : {
                        ...s,
                        workoutStarted: !s.workoutStarted,
                      },
                )
              }
            >
              {sample.workoutFinished
                ? "Bắt đầu buổi mới"
                : sample.workoutStarted
                  ? "Tạm dừng"
                  : "Bắt đầu buổi tập"}
            </Button>
          )
        }
      />
      <div className="g-prototype-note">
        <Sample>Mẫu</Sample>
        <span>
          {builder
            ? "Giáo án đang dùng dữ liệu mẫu, chưa ghi lên backend."
            : "Nhật ký tập luyện đang dùng dữ liệu mẫu."}
        </span>
      </div>
      {builder && (
        <div className="g-builder-fields">
          <Field
            label="Tên giáo án"
            value={sample.programName}
            onChange={(e) =>
              setSample((s) => ({
                ...s,
                programName: e.target.value,
                programSaved: false,
              }))
            }
          />
          <Select
            label="Học viên"
            value={sample.programClient}
            onChange={(e) =>
              setSample((s) => ({
                ...s,
                programClient: e.target.value,
                programSaved: false,
              }))
            }
          >
            <option value="">Chọn học viên</option>
            {ctx.data.clients.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </Select>
        </div>
      )}
      <div className="g-workout-layout">
        <div>
          <div className="g-workout-list">
            {sample.exercises.map((e, i) => {
              const open = expanded === e.id,
                finished = sample.done.includes(e.id);
              return (
                <article
                  className={
                    (open ? "expanded " : "") + (finished ? "complete" : "")
                  }
                  key={e.id}
                >
                  <button
                    className="g-exercise-toggle"
                    aria-expanded={open}
                    onClick={() => setExpanded(open ? null : e.id)}
                  >
                    <span className="g-exercise-number">
                      {finished ? (
                        <Check size={20} />
                      ) : (
                        String(i + 1).padStart(2, "0")
                      )}
                    </span>
                    <div>
                      <h2>{e.name}</h2>
                      <p>
                        {e.group} / {e.equipment}
                      </p>
                    </div>
                    <span className="g-exercise-summary">
                      {e.sets} × {e.reps}
                      {e.seconds ? " giây" : ""}
                      <small>{e.weight ? e.weight + " kg" : "Tự trọng"}</small>
                    </span>
                    <ChevronDown size={19} />
                  </button>
                  {open && (
                    <div className="g-exercise-content">
                      {builder ? (
                        <>
                          <div className="g-form-trio">
                            <Field
                              label="Số hiệp"
                              type="number"
                              min={1}
                              max={6}
                              value={e.sets}
                              onChange={(ev) =>
                                edit(
                                  e.id,
                                  "sets",
                                  Math.max(
                                    1,
                                    Math.min(6, Number(ev.target.value)),
                                  ),
                                )
                              }
                            />
                            <Field
                              label={
                                e.seconds ? "Thời gian (giây)" : "Số lần / hiệp"
                              }
                              type="number"
                              min={1}
                              max={120}
                              value={e.reps}
                              onChange={(ev) =>
                                edit(
                                  e.id,
                                  "reps",
                                  Math.max(1, Number(ev.target.value)),
                                )
                              }
                            />
                            <Field
                              label="Mức tạ (kg)"
                              type="number"
                              min={0}
                              max={300}
                              step={0.5}
                              value={e.weight}
                              onChange={(ev) =>
                                edit(e.id, "weight", Number(ev.target.value))
                              }
                            />
                          </div>
                          <button
                            className="g-inline-link"
                            onClick={() => {
                              setSample((s) => ({
                                ...s,
                                exercises: s.exercises.filter(
                                  (x) => x.id !== e.id,
                                ),
                                done: s.done.filter((id) => id !== e.id),
                                completedSets: Object.fromEntries(
                                  Object.entries(s.completedSets || {}).filter(
                                    ([id]) => id !== e.id,
                                  ),
                                ),
                                workoutFinished: false,
                                programSaved: false,
                              }));
                              ctx.flash("Đã bỏ bài khỏi giáo án mẫu.");
                            }}
                          >
                            Bỏ bài này khỏi giáo án
                          </button>
                        </>
                      ) : (
                        <>
                          <p className="g-exercise-tip">
                            {e.seconds
                              ? "Giữ thân thẳng, siết bụng và thở đều."
                              : "Hạ tạ có kiểm soát. Dừng nếu cảm thấy đau bất thường."}
                          </p>
                          <div className="g-set-table">
                            <div>
                              <span>Hiệp</span>
                              <span>{e.seconds ? "Giây" : "Số lần"}</span>
                              <span>Mức tạ</span>
                              <span>Hoàn thành</span>
                            </div>
                            {Array.from(
                              {
                                length: e.sets,
                              },
                              (_, j) => {
                                const checked = (sample.completedSets || {})[
                                  e.id
                                ]?.includes(j);
                                return (
                                  <div key={j}>
                                    <b>{j + 1}</b>
                                    <span>{e.reps}</span>
                                    <span>
                                      {e.weight ? e.weight + " kg" : "Tự trọng"}
                                    </span>
                                    <button
                                      aria-label={
                                        "Hoàn thành hiệp " +
                                        (j + 1) +
                                        " " +
                                        e.name
                                      }
                                      aria-pressed={Boolean(checked)}
                                      className={checked ? "checked" : ""}
                                      onClick={() => completeSet(e, j)}
                                    >
                                      {checked ? <Check size={18} /> : <span />}
                                    </button>
                                  </div>
                                );
                              },
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
          {builder && (
            <Button quiet icon={Plus} onClick={() => setAdd(true)}>
              Thêm bài tập
            </Button>
          )}
          {!sample.exercises.length && (
            <Empty title="Giáo án chưa có bài tập" />
          )}
        </div>
        <aside>
          <div className="g-workout-side">
            <Dumbbell size={28} />
            <h2>{builder ? "Tóm tắt giáo án" : "Buổi tập của bạn"}</h2>
            <div>
              <span>Bài tập</span>
              <strong>{sample.exercises.length}</strong>
            </div>
            <div>
              <span>{builder ? "Tổng số hiệp" : "Hiệp đã hoàn thành"}</span>
              <strong>{builder ? total : `${completed} / ${total}`}</strong>
            </div>
            <div>
              <span>Thời gian dự kiến</span>
              <strong>50 phút</strong>
            </div>
            {!builder && (
              <>
                <div className="g-rest-clock">
                  <Clock3 size={18} />
                  <span>
                    {rest > 0
                      ? "Nghỉ giữa hiệp"
                      : "Sẵn sàng cho hiệp tiếp theo"}
                  </span>
                  <strong>
                    {rest > 0
                      ? `${String(Math.floor(rest / 60)).padStart(2, "0")}:${String(rest % 60).padStart(2, "0")}`
                      : "00:00"}
                  </strong>
                  {rest > 0 && (
                    <button onClick={() => setRest(0)}>
                      Bỏ qua thời gian nghỉ
                    </button>
                  )}
                </div>
                <Button
                  icon={Check}
                  disabled={
                    !sample.exercises.length ||
                    sample.done.length !== sample.exercises.length
                  }
                  onClick={() => {
                    setRest(0);
                    setSample((s) => ({
                      ...s,
                      workoutFinished: true,
                      workoutStarted: false,
                    }));
                    ctx.flash("Đã hoàn thành và lưu buổi tập mẫu.");
                  }}
                >
                  {sample.workoutFinished
                    ? "Đã hoàn thành"
                    : "Kết thúc buổi tập"}
                </Button>
                {sample.workoutFinished && (
                  <p className="g-success" role="status">
                    Kết quả đã được lưu trong nhật ký mẫu.
                  </p>
                )}
              </>
            )}
          </div>
          <div className="g-workout-photo">
            <img
              src="/studio/training.jpg"
              width="1400"
              height="933"
              alt="Tập với thanh tạ ở phòng gym"
            />
          </div>
        </aside>
      </div>
      {add && (
        <Modal
          title="Thêm bài vào giáo án"
          description="Chọn từ thư viện bài tập mẫu."
          onClose={() => setAdd(false)}
        >
          <div className="g-command-list">
            {[
              ...exerciseSeed,
              {
                id: "e6",
                name: "Dumbbell curl",
                group: "Tay trước",
                equipment: "Tạ đơn",
                sets: 3,
                reps: 12,
                weight: 6,
              },
              {
                id: "e7",
                name: "Walking lunge",
                group: "Chân",
                equipment: "Tạ đơn",
                sets: 3,
                reps: 10,
                weight: 8,
              },
            ]
              .filter((e) => !sample.exercises.some((x) => x.id === e.id))
              .map((e) => (
                <button
                  key={e.id}
                  onClick={() => {
                    setSample((s) => ({
                      ...s,
                      exercises: [...s.exercises, e],
                      programSaved: false,
                    }));
                    setAdd(false);
                    setExpanded(e.id);
                  }}
                >
                  {e.name}
                  <Plus size={17} />
                </button>
              ))}
          </div>
        </Modal>
      )}
    </>
  );
}
