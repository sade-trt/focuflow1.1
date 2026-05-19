import { useState } from "react";

import {
  X,
  Palette,
  Sparkles,
  RotateCcw,
  Type,
} from "lucide-react";

import { useTheme } from "@/hooks/use-theme";

import {
  ACCENTS,
  FONT_PAIRS,
  useAppearance,
} from "@/hooks/use-appearance";

type TabId =
  | "appearance"
  | "typography";

const TABS: {
  id: TabId;
  label: string;
  icon: typeof Palette;
}[] = [
  {
    id: "appearance",
    label: "Appearance",
    icon: Palette,
  },

  {
    id: "typography",
    label: "Typography",
    icon: Type,
  },
];

export function SettingsPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [tab, setTab] =
    useState<TabId>("appearance");

  const { theme, setTheme } =
    useTheme();

  const {
    state: ap,
    setAccent,
    setBlur,
    setDim,
    setGlassOpacity,
    setFontPair,
    reset,
  } = useAppearance();

  const [uniCity, setUniCity] =
    useState(
      localStorage.getItem(
        "uniCity"
      ) || "Tartu"
    );

  const [calendarUrl, setCalendarUrl] =
    useState(
      localStorage.getItem(
        "google-calendar-url"
      ) || ""
    );

  return (
    <>
      {/* BACKDROP */}
      <div
        onClick={onClose}
        className={`fixed inset-0 z-40 bg-background/30 backdrop-blur-sm transition-opacity duration-300 ${
          open
            ? "opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* PANEL */}
      <aside
        className={`glass-strong fixed inset-x-3 top-[max(0.75rem,env(safe-area-inset-top,0px))] z-50 flex h-[calc(100dvh-max(1.5rem,env(safe-area-inset-top,0px))-env(safe-area-inset-bottom,0px))] flex-col overflow-hidden rounded-3xl transition-all duration-300 sm:inset-x-auto sm:right-4 sm:top-4 sm:h-[calc(100vh-2rem)] sm:w-[380px] sm:max-w-[92vw] ${
          open
            ? "translate-x-0 opacity-100"
            : "pointer-events-none translate-x-6 opacity-0"
        }`}
      >
        {/* HEADER */}
        <header className="flex items-center justify-between border-b border-border/40 px-5 py-4">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-primary" />

            <h2 className="font-display text-base font-semibold tracking-tight">
              Settings
            </h2>
          </div>

          <button
            onClick={onClose}
            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        {/* TABS */}
        <nav className="flex gap-1 px-4 pt-3">
          {TABS.map((t) => {
            const Icon = t.icon;

            const active =
              tab === t.id;

            return (
              <button
                key={t.id}
                onClick={() =>
                  setTab(t.id)
                }
                className={`relative flex flex-1 items-center justify-center gap-1.5 rounded-2xl px-3 py-2 text-xs font-medium transition ${
                  active
                    ? "bg-foreground/10 text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                <Icon className="h-3.5 w-3.5" />

                {t.label}

                {active && (
                  <span
                    className="absolute inset-x-3 -bottom-px h-px"
                    style={{
                      background:
                        "var(--glow)",
                      boxShadow:
                        "0 0 8px var(--glow)",
                    }}
                  />
                )}
              </button>
            );
          })}
        </nav>

        {/* BODY */}
        <div className="thin-scroll flex-1 overflow-y-auto px-5 py-5">

          {/* APPEARANCE */}
          {tab === "appearance" && (
            <div className="space-y-6">

              {/* THEME */}
              <Section label="Theme">
                <div className="grid grid-cols-2 gap-2">

                  <ThemeChip
                    active={
                      theme === "light"
                    }
                    onClick={() =>
                      setTheme("light")
                    }
                    label="Light"
                  />

                  <ThemeChip
                    active={
                      theme === "dark"
                    }
                    onClick={() =>
                      setTheme("dark")
                    }
                    label="Dark"
                  />
                </div>
              </Section>

              {/* ACCENTS */}
              <Section label="Accent Colors">
                <div className="grid grid-cols-6 gap-2">
                  {ACCENTS.map((a) => {
                    const active =
                      ap.accent ===
                      a.id;

                    return (
                      <button
                        key={a.id}
                        onClick={() =>
                          setAccent(
                            a.id
                          )
                        }
                        title={a.name}
                        className={`aspect-square rounded-2xl transition ${
                          active
                            ? "ring-2 ring-primary scale-105"
                            : "ring-1 ring-border hover:scale-105"
                        }`}
                        style={{
                          background:
                            a.swatch,
                        }}
                      />
                    );
                  })}
                </div>
              </Section>

              {/* UNIVERSITY CITY */}
              <Section label="University City">
                <input
                  type="text"
                  value={uniCity}
                  onChange={(e) => {
                    setUniCity(
                      e.target.value
                    );

                    localStorage.setItem(
                      "uniCity",
                      e.target.value
                    );
                  }}
                  placeholder="Tartu"
                  className="w-full rounded-2xl border border-border/60 bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition focus:border-primary"
                />

                <div className="mt-2 text-[11px] text-muted-foreground">
                  Used for weather.
                </div>
              </Section>

              {/* GOOGLE CALENDAR */}
              <Section label="Google Calendar">
                <input
                  type="text"
                  value={calendarUrl}
                  onChange={(e) => {
                    setCalendarUrl(
                      e.target.value
                    );

                    localStorage.setItem(
                      "google-calendar-url",
                      e.target.value
                    );
                  }}
                  placeholder="Paste public .ics link..."
                  className="w-full rounded-2xl border border-border/60 bg-foreground/[0.03] px-4 py-3 text-sm outline-none transition focus:border-primary"
                />

                <div className="mt-2 text-[11px] text-muted-foreground">
                  Sync your Google Calendar.
                </div>
              </Section>

              {/* GLASS */}
              <Section
                label="Glass Blur"
                value={`${ap.blur}px`}
              >
                <Slider
                  min={8}
                  max={40}
                  step={1}
                  value={ap.blur}
                  onChange={setBlur}
                />
              </Section>

              {/* TRANSPARENCY */}
              <Section
                label="Transparency"
                value={`${ap.glassOpacity}%`}
              >
                <Slider
                  min={15}
                  max={70}
                  step={1}
                  value={
                    ap.glassOpacity
                  }
                  onChange={
                    setGlassOpacity
                  }
                />
              </Section>

              {/* DIM */}
              <Section
                label="Background Dim"
                value={`${ap.dim}%`}
              >
                <Slider
                  min={0}
                  max={85}
                  step={1}
                  value={ap.dim}
                  onChange={setDim}
                />
              </Section>

              {/* RESET */}
              <button
                onClick={reset}
                className="flex w-full items-center justify-center gap-2 rounded-2xl border border-border/60 bg-foreground/[0.03] py-2.5 text-xs font-medium text-muted-foreground transition hover:bg-foreground/[0.06] hover:text-foreground"
              >
                <RotateCcw className="h-3.5 w-3.5" />

                Reset appearance
              </button>
            </div>
          )}

          {/* TYPOGRAPHY */}
          {tab === "typography" && (
            <div className="space-y-6">

              <Section label="Fonts">
                <div className="space-y-2">

                  {FONT_PAIRS.map(
                    (f) => {
                      const active =
                        ap.fontPair ===
                        f.id;

                      return (
                        <button
                          key={f.id}
                          onClick={() =>
                            setFontPair(
                              f.id
                            )
                          }
                          className={`w-full rounded-2xl border p-4 text-left transition ${
                            active
                              ? "border-primary bg-primary/10"
                              : "border-border/40 hover:bg-foreground/5"
                          }`}
                        >
                          <div
                            className="text-base font-semibold"
                            style={{
                              fontFamily:
                                f.display,
                            }}
                          >
                            {f.name}
                          </div>

                          <div
                            className="mt-1 text-sm text-muted-foreground"
                            style={{
                              fontFamily:
                                f.body,
                            }}
                          >
                            The quick brown fox jumps over the lazy dog
                          </div>
                        </button>
                      );
                    }
                  )}
                </div>
              </Section>

            </div>
          )}
        </div>
      </aside>
    </>
  );
}

/* ---------- SMALL COMPONENTS ---------- */

function Section({
  label,
  value,
  children,
}: {
  label: string;
  value?: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <div className="mb-2 flex items-center justify-between">

        <div className="text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
          {label}
        </div>

        {value && (
          <span className="text-[11px] text-muted-foreground">
            {value}
          </span>
        )}
      </div>

      {children}
    </section>
  );
}

function ThemeChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={`rounded-2xl px-3 py-2.5 text-sm font-medium transition ${
        active
          ? "bg-primary text-primary-foreground shadow-[0_0_20px_var(--glow)]"
          : "bg-foreground/5 text-muted-foreground hover:bg-foreground/10"
      }`}
    >
      {label}
    </button>
  );
}

function Slider({
  min,
  max,
  step,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step: number;
  value: number;
  onChange: (n: number) => void;
}) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      onChange={(e) =>
        onChange(+e.target.value)
      }
      className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-foreground/10 accent-primary"
    />
  );
}