import React from "react";

export function PageTitle({ label, title, description, action }) {
  return (
    <header className="g-page-title">
      <div>
        {label && <p className="g-overline">{label}</p>}
        <h1>{title}</h1>
        {description && <p className="g-description">{description}</p>}
      </div>
      {action}
    </header>
  );
}
