export function AmbientBackground() {
  return (
    <div className="fixed inset-0 -z-50 overflow-hidden">

      <div className="absolute inset-0 bg-[linear-gradient(135deg,#0f172a_0%,#111827_100%)]" />

      <div className="absolute inset-0 bg-black/20" />

      <div
        className="absolute -top-40 -left-40 h-[40rem] w-[40rem] rounded-full opacity-30 blur-3xl animate-blob"
        style={{
          background:
            "radial-gradient(circle, var(--glow) 0%, transparent 70%)",
        }}
      />

      <div
        className="absolute -bottom-40 -right-40 h-[45rem] w-[45rem] rounded-full opacity-20 blur-3xl animate-blob"
        style={{
          background:
            "radial-gradient(circle, var(--glow-2) 0%, transparent 70%)",
          animationDelay: "-8s",
        }}
      />
    </div>
  );
}