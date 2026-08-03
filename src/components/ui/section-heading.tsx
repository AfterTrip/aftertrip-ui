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
        <Link className="section-link" href={link.href}>
          {link.label}
          <ArrowRight aria-hidden="true" size={18} />
        </Link>
      ) : null}
    </div>
  );
}
