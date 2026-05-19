import { useState } from "react";
import { X, Sparkles } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

type Mode = "signin" | "signup";

export function AuthDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const { signIn, signUp } = useAuth();
  const [mode, setMode] = useState<Mode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [busy, setBusy] = useState(false);

  if (!open) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusy(true);
    const res =
      mode === "signin"
        ? await signIn(email, password)
        : await signUp(email, password, username || undefined);
    setBusy(false);
    if (res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(mode === "signin" ? "Welcome back" : "Account created");
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-background/40 p-4 backdrop-blur-md animate-fade-in" onClick={onClose}>
      <div
        className="glass-strong relative w-full max-w-md rounded-3xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full text-muted-foreground transition hover:bg-foreground/10 hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="mb-5 flex flex-col items-center text-center">
          <div className="mb-3 grid h-12 w-12 place-items-center rounded-2xl bg-primary/15 text-primary shadow-[0_0_30px_-5px_var(--glow)]">
            <Sparkles className="h-5 w-5" />
          </div>
          <h2 className="font-display text-xl font-semibold">
            {mode === "signin" ? "Welcome back" : "Create your space"}
          </h2>
          <p className="mt-1 text-xs text-muted-foreground">
            {mode === "signin" ? "Sign in to sync your dashboard." : "Save your focus across devices."}
          </p>
        </div>

        <form onSubmit={submit} className="space-y-2.5">
          {mode === "signup" && (
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Username (optional)"
              className="w-full rounded-2xl bg-foreground/5 px-4 py-2.5 text-sm outline-none ring-1 ring-transparent transition focus:ring-primary"
            />
          )}
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            autoComplete="email"
            className="w-full rounded-2xl bg-foreground/5 px-4 py-2.5 text-sm outline-none ring-1 ring-transparent transition focus:ring-primary"
          />
          <input
            type="password"
            required
            minLength={6}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            autoComplete={mode === "signin" ? "current-password" : "new-password"}
            className="w-full rounded-2xl bg-foreground/5 px-4 py-2.5 text-sm outline-none ring-1 ring-transparent transition focus:ring-primary"
          />
          <button
            disabled={busy}
            type="submit"
            className="mt-2 w-full rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-8px_var(--glow)] transition hover:scale-[1.01] disabled:opacity-60"
          >
            {busy ? "…" : mode === "signin" ? "Sign in" : "Create account"}
          </button>
        </form>

        <button
          onClick={() => setMode((m) => (m === "signin" ? "signup" : "signin"))}
          className="mt-4 w-full text-center text-xs text-muted-foreground transition hover:text-foreground"
        >
          {mode === "signin" ? "New here? Create an account" : "Already have an account? Sign in"}
        </button>
      </div>
    </div>
  );
}
