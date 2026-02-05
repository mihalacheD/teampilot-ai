"use client";

import { Toaster } from "sonner";

export function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      expand={false}
      richColors
      closeButton
      toastOptions={{
        classNames: {
          toast: "rounded-xl border shadow-lg",
          title: "font-semibold",
          description: "text-sm",
          actionButton: "bg-blue-600 text-white",
          cancelButton: "bg-gray-200 text-gray-900",
          closeButton: "bg-gray-100 hover:bg-gray-200",
        },
      }}
    />
  );
}