import { useEffect, useRef, useState } from "react";
import { Pause, Play, RotateCcw, Coffee, Brain } from "lucide-react";
import { loadLS, saveLS } from "@/lib/storage";

type Mode = "focus" | "break";
type Settings = { focus: number; break: number };

export function FocusTimer() {
  const [settings, setSettings] = useState<Settings>({ focus: 25, break: 5 });
  const [mode, setMode] = useState<Mode>("focus");
  const [remaining, setRemaining] = useState(25 * 60);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef<number | null>(null);

  useEffect(() => {
    const s = loadLS<Settings>("focus.timer", { focus: 25, break: 5 });
    setSettings(s);
    setRemaining(s.focus * 60);
  }, []);

  useEffect(() => saveLS("focus.timer", settings), [settings]);

  useEffect(() => {
    if (running) return;
    setRemaining((mode === "focus" ? settings.focus : settings.break) * 60);
  }, [settings.focus, settings.break, mode, running]);

  useEffect(() => {
    if (!running) return;

    intervalRef.current = window.setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          const nextMode: Mode = mode === "focus" ? "break" : "focus";
          setMode(nextMode);
          setRunning(false);

          return (
            (nextMode === "focus"
              ? settings.focus
              : settings.break) * 60
          );
        }

        return r - 1;
      });
    }, 1000);

    return () => {
      if (intervalRef.current) {
        window.clearInterval(intervalRef.current);
      }
    };
  }, [running, mode, settings]);

  const total =
    (mode === "focus" ? settings.focus : settings.break) * 60;

  const progress = 1 - remaining / total;

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");

  const reset = () => {
    setRunning(false);
    setRemaining(total);
  };

  const switchMode = (m: Mode) => {
    setMode(m);
    setRunning(false);

    setRemaining(
      (m === "focus" ? settings.focus : settings.break) * 60
    );
  };

  const R = 130;
  const C = 2 * Math.PI * R;

  return (
    <div className="glass glass-mobile animate-fade-in relative flex h-full min-h-0 min-w-0 max-w-full flex-1 flex-col items-center justify-between overflow-hidden rounded-[2rem] p-4 sm:p-5">

      {/* MODE TABS */}
      <div className="flex w-full max-w-sm shrink-0 gap-1 rounded-full bg-foreground/5 p-1">
        <button
          onClick={() => switchMode("focus")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition min-h-[2.75rem]
            ${
              mode === "focus"
                ? "bg-primary text-primary-foreground shadow-[0_0_24px_-4px_var(--glow)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <Brain className="h-3.5 w-3.5" />
          Focus
        </button>

        <button
          onClick={() => switchMode("break")}
          className={`flex flex-1 items-center justify-center gap-1.5 rounded-full px-3 py-2 text-xs font-medium transition min-h-[2.75rem]
            ${
              mode === "break"
                ? "bg-primary text-primary-foreground shadow-[0_0_24px_-4px_var(--glow)]"
                : "text-muted-foreground hover:text-foreground"
            }`}
        >
          <Coffee className="h-3.5 w-3.5" />
          Break
        </button>
      </div>

      {/* TIMER */}
      <div className="relative my-3 flex w-full min-h-0 flex-1 items-center justify-center">
        <div
          className={`relative aspect-square h-[17rem] w-[17rem] sm:h-[21rem] sm:w-[21rem]
            ${running ? "animate-pulse-glow" : ""}`}
        >
          <svg
            viewBox="0 0 300 300"
            className="h-full w-full"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="var(--glow)" />
                <stop offset="100%" stopColor="var(--glow-2)" />
              </linearGradient>

              <filter
                id="ringGlow"
                x="-50%"
                y="-50%"
                width="200%"
                height="200%"
              >
                <feGaussianBlur stdDeviation="6" result="blur" />

                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            <circle
              cx="150"
              cy="150"
              r={R}
              stroke="currentColor"
              className="text-foreground/10"
              strokeWidth="10"
              fill="none"
            />

            <circle
              cx="150"
              cy="150"
              r={R}
              stroke="url(#ringGrad)"
              strokeWidth="10"
              strokeLinecap="round"
              fill="none"
              filter="url(#ringGlow)"
              strokeDasharray={C}
              strokeDashoffset={C * (1 - progress)}
              transform="rotate(-90 150 150)"
              style={{
                transition: "stroke-dashoffset 1s linear",
              }}
            />
          </svg>

          <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
            <div
              className="font-display text-[clamp(2rem,11vw,3.4rem)] font-semibold tabular-nums leading-none tracking-tight"
              style={{
                color:
                  "color-mix(in srgb, var(--primary) 78%, var(--foreground))",

                textShadow: `
                  0 0 8px color-mix(in srgb, var(--glow) 65%, transparent),
                 0 0 22px color-mix(in srgb, var(--glow) 30%, transparent)
                `,
              }}
            >
              {mm}:{ss}
            </div>

            <div className="mt-1 text-[10px] uppercase tracking-[0.22em] text-muted-foreground">
              {mode === "focus" ? "Deep Work" : "Recharge"}
            </div>
          </div>
        </div>
      </div>

      {/* CONTROLS */}
      <div className="mt-2 flex w-full max-w-sm flex-wrap items-center justify-center gap-2 sm:flex-nowrap sm:gap-3">

        {/* RESET */}
        <button
          onClick={reset}
          className="touch-target grid h-10 w-10 shrink-0 place-items-center rounded-full bg-foreground/5 transition hover:bg-foreground/10 sm:h-11 sm:w-11"
          aria-label="Reset"
        >
          <RotateCcw className="h-4 w-4" />
        </button>

        {/* PLAY / PAUSE */}
        <button
          onClick={() => setRunning((r) => !r)}
          className="touch-target grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_40px_-5px_var(--glow)] transition hover:scale-105 sm:h-14 sm:w-14"
          aria-label={running ? "Pause" : "Start"}
        >
          {running ? (
            <Pause className="h-5 w-5" />
          ) : (
            <Play className="ml-0.5 h-5 w-5" />
          )}
        </button>

        {/* SETTINGS */}
        <div className="flex min-h-[2.75rem] min-w-0 items-center gap-1 rounded-full bg-foreground/5 px-2.5 py-1.5 text-xs">

          <label className="px-0.5 text-muted-foreground">
            F
          </label>

          <input
            type="number"
            min={1}
            max={120}
            value={settings.focus}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                focus: Math.max(1, +e.target.value || 1),
              }))
            }
            className="w-9 bg-transparent text-center text-sm tabular-nums text-foreground outline-none"
          />

          <span className="text-muted-foreground">
            /
          </span>

          <label className="px-0.5 text-muted-foreground">
            B
          </label>

          <input
            type="number"
            min={1}
            max={60}
            value={settings.break}
            onChange={(e) =>
              setSettings((s) => ({
                ...s,
                break: Math.max(1, +e.target.value || 1),
              }))
            }
            className="w-9 bg-transparent text-center text-sm tabular-nums text-foreground outline-none"
          />
        </div>
      </div>
    </div>
  );
}