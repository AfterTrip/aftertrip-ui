"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Share2 } from "lucide-react";

type SharePageButtonProps = {
  title: string;
  text?: string;
  className?: string;
  label?: string;
};

export function SharePageButton({
  title,
  text,
  className,
  label = "Share"
}: SharePageButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (resetTimer.current) clearTimeout(resetTimer.current);
    },
    []
  );

  const share = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title, text, url });
        return;
      }

      await navigator.clipboard.writeText(url);
      setCopied(true);
      resetTimer.current = setTimeout(() => setCopied(false), 2200);
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") return;
      setCopied(false);
    }
  };

  return (
    <button
      className={className}
      type="button"
      aria-label={copied ? "Link copied" : label}
      title={copied ? "Link copied" : label}
      onClick={() => void share()}
    >
      {copied ? (
        <Check aria-hidden="true" size={18} />
      ) : (
        <Share2 aria-hidden="true" size={18} />
      )}
      {copied ? "Link copied" : label}
    </button>
  );
}
