import React from "react";

export function Button({
  children,
  icon: Icon,
  quiet = false,
  className = "",
  ...props
}) {
  return (
    <button
      className={"g-button " + (quiet ? "quiet " : "") + className}
      {...props}
    >
      {Icon && <Icon size={17} strokeWidth={1.7} />}
      <span>{children}</span>
    </button>
  );
}
