import { AlertCircle } from "lucide-react";

interface FormErrorProps {
  message?: string | null;
}

export function FormError({ message }: FormErrorProps) {
  if (!message) return null;

  return (
    <div className="bg-red-50 border border-red-200 rounded-xl p-4 flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
      <AlertCircle className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
      <p className="text-red-700 text-sm">{message}</p>
    </div>
  );
}