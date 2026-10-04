import { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Search,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { IconButton } from "./IconButton.jsx";
import { Empty } from "./Empty.jsx";
import React from "react";

export function Table({
  rows,
  columns,
  searchable = true,
  empty = "Không có kết quả",
  pageSize = 8,
}) {
  const [query, setQuery] = useState(""),
    [sort, setSort] = useState(null),
    [asc, setAsc] = useState(true),
    [page, setPage] = useState(1);
  const filtered = rows.filter(
    (r) =>
      !query ||
      columns.some((c) =>
        String(c.get ? c.get(r) : (r[c.key] ?? ""))
          .toLocaleLowerCase("vi")
          .includes(query.toLocaleLowerCase("vi")),
      ),
  );
  const sorted = sort
    ? [...filtered].sort((a, b) => {
        const x = a[sort],
          y = b[sort];
        return (
          (typeof x === "number" && typeof y === "number"
            ? x - y
            : String(x ?? "").localeCompare(String(y ?? ""), "vi", {
                numeric: true,
              })) * (asc ? 1 : -1)
        );
      })
    : filtered;
  const pages = Math.max(1, Math.ceil(sorted.length / pageSize));
  const current = Math.min(page, pages);
  return (
    <div className="g-table-block">
      {searchable && (
        <div className="g-table-search">
          <Search size={17} />
          <input
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
            aria-label="Tìm trong danh sách"
            placeholder="Tìm tên, email hoặc thông tin..."
          />
          <span>{filtered.length} kết quả</span>
        </div>
      )}
      <div className="g-table-scroll">
        <table className="g-table">
          <thead>
            <tr>
              {columns.map((c) => (
                <th key={c.key}>
                  {c.sortable === false ? (
                    c.label
                  ) : (
                    <button
                      onClick={() => {
                        setSort(c.key);
                        setAsc(sort === c.key ? !asc : true);
                        setPage(1);
                      }}
                    >
                      {c.label}
                      {sort === c.key &&
                        (asc ? <ArrowUp size={12} /> : <ArrowDown size={12} />)}
                    </button>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sorted
              .slice((current - 1) * pageSize, current * pageSize)
              .map((r, i) => (
                <tr key={r.id ?? i}>
                  {columns.map((c) => (
                    <td key={c.key}>
                      {c.render
                        ? c.render(r)
                        : c.get
                          ? c.get(r)
                          : (r[c.key] ?? "-")}
                    </td>
                  ))}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
      {!filtered.length && (
        <Empty title={empty}>Thử từ khóa khác hoặc thay đổi bộ lọc.</Empty>
      )}
      <footer className="g-table-footer">
        <span>{filtered.length} mục</span>
        <div>
          <IconButton
            icon={ChevronLeft}
            label="Trang trước"
            disabled={current <= 1}
            onClick={() => setPage(current - 1)}
          />
          <span>
            {current} / {pages}
          </span>
          <IconButton
            icon={ChevronRight}
            label="Trang sau"
            disabled={current >= pages}
            onClick={() => setPage(current + 1)}
          />
        </div>
      </footer>
    </div>
  );
}
