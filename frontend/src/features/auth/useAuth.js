import { useState } from "react";
import { api } from "../../shared/api/client.js";
export function useAuth(onLogin) {
  const [mode, setMode] = useState("login"),
    [busy, setBusy] = useState(false),
    [error, setError] = useState(""),
    [message, setMessage] = useState(""),
    [visible, setVisible] = useState(false),
    [confirm, setConfirm] = useState("");
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    phone: "",
    role: "MEMBER",
    specialty: "GYM",
    code: "",
  });
  const patch = (key, value) =>
    setForm((f) => ({
      ...f,
      [key]: value,
    }));
  function changeMode(next) {
    setMode(next);
    setError("");
    setMessage("");
    setVisible(false);
  }
  async function submit(e) {
    e.preventDefault();
    setBusy(true);
    setError("");
    setMessage("");
    try {
      if (mode === "login") {
        onLogin(
          await api("/auth/login", {
            method: "POST",
            body: JSON.stringify({
              email: form.email,
              password: form.password,
            }),
          }),
        );
        return;
      }
      if (mode === "reset" && form.password !== confirm)
        throw Error("Mật khẩu nhập lại chưa khớp.");
      const path = {
        register: "register",
        verify: "verify",
        forgot: "forgot-password",
        reset: "reset-password",
      }[mode];
      const body =
        mode === "forgot"
          ? {
              email: form.email,
            }
          : mode === "verify"
            ? {
                email: form.email,
                code: form.code,
              }
            : mode === "reset"
              ? {
                  email: form.email,
                  code: form.code,
                  password: form.password,
                }
              : form;
      const result = await api("/auth/" + path, {
        method: "POST",
        body: JSON.stringify(body),
      });
      setMessage(result.message || "Đã hoàn tất.");
      setMode(
        {
          register: "verify",
          verify: "login",
          forgot: "reset",
          reset: "login",
        }[mode],
      );
      patch("password", "");
      patch("code", "");
      setConfirm("");
    } catch (e) {
      setError(e.message);
      if (mode === "login" && e.message.includes("chưa xác thực"))
        setMode("verify");
    } finally {
      setBusy(false);
    }
  }
  async function resend() {
    setBusy(true);
    setError("");
    try {
      const result = await api("/auth/resend", {
        method: "POST",
        body: JSON.stringify({
          email: form.email,
        }),
      });
      setMessage(result.message);
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }
  const titles = {
    login: "Chào bạn trở lại.",
    register: "Tạo tài khoản.",
    verify: "Kiểm tra email.",
    forgot: "Lấy lại mật khẩu.",
    reset: "Đặt mật khẩu mới.",
  };
  const descriptions = {
    login: "Đăng nhập để xem lịch, buổi tập và thông tin của bạn.",
    register: "Chọn vai trò. Chúng mình sẽ gửi mã xác thực qua email.",
    verify: "Nhập mã 6 chữ số. Mã có hiệu lực trong 10 phút.",
    forgot: "Nhập email đã đăng ký để nhận mã đặt lại mật khẩu.",
    reset: "Nhập mã trong email và mật khẩu mới của bạn.",
  };
  return {
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
  };
}
