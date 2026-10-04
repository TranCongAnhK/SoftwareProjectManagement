import React from "react";

export function Tag({ children, active = false }) {
  return (
    <span className={"g-tag " + (active ? "active" : "")}>{children}</span>
  );
}
