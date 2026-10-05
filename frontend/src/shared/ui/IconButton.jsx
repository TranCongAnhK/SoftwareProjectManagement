import React from "react";

export function IconButton({ icon: Icon, label, ...props }) {
  return (
    <button
      className="g-icon-button"
      aria-label={label}
      title={label}
      {...props}
    >
      <Icon size={19} strokeWidth={1.7} />
    </button>
  );
}
