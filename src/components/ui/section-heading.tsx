import Link from "next/link";
import { ArrowRight } from "lucide-react";

type SectionHeadingProps = {
  eyebrow?: string;
  titleId?: string;
  title: string;
  copy?: string;
  link?: {
    label: string;
    href: string;
  };
  centered?: boolean;
};

export function SectionHeading({ titleId, title, copy, link, centered = false }: SectionHeadingProps) {
  return (
    <div className={centered ? "section-heading centered" : "section-heading"}>
      <div>
        <h2 id={titleId}>{title}</h2>
        {copy ? <p>{copy}</p> : null}
      </div>
      {link ? (
        <Link className="section-link" href={link.href} aria-label={link.label}>
          <span className="section-link-full" aria-hidden="true">
            {link.label}
          </span>
          <span className="section-link-mobile" aria-hidden="true">
            View all
          </span>
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      ) : null}
    </div>
  );
}
