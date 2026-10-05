export const formatNumber = (n) => Number(n).toLocaleString("vi-VN");

export const currency = (n) => formatNumber(n) + " ₫";

export const shortName = (name) =>
  name?.split(" ").slice(-2).join(" ") || "Bạn";

export const initials = (name) =>
  name
    ?.split(" ")
    .slice(-2)
    .map((x) => x[0])
    .join("") || "OG";
