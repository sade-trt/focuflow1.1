import { useEffect, useState } from "react";

const QUOTES = [
  { q: "The secret of getting ahead is getting started.", a: "Mark Twain" },
  { q: "Discipline is choosing between what you want now and what you want most.", a: "Abraham Lincoln" },
  { q: "Success is the sum of small efforts repeated day in and day out.", a: "Robert Collier" },
  { q: "You don't have to be great to start, but you have to start to be great.", a: "Zig Ziglar" },
  { q: "Focus on being productive instead of busy.", a: "Tim Ferriss" },
  { q: "Small steps every day.", a: "Unknown" },
  { q: "Deep work is the superpower of the 21st century.", a: "Cal Newport" },
];

export function QuoteWidget() {
  const [i, setI] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const t = setInterval(() => {
      setShow(false);
      setTimeout(() => {
        setI((x) => (x + 1) % QUOTES.length);
        setShow(true);
      }, 400);
    }, 9000);
    return () => clearInterval(t);
  }, []);

  const cur = QUOTES[i];
  return (
    <div className="glass glass-mobile animate-fade-in min-w-0 max-w-full rounded-3xl p-4 text-center max-lg:p-5">
      <div
        className={`transition-opacity duration-500 ${show ? "opacity-100" : "opacity-0"}`}
      >
        <p className="break-words font-display text-sm italic leading-relaxed text-foreground/90">
          &ldquo;{cur.q}&rdquo;
        </p>
        <p className="mt-2 text-[11px] uppercase tracking-[0.2em] text-muted-foreground">— {cur.a}</p>
      </div>
    </div>
  );
}
