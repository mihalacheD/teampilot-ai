import { DEMO_USERS, DemoRole } from "./demo-constants";

export function isDemoUser(email?: string | null): boolean {
  return !!email && Object.values(DEMO_USERS).includes(email as any);
}

export function getDemoRole(email: string): DemoRole | null {
  if (email === DEMO_USERS.MANAGER) return "MANAGER";
  if (email === DEMO_USERS.EMPLOYEE) return "EMPLOYEE";
  return null;
}
