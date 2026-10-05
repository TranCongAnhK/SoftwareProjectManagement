import React from "react";
import { WorkoutView } from "../../../shared/workout/WorkoutEditor.jsx";
export function MemberWorkoutView({ ctx }) {
  return <WorkoutView ctx={ctx} builder={false} />;
}
