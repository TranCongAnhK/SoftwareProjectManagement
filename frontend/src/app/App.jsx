import { useEffect, useState, useRef } from "react";
import {
  ArrowRight,
  Search,
  Sun,
  Moon,
  ChevronDown,
  Bell,
  LogOut,
  X,
  RefreshCw,
  Settings,
  CheckCircle2,
  LayoutDashboard,
  Users,
  Dumbbell,
  CalendarDays,
  Activity,
  Wallet,
  ClipboardList,
  Layers3,
  UserRoundCheck,
  Utensils,
  ScanLine,
  BookOpen,
  Menu,
} from "lucide-react";
import { AuthView } from "../features/auth/AuthView.jsx";
import { Button } from "../shared/ui/Button.jsx";
import { IconButton } from "../shared/ui/IconButton.jsx";
import { Avatar } from "../shared/ui/Avatar.jsx";
import { Modal } from "../shared/ui/Modal.jsx";
import { Loading } from "../shared/ui/Loading.jsx";
import { Sample } from "../shared/ui/Sample.jsx";
import { PagesView } from "./PagesView.jsx";
import { api } from "../shared/api/client.js";
import { demoAccounts } from "../shared/demo/accounts.js";
import { freshDemoData } from "../shared/demo/freshDemoData.js";
import { freshRealData } from "../shared/api/initialData.js";
import { freshSample } from "../shared/demo/freshSample.js";
import { loadPaths } from "../shared/api/loadPaths.js";
import { roleNames } from "../shared/config/roles.js";
import {
  routes,
  mainPages,
  allowedPages,
} from "../shared/config/navigation.js";
import { readRole } from "../shared/demo/readRole.js";
import React from "react";

export function App() {
  const [user, setUser] = useState(() =>
      readRole()
        ? {
            ...demoAccounts[readRole()],
          }
        : null,
    ),
    [boot, setBoot] = useState(() => !readRole());
  const [appearance, setAppearance] = useState(() => {
    try {
      return localStorage.getItem("optigym-studio-theme") || "light";
    } catch {
      return "light";
    }
  });
  const [page, setPage] = useState("home"),
    [data, setData] = useState(() =>
      readRole() ? freshDemoData() : freshRealData(),
    ),
    [sample, setSample] = useState(freshSample),
    [loading, setLoading] = useState(false),
    [loadErrors, setLoadErrors] = useState([]),
    [revision, setRevision] = useState(0),
    [toast, setToast] = useState(""),
    [searchOpen, setSearchOpen] = useState(false),
    [query, setQuery] = useState(""),
    [navOpen, setNavOpen] = useState(false);
  const toastTimer = useRef();
  useEffect(() => {
    if (!boot) return;
    let active = true;
    api("/auth/me")
      .then((u) => {
        if (active) setUser(u);
      })
      .catch(() => {})
      .finally(() => active && setBoot(false));
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    if (!user || user.demo) return;
    let active = true;
    setLoading(true);
    setLoadErrors([]);
    const paths = Object.entries(loadPaths[user.role] || {});
    Promise.allSettled(
      paths.map(async ([key, path]) => ({
        key,
        path,
        value: await api(path),
      })),
    ).then((results) => {
      if (!active) return;
      const next = freshRealData(),
        errors = [];
      results.forEach((r, i) => {
        if (r.status === "fulfilled") next[r.value.key] = r.value.value;
        else
          errors.push({
            key: paths[i][0],
            message: r.reason.message,
          });
      });
      setData(next);
      setLoadErrors(errors);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, [user?.id, user?.role, user?.demo, revision]);
  useEffect(() => {
    document.documentElement.dataset.gTheme = appearance;
    try {
      localStorage.setItem("optigym-studio-theme", appearance);
    } catch {}
  }, [appearance]);
  useEffect(() => {
    function key(e) {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    }
    document.addEventListener("keydown", key);
    return () => document.removeEventListener("keydown", key);
  }, []);
  useEffect(() => () => clearTimeout(toastTimer.current), []);
  function flash(message) {
    setToast(message);
    clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(""), 5500);
  }
  function go(next) {
    if (!allowedPages[user.role].includes(next)) return;
    setPage(next);
    setNavOpen(false);
    setSearchOpen(false);
    setQuery("");
    window.scrollTo({
      top: 0,
      behavior: "instant",
    });
  }
  function demo(role) {
    history.replaceState(null, "", location.pathname + "?demo=" + role);
    setUser({
      ...demoAccounts[role],
    });
    setData(freshDemoData());
    setSample(freshSample());
    setLoadErrors([]);
    setLoading(false);
    setPage("home");
    setBoot(false);
    setToast("");
  }
  function login(u) {
    setData(freshRealData());
    setUser(u);
    setPage("home");
    setLoadErrors([]);
  }
  async function logout() {
    if (user.demo) {
      setUser(null);
      setData(freshRealData());
      setPage("home");
      history.replaceState(null, "", location.pathname);
      return;
    }
    try {
      await api("/auth/logout", {
        method: "POST",
      });
      setUser(null);
      setData(freshRealData());
    } catch (e) {
      flash(e.message);
    }
  }
  const ctx = {
    user,
    data,
    setData,
    sample,
    setSample,
    go,
    flash,
    api,
    reload: () => setRevision((v) => v + 1),
  };
  if (boot)
    return (
      <div className="g-app" data-theme={appearance}>
        <Loading />
      </div>
    );
  if (!user)
    return (
      <div className="g-app" data-theme={appearance}>
        <AuthView onLogin={login} onDemo={demo} />
      </div>
    );
  const matches = allowedPages[user.role].filter((p) =>
    routes[p].toLocaleLowerCase("vi").includes(query.toLocaleLowerCase("vi")),
  );
  const icons = {
    home: LayoutDashboard,
    members: Users,
    trainers: UserRoundCheck,
    staff: Users,
    packages: Layers3,
    assignments: UserRoundCheck,
    schedule: CalendarDays,
    billing: Wallet,
    revenue: Activity,
    checkin: ScanLine,
    equipment: Dumbbell,
    reports: ClipboardList,
    exercises: BookOpen,
    notifications: Bell,
    settings: Settings,
    clients: Users,
    builder: ClipboardList,
    progress: Activity,
    workout: Dumbbell,
    membership: Layers3,
    nutrition: Utensils,
  };
  const groups = [
    {
      label: "Không gian của bạn",
      pages: mainPages[user.role],
    },
    {
      label: user.role === "ADMIN" ? "Quản lý & dịch vụ" : "Theo dõi & dịch vụ",
      pages: allowedPages[user.role].filter(
        (p) =>
          !mainPages[user.role].includes(p) &&
          !["notifications", "settings"].includes(p),
      ),
    },
  ];
  const Nav = () => (
    <>
      <button className="n-logo" onClick={() => go("home")}>
        <span>
          <Dumbbell size={21} />
        </span>
        OptiGym
      </button>
      <div className="n-role">{roleNames[user.role]}</div>
      <nav aria-label="Điều hướng chính">
        {groups.map((group) => (
          <div className="n-nav-group" key={group.label}>
            <p>{group.label}</p>
            {group.pages.map((p) => {
              const Icon = icons[p];
              return (
                <button
                  key={p}
                  className={p === page ? "active" : ""}
                  aria-current={p === page ? "page" : undefined}
                  onClick={() => go(p)}
                >
                  <Icon size={19} strokeWidth={1.7} />
                  <span>{routes[p]}</span>
                  {p === page && <ArrowRight size={14} />}
                </button>
              );
            })}
          </div>
        ))}
      </nav>
      <div className="n-sidebar-bottom">
        <button onClick={() => go("notifications")}>
          <Bell size={18} />
          Thông báo{!sample.readNotifications && <span>3</span>}
        </button>
        <button onClick={() => go("settings")}>
          <Settings size={18} />
          Tài khoản
        </button>
        <div className="n-account">
          <Avatar name={user.name} />
          <div>
            <b>{user.name}</b>
            <small>
              {user.demo ? "Đang xem dữ liệu mẫu" : roleNames[user.role]}
            </small>
          </div>
          <IconButton
            icon={LogOut}
            label={user.demo ? "Thoát xem thử" : "Đăng xuất"}
            onClick={logout}
          />
        </div>
      </div>
    </>
  );
  return (
    <div className="g-app n-app" data-theme={appearance}>
      <a className="n-skip" href="#content">
        Đến nội dung chính
      </a>
      <div className="n-shell">
        <header className="s-header">
          <button
            className="s-brand"
            onClick={() => go("home")}
            aria-label="OptiGym, trang chủ"
          >
            <i aria-hidden="true">
              <b />
              <b />
              <b />
            </i>
            optigym<span>®</span>
          </button>
          <nav className="s-navigation" aria-label="Điều hướng chính">
            {mainPages[user.role].map((p) => (
              <button
                key={p}
                aria-current={page === p ? "page" : undefined}
                onClick={() => go(p)}
              >
                {routes[p]}
              </button>
            ))}
            <button aria-expanded={navOpen} onClick={() => setNavOpen(true)}>
              Khám phá
              <ChevronDown size={14} />
            </button>
          </nav>
          <div className="s-actions">
            <IconButton
              icon={Search}
              label="Tìm trong OptiGym"
              onClick={() => setSearchOpen(true)}
            />
            <IconButton
              icon={appearance === "light" ? Moon : Sun}
              label={
                appearance === "light"
                  ? "Bật giao diện tối"
                  : "Bật giao diện sáng"
              }
              onClick={() =>
                setAppearance((a) => (a === "light" ? "dark" : "light"))
              }
            />
            <button
              className="s-profile"
              onClick={() => setNavOpen(true)}
              aria-label="Mở menu tài khoản"
            >
              <Avatar name={user.name} />
              <ChevronDown size={14} />
            </button>
          </div>
        </header>
        {user.demo && (
          <div className="n-preview">
            <div>
              <Sample>Xem thử</Sample>
              <span>Thao tác với dữ liệu mẫu, không cần đăng nhập.</span>
            </div>
            <label>
              Vai trò
              <select
                aria-label="Đổi vai trò xem thử"
                value={user.role}
                onChange={(e) => demo(e.target.value)}
              >
                {Object.keys(roleNames).map((r) => (
                  <option key={r} value={r}>
                    {roleNames[r]}
                  </option>
                ))}
              </select>
            </label>
          </div>
        )}
        <main className="g-main n-main" id="content">
          {loadErrors.length > 0 && (
            <div className="g-load-error" role="alert">
              <div>
                <b>Chưa tải được một phần dữ liệu.</b>
                <p>{loadErrors.map((x) => x.message).join(" / ")}</p>
              </div>
              <Button quiet icon={RefreshCw} onClick={ctx.reload}>
                Thử lại
              </Button>
            </div>
          )}
          {loading ? (
            <Loading />
          ) : (
            <div className="g-page" key={page}>
              <PagesView page={page} ctx={ctx} />
            </div>
          )}
          <footer className="n-footer">
            <span>OptiGym</span>
            <p>
              {user.demo
                ? "Dữ liệu mẫu chỉ giữ trong lần xem này."
                : "Các mục có nhãn Mẫu chưa kết nối backend."}
            </p>
          </footer>
        </main>
        <nav className="n-mobile-tabs" aria-label="Điều hướng nhanh">
          {mainPages[user.role].map((p) => {
            const Icon = icons[p];
            return (
              <button
                key={p}
                className={page === p ? "active" : ""}
                onClick={() => go(p)}
              >
                <Icon size={20} />
                <span>{routes[p]}</span>
              </button>
            );
          })}
          <button onClick={() => setNavOpen(true)}>
            <Menu size={20} />
            <span>Thêm</span>
          </button>
        </nav>
      </div>
      {navOpen && (
        <Modal
          title="Điều hướng"
          description="Các mục trong không gian của bạn."
          onClose={() => setNavOpen(false)}
        >
          <div className="n-mobile-menu">
            <Nav />
          </div>
        </Modal>
      )}
      {toast && (
        <div className="g-toast" role="status">
          <CheckCircle2 size={20} />
          <span>{toast}</span>
          <IconButton
            icon={X}
            label="Đóng thông báo"
            onClick={() => setToast("")}
          />
        </div>
      )}
      {searchOpen && (
        <Modal
          title="Tìm trong OptiGym"
          description="Chuyển nhanh đến một mục. Phím tắt Ctrl + K."
          onClose={() => setSearchOpen(false)}
        >
          <div className="g-command-search">
            <Search size={20} />
            <input
              aria-label="Tên mục cần tìm"
              placeholder="Lịch, hội viên, hóa đơn..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
          </div>
          <div className="g-command-list">
            {matches.map((p) => (
              <button key={p} onClick={() => go(p)}>
                {routes[p]}
                <ArrowRight size={17} />
              </button>
            ))}
            {!matches.length && <p>Không tìm thấy mục phù hợp.</p>}
          </div>
        </Modal>
      )}
    </div>
  );
}
