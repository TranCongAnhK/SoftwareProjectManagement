export function status(row, kind) {
  if (kind === "packages") return row.active ? "Đang bán" : "Đã ẩn";
  if (["members", "trainers"].includes(kind) && !row.email_verified)
    return "Chờ xác thực";
  return (
    {
      ACTIVE: "Hoạt động",
      PENDING: "Chờ duyệt",
      DISABLED: "Đã khóa",
      REJECTED: "Từ chối",
      INACTIVE: "Ngưng làm",
    }[row.status] || row.status
  );
}
