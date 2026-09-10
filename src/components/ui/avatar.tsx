import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/testimonial";

type AvatarProps = {
  initials: string;
  tone?: Testimonial["avatar"]["tone"];
  src?: string | null;
  label: string;
};

export function Avatar({ initials, tone = "teal", src, label }: AvatarProps) {
  return (
    <span
      className={cn("avatar", `avatar-${tone}`, src && "has-photo")}
      style={src ? { backgroundImage: `url("${src}")` } : undefined}
      aria-label={label}
    >
      {src ? null : initials}
    </span>
  );
}
