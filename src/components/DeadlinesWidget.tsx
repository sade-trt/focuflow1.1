import { useEffect, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { loadLS, saveLS } from "@/lib/storage";

type Priority = "high" | "med" | "low";

type Deadline = {
  id: string;
  title: string;
  date: string;
  priority: Priority;
};

const DEFAULTS: Deadline[] = []

const PR_COLOR: Record<Priority, string> = {
  high: "var(--destructive)",
  med: "var(--glow)",
  low: "var(--glow-2)",
};

const PR_LABEL: Record<Priority, string> = {
  high: "High",
  med: "Medium",
  low: "Low",
};

const priorityOrder: Record<Priority, number> = {
  high: 0,
  med: 1,
  low: 2,
};

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(date: string) {
  const d = new Date(date);

  return `${MONTHS[d.getMonth()]} ${d.getDate()}`;
}

function daysUntil(date: string) {
  const ms = new Date(date).getTime() - Date.now();

  return Math.max(0, Math.ceil(ms / 86400000));
}

export function DeadlinesWidget() {
  const [items, setItems] = useState<Deadline[]>(DEFAULTS);

  const [adding, setAdding] = useState(false);

  const [draft, setDraft] = useState({
    title: "",
    date: "",
    priority: "med" as Priority,
  });

  useEffect(() => {
    setItems(loadLS("focus.deadlines", DEFAULTS));
  }, []);

  useEffect(() => {
    saveLS("focus.deadlines", items);
  }, [items]);

  const add = () => {
    if (!draft.title || !draft.date) return;

    setItems((it) => [
      ...it,
      {
        id: crypto.randomUUID(),
        ...draft,
      },
    ]);

    setDraft({
      title: "",
      date: "",
      priority: "med",
    });

    setAdding(false);
  };

  // SORT:
  // 1. High → Med → Low
  // 2. Closest date first
  const sorted = [...items].sort((a, b) => {
    const priorityDiff =
      priorityOrder[a.priority] - priorityOrder[b.priority];

    if (priorityDiff !== 0) {
      return priorityDiff;
    }

    return +new Date(a.date) - +new Date(b.date);
  });

  return (
    <div className="glass glass-mobile animate-fade-in flex h-full min-h-0 w-full flex-1 flex-col rounded-3xl p-4 max-lg:p-5">
      {/* HEADER */}
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">
            Upcoming
          </h3>

          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
            Exams &amp; Deadlines
          </p>
        </div>

        <button
          onClick={() => setAdding((a) => !a)}
          className="touch-target grid h-10 w-10 place-items-center rounded-full bg-foreground/5 transition hover:bg-foreground/10 sm:h-8 sm:w-8"
          aria-label="Add deadline"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      {/* ADD FORM */}
      {adding && (
        <div className="mb-3 space-y-2 rounded-2xl bg-foreground/5 p-3">
          <input
            value={draft.title}
            onChange={(e) =>
              setDraft({
                ...draft,
                title: e.target.value,
              })
            }
            placeholder="Title"
            className="w-full rounded-xl bg-foreground/5 px-3 py-1.5 text-sm text-foreground outline-none ring-1 ring-border focus:ring-primary"
          />

          <div className="flex gap-2">
            <input
              type="date"
              value={draft.date}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  date: e.target.value,
                })
              }
              className="flex-1 rounded-xl bg-foreground/5 px-3 py-1.5 text-sm text-foreground outline-none ring-1 ring-border focus:ring-primary"
            />

            <select
              value={draft.priority}
              onChange={(e) =>
                setDraft({
                  ...draft,
                  priority: e.target.value as Priority,
                })
              }
              className="rounded-xl bg-foreground/5 px-2 py-1.5 text-sm text-foreground outline-none ring-1 ring-border"
            >
              <option value="high">High</option>
              <option value="med">Med</option>
              <option value="low">Low</option>
            </select>
          </div>

          <button
            onClick={add}
            className="w-full rounded-xl bg-primary py-1.5 text-sm font-medium text-primary-foreground transition hover:opacity-90"
          >
            Add
          </button>
        </div>
      )}

      {/* LIST */}
      <div className="thin-scroll scroll-touch -mr-2 flex-1 space-y-2 overflow-y-auto pr-2">
        {sorted.map((d) => {
          const days = daysUntil(d.date);

          return (
            <div
              key={d.id}
              className="group relative overflow-hidden rounded-2xl bg-foreground/5 p-3 transition hover:bg-foreground/10 max-lg:py-3.5"
            >
              {/* PRIORITY BAR */}
              <span
                className="absolute left-0 top-0 h-full w-1"
                style={{
                  background: PR_COLOR[d.priority],
                  boxShadow: `0 0 12px ${PR_COLOR[d.priority]}`,
                }}
              />

              <div className="flex items-start justify-between gap-2 pl-2">
                {/* LEFT */}
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium">
                    {d.title}
                  </div>

                  <div className="mt-0.5 flex items-center gap-2 text-[11px] text-muted-foreground">
                    <span>{formatDate(d.date)}</span>

                    <span>•</span>

                    <span>{PR_LABEL[d.priority]}</span>
                  </div>
                </div>

                {/* RIGHT */}
                <div className="flex items-center gap-2">
                  <span
                    className="rounded-full px-2 py-0.5 text-[10px] font-semibold tabular-nums"
                    style={{
                      background: `color-mix(in oklab, ${PR_COLOR[d.priority]} 18%, transparent)`,
                      color: PR_COLOR[d.priority],
                    }}
                  >
                    {days}d
                  </span>

                  <button
                    onClick={() =>
                      setItems((it) =>
                        it.filter((x) => x.id !== d.id)
                      )
                    }
                    className="touch-target opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100"
                    aria-label="Delete"
                  >
                    <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}