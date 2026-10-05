import { ArrowUpRight } from "lucide-react";
import React from "react";

export function TextLink({ children, onClick }) {
  return (
    <button className="g-text-link" onClick={onClick}>
      {children}
      <ArrowUpRight size={16} />
    </button>
  );
}
