import { useEffect, useState } from "react";
import { Moon, Sun, Settings, User } from "lucide-react";

import { useTheme } from "@/hooks/use-theme";
import { useAuth } from "@/hooks/use-auth";

import { WeatherWidget } from "@/components/WeatherWidget";
import { AuthDialog } from "@/components/AuthDialog";
import { ProfilePanel } from "@/components/ProfilePanel";

export function TopBar() {
  const { theme, toggle } = useTheme();
  const { user, profile } = useAuth();

  const [now, setNow] = useState<Date | null>(null);
  const [authOpen, setAuthOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const time = now
    ? now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "--:--";

  const date = now
    ? now.toLocaleDateString([], { weekday: "long", month: "short", day: "numeric" })
    : "";

  return (
    <>
      <header className="glass sticky top-0 z-30 mx-auto flex w-full max-w-[1600px] items-center justify-between gap-2 overflow-hidden rounded-3xl px-2 py-2 sm:rounded-full sm:px-3 sm:py-1.5">

        {/* LEFT: Settings button */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => alert("Settings clicked")}
            className="touch-target grid h-11 w-11 place-items-center rounded-full text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground sm:h-9 sm:w-9"
            aria-label="Settings"
          >
            <Settings className="h-[18px] w-[18px]" />
          </button>
        </div>

        {/* CENTER: Time & Date */}
        <div className="flex flex-1 flex-col items-center justify-center px-1 leading-tight min-w-0">
          <div className="font-display text-base font-semibold tracking-tight tabular-nums sm:text-base" suppressHydrationWarning>
            {time}
          </div>
          <div className="max-w-[9rem] truncate text-center text-[9px] uppercase tracking-[0.12em] text-muted-foreground sm:max-w-none sm:text-[10px] sm:tracking-[0.18em]" suppressHydrationWarning>
            {date}
          </div>
        </div>

        {/* RIGHT: Weather (mobile), Theme, Profile */}
        <div className="flex items-center gap-1">

          {/* Mobile Weather */}
          <div className="hidden sm:block lg:hidden scale-[0.9] origin-right">
            <WeatherWidget />
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggle}
            className="touch-target grid h-11 w-11 place-items-center rounded-full text-foreground/80 transition hover:bg-foreground/5 hover:text-foreground sm:h-9 sm:w-9"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
          </button>

          {/* Profile / Auth */}
          <button
            onClick={() => (user ? setProfileOpen(true) : setAuthOpen(true))}
            className="touch-target grid h-11 w-11 place-items-center overflow-hidden rounded-full bg-foreground/5 text-foreground/80 transition hover:bg-foreground/10 hover:text-foreground sm:h-9 sm:w-9"
            aria-label="Profile"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
            ) : user ? (
              <span className="text-xs font-semibold">{(profile?.username || user.email || "?")[0]?.toUpperCase()}</span>
            ) : (
              <User className="h-[18px] w-[18px]" />
            )}
          </button>
        </div>
      </header>

      {/* AuthDialog */}
      <AuthDialog open={authOpen} onClose={() => setAuthOpen(false)} />

      {/* ProfilePanel */}
      {user && <ProfilePanel open={profileOpen} onClose={() => setProfileOpen(false)} onOpenSettings={() => alert("Open settings")} />}
    </>
  );
}