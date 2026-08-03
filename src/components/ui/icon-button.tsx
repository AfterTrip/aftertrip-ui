import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

type IconButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  label: string;
};

export function IconButton({ label, className, children, ...props }: IconButtonProps) {
  return (
    <button className={cn("icon-button", className)} aria-label={label} title={label} {...props}>
      {children}
    </button>
  );
}
