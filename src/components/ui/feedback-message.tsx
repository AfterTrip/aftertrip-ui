import { AlertCircle, CheckCircle2, Info } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type FeedbackVariant = "success" | "error" | "info";

type FeedbackMessageProps = {
  children: ReactNode;
  className?: string;
  title?: string;
  variant?: FeedbackVariant;
};

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info
};

export function FeedbackMessage({
  children,
  className,
  title,
  variant = "info"
}: FeedbackMessageProps) {
  const Icon = icons[variant];
  const role = variant === "error" ? "alert" : "status";

  return (
    <div
      className={cn("feedback-message", `feedback-message-${variant}`, className)}
      role={role}
      aria-live={variant === "error" ? "assertive" : "polite"}
    >
      <span className="feedback-message-icon" aria-hidden="true">
        <Icon size={18} />
      </span>
      <span className="feedback-message-copy">
        {title ? <strong>{title}</strong> : null}
        <span>{children}</span>
      </span>
    </div>
  );
}
