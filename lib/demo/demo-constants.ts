export const DEMO_USERS = {
  MANAGER: "manager@demo.com",
  EMPLOYEE: "employee@demo.com",
} as const;

export type DemoRole = "MANAGER" | "EMPLOYEE";
