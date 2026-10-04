import React from "react";

export function Section({ title, detail, action, children, className = "" }) {
  return (
    <section className={"g-section " + className}>
      <header className="g-section-head">
        <div>
          <h2>{title}</h2>
          {detail && <p>{detail}</p>}
        </div>
        {action}
      </header>
      {children}
    </section>
  );
}
