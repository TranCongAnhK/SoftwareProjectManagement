import { ShieldCheck } from "lucide-react";
import { PageTitle } from "../../shared/ui/PageTitle.jsx";
import { Section } from "../../shared/ui/Section.jsx";
import { Sample } from "../../shared/ui/Sample.jsx";
import { Avatar } from "../../shared/ui/Avatar.jsx";
import { roleNames } from "../../shared/config/roles.js";
import React from "react";

export function SettingsView({ ctx }) {
  return (
    <>
      <PageTitle
        title="Tài khoản của bạn"
        description="Thông tin đăng nhập và vai trò trong OptiGym."
      />
      <div className="g-settings-layout">
        <section>
          <Avatar name={ctx.user.name} size="large" />
          <h2>{ctx.user.name}</h2>
          <p>{roleNames[ctx.user.role]}</p>
          {ctx.user.demo && <Sample>Tài khoản xem thử</Sample>}
        </section>
        <Section title="Thông tin tài khoản">
          <dl className="g-account-details">
            <div>
              <dt>Họ và tên</dt>
              <dd>{ctx.user.name}</dd>
            </div>
            <div>
              <dt>Email</dt>
              <dd>{ctx.user.email}</dd>
            </div>
            <div>
              <dt>Vai trò</dt>
              <dd>{roleNames[ctx.user.role]}</dd>
            </div>
            <div>
              <dt>Phiên đăng nhập</dt>
              <dd>{ctx.user.demo ? "Bản xem thử" : "Đang hoạt động"}</dd>
            </div>
          </dl>
          <div className="g-account-security">
            <ShieldCheck size={21} />
            <p>
              Đổi mật khẩu qua mục quên mật khẩu ở màn đăng nhập. Chỉnh sửa hồ
              sơ sẽ được bổ sung khi có API.
            </p>
          </div>
        </Section>
      </div>
    </>
  );
}
