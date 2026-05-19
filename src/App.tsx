import { useState } from "react";

import "./styles.css";

import { ThemeProvider } from "./hooks/use-theme";
import { AppearanceProvider } from "./hooks/use-appearance";
import { BackgroundProvider } from "./hooks/use-background";

import { TopBar } from "./components/TopBar";
import { SettingsPanel } from "./components/SettingsPanel";

import { AmbientBackground } from "./components/AmbientBackground";
import { CalendarWidget } from "./components/CalendarWidget";
import { DeadlinesWidget } from "./components/DeadlinesWidget";
import { FocusToday } from "./components/FocusToday";
import { QuoteWidget } from "./components/QuoteWidget";
import { FocusTimer } from "./components/FocusTimer";
import { WeatherWidget } from "./components/WeatherWidget";
import { NotesWidget } from "./components/NotesWidget";
import { TodoWidget } from "./components/TodoWidget";
import { AmbienceControl } from "./components/AmbienceControl";

export default function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <ThemeProvider>
      <AppearanceProvider>
        <BackgroundProvider>
          <div className="relative min-h-screen overflow-x-hidden px-3 py-3">
            <AmbientBackground />

            {/* TopBar handles AuthDialog + ProfilePanel */}
            <TopBar />

            {/* Main Grid */}
            <main className="mx-auto mt-3 grid min-h-[calc(100vh-120px)] max-w-[1600px] grid-cols-1 gap-3 lg:grid-cols-12">

              {/* LEFT */}
              <section className="lg:col-span-3 flex min-h-0 flex-col gap-3">
                <div className="max-h-[50vh] overflow-y-auto">
                  <CalendarWidget />
                </div>
                <div className="flex-1 overflow-hidden">
                  <DeadlinesWidget />
                </div>
              </section>

              {/* CENTER */}
              <section className="lg:col-span-6 flex min-h-0 flex-col gap-3">
                <FocusToday />
                <QuoteWidget />
                <div className="flex flex-1">
                  <FocusTimer />
                </div>
              </section>

              {/* RIGHT */}
              <section className="lg:col-span-3 flex min-h-0 flex-col gap-3">
                <WeatherWidget />
                <div className="flex-1 overflow-hidden">
                  <TodoWidget />
                </div>
                <NotesWidget />
              </section>

            </main>

            {/* Settings panel */}
            <SettingsPanel open={settingsOpen} onClose={() => setSettingsOpen(false)} />

            {/* Ambience controls */}
            <AmbienceControl />
          </div>
        </BackgroundProvider>
      </AppearanceProvider>
    </ThemeProvider>
  );
}