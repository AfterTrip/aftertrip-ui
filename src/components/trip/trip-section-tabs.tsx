"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, ImageIcon, NotebookTabs, Sparkles } from "lucide-react";

type TripSectionTabsProps = {
  hasTravelerNotes: boolean;
  hasGallery: boolean;
};

export function TripSectionTabs({
  hasTravelerNotes,
  hasGallery
}: TripSectionTabsProps) {
  const items = useMemo(
    () =>
      [
        { id: "overview", label: "Overview", icon: NotebookTabs },
        { id: "itinerary", label: "Itinerary", icon: CalendarDays },
        hasTravelerNotes
          ? { id: "tips", label: "Highlights", icon: Sparkles }
          : null,
        hasGallery ? { id: "gallery", label: "Gallery", icon: ImageIcon } : null
      ].filter(
        (
          item
        ): item is {
          id: string;
          label: string;
          icon: typeof NotebookTabs;
        } => Boolean(item)
      ),
    [hasGallery, hasTravelerNotes]
  );
  const [activeSection, setActiveSection] = useState(
    items[0]?.id ?? "overview"
  );
  const manualActive = useRef(false);
  const manualActiveTimer = useRef<number | null>(null);

  const holdManualActive = useCallback(() => {
    manualActive.current = true;
    if (manualActiveTimer.current)
      window.clearTimeout(manualActiveTimer.current);
    manualActiveTimer.current = window.setTimeout(() => {
      manualActive.current = false;
      manualActiveTimer.current = null;
    }, 900);
  }, []);

  useEffect(() => {
    const availableIds = items.map((item) => item.id);
    const setFromHash = () => {
      const id = window.location.hash.slice(1);
      if (availableIds.includes(id)) {
        holdManualActive();
        setActiveSection(id);
      }
    };

    setFromHash();
    window.addEventListener("hashchange", setFromHash);
    if (!("IntersectionObserver" in window)) {
      return () => window.removeEventListener("hashchange", setFromHash);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (manualActive.current) return;
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (left, right) => right.intersectionRatio - left.intersectionRatio
          );
        if (visible[0]?.target.id) setActiveSection(visible[0].target.id);
      },
      {
        rootMargin: "-112px 0px -58% 0px",
        threshold: [0.08, 0.18, 0.32]
      }
    );

    availableIds.forEach((id) => {
      const section = document.getElementById(id);
      if (section) observer.observe(section);
    });

    return () => {
      window.removeEventListener("hashchange", setFromHash);
      observer.disconnect();
      if (manualActiveTimer.current) {
        window.clearTimeout(manualActiveTimer.current);
        manualActiveTimer.current = null;
      }
    };
  }, [items, holdManualActive]);

  const selectSection = (id: string) => {
    holdManualActive();
    setActiveSection(id);
  };

  return (
    <nav className="trip-mobile-tabs" aria-label="Trip sections">
      {items.map((item) => {
        const Icon = item.icon;
        const active = activeSection === item.id;
        return (
          <a
            href={`#${item.id}`}
            className={active ? "active" : undefined}
            aria-current={active ? "true" : undefined}
            key={item.id}
            onClick={() => selectSection(item.id)}
          >
            <Icon aria-hidden="true" size={19} />
            {item.label}
          </a>
        );
      })}
    </nav>
  );
}
