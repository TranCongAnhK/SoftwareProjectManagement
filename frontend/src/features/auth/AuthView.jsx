import React from "react";
import { useAuth } from "./useAuth.js";
import { ArrowRight, Eye, EyeOff, ShieldCheck, Dumbbell } from "lucide-react";
import { Button } from "../../shared/ui/Button.jsx";
import { Field } from "../../shared/ui/Field.jsx";
import { Select } from "../../shared/ui/Select.jsx";
import { IconButton } from "../../shared/ui/IconButton.jsx";
export function AuthView({ onLogin }) {
  const {
    mode,
    busy,
    error,
    message,
    visible,
    setVisible,
    confirm,
    setConfirm,
    form,
    patch,
    changeMode,
    submit,
    resend,
    titles,
    descriptions,
  } = useAuth(onLogin);
  return (
    <div className="g-auth">
      <header className="g-auth-top">
        <a className="g-wordmark" href="/">
          OptiGym
          <span className="g-brand-stroke" />
        </a>
      </header>
      <div className="g-auth-main">
        <div className="g-auth-editorial">
          <div className="n-auth-copy">
            <span>Gym / Yoga / Boxing</span>
            <h1>
              Thêm một
              <br />
              buổi tập tốt.
            </h1>
            <p>Xem lịch, chuẩn bị buổi tập và ghi lại kết quả của bạn.</p>
          </div>
          <div className="g-auth-photo">
            <img
              src="/studio/training.jpg"
              alt="Người tập nâng tạ tại phòng gym"
              fetchpriority="high"
              width="1400"
              height="933"
            />
          </div>
          <div className="n-auth-sports">
            <Dumbbell size={21} />
            <span>OPTIGYM / TRAINING CLUB</span>
          </div>
        </div>
        <div className="g-auth-form">
          <div className="g-auth-form-inner">
            <span className="g-auth-label">Bắt đầu buổi tập tiếp theo</span>
            <h2>{titles[mode]}</h2>
            <p>{descriptions[mode]}</p>
            {["login", "register"].includes(mode) && (
              <div className="g-auth-tabs">
                <button
                  className={mode === "login" ? "selected" : ""}
                  onClick={() => changeMode("login")}
                >
                  Đăng nhập
                </button>
                <button
                  className={mode === "register" ? "selected" : ""}
                  onClick={() => changeMode("register")}
                >
                  Đăng ký
                </button>
              </div>
            )}
            {error && (
              <p className="g-error" role="alert">
                {error}
              </p>
            )}
            {message && (
              <p className="g-success" role="status">
                {message}
              </p>
            )}
            <form onSubmit={submit} className="g-form">
              {mode === "register" && (
                <>
                  <Field
                    label="Họ và tên"
                    required
                    minLength={2}
                    maxLength={120}
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => patch("name", e.target.value)}
                  />
                  <Field
                    label="Số điện thoại (không bắt buộc)"
                    type="tel"
                    maxLength={30}
                    autoComplete="tel"
                    value={form.phone}
                    onChange={(e) => patch("phone", e.target.value)}
                  />
                  <Select
                    label="Vai trò"
                    value={form.role}
                    onChange={(e) => patch("role", e.target.value)}
                  >
                    <option value="MEMBER">Hội viên</option>
                    <option value="PT">Huấn luyện viên</option>
                  </Select>
                  {form.role === "PT" && (
                    <>
                      <Select
                        label="Chuyên môn"
                        value={form.specialty}
                        onChange={(e) => patch("specialty", e.target.value)}
                      >
                        {["GYM", "YOGA", "BOXING"].map((x) => (
                          <option key={x}>{x}</option>
                        ))}
                      </Select>
                      <p className="g-form-note">
                        Tài khoản PT cần được quản trị viên duyệt sau khi xác
                        thực email.
                      </p>
                    </>
                  )}
                </>
              )}
              <Field
                label="Email"
                type="email"
                required
                maxLength={255}
                autoComplete="email"
                value={form.email}
                onChange={(e) => patch("email", e.target.value)}
                placeholder="ban@example.com"
              />
              {["verify", "reset"].includes(mode) && (
                <Field
                  label="Mã xác thực"
                  required
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  pattern="[0-9]{6}"
                  maxLength={6}
                  value={form.code}
                  onChange={(e) =>
                    patch("code", e.target.value.replace(/\D/g, ""))
                  }
                  placeholder="6 chữ số"
                />
              )}
              {["login", "register", "reset"].includes(mode) && (
                <div className="g-password">
                  <Field
                    label={mode === "reset" ? "Mật khẩu mới" : "Mật khẩu"}
                    required
                    type={visible ? "text" : "password"}
                    minLength={mode === "login" ? 1 : 8}
                    maxLength={128}
                    autoComplete={
                      mode === "login" ? "current-password" : "new-password"
                    }
                    value={form.password}
                    onChange={(e) => patch("password", e.target.value)}
                  />
                  <IconButton
                    type="button"
                    icon={visible ? EyeOff : Eye}
                    label={visible ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                    onClick={() => setVisible(!visible)}
                  />
                </div>
              )}
              {mode === "reset" && (
                <Field
                  label="Nhập lại mật khẩu mới"
                  type="password"
                  required
                  minLength={8}
                  maxLength={128}
                  autoComplete="new-password"
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                />
              )}
              {mode === "login" && (
                <button
                  className="g-forgot"
                  type="button"
                  onClick={() => changeMode("forgot")}
                >
                  Quên mật khẩu?
                </button>
              )}
              <Button
                disabled={busy}
                type="submit"
                icon={mode === "login" ? ArrowRight : ShieldCheck}
              >
                {busy
                  ? "Đang xử lý..."
                  : {
                      login: "Đăng nhập",
                      register: "Tạo tài khoản",
                      verify: "Xác thực email",
                      forgot: "Gửi mã xác thực",
                      reset: "Đổi mật khẩu",
                    }[mode]}
              </Button>
            </form>
            {mode === "verify" && (
              <button
                className="g-inline-link"
                disabled={busy}
                onClick={resend}
              >
                Gửi lại mã xác thực
              </button>
            )}
            {mode === "reset" && (
              <button
                className="g-inline-link"
                onClick={() => changeMode("forgot")}
              >
                Yêu cầu mã mới
              </button>
            )}
            {!["login", "register"].includes(mode) && (
              <button
                className="g-inline-link"
                onClick={() => changeMode("login")}
              >
                Quay lại đăng nhập
              </button>
            )}
            {mode === "login" && (
              <button
                className="g-inline-link"
                onClick={() => changeMode("verify")}
              >
                Xác thực email đã đăng ký
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
