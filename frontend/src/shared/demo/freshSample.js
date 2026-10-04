import { demoMembers } from "./members.js";
import { sessionSeed } from "../../features/schedule/demo/sessions.js";
import { exerciseSeed } from "../../features/training/demo/exercises.js";
import { invoiceSeed } from "../../features/admin/finance/demo/invoices.js";
import { equipmentSeed } from "../../features/admin/equipment/demo/equipment.js";

export function freshSample() {
  return {
    bookings: [],
    sessions: sessionSeed,
    exercises: exerciseSeed,
    programName: "Chân & core",
    programClient: "",
    programSaved: false,
    done: [],
    workoutStarted: false,
    workoutFinished: false,
    water: 1500,
    meals: [
      {
        id: 1,
        name: "Yến mạch, sữa & chuối",
        meal: "Bữa sáng",
        calories: 380,
      },
      {
        id: 2,
        name: "Cơm, ức gà & rau",
        meal: "Bữa trưa",
        calories: 620,
      },
      {
        id: 3,
        name: "Sữa chua & hạt",
        meal: "Bữa phụ",
        calories: 420,
      },
    ],
    invoices: invoiceSeed,
    equipment: equipmentSeed,
    readNotifications: false,
    checkins: demoMembers.slice(0, 6).map((m, i) => ({
      id: "ci" + i,
      name: m.name,
      time: ["08:42", "08:35", "08:21", "08:15", "07:58", "07:42"][i],
      zone: ["Gym", "Gym", "Yoga", "Boxing", "Gym", "Yoga"][i],
    })),
  };
}
