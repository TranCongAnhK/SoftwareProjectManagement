# Phân công và đưa code lên Git

Đây là phạm vi phụ trách sau refactor; không phải bằng chứng ai đã viết code gốc.

| Thành viên | Issue | Thư mục/file chính |
| --- | --- | --- |
| Trần Công Anh Khoa | #1 | Backend `auth/`, `shared/`, `config/`, entry application; frontend `app/`, `shared/` (trừ workout), dashboard Admin; Docker, build, tài liệu |
| Lê Đình Bảo | #3 | Backend `verification/`, `passwordreset/`, `resources/db/`, `application.properties` |
| Phạm Phú Đức | #4 | Backend `admin/`, `member/`, `pt/`, `packages/` |
| Nguyễn Trần Dũng | #5 | Frontend Admin (trừ dashboard), PT, shared workout, training |
| Lê Đình Viên | #6 | Frontend auth, Member, lịch dùng chung |

Chi tiết từng file: `FILE-OWNERSHIP.csv`.
Dũng và Viên dùng chung `WorkoutEditor`, `Agenda`, UI và styles; thay đổi phần chung phải có người còn lại review. CSS hiện vẫn dùng chung để giữ giao diện và cascade; chưa tách ownership theo từng selector.
Các module tài chính/thiết bị/check-in/tiến trình/dinh dưỡng/thông báo là prototype bổ sung, không tự đánh dấu hoàn thành API Sprint 1–2.

## Sửa issue cho đúng code

- #1: auth là S1-03; nếu giữ setup S1-01 cần ghi cả hai. Đổi JWT thành session cookie.
- #1 giữ dashboard Admin + điều hướng. #5 giữ màn hình quản lý Admin + PT.
- #4 bổ sung API packages công khai, overview Member và clients PT.
- #3 gồm hai sprint: database/email OTP và reset password; nên tách sub-issue theo sprint.
- #6 có auth Sprint 1 và Member/reset UI Sprint 2; nên tách sub-issue tương ứng.
- Task PT CRUD: PT tự đăng ký; Admin quản lý/duyệt/khóa/xóa, chưa có endpoint Admin tạo PT riêng.

## Cập nhật repository đang có

Giữ thư mục `.git` và lịch sử hiện tại của repository đích. ZIP không mang `.git`, `.env`, `node_modules`, `target`, `dist` hoặc credentials cá nhân.

1. Leader clone đúng repository và tạo branch `refactor/feature-structure` từ nhánh hiện tại.
2. Sao lưu thay đổi local chưa commit. Chép nội dung thư mục `OptiGym/` vào đúng root ứng dụng của repo; không tự tạo thêm lớp thư mục nếu repo đang có frontend/backend ở root.
3. Xóa file source cũ đã được thay thế theo bảng STRUCTURE. Đặc biệt không để lại `Api.java` có route trùng và controller OTP cũ trong package gốc. Xóa `frontend/src/edition-b/` và các file app gộp cũ; giữ file mới `App.jsx`, `HomeView.jsx`, `PagesView.jsx`.
4. Kiểm tra `git status`, `git diff --stat`, chạy `npm ci`, build frontend, render smoke test và `mvn test`.
5. Commit refactor tập trung, mở một PR cho cả nhóm review. Commit này ghi nhận việc tổ chức lại mã nguồn, không chia giả thành lịch sử phát triển của 5 người.
6. Sau merge, cả 5 người pull và tạo branch task riêng từ cùng baseline. Chỉ commit thay đổi thật của phần được giao; liên kết PR với issue bằng `Refs #...`.

Lệnh ví dụ từ root repository:

```sh
git switch -c refactor/feature-structure
git status
git diff --stat
git add backend frontend docs README.md Dockerfile compose.yaml .gitignore .dockerignore .env.example
git commit -m "refactor: organize OptiGym by feature and role"
# Kiểm tra remote và diff PR trước khi push.
git push -u origin refactor/feature-structure
```

Nếu repo giữ ứng dụng dưới `optigym/`, điều chỉnh đường dẫn `git add` theo vị trí đó. Không force-push hoặc xóa lịch sử để làm lại phân công. Tên tác giả commit phải là người thực sự thực hiện commit; ghi đóng góp trước Git bằng báo cáo/issue và bằng chứng nhóm có.
