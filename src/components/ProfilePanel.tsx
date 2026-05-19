import { useEffect, useState } from "react";
import { Flame, LogOut, Pencil, Settings as SettingsIcon, Timer, Check, X } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { toast } from "sonner";

export function ProfilePanel({
  open,
  onClose,
  onOpenSettings,
}: {
  open: boolean;
  onClose: () => void;
  onOpenSettings: () => void;
}) {
  const { profile, user, signOut, updateProfile } = useAuth();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState({ username: "", school: "", major: "" });

  useEffect(() => {
    if (profile) {
      setDraft({
        username: profile.username ?? "",
        school: profile.school ?? "",
        major: profile.major ?? "",
      });
    }
  }, [profile, open]);

  if (!open) return null;

  const initials =
    (profile?.username || user?.email || "?")
      .split(/[\s@.]/)
      .filter(Boolean)
      .slice(0, 2)
      .map((s) => s[0]?.toUpperCase())
      .join("") || "?";

  const save = async () => {
    const res = await updateProfile(draft);
    if (res.error) toast.error(res.error);
    else {
      toast.success("Profile updated");
      setEditing(false);
    }
  };

  const stats = [
    { icon: Flame, label: "Streak", value: `${profile?.study_streak ?? 0}d` },
    { icon: Timer, label: "Sessions", value: profile?.total_sessions ?? 0 },
    { icon: Timer, label: "Hours", value: profile?.total_hours ?? 0 },
  ];

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

        {/* Avatar + identity */}
        <div className="flex flex-col items-center text-center">
          <div
            className="grid h-20 w-20 place-items-center rounded-full bg-gradient-to-br from-[var(--glow)] to-[var(--glow-2)] font-display text-2xl font-semibold text-primary-foreground shadow-[0_0_40px_-5px_var(--glow)]"
          >
            {profile?.avatar_url ? (
              <img src={profile.avatar_url} alt="" className="h-full w-full rounded-full object-cover" />
            ) : (
              initials
            )}
          </div>
          {!editing ? (
            <>
              <h2 className="mt-3 font-display text-lg font-semibold">
                {profile?.username || user?.email?.split("@")[0]}
              </h2>
              <p className="text-xs text-muted-foreground">{user?.email}</p>
              {(profile?.school || profile?.major) && (
                <p className="mt-1 text-xs text-muted-foreground">
                  {[profile?.major, profile?.school].filter(Boolean).join(" • ")}
                </p>
              )}
            </>
          ) : (
            <div className="mt-3 w-full space-y-2">
              <input
                value={draft.username}
                onChange={(e) => setDraft({ ...draft, username: e.target.value })}
                placeholder="Username"
                className="w-full rounded-2xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-primary"
              />
              <input
                value={draft.school}
                onChange={(e) => setDraft({ ...draft, school: e.target.value })}
                placeholder="School / University"
                className="w-full rounded-2xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-primary"
              />
              <input
                value={draft.major}
                onChange={(e) => setDraft({ ...draft, major: e.target.value })}
                placeholder="Major / Field of study"
                className="w-full rounded-2xl bg-foreground/5 px-3 py-2 text-sm outline-none ring-1 ring-transparent focus:ring-primary"
              />
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="mt-5 grid grid-cols-3 gap-2">
          {stats.map(({ icon: Icon, label, value }) => (
            <div key={label} className="rounded-2xl bg-foreground/5 p-3 text-center">
              <Icon className="mx-auto h-3.5 w-3.5 text-muted-foreground" />
              <div className="mt-1 font-display text-base font-semibold tabular-nums">{value}</div>
              <div className="text-[10px] uppercase tracking-[0.18em] text-muted-foreground">{label}</div>
            </div>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-5 flex flex-col gap-2">
          {editing ? (
            <button
              onClick={save}
              className="flex items-center justify-center gap-2 rounded-2xl bg-primary py-2.5 text-sm font-semibold text-primary-foreground shadow-[0_0_30px_-8px_var(--glow)] transition hover:scale-[1.01]"
            >
              <Check className="h-4 w-4" />
              Save changes
            </button>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center justify-center gap-2 rounded-2xl bg-foreground/5 py-2.5 text-sm font-medium text-foreground transition hover:bg-foreground/10"
            >
              <Pencil className="h-4 w-4" />
              Edit profile
            </button>
          )}

          <button
            onClick={() => {
              onClose();
              onOpenSettings();
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-foreground/5 py-2.5 text-sm font-medium text-foreground transition hover:bg-foreground/10"
          >
            <SettingsIcon className="h-4 w-4" />
            Open settings
          </button>

          <button
            onClick={async () => {
              await signOut();
              toast.success("Signed out");
              onClose();
            }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-destructive/10 py-2.5 text-sm font-medium text-destructive transition hover:bg-destructive/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </div>
  );
}
