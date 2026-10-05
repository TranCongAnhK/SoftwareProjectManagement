import React from "react";
import { WorkoutView } from "../../../shared/workout/WorkoutEditor.jsx";
export function ProgramBuilderView({ ctx }) {
  return <WorkoutView ctx={ctx} builder={true} />;
}
