import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { fetchGoogleCalendarEvents } from "@/lib/google-calendar";

type EventItem = {
  id: string;
  title: string;
  date: Date;
  source?: "manual" | "google";
};

const DAY_NAMES = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

const MANUAL_EVENTS_KEY = "manual-calendar-events";

export function CalendarWidget() {
  const [offset, setOffset] = useState(0);
  const [selectedDay, setSelectedDay] = useState(0);

  const [googleEvents, setGoogleEvents] = useState<EventItem[]>([]);
  const [manualEvents, setManualEvents] = useState<EventItem[]>([]);

  const [showAdd, setShowAdd] = useState(false);

  const [newTitle, setNewTitle] = useState("");
  const [newTime, setNewTime] = useState("12:00");

  /* LOAD GOOGLE EVENTS */
  useEffect(() => {
    const url = localStorage.getItem("google-calendar-url");

    if (!url) return;

    fetchGoogleCalendarEvents(url).then((events) => {
      const mapped = events.map((e: any, i: number) => ({
        id: `google-${i}`,
        title: e.title,
        date: new Date(e.date),
        source: "google" as const,
      }));

      setGoogleEvents(mapped);
    });
  }, []);

  /* LOAD MANUAL EVENTS */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(MANUAL_EVENTS_KEY);

      if (!raw) return;

      const parsed = JSON.parse(raw);

      setManualEvents(
        parsed.map((e: any) => ({
          ...e,
          date: new Date(e.date),
        }))
      );
    } catch (err) {
      console.error(err);
    }
  }, []);

  /* SAVE MANUAL EVENTS */
  useEffect(() => {
    localStorage.setItem(
      MANUAL_EVENTS_KEY,
      JSON.stringify(manualEvents)
    );
  }, [manualEvents]);

  const today = new Date();

  const startOfWeek = useMemo(() => {
    const d = new Date(today);

    const day = d.getDay();

    const mondayOffset = day === 0 ? -6 : 1 - day;

    d.setDate(d.getDate() + mondayOffset + offset * 7);

    d.setHours(0, 0, 0, 0);

    return d;
  }, [offset]);

  const days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date(startOfWeek);

    d.setDate(startOfWeek.getDate() + i);

    return d;
  });

  useEffect(() => {
    const currentDay = today.getDay();

    setSelectedDay(currentDay === 0 ? 6 : currentDay - 1);
  }, []);

  const selectedDate = days[selectedDay];

  const allEvents = [...googleEvents, ...manualEvents];

  const events = allEvents.filter((event) => {
    const d = new Date(event.date);

    return (
      d.getFullYear() === selectedDate.getFullYear() &&
      d.getMonth() === selectedDate.getMonth() &&
      d.getDate() === selectedDate.getDate()
    );
  });

  function addManualEvent() {
    if (!newTitle.trim()) return;

    const [hours, minutes] = newTime.split(":").map(Number);

    const date = new Date(selectedDate);

    date.setHours(hours);
    date.setMinutes(minutes);

    const event: EventItem = {
      id: crypto.randomUUID(),
      title: newTitle,
      date,
      source: "manual",
    };

    setManualEvents((prev) => [...prev, event]);

    setNewTitle("");
    setNewTime("12:00");

    setShowAdd(false);
  }

  function deleteManualEvent(id: string) {
    setManualEvents((prev) =>
      prev.filter((e) => e.id !== id)
    );
  }

  return (
    <div className="thin-scroll flex h-full flex-col overflow-y-auto rounded-3xl border border-border/60 bg-background/95 p-5 shadow-2xl backdrop-blur-xl">

      {/* HEADER */}
      <div className="mb-3 flex items-center justify-between">
        <div>
          <div className="text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Schedule
          </div>

          <div className="mt-1 font-display text-lg font-semibold">
            {offset === 0
              ? "This Week"
              : offset > 0
              ? `${offset} Week${offset > 1 ? "s" : ""} Ahead`
              : `${Math.abs(offset)} Week${
                  Math.abs(offset) > 1 ? "s" : ""
                } Ago`}
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setShowAdd(true)}
            className="grid h-8 w-8 place-items-center rounded-full bg-primary text-primary-foreground shadow-[0_0_20px_-4px_var(--glow)] transition hover:scale-105"
          >
            <Plus className="h-4 w-4" />
          </button>

          <button
            onClick={() => setOffset((o) => o - 1)}
            className="grid h-8 w-8 place-items-center rounded-full bg-foreground/5 transition hover:bg-foreground/10"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>

          <button
            onClick={() => setOffset((o) => o + 1)}
            className="grid h-8 w-8 place-items-center rounded-full bg-foreground/5 transition hover:bg-foreground/10"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* DAYS */}
      <div className="grid grid-cols-7 gap-1.5">
        {days.map((date, i) => {
          const active = selectedDay === i;

          const isToday =
            today.toDateString() === date.toDateString();

          return (
            <button
              key={i}
              onClick={() => setSelectedDay(i)}
              className={`flex flex-col items-center rounded-2xl px-1 py-2 transition ${
                active
                  ? "bg-primary text-primary-foreground shadow-[0_0_20px_-4px_var(--glow)]"
                  : "bg-foreground/[0.04] hover:bg-foreground/[0.07]"
              }`}
            >
              <span
                className={`text-[10px] uppercase tracking-[0.14em] ${
                  active
                    ? "text-primary-foreground/80"
                    : "text-muted-foreground"
                }`}
              >
                {DAY_NAMES[i]}
              </span>

              <span className="mt-1 text-sm font-semibold tabular-nums">
                {date.getDate()}
              </span>

              {isToday && (
                <span className="mt-1 h-1 w-1 rounded-full bg-current opacity-80" />
              )}
            </button>
          );
        })}
      </div>

      {/* EVENTS */}
      <div className="mt-4 flex-1 overflow-y-auto">
        {events.length === 0 ? (
          <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-border/50 text-sm text-muted-foreground">
            No events
          </div>
        ) : (
          <div className="space-y-2">
            {events
              .sort(
                (a, b) =>
                  a.date.getTime() - b.date.getTime()
              )
              .map((event) => (
                <div
                  key={event.id}
                  className="group rounded-2xl bg-foreground/[0.04] px-4 py-3 transition hover:bg-foreground/[0.06]"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-sm font-medium">
                        {event.title}
                      </div>

                      <div className="mt-1 text-xs text-muted-foreground">
                        {event.date.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </div>
                    </div>

                    {event.source === "manual" && (
                      <button
                        onClick={() =>
                          deleteManualEvent(event.id)
                        }
                        className="opacity-0 transition group-hover:opacity-100"
                      >
                        <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
                      </button>
                    )}
                  </div>
                </div>
              ))}
          </div>
        )}
      </div>

      {/* ADD EVENT MODAL */}
      {showAdd && (
        <div className="absolute inset-0 z-30 flex items-center justify-center rounded-[2rem] bg-black/40 backdrop-blur-sm">
          <div className="w-[90%] max-w-sm rounded-3xl border border-border/50 bg-background p-5 shadow-[0_20px_60px_-20px_rgba(0,0,0,0.45)]">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="font-display text-lg font-semibold">
                Add Event
              </h3>

              <button
                onClick={() => setShowAdd(false)}
                className="grid h-8 w-8 place-items-center rounded-full bg-foreground/5"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-3">
              <input
                value={newTitle}
                onChange={(e) =>
                  setNewTitle(e.target.value)
                }
                placeholder="Event title"
                className="w-full rounded-2xl bg-foreground/5 px-4 py-3 text-sm outline-none"
              />

              <input
                type="time"
                value={newTime}
                onChange={(e) =>
                  setNewTime(e.target.value)
                }
                className="w-full rounded-2xl bg-foreground/5 px-4 py-3 text-sm outline-none"
              />

              <button
                onClick={addManualEvent}
                className="w-full rounded-2xl bg-primary py-3 text-sm font-medium text-primary-foreground shadow-[0_0_24px_-6px_var(--glow)] transition hover:scale-[1.02]"
              >
                Add Event
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}