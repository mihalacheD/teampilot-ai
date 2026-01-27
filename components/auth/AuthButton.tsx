import { Loader2 } from "lucide-react";

interface AuthButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  isLoading: boolean;
  loadingText?: string;
  text: string;
}

export function AuthButton({ isLoading, loadingText, text, ...props }: AuthButtonProps) {
  return (
    <button
      {...props}
      disabled={isLoading || props.disabled}
      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-linear-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 text-white font-semibold rounded-xl transition-all shadow-md hover:shadow-lg disabled:cursor-not-allowed"
    >
      {isLoading ? (
        <>
          <Loader2 className="w-5 h-5 animate-spin" />
          {loadingText || text}
        </>
      ) : (
        text
      )}
    </button>
  );
}