"use client";

import { useMemo, useState } from "react";
import { ChevronDown } from "lucide-react";

type ReadMoreTextProps = {
  text: string;
  limit: number;
  className?: string;
};

export function ReadMoreText({ text, limit, className }: ReadMoreTextProps) {
  const [expanded, setExpanded] = useState(false);
  const trimmed = text.trim();
  const needsToggle = trimmed.length > limit;
  const visibleText = useMemo(() => {
    if (!needsToggle || expanded) return trimmed;
    const boundary = trimmed.lastIndexOf(" ", limit);
    const end = boundary > Math.floor(limit * 0.72) ? boundary : limit;
    return `${trimmed.slice(0, end).trimEnd()}...`;
  }, [expanded, limit, needsToggle, trimmed]);

  if (!trimmed) return null;

  return (
    <div className={className ? `read-more-text ${className}` : "read-more-text"}>
      <p>{visibleText}</p>
      {needsToggle ? (
        <button
          type="button"
          className="trip-read-more-toggle"
          onClick={() => setExpanded((current) => !current)}
          aria-expanded={expanded}
        >
          {expanded ? "Read less" : "Read more"}
          <ChevronDown aria-hidden="true" size={16} />
        </button>
      ) : null}
    </div>
  );
}
