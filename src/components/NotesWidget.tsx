import { useEffect, useState } from "react";
import { StickyNote } from "lucide-react";
import { loadLS, saveLS } from "@/lib/storage";

export function NotesWidget() {
  const [text, setText] = useState("");
  useEffect(() => setText(loadLS("focus.notes", "Quick thoughts go here…\n\n- Review derivatives\n- Email professor")), []);
  useEffect(() => {
    const t = setTimeout(() => saveLS("focus.notes", text), 300);
    return () => clearTimeout(t);
  }, [text]);

  return (
    <div className="glass glass-mobile animate-fade-in min-w-0 max-w-full rounded-3xl p-4 max-lg:p-5">
      <div className="mb-2 flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        <StickyNote className="h-3.5 w-3.5" />
        Quick Notes
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="thin-scroll h-28 w-full resize-none rounded-2xl bg-foreground/5 p-3 text-sm leading-relaxed outline-none ring-1 ring-transparent transition focus:ring-primary sm:h-20 sm:p-2.5"
        placeholder="Write a quick note…"
      />
    </div>
  );
}
