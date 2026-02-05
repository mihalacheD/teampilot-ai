"use client";

import { toast } from "sonner";

export function useDemoToast() {
  const showDemoToast = (action = "this action") => {
    toast.info("Demo Mode", {
      description: `Cannot ${action} in demo mode. Sign up to create your own workspace!`,
      duration: 3000,
    });
  };

  return { showDemoToast };
}
