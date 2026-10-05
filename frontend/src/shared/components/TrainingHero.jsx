import { ArrowUpRight } from "lucide-react";
import { Sample } from "../ui/Sample.jsx";
import React from "react";

export function Hero({
  ctx,
  label,
  title,
  description,
  action,
  onAction,
  meta,
}) {
  return (
    <section className="s-hero">
      <img
        src="/studio/training.jpg"
        alt="Vận động viên chuẩn bị buổi tập tạ trong phòng gym ngập nắng"
        fetchpriority="high"
        width="1536"
        height="1024"
      />
      <div className="s-hero-top">
        <span>
          <i />
          {label}
        </span>
        <Sample>Mẫu</Sample>
      </div>
      <div className="s-hero-content">
        <p>BUỔI TẬP / 01</p>
        <h2>{title}</h2>
        <div className="s-hero-bottom">
          <div>
            <p>{description}</p>
            <span>{meta}</span>
          </div>
          <button onClick={onAction} className="s-hero-cta" aria-label={action}>
            <ArrowUpRight size={28} />
            <span>{action}</span>
          </button>
        </div>
      </div>
    </section>
  );
}
