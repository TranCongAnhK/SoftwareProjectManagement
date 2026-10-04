import { Avatar } from "./Avatar.jsx";
import React from "react";

export function Person({ name, detail }) {
  return (
    <div className="g-person">
      <Avatar name={name} />
      <div>
        <b>{name}</b>
        {detail && <small>{detail}</small>}
      </div>
    </div>
  );
}
