export function exportCSV(name, rows) {
  const text =
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((value) => '"' + String(value).replace(/"/g, '""') + '"')
          .join(","),
      )
      .join("\r\n");
  const url = URL.createObjectURL(
    new Blob([text], {
      type: "text/csv;charset=utf-8",
    }),
  );
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
