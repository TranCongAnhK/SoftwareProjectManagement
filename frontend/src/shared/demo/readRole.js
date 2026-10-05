import { demoAccounts } from "./accounts.js";

export const readRole = () => {
  const role = new URLSearchParams(location.search).get("demo");
  return demoAccounts[role] ? role : null;
};
