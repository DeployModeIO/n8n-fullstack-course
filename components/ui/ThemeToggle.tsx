"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils/cn";
import { Sun, Moon } from "lucide-react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="h-9 w-9 rounded-xl border bg-gray-200 border-gray-300 dark:bg-white/5 dark:border-white/10" />
    );
  }

  return (
    <button
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-xl",
        "border backdrop-blur-xl transition-all duration-300",
        "bg-white/70 border-gray-200/50 text-gray-700 hover:bg-white hover:text-gray-900",
        "dark:bg-white/5 dark:border-white/10 dark:text-white/70 dark:hover:bg-white/10 dark:hover:text-white"
      )}
      aria-label="Toggle theme"
    >
      <Sun
        size={16}
        className={cn(
          "absolute transition-all duration-300",
          theme === "dark"
            ? "rotate-0 scale-100 opacity-100"
            : "rotate-90 scale-0 opacity-0"
        )}
      />
      <Moon
        size={16}
        className={cn(
          "absolute transition-all duration-300",
          theme === "light"
            ? "rotate-0 scale-100 opacity-100"
            : "-rotate-90 scale-0 opacity-0"
        )}
      />
    </button>
  );
}
