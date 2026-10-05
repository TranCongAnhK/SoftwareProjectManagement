import { dayKey, daysFromNow } from "../../../../shared/lib/date.js";
import { demoMembers } from "../../../../shared/demo/members.js";

export const invoiceSeed = [
  {
    id: "HD-1048",
    name: demoMembers[0].name,
    service: "Gym 3 tháng",
    amount: 1800000,
    paid: true,
    date: dayKey(),
  },
  {
    id: "HD-1047",
    name: demoMembers[1].name,
    service: "PT 12 buổi",
    amount: 3600000,
    paid: true,
    date: dayKey(),
  },
  {
    id: "HD-1046",
    name: demoMembers[2].name,
    service: "Yoga 1 tháng",
    amount: 850000,
    paid: false,
    date: dayKey(),
  },
  {
    id: "HD-1045",
    name: demoMembers[3].name,
    service: "Boxing 1 tháng",
    amount: 1200000,
    paid: true,
    date: daysFromNow(-1),
  },
  {
    id: "HD-1044",
    name: demoMembers[4].name,
    service: "Gym 3 tháng",
    amount: 1800000,
    paid: true,
    date: daysFromNow(-1),
  },
];
