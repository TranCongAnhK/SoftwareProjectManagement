export async function api(path, options = {}) {
  const response = await fetch("/api" + path, {
    credentials: "same-origin",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });
  let body = {};
  try {
    body = await response.json();
  } catch {}
  if (!response.ok) {
    const error = new Error(
      body.message ||
        body.detail ||
        {
          401: "Phiên đã hết hạn. Hãy đăng nhập lại.",
          403: "Bạn không có quyền thực hiện thao tác này.",
        }[response.status] ||
        "Không thể kết nối. Vui lòng thử lại.",
    );
    error.status = response.status;
    throw error;
  }
  return body;
}
