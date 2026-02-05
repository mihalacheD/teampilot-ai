import { toast } from "sonner";

export function showDemoToast(action = "this action") {
  toast.info("Demo Mode", {
    description: `Cannot ${action} in demo mode. Sign up to create your own workspace!`,
    duration: 3000,
  });
}

export function showSuccessToast(message: string, description?: string) {
  toast.success(message, {
    description,
    duration: 2000,
  });
}

export function showErrorToast(message: string, description?: string) {
  toast.error(message, {
    description,
    duration: 4000,
  });
}

export function showInfoToast(message: string, description?: string) {
  toast.info(message, {
    description,
    duration: 3000,
  });
}
