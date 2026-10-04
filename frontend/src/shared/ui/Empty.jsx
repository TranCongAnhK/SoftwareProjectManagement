import { Search } from "lucide-react";
import React from "react";

export function Empty({ title = "Chưa có dữ liệu", children }) {
  return (
    <div className="g-empty">
      <div className="g-empty-mark">
        <Search size={24} />
      </div>
      <h3>{title}</h3>
      <p>{children || "Dữ liệu sẽ xuất hiện khi được cập nhật."}</p>
    </div>
  );
}
