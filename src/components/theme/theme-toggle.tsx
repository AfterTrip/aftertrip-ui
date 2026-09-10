"use client";

import { Moon, Sun } from "lucide-react";

type ThemeToggleProps = {
  className?: string;
};

export function ThemeToggle({ className = "" }: ThemeToggleProps) {
  const toggleTheme = () => {
    const root = document.documentElement;
    const nextTheme = root.dataset.theme === "dark" ? "light" : "dark";

    root.dataset.theme = nextTheme;
    root.style.colorScheme = nextTheme;
    window.localStorage.setItem("aftertrip-theme", nextTheme);
  };

  return (
    <button
      type="button"
      className={`theme-toggle ${className}`.trim()}
      aria-label="Toggle light and dark mode"
      title="Toggle light and dark mode"
      onClick={toggleTheme}
    >
      <Sun className="theme-icon-sun" aria-hidden="true" size={19} />
      <Moon className="theme-icon-moon" aria-hidden="true" size={19} />
    </button>
  );
}
