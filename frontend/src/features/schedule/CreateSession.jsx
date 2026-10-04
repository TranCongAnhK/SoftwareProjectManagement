import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "../../shared/ui/Button.jsx";
import { Modal } from "../../shared/ui/Modal.jsx";
import { Field } from "../../shared/ui/Field.jsx";
import { Select } from "../../shared/ui/Select.jsx";
import React from "react";

export function CreateSession({ onClose, onSave }) {
  const [form, setForm] = useState({
    name: "",
    time: "18:00",
    end: "19:00",
    type: "GYM",
    coach: "Lê Quốc Bảo",
    room: "Khu tạ tự do",
    capacity: 12,
  });
  const patch = (k, v) =>
    setForm((f) => ({
      ...f,
      [k]: v,
    }));
  const [error, setError] = useState("");
  return (
    <Modal
      title="Thêm buổi vào lịch mẫu"
      description="Buổi mới được thêm vào lịch minh họa, không ghi lên backend."
      onClose={onClose}
    >
      <form
        className="g-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (form.end <= form.time) {
            setError("Giờ kết thúc phải sau giờ bắt đầu.");
            return;
          }
          onSave({
            ...form,
            id: "s" + Date.now(),
            filled: 0,
            capacity: Number(form.capacity),
            duration:
              Number(form.end.slice(0, 2)) * 60 +
              Number(form.end.slice(3)) -
              (Number(form.time.slice(0, 2)) * 60 + Number(form.time.slice(3))),
          });
        }}
      >
        <Field
          label="Tên buổi tập"
          required
          value={form.name}
          onChange={(e) => patch("name", e.target.value)}
        />
        <div className="g-form-pair">
          <Field
            label="Giờ bắt đầu"
            type="time"
            required
            value={form.time}
            onChange={(e) => patch("time", e.target.value)}
          />
          <Field
            label="Giờ kết thúc"
            type="time"
            required
            value={form.end}
            onChange={(e) => patch("end", e.target.value)}
          />
        </div>
        <Select
          label="Bộ môn"
          value={form.type}
          onChange={(e) => patch("type", e.target.value)}
        >
          {["GYM", "YOGA", "BOXING"].map((s) => (
            <option key={s}>{s}</option>
          ))}
        </Select>
        <Field
          label="Huấn luyện viên"
          required
          value={form.coach}
          onChange={(e) => patch("coach", e.target.value)}
        />
        <Field
          label="Phòng tập"
          required
          value={form.room}
          onChange={(e) => patch("room", e.target.value)}
        />
        <Field
          label="Sức chứa"
          type="number"
          required
          min={1}
          max={50}
          value={form.capacity}
          onChange={(e) => patch("capacity", e.target.value)}
        />
        {error && <p className="g-error">{error}</p>}
        <Button type="submit" icon={Plus}>
          Thêm vào lịch mẫu
        </Button>
      </form>
    </Modal>
  );
}
