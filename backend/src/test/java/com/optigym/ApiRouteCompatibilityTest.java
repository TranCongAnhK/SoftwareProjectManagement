package com.optigym;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

import com.optigym.passwordreset.PasswordResetService;
import com.optigym.shared.security.SessionSecurity;
import com.optigym.verification.EmailVerificationService;
import java.util.*;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest;
import org.springframework.boot.test.mock.mockito.MockBean;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.web.servlet.mvc.method.annotation.RequestMappingHandlerMapping;

@WebMvcTest(
  controllers = {
    com.optigym.pt.PtController.class,
    com.optigym.packages.PublicPackageController.class,
    com.optigym.auth.AuthController.class,
    com.optigym.passwordreset.PasswordResetController.class,
    com.optigym.verification.EmailVerificationController.class,
    com.optigym.member.MemberController.class,
    com.optigym.admin.assignments.AssignmentController.class,
    com.optigym.admin.subscriptions.SubscriptionController.class,
    com.optigym.admin.users.AdminUserController.class,
    com.optigym.admin.dashboard.AdminDashboardController.class,
    com.optigym.admin.packages.AdminPackageController.class,
    com.optigym.admin.staff.StaffController.class,
  }
)
class ApiRouteCompatibilityTest {

  @MockBean
  JdbcTemplate db;

  @MockBean
  SessionSecurity security;

  @MockBean
  EmailVerificationService verification;

  @MockBean
  PasswordResetService passwordReset;

  @Autowired
  RequestMappingHandlerMapping mappings;

  @Autowired
  MockMvc mvc;

  @Test
  void preservesAllOriginalHttpRoutes() {
    Set<String> actual = new TreeSet<>();
    mappings.getHandlerMethods().forEach((mapping, handler) -> {
      if (handler.getBeanType().getName().startsWith("com.optigym.")) {
        mapping.getPatternValues().forEach(path ->
          mapping
            .getMethodsCondition()
            .getMethods()
            .forEach(method -> actual.add(method.name() + " " + path))
        );
      }
    });
    assertEquals(
      Set.of(
        "POST /api/auth/register",
        "POST /api/auth/verify",
        "POST /api/auth/resend",
        "POST /api/auth/forgot-password",
        "POST /api/auth/reset-password",
        "POST /api/auth/login",
        "POST /api/auth/logout",
        "GET /api/auth/me",
        "GET /api/packages",
        "GET /api/admin/summary",
        "GET /api/admin/users",
        "POST /api/admin/members",
        "PATCH /api/admin/users/{id}",
        "DELETE /api/admin/users/{id}",
        "GET /api/admin/staff",
        "POST /api/admin/staff",
        "PUT /api/admin/staff/{id}",
        "DELETE /api/admin/staff/{id}",
        "GET /api/admin/packages",
        "POST /api/admin/packages",
        "PUT /api/admin/packages/{id}",
        "DELETE /api/admin/packages/{id}",
        "POST /api/admin/subscriptions",
        "GET /api/member/overview",
        "GET /api/pt/clients",
        "GET /api/admin/assignments",
        "POST /api/admin/assignments",
        "DELETE /api/admin/assignments/{pt}/{member}"
      ),
      actual
    );
  }

  @Test
  void adminSummaryStillRequiresAdminPermission() throws Exception {
    when(security.admin(any())).thenThrow(
      new org.springframework.web.server.ResponseStatusException(
        org.springframework.http.HttpStatus.FORBIDDEN,
        "Chỉ admin được thực hiện"
      )
    );
    mvc.perform(get("/api/admin/summary")).andExpect(status().isForbidden());
    verifyNoInteractions(db);
  }

  @Test
  void verifyEndpointDelegatesToOtpService() throws Exception {
    when(verification.verify("member@example.com", "123456")).thenReturn(
      org.springframework.http.ResponseEntity.ok(Map.of("message", "verified"))
    );
    mvc
      .perform(
        post("/api/auth/verify")
          .contentType("application/json")
          .content("{\"email\":\"member@example.com\",\"code\":\"123456\"}")
      )
      .andExpect(status().isOk())
      .andExpect(jsonPath("$.message").value("verified"));
    verify(verification).verify("member@example.com", "123456");
  }
}
