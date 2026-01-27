import Link from "next/link";

interface AuthFooterProps {
  message: string;
  linkText: string;
  linkHref: string;
}

export function AuthFooter({ message, linkText, linkHref }: AuthFooterProps) {
  return (
    <div className="mt-6 text-center">
      <p className="text-gray-600 text-sm">
        {message}{" "}
        <Link href={linkHref} className="font-semibold text-blue-600 hover:text-blue-700 transition-colors">
          {linkText}
        </Link>
      </p>
    </div>
  );
}