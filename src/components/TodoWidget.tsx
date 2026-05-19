import { useEffect, useState } from "react";
import { Check, Plus, Trash2 } from "lucide-react";
import { loadLS, saveLS } from "@/lib/storage";

type Priority = "high" | "med" | "low";
type Todo = { id: string; text: string; done: boolean; priority: Priority };

const DEFAULTS: Todo[] = [
  { id: "1", text: "Read chapter 4", done: false, priority: "high" },
  { id: "2", text: "Complete problem set", done: false, priority: "med" },
  { id: "3", text: "Reply to study group", done: true, priority: "low" },
];

const PR: Record<Priority, string> = {
  high: "var(--destructive)",
  med: "var(--glow)",
  low: "var(--glow-2)",
};

export function TodoWidget() {
  const [items, setItems] = useState<Todo[]>(DEFAULTS);
  const [draft, setDraft] = useState("");
  const [pr, setPr] = useState<Priority>("med");

  useEffect(() => setItems(loadLS("focus.todos", DEFAULTS)), []);
  useEffect(() => saveLS("focus.todos", items), [items]);

  const add = () => {
    if (!draft.trim()) return;
    setItems((it) => [...it, { id: crypto.randomUUID(), text: draft.trim(), done: false, priority: pr }]);
    setDraft("");
  };

  return (
    <div className="glass glass-mobile animate-fade-in flex h-full min-w-0 max-w-full flex-col rounded-3xl p-4 max-lg:p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h3 className="font-display text-base font-semibold">To-Do</h3>
          <p className="text-[11px] uppercase tracking-[0.18em] text-muted-foreground">Reminders</p>
        </div>
        <span className="rounded-full bg-foreground/5 px-2.5 py-1 text-[11px] font-medium tabular-nums text-muted-foreground">
          {items.filter((i) => !i.done).length} left
        </span>
      </div>

      <div className="mb-3 flex min-h-[2.75rem] items-center gap-2 rounded-2xl bg-foreground/5 p-2 sm:min-h-0 sm:p-1.5">
        <select
          value={pr}
          onChange={(e) => setPr(e.target.value as Priority)}
          className="min-h-[2.25rem] rounded-xl bg-foreground/5 px-2 text-xs text-foreground outline-none sm:min-h-0 sm:bg-transparent sm:px-1"
          aria-label="Priority"
        >
          <option value="high">High</option>
          <option value="med">Med</option>
          <option value="low">Low</option>
        </select>
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && add()}
          placeholder="Add task…"
          className="min-h-[2.25rem] flex-1 bg-transparent py-1 text-sm text-foreground outline-none sm:min-h-0 sm:py-0"
        />
        <button
          onClick={add}
          className="touch-target grid h-10 w-10 shrink-0 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105 sm:h-7 sm:w-7"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="thin-scroll scroll-touch -mr-2 flex-1 space-y-1.5 overflow-y-auto pr-2">
        {items.map((t) => (
          <div
            key={t.id}
            className="group flex items-center gap-3 rounded-2xl bg-foreground/5 px-3 py-2.5 transition hover:bg-foreground/10 max-lg:py-3"
          >
            <button
              onClick={() => setItems((it) => it.map((x) => (x.id === t.id ? { ...x, done: !x.done } : x)))}
              className={`touch-target grid h-7 w-7 shrink-0 place-items-center rounded-full border-2 transition sm:h-5 sm:w-5 ${
                t.done ? "border-primary bg-primary" : "border-foreground/30 hover:border-primary"
              }`}
            >
              {t.done && <Check className="h-3 w-3 text-primary-foreground" />}
            </button>
            <span
              className="h-2 w-2 shrink-0 rounded-full"
              style={{ background: PR[t.priority], boxShadow: `0 0 8px ${PR[t.priority]}` }}
            />
            <span className={`flex-1 truncate text-sm transition ${t.done ? "text-muted-foreground line-through" : ""}`}>
              {t.text}
            </span>
            <button
              onClick={() => setItems((it) => it.filter((x) => x.id !== t.id))}
              className="touch-target opacity-100 transition lg:opacity-0 lg:group-hover:opacity-100"
              aria-label="Delete"
            >
              <Trash2 className="h-3.5 w-3.5 text-muted-foreground hover:text-destructive" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
