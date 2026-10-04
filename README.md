# OptiGym

Ứng dụng React/Vite và Spring Boot 3.3.5, Java 17, PostgreSQL 16.
Mã nguồn đã được tách theo chức năng. API và hành vi nghiệp vụ của bản ZIP gốc được giữ lại.
Xác thực dùng session token lưu trong PostgreSQL và cookie HttpOnly `og_session`, không phải JWT.

## Chạy bằng Docker trên Windows

Tại thư mục chứa `compose.yaml`, dùng PowerShell:

```powershell
Copy-Item .env.example .env
# Điền ADMIN_EMAIL, ADMIN_PASSWORD (ít nhất 12 ký tự) và các biến MAIL_* trong .env.
docker compose up --build -d
docker compose logs -f backend
```

Frontend: http://localhost:5173. Backend: http://localhost:8080.
Cập nhật code rồi chạy lại `docker compose up --build -d`.
PostgreSQL nằm trong volume `optigym_pg`. Không xóa volume để cập nhật mã nguồn.
Không commit `.env`.

## Chạy và kiểm tra riêng

Frontend (Node 20+):

```sh
cd frontend
npm ci
npm run dev
npm run build
npm run test:render
```

Backend (Java 17, Maven 3.9+):

```sh
cd backend
mvn test
mvn spring-boot:run
```

Backend cần PostgreSQL và các biến ADMIN_*, MAIL_*; nếu chạy ngoài Docker, cần đặt biến môi trường trong shell. Spring Boot không tự đọc file `.env` như Docker Compose.
Vite proxy `/api` sang `http://localhost:8080`; Docker Compose đặt `API_TARGET` cho frontend.
Các script trong `backend/src/main/resources/db/schema/` chạy theo thứ tự khai báo trong `application.properties`. Tên bảng và dữ liệu hiện có được giữ lại.
Dockerfile ở root build frontend và đóng gói cùng backend để deploy; Compose phục vụ phát triển bằng ba service riêng.

## Tài liệu bàn giao

- [Cấu trúc mã nguồn](docs/STRUCTURE.md)
- [Phân công 5 thành viên và hướng dẫn Git](docs/TEAM-OWNERSHIP.md)
- [Bản đồ từng file](docs/FILE-OWNERSHIP.csv)
- [Kiểm tra và giới hạn](docs/VALIDATION.md)

`/version-b.html` là URL tương thích, dùng cùng source với `/`. Chỉ còn một bộ frontend trong `frontend/src/`.
## Cập nhật
- Đã kiểm tra và đồng bộ sơ đồ phân công file trong thư mục docs.
