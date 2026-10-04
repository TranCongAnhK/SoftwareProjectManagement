import { LoaderCircle } from "lucide-react";
import React from "react";

export function Loading() {
  return (
    <div className="g-loading" role="status">
      <LoaderCircle size={26} />
      <p>Đang tải OptiGym...</p>
    </div>
  );
}
