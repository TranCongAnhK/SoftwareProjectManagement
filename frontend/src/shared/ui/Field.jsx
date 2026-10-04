import React from "react";

export function Field({ label, ...props }) {
  return (
    <label className="g-field">
      <span>{label}</span>
      <input {...props} />
    </label>
  );
}
