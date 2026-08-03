import { cn } from "@/lib/utils";
import type { Testimonial } from "@/types/testimonial";

type AvatarProps = {
  initials: string;
  tone?: Testimonial["avatar"]["tone"];
  label: string;
};

export function Avatar({ initials, tone = "teal", label }: AvatarProps) {
  return (
    <span className={cn("avatar", `avatar-${tone}`)} aria-label={label}>
      {initials}
    </span>
  );
}
