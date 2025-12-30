export const PERMISSIONS = {
  MANAGER: {
    canCreateTask: true,
    canEditAnyTask: true,
    canDeleteAnyTask: true,
    canViewAllTasks: true,
    canChangeTaskStatus: true,
  },
  EMPLOYEE: {
    canCreateTask: false,
    canEditAnyTask: false,
    canDeleteAnyTask: false,
    canViewAllTasks: true,
    canChangeTaskStatus: true, // Poate schimba status doar la task-urile proprii
  },
} as const;

export function canEditTask(
  userRole: "MANAGER" | "EMPLOYEE",
  taskUserId: string,
  currentUserId: string
) {
  if (userRole === "MANAGER") return true;
  return taskUserId === currentUserId; // Employee poate edita doar task-urile lui
}

export function canDeleteTask(
  userRole: "MANAGER" | "EMPLOYEE",
  taskUserId: string,
  currentUserId: string
) {
  if (userRole === "MANAGER") return true;
  return false; // Employee NU poate șterge task-uri
}

export function canChangeTaskStatus(
  userRole: "MANAGER" | "EMPLOYEE",
  taskUserId: string,
  currentUserId: string
) {
  if (userRole === "MANAGER") return true;
  return taskUserId === currentUserId; // Employee poate schimba status doar la task-urile lui
}
