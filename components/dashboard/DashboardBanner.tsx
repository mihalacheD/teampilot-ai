import Link from "next/link";
import { LucideIcon } from "lucide-react";

type CTABannerCompactProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  buttonText: string;
  buttonHref?: string;
  onClick?: () => void;
  variant?: "purple";
};

const variantStyles = {
  purple: {
    gradient: "bg-gradient-to-br from-purple-600 to-indigo-600",
    iconBg: "bg-white/20",
    textColor: "text-purple-100",
    buttonBg: "bg-white/20 hover:bg-white/30",
  },
};

export default function CTABannerCompact({
  icon: Icon,
  title,
  description,
  buttonText,
  buttonHref,
  onClick,
  variant = "purple",
}: CTABannerCompactProps) {
  const styles = variantStyles[variant];

  const buttonContent = (
    <span className={`px-4 py-2 ${styles.buttonBg} backdrop-blur rounded-lg font-medium transition-all cursor-pointer inline-block`}>
      {buttonText}
    </span>
  );

  return (
    <div className={`${styles.gradient} rounded-2xl p-6 text-white shadow-md hover:shadow-lg transition-all`}>
      <div className="flex items-start gap-4">
        <div className={`w-10 h-10 ${styles.iconBg} rounded-xl flex items-center justify-center shrink-0`}>
          <Icon className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-bold mb-1">{title}</h3>
          <p className={`${styles.textColor} text-sm mb-3 leading-relaxed`}>{description}</p>
          {buttonHref ? (
            <Link href={buttonHref}>
              {buttonContent}
            </Link>
          ) : (
            <button onClick={onClick}>
              {buttonContent}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}