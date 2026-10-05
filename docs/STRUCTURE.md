# Cấu trúc dự án

## Nguyên tắc

Backend chia package theo chức năng; mỗi controller sở hữu một nhóm route. Service OTP giữ logic gửi và xác thực mã. `SessionSecurity` là nơi dùng chung cho session, cookie, role và Origin. `RequestValues` là helper đọc/kiểm tra input. Controller quản lý vẫn dùng JdbcTemplate như bản gốc: đợt này không tạo service/repository chỉ để chuyển tiếp cùng một lệnh SQL.
Frontend chia theo tính năng và vai trò. Router/khởi tạo ứng dụng nằm trong `app/`; UI, helper, style và cơ chế dùng chung nằm trong `shared/`. Dữ liệu minh họa được tách khỏi client API thật.

`Api.java`, `home.jsx`, `management.jsx`, `modules.jsx`, `data.js`, `ui.jsx` gộp cũ đã được thay bằng module nhỏ. `auth.jsx` được thay bằng `AuthView.jsx` và `useAuth.js`.
SQL được tách thành 8 script theo thứ tự phụ thuộc; không đổi tên bảng/cột.

## Cây thư mục đầy đủ

```text
OptiGym/
.dockerignore
.env.example
.gitignore
Dockerfile
README.md
backend/
  Dockerfile
  pom.xml
  src/
    main/
      java/
        com/
          optigym/
            OptiGymApplication.java
            admin/
              assignments/
                AssignmentController.java
              dashboard/
                AdminDashboardController.java
              packages/
                AdminPackageController.java
              staff/
                StaffController.java
              subscriptions/
                SubscriptionController.java
              users/
                AdminUserController.java
            auth/
              AuthController.java
            config/
              AdminBootstrapConfiguration.java
            member/
              MemberController.java
            packages/
              PublicPackageController.java
            passwordreset/
              PasswordResetController.java
              PasswordResetService.java
            pt/
              PtController.java
            shared/
              security/
                SessionSecurity.java
              web/
                Errors.java
                RequestValues.java
            verification/
              EmailVerificationController.java
              EmailVerificationService.java
      resources/
        application.properties
        db/
          schema/
            01-users.sql
            02-email-verification.sql
            03-password-reset.sql
            04-sessions.sql
            05-staff.sql
            06-packages.sql
            07-subscriptions.sql
            08-pt-clients.sql
    test/
      java/
        com/
          optigym/
            ApiRouteCompatibilityTest.java
      resources/
        mockito-extensions/
          org.mockito.plugins.MockMaker
compose.yaml
docs/
  FILE-OWNERSHIP.csv
  STRUCTURE.md
  TEAM-OWNERSHIP.md
  VALIDATION.md
frontend/
  Dockerfile
  FRONTEND-STUDIO.md
  README.md
  index.html
  package-lock.json
  package.json
  public/
    studio/
      training.jpg
  scripts/
    check-render.jsx
  src/
    app/
      App.jsx
      HomeView.jsx
      PagesView.jsx
    features/
      account/
        SettingsView.jsx
      admin/
        assignments/
          AssignmentsView.jsx
        dashboard/
          AdminDashboard.jsx
        equipment/
          EquipmentView.jsx
          demo/
            equipment.js
        finance/
          FinanceView.jsx
          demo/
            invoices.js
        management/
          DirectoryView.jsx
          ManagerForm.jsx
          directoryConfig.js
          directoryStatus.js
        reports/
          ReportsView.jsx
        subscriptions/
          AssignSubscription.jsx
      auth/
        AuthView.jsx
        useAuth.js
      checkin/
        CheckinView.jsx
      member/
        dashboard/
          MemberDashboard.jsx
          WeeklyActivity.jsx
        membership/
          MembershipView.jsx
        nutrition/
          NutritionView.jsx
        workout/
          MemberWorkoutView.jsx
      notifications/
        NotificationsView.jsx
      pt/
        clients/
          ClientsView.jsx
        dashboard/
          PtDashboard.jsx
        programs/
          ProgramBuilderView.jsx
      schedule/
        Agenda.jsx
        CreateSession.jsx
        demo/
          sessions.js
      training/
        demo/
          exercises.js
        exercises/
          LibraryView.jsx
        progress/
          ProgressView.jsx
    main.jsx
    shared/
      api/
        client.js
        initialData.js
        loadPaths.js
      components/
        TrainingHero.jsx
      config/
        navigation.js
        roles.js
      demo/
        accounts.js
        freshDemoData.js
        freshSample.js
        members.js
        packages.js
        readRole.js
        staff.js
        trainers.js
      lib/
        date.js
        exportCSV.js
        format.js
        today.js
      styles/
        base.css
        studio.css
        styles.css
      ui/
        Avatar.jsx
        BarChart.jsx
        Button.jsx
        Empty.jsx
        Field.jsx
        IconButton.jsx
        Loading.jsx
        MetricStrip.jsx
        Modal.jsx
        PageTitle.jsx
        Person.jsx
        Sample.jsx
        Section.jsx
        Select.jsx
        Table.jsx
        Tag.jsx
        TextLink.jsx
        WeightChart.jsx
      workout/
        WorkoutEditor.jsx
  version-b.html
  vite.config.js
```

## Từ file cũ sang mới

| File cũ | Nơi mới |
| --- | --- |
| `backend/.../Api.java` | `auth/`, `verification/`, `passwordreset/`, `admin/*/`, `member/`, `pt/`, `packages/`, `shared/security/`, `shared/web/`, `config/` |
| `schema.sql` | `resources/db/schema/01-*.sql` đến `08-*.sql` |
| `frontend/src/app/app.jsx` | `src/app/App.jsx` |
| `home.jsx` | `app/HomeView.jsx`, `features/{admin,pt,member}/dashboard/`, `shared/components/TrainingHero.jsx` |
| `management.jsx` | Admin management/subscriptions/assignments, PT clients, Member membership |
| `modules.jsx` | `features/*/`, `shared/workout/WorkoutEditor.jsx`, `shared/lib/exportCSV.js` |
| `data.js` | `shared/api/`, `shared/lib/`, `shared/config/`, `shared/demo/`, dữ liệu demo từng feature |
| `ui.jsx` | `shared/ui/`: mỗi component một file |
| `auth.jsx` | `features/auth/AuthView.jsx`, `useAuth.js` |
| `schedule.jsx` | `features/schedule/Agenda.jsx`, `CreateSession.jsx` |
| `main.jsx` | `src/main.jsx` |
| CSS trong `src/app/` | `shared/styles/` |

Các export như `Admin`, `Coach`, `Member`, `Hero`, `Week` giữ tên hàm cũ để giảm thay đổi hành vi; file mới thể hiện chức năng rõ ràng.
