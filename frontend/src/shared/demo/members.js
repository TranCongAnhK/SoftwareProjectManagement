import { daysFromNow } from "../lib/date.js";

export const names = [
  "Nguyễn Khánh Linh",
  "Phạm Hoàng Nam",
  "Trần Thảo Vy",
  "Đặng Minh Quân",
  "Vũ Ngọc Hà",
  "Lê Tuấn Kiệt",
  "Bùi Anh Thư",
  "Hoàng Gia Huy",
  "Phan Mỹ Duyên",
  "Đỗ Minh Đức",
  "Lý Thanh Trúc",
  "Trịnh Ngọc Sơn",
];

export const demoMembers = names.map((name, i) => ({
  id: 101 + i,
  name,
  email: `hoivien${i + 1}@demo.optigym`,
  phone: `090 234 ${String(5600 + i)}`,
  status: i === 9 ? "DISABLED" : "ACTIVE",
  email_verified: i !== 10,
  created_at: daysFromNow(-i * 2),
  plan: ["Gym 3 tháng", "Gym 1 tháng", "Yoga 1 tháng", "Boxing"][i % 4],
}));
