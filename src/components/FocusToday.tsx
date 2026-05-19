import { useEffect, useState } from "react";
import { Pencil, Target } from "lucide-react";
import { loadLS, saveLS } from "@/lib/storage";

export function FocusToday() {
  const [text, setText] = useState("Finish Chapter 4 — Differential Equations");
  const [editing, setEditing] = useState(false);

  useEffect(() => setText(loadLS("focus.today", text)), []);
  useEffect(() => saveLS("focus.today", text), [text]);

  return (
    <div className="glass glass-mobile animate-fade-in min-w-0 max-w-full rounded-3xl p-4 max-lg:p-5">
      <div className="mb-2 flex items-center justify-between">
        <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
          <Target className="h-3.5 w-3.5" />
          Today&apos;s Focus
        </div>
        <button
          onClick={() => setEditing((e) => !e)}
          className="touch-target grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground sm:h-7 sm:w-7"
        >
          <Pencil className="h-3.5 w-3.5" />
        </button>
      </div>
      {editing ? (
        <input
          autoFocus
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={() => setEditing(false)}
          onKeyDown={(e) => e.key === "Enter" && setEditing(false)}
          className="w-full rounded-xl bg-foreground/5 px-3 py-2 font-display text-lg text-foreground outline-none ring-1 ring-primary"
        />
      ) : (
        <p className="break-words font-display text-base leading-snug text-foreground sm:text-lg">{text}</p>
      )}
    </div>
  );
}
