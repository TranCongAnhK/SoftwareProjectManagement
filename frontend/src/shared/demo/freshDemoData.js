import { daysFromNow } from "../lib/date.js";
import { demoMembers } from "./members.js";
import { demoTrainers } from "./trainers.js";
import { demoPackages } from "./packages.js";
import { demoStaff } from "./staff.js";

export function freshDemoData() {
  return structuredClone({
    members: demoMembers,
    trainers: demoTrainers,
    staff: demoStaff,
    packages: demoPackages,
    assignments: [
      {
        pt_id: 201,
        member_id: 101,
        pt_name: demoTrainers[0].name,
        member_name: demoMembers[0].name,
      },
      {
        pt_id: 202,
        member_id: 103,
        pt_name: demoTrainers[1].name,
        member_name: demoMembers[2].name,
      },
    ],
    clients: demoMembers.slice(0, 6),
    overview: {
      subscriptions: [
        {
          id: 501,
          name: "Gym 3 tháng",
          category: "GYM",
          starts_on: daysFromNow(-28),
          ends_on: daysFromNow(62),
        },
      ],
      trainers: [demoTrainers[0]],
    },
    summary: {},
  });
}
