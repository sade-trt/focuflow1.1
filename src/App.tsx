import { useState } from "react";

import "./styles.css";

import { ThemeProvider } from "./hooks/use-theme";
import { AppearanceProvider } from "./hooks/use-appearance";
import { BackgroundProvider } from "./hooks/use-background";

import { AmbientBackground } from "./components/AmbientBackground";
import { TopBar } from "./components/TopBar";

import { CalendarWidget } from "./components/CalendarWidget";
import { DeadlinesWidget } from "./components/DeadlinesWidget";

import { FocusToday } from "./components/FocusToday";
import { QuoteWidget } from "./components/QuoteWidget";
import { FocusTimer } from "./components/FocusTimer";

import { WeatherWidget } from "./components/WeatherWidget";
import { NotesWidget } from "./components/NotesWidget";
import { TodoWidget } from "./components/TodoWidget";

import { AmbienceControl } from "./components/AmbienceControl";

import { SettingsPanel } from "./components/SettingsPanel";

function Dashboard() {
  const [settingsOpen, setSettingsOpen] =
    useState(false);

  const [profileOpen, setProfileOpen] =
    useState(false);

  return (
    <div className="relative min-h-screen overflow-hidden px-3 py-3">

      <AmbientBackground />

      {/* TOP BAR */}
      <TopBar
        onOpenSettings={() =>
          setSettingsOpen(true)
        }
        onOpenProfile={() =>
          setProfileOpen(true)
        }
      />

      {/* MAIN GRID */}
      <main className="mx-auto mt-3 grid h-[calc(100vh-96px)] max-w-[1600px] grid-cols-1 gap-3 overflow-hidden lg:grid-cols-12">

        {/* LEFT COLUMN */}
        <section className="lg:col-span-3 flex h-full min-h-0 flex-col gap-3 overflow-hidden">

          <div className="h-[45%] overflow-y-auto">
            <CalendarWidget />
          </div>

          <div className="flex-1 overflow-y-auto">
            <DeadlinesWidget />
          </div>

        </section>

        {/* CENTER COLUMN */}
        <section className="lg:col-span-6 flex h-full min-h-0 flex-col gap-3 overflow-hidden">

          <div className="overflow-hidden rounded-3xl">
            <FocusToday />
          </div>

          <div className="overflow-hidden rounded-3xl">
            <QuoteWidget />
          </div>

          <div className="flex flex-1 overflow-hidden">
            <FocusTimer />
          </div>

        </section>

        {/* RIGHT COLUMN */}
        <section className="lg:col-span-3 flex h-full min-h-0 flex-col gap-3 overflow-hidden">

          <div className="overflow-hidden rounded-3xl">
            <WeatherWidget />
          </div>

          <div className="overflow-hidden rounded-3xl">
            <NotesWidget />
          </div>

          <div className="flex min-h-[520px] flex-1 overflow-visible rounded-3xl">
            <div className="flex-1 overflow-y-auto">
              <TodoWidget />
            </div>
          </div>

        </section>

      </main>

      {/* SETTINGS PANEL */}
      <SettingsPanel
        open={settingsOpen}
        onClose={() =>
          setSettingsOpen(false)
        }
      />

      {/* AMBIENCE */}
      <AmbienceControl />

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppearanceProvider>
        <BackgroundProvider>
          <Dashboard />
        </BackgroundProvider>
      </AppearanceProvider>
    </ThemeProvider>
  );
}