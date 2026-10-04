import React from "react";

export function Select({ label, children, ...props }) {
  return (
    <label className="g-field">
      <span>{label}</span>
      <select {...props}>{children}</select>
    </label>
  );
}
