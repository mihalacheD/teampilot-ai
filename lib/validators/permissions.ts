export type Role = "MANAGER" | "EMPLOYEE";

export type PermissionContext = {
  role?: Role;
  isDemo?: boolean;
  taskUserId: string;
  currentUserId: string;
};

export const PERMISSIONS = {
  MANAGER: {
    canCreateTask: true,
    canEditAnyTask: true,
    canDeleteAnyTask: true,
    canViewAllTasks: true,
    canChangeTaskStatusAny: true,
  },
  EMPLOYEE: {
    canCreateTask: false,
    canEditAnyTask: false,
    canDeleteAnyTask: false,
    canViewAllTasks: true,
    canChangeTaskStatusAny: false,
  },
} as const;

/* =========================
   Helpers defensive (SAFE)
   ========================= */
function getPermissions(role?: Role) {
  if (!role) return null;
  return PERMISSIONS[role] ?? null;
}

export function canCreateTask(ctx: PermissionContext): boolean {
  // ✅ ONLY block if explicitly demo
  if (ctx.isDemo === true) return false;
  if (!ctx.role) return false;
  const permissions = getPermissions(ctx.role);
  if (!permissions) return false;
  return permissions.canCreateTask;
}

export function canEditTask(ctx: PermissionContext): boolean {
  // ✅ ONLY block if explicitly demo
  if (ctx.isDemo === true) return false;
  if (!ctx.role) return false;
  const permissions = getPermissions(ctx.role);
  if (!permissions) return false;
  // ⚠️ DOAR MANAGERII pot edita taskuri
  return permissions.canEditAnyTask;
}

export function canDeleteTask(ctx: PermissionContext): boolean {
  // ✅ ONLY block if explicitly demo
  if (ctx.isDemo === true) return false;
  if (!ctx.role) return false;
  const permissions = getPermissions(ctx.role);
  if (!permissions) return false;
  return permissions.canDeleteAnyTask;
}

export function canChangeTaskStatus(ctx: PermissionContext): boolean {
  // ✅ ONLY block if explicitly demo
  if (ctx.isDemo === true) return false;
  if (!ctx.role) return false;
  const permissions = getPermissions(ctx.role);
  if (!permissions) return false;
  if (permissions.canChangeTaskStatusAny) return true;
  // ✅ EMPLOYEE poate schimba statusul doar la propriile taskuri
  return ctx.taskUserId === ctx.currentUserId;
}