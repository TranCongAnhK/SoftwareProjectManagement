# Kiểm tra bản refactor

- Frontend `npm run build`: PASS.
- `npm run test:render`: PASS; 62 tổ hợp role/page (31 với dữ liệu demo, 31 với dữ liệu API rỗng), cộng trang login. SSR smoke check bắt lỗi import/render nhưng không thay kiểm thử tương tác trình duyệt.
- Backend `mvn test`: PASS; 3 test, 0 failures/errors. Spring MVC khởi tạo toàn bộ controller; kiểm tra tập 28 endpoint khớp bản gốc, quyền Admin ở summary, và verify OTP chuyển đúng sang service.
- SQL: nối 8 script theo thứ tự cho cùng nội dung schema gốc.
- API paths, HTTP methods, SQL nghiệp vụ và cơ chế session được giữ lại.

Chưa chạy gửi SMTP thật, luồng đăng ký/reset xuyên frontend-backend-database, hoặc Docker trên máy nhóm. MockMvc dùng mock JdbcTemplate/services; không xác nhận DB/SMTP hoạt động.
Dữ liệu lịch, booking, giáo án, workout, dinh dưỡng, thiết bị, tài chính, check-in, chỉ số và thông báo vẫn là prototype của bản gốc.
Test dùng Mockito subclass để không cần JVM attach; production runtime không thay đổi.
