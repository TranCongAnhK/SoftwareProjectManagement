import { initials } from "../lib/format.js";
import React from "react";

export function Avatar({ name, size = "normal" }) {
  return (
    <span className={"g-avatar " + size} aria-hidden="true">
      {initials(name)}
    </span>
  );
}
