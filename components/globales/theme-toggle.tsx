"use client";

import * as React from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import gsap from "gsap";
import { cn } from "@/lib/utils";

interface ThemeToggleProps {
  className?: string;
}

export default function ThemeToggle({ className }: ThemeToggleProps) {
  const { theme, setTheme, resolvedTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  const sunRef = React.useRef<SVGSVGElement>(null);
  const moonRef = React.useRef<SVGSVGElement>(null);

  React.useEffect(() => setMounted(true), []);

  const isDark = mounted && (resolvedTheme ?? theme) === "dark";

  const handleClick = () => {
    const next = isDark ? "light" : "dark";
    // micro-rotation animation respecting reduced motion
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const targetIcon = isDark ? sunRef.current : moonRef.current;
    if (targetIcon && !reduce) {
      gsap.fromTo(
        targetIcon,
        { rotation: -90, scale: 0.6, opacity: 0 },
        { rotation: 0, scale: 1, opacity: 1, duration: 0.45, ease: "back.out(1.7)" },
      );
    }
    setTheme(next);
  };

  return (
    <button
      type="button"
      aria-label={isDark ? "Activar modo claro" : "Activar modo oscuro"}
      onClick={handleClick}
      className={cn(
        "relative inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 text-white backdrop-blur-md transition-colors hover:bg-white/20 dark:border-white/15 dark:bg-white/10",
        className,
      )}
    >
      {mounted ? (
        isDark ? (
          <Sun ref={sunRef} className="h-5 w-5" />
        ) : (
          <Moon ref={moonRef} className="h-5 w-5" />
        )
      ) : (
        <span className="h-5 w-5" />
      )}
    </button>
  );
}
