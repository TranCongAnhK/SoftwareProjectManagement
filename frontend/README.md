# OptiGym frontend

Entry: `index.html` → `src/main.jsx` → `src/app/App.jsx`.
`version-b.html` dùng cùng entry để giữ link cũ.

- `app/`: khởi tạo phiên, tải dữ liệu và điều hướng.
- `features/admin/`: dashboard, quản lý, phân công, gán gói, tài chính, báo cáo, thiết bị.
- `features/pt/`: dashboard, học viên, trang soạn giáo án.
- `features/member/`: dashboard, gói/PT, buổi tập, dinh dưỡng.
- `features/auth/`: view auth và hook xử lý đăng nhập/đăng ký/OTP/khôi phục.
- `features/schedule/`, `training/`, `checkin/`, `notifications/`, `account/`: chức năng dùng cho nhiều vai trò.
- `shared/api/`: client HTTP và cấu hình tải dữ liệu.
- `shared/ui/`: component tái sử dụng; một component mỗi file.
- `shared/lib/`: định dạng, ngày tháng, xuất CSV.
- `shared/config/`: quyền màn hình và menu.
- `shared/demo/`: dữ liệu và state minh họa.
- `shared/workout/`: trình tập luyện/giáo án dùng chung, tránh hai bản sao của cùng một logic.
- `shared/styles/`: CSS dùng chung, vẫn giữ selector và thứ tự cascade từ bản gốc.

Chạy: `npm ci`, `npm run dev`. Kiểm tra: `npm run build`, `npm run test:render`.
Demo: `/?demo=ADMIN`, `/?demo=PT`, `/?demo=MEMBER`.
Các chỉ số, lịch, giáo án, booking, dinh dưỡng, thiết bị, check-in và tài chính mẫu chưa có persistence backend tương ứng.
