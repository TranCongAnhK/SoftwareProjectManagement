import { useState } from "react";
import { Check } from "lucide-react";
import { Button } from "../../../shared/ui/Button.jsx";
import { Field } from "../../../shared/ui/Field.jsx";
import { Select } from "../../../shared/ui/Select.jsx";
import React from "react";

export function ManagerForm({ kind, record, busy, error, save }) {
  const [f, setF] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    specialty: "GYM",
    status: "ACTIVE",
    position: "",
    category: "GYM",
    price: 0,
    duration_days: 30,
    description: "",
    active: true,
    ...record,
  });
  const patch = (k, v) =>
    setF((old) => ({
      ...old,
      [k]: v,
    }));
  return (
    <form
      className="g-form"
      onSubmit={(e) => {
        e.preventDefault();
        save(f);
      }}
    >
      <Field
        label={kind === "packages" ? "Tên gói" : "Họ và tên"}
        required
        minLength={2}
        maxLength={120}
        value={f.name}
        onChange={(e) => patch("name", e.target.value)}
      />
      {kind === "members" && !record.id && (
        <>
          <Field
            label="Email"
            type="email"
            required
            value={f.email}
            onChange={(e) => patch("email", e.target.value)}
          />
          <Field
            label="Mật khẩu ban đầu"
            type="password"
            minLength={8}
            maxLength={128}
            required
            value={f.password}
            onChange={(e) => patch("password", e.target.value)}
          />
          <p className="g-form-note">
            Tài khoản thật sẽ nhận mã xác thực qua email.
          </p>
        </>
      )}
      {kind === "staff" && (
        <Field
          label="Email"
          type="email"
          value={f.email}
          onChange={(e) => patch("email", e.target.value)}
        />
      )}{" "}
      {["members", "trainers", "staff"].includes(kind) && (
        <Field
          label="Số điện thoại"
          type="tel"
          maxLength={30}
          value={f.phone}
          onChange={(e) => patch("phone", e.target.value)}
        />
      )}{" "}
      {kind === "staff" && (
        <Field
          label="Vị trí"
          required
          maxLength={80}
          value={f.position}
          onChange={(e) => patch("position", e.target.value)}
        />
      )}{" "}
      {kind === "trainers" && (
        <Select
          label="Chuyên môn"
          value={f.specialty}
          onChange={(e) => patch("specialty", e.target.value)}
        >
          {["GYM", "YOGA", "BOXING"].map((x) => (
            <option key={x}>{x}</option>
          ))}
        </Select>
      )}
      {kind !== "packages" && (
        <Select
          label="Trạng thái"
          value={f.status}
          onChange={(e) => patch("status", e.target.value)}
        >
          {(kind === "trainers"
            ? [
                ["ACTIVE", "Duyệt / hoạt động"],
                ["PENDING", "Chờ duyệt"],
                ["REJECTED", "Từ chối"],
                ["DISABLED", "Đã khóa"],
              ]
            : kind === "staff"
              ? [
                  ["ACTIVE", "Hoạt động"],
                  ["INACTIVE", "Ngưng làm"],
                ]
              : [
                  ["ACTIVE", "Hoạt động"],
                  ["DISABLED", "Đã khóa"],
                ]
          ).map(([v, l]) => (
            <option value={v} key={v}>
              {l}
            </option>
          ))}
        </Select>
      )}
      {kind === "trainers" && !record.email_verified && (
        <p className="g-form-note">
          PT cần xác thực email trước khi được duyệt.
        </p>
      )}
      {kind === "packages" && (
        <>
          <Select
            label="Bộ môn"
            value={f.category}
            onChange={(e) => patch("category", e.target.value)}
          >
            {["GYM", "YOGA", "BOXING"].map((x) => (
              <option key={x}>{x}</option>
            ))}
          </Select>
          <div className="g-form-pair">
            <Field
              label="Giá (₫)"
              type="number"
              min={0}
              required
              value={f.price}
              onChange={(e) => patch("price", e.target.value)}
            />
            <Field
              label="Thời hạn (ngày)"
              type="number"
              min={1}
              max={3650}
              required
              value={f.duration_days}
              onChange={(e) => patch("duration_days", e.target.value)}
            />
          </div>
          <Field
            label="Mô tả"
            maxLength={500}
            value={f.description}
            onChange={(e) => patch("description", e.target.value)}
          />
          <label className="g-checkbox">
            <input
              type="checkbox"
              checked={f.active}
              onChange={(e) => patch("active", e.target.checked)}
            />
            Mở bán gói này
          </label>
        </>
      )}
      {error && (
        <p className="g-error" role="alert">
          {error}
        </p>
      )}
      <Button type="submit" disabled={busy} icon={Check}>
        {busy ? "Đang lưu..." : "Lưu thay đổi"}
      </Button>
    </form>
  );
}
