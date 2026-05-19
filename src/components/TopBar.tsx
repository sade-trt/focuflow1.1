import { useEffect, useState } from "react";

import {
  Moon,
  Settings,
  Sun,
  User,
} from "lucide-react";

import { useTheme } from "@/hooks/use-theme";

import { WeatherWidget } from "@/components/WeatherWidget";

export function TopBar({
  onOpenSettings,
  onOpenProfile,
}: {
  onOpenSettings: () => void;
  onOpenProfile: () => void;
}) {
  const { theme, toggle } = useTheme();

  const [now, setNow] =
    useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());

    const t = setInterval(() => {
      setNow(new Date());
    }, 1000);

    return () => clearInterval(t);
  }, []);

  const time = now
    ? now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    : "--:--";

  const date = now
    ? now.toLocaleDateString([], {
        weekday: "long",
        month: "short",
        day: "numeric",
      })
    : "";

  return (
    <header
      className="
        glass
        sticky
        top-0
        z-30
        mx-auto
        flex
        w-full
        min-w-0
        max-w-[1600px]
        items-center
        justify-between
        gap-2
        overflow-hidden
        rounded-3xl
        px-2
        py-2
        sm:rounded-full
        sm:px-3
        sm:py-1.5
      "
    >
      {/* LEFT */}
      <div className="flex min-w-0 shrink items-center gap-1">

        <button
          onClick={onOpenSettings}
          className="
            touch-target
            grid
            h-11
            w-11
            place-items-center
            rounded-full
            text-foreground/80
            transition
            hover:bg-foreground/5
            hover:text-foreground
            sm:h-9
            sm:w-9
          "
          aria-label="Settings"
        >
          <Settings className="h-[18px] w-[18px]" />
        </button>

        <button
          onClick={onOpenProfile}
          className="
            touch-target
            grid
            h-11
            w-11
            place-items-center
            overflow-hidden
            rounded-full
            bg-foreground/5
            text-foreground/80
            transition
            hover:bg-foreground/10
            hover:text-foreground
            sm:h-9
            sm:w-9
          "
          aria-label="Profile"
        >
          <User className="h-[18px] w-[18px]" />
        </button>
      </div>

      {/* CENTER */}
      <div className="flex min-w-0 flex-1 flex-col items-center justify-center px-1 leading-tight">

        <div
          className="
            font-display
            text-base
            font-semibold
            tracking-tight
            tabular-nums
            sm:text-base
          "
          suppressHydrationWarning
        >
          {time}
        </div>

        <div
          className="
            max-w-[9rem]
            truncate
            text-center
            text-[9px]
            uppercase
            tracking-[0.12em]
            text-muted-foreground
            sm:max-w-none
            sm:text-[10px]
            sm:tracking-[0.18em]
          "
          suppressHydrationWarning
        >
          {date}
        </div>
      </div>

      {/* RIGHT */}
      <div className="flex min-w-0 shrink items-center gap-1">

        {/* MOBILE WEATHER */}
        <div className="hidden sm:block lg:hidden scale-[0.9] origin-right">
          <WeatherWidget />
        </div>

        <button
          onClick={toggle}
          className="
            touch-target
            grid
            h-11
            w-11
            place-items-center
            rounded-full
            text-foreground/80
            transition
            hover:bg-foreground/5
            hover:text-foreground
            sm:h-9
            sm:w-9
          "
          aria-label="Toggle theme"
        >
          {theme === "dark" ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>
    </header>
  );
}