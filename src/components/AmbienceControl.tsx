import { useCallback, useEffect, useRef, useState } from "react";
import { Headphones, Loader2, Pause, Play, Volume2, X } from "lucide-react";
import { toast } from "sonner";
import {
  AMBIENCE_LS,
  AMBIENCE_SOUNDS,
  type AmbienceSound,
} from "@/lib/ambience-sounds";
import { loadLS, saveLS } from "@/lib/storage";

const FADE_STEP = 0.04;

export function AmbienceControl() {
  const [open, setOpen] = useState(false);
  const [current, setCurrent] = useState<string | null>(null);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeRef = useRef<number | null>(null);
  const sessionRef = useRef(0);
  const volumeRef = useRef(0.5);
  const playingRef = useRef(false);
  const currentRef = useRef<string | null>(null);
  const restoredRef = useRef(false);

  const cancelFade = useCallback(() => {
    if (fadeRef.current !== null) {
      cancelAnimationFrame(fadeRef.current);
      fadeRef.current = null;
    }
  }, []);

  const disposeAudio = useCallback(() => {
    cancelFade();
    const a = audioRef.current;
    if (!a) return;
    a.pause();
    a.removeAttribute("src");
    a.load();
    audioRef.current = null;
  }, [cancelFade]);

  const fadeTo = useCallback(
    (target: number, done?: () => void) => {
      cancelFade();
      const a = audioRef.current;
      if (!a) {
        done?.();
        return;
      }

      const step = () => {
        const active = audioRef.current;
        if (!active) {
          fadeRef.current = null;
          done?.();
          return;
        }
        const cur = active.volume;
        const diff = target - cur;
        if (Math.abs(diff) < 0.02) {
          active.volume = target;
          fadeRef.current = null;
          done?.();
          return;
        }
        active.volume = Math.max(0, Math.min(1, cur + Math.sign(diff) * FADE_STEP));
        fadeRef.current = requestAnimationFrame(step);
      };

      step();
    },
    [cancelFade],
  );

  const persist = useCallback(() => {
    saveLS(AMBIENCE_LS.volume, volumeRef.current);
    saveLS(AMBIENCE_LS.soundId, currentRef.current);
    saveLS(AMBIENCE_LS.playing, playingRef.current);
  }, []);

  const startSound = useCallback(
    (sound: AmbienceSound, session: number, autoplay: boolean) => {
      disposeAudio();

      const a = new Audio(sound.file);
      a.loop = true;
      a.preload = "auto";
      a.volume = 0;
      audioRef.current = a;

      setLoadingId(sound.id);

      let settled = false;

      const fail = (message: string) => {
        if (settled || session !== sessionRef.current) return;
        settled = true;
        setLoadingId(null);
        disposeAudio();
        setPlaying(false);
        playingRef.current = false;
        toast.error(message);
        persist();
      };

      const ready = async () => {
        if (settled || session !== sessionRef.current) return;
        settled = true;
        setLoadingId(null);
        currentRef.current = sound.id;
        setCurrent(sound.id);

        if (!autoplay) {
          a.volume = 0;
          setPlaying(false);
          playingRef.current = false;
          persist();
          return;
        }

        try {
          await a.play();
          setPlaying(true);
          playingRef.current = true;
          fadeTo(volumeRef.current);
          persist();
        } catch {
          fail("Playback blocked — tap play to start");
        }
      };

      a.addEventListener(
        "canplaythrough",
        () => {
          void ready();
        },
        { once: true },
      );
      a.addEventListener(
        "error",
        () => {
          fail(`Couldn't load ${sound.name}`);
        },
        { once: true },
      );

      a.load();
    },
    [disposeAudio, fadeTo, persist],
  );

  const loadSound = useCallback(
    (sound: AmbienceSound, { autoplay }: { autoplay: boolean }) => {
      const session = ++sessionRef.current;
      cancelFade();

      const begin = () => {
        if (session !== sessionRef.current) return;
        startSound(sound, session, autoplay);
      };

      const active = audioRef.current;
      if (active && active.volume > 0.01 && !active.paused) {
        fadeTo(0, () => {
          if (session !== sessionRef.current) return;
          disposeAudio();
          begin();
        });
      } else {
        disposeAudio();
        begin();
      }
    },
    [cancelFade, disposeAudio, fadeTo, startSound],
  );

  const pick = useCallback(
    (sound: AmbienceSound) => {
      if (currentRef.current === sound.id && audioRef.current) {
        const a = audioRef.current;
        if (playingRef.current) {
          fadeTo(0, () => {
            a.pause();
            setPlaying(false);
            playingRef.current = false;
            persist();
          });
        } else {
          void a
            .play()
            .then(() => {
              setPlaying(true);
              playingRef.current = true;
              fadeTo(volumeRef.current);
              persist();
            })
            .catch(() => toast.error("Playback blocked — tap play again"));
        }
        return;
      }

      loadSound(sound, { autoplay: true });
    },
    [fadeTo, loadSound, persist],
  );

  const toggle = useCallback(() => {
    if (!currentRef.current) return;

    const a = audioRef.current;
    if (!a) {
      const sound = AMBIENCE_SOUNDS.find((s) => s.id === currentRef.current);
      if (sound) loadSound(sound, { autoplay: true });
      return;
    }

    if (playingRef.current) {
      fadeTo(0, () => {
        a.pause();
        setPlaying(false);
        playingRef.current = false;
        persist();
      });
    } else {
      void a
        .play()
        .then(() => {
          setPlaying(true);
          playingRef.current = true;
          fadeTo(volumeRef.current);
          persist();
        })
        .catch(() => toast.error("Playback blocked"));
    }
  }, [fadeTo, loadSound, persist]);

  const stop = useCallback(() => {
    const session = ++sessionRef.current;
    setLoadingId(null);

    if (!audioRef.current) {
      currentRef.current = null;
      setCurrent(null);
      setPlaying(false);
      playingRef.current = false;
      persist();
      return;
    }

    fadeTo(0, () => {
      if (session !== sessionRef.current) return;
      disposeAudio();
      currentRef.current = null;
      setCurrent(null);
      setPlaying(false);
      playingRef.current = false;
      persist();
    });
  }, [disposeAudio, fadeTo, persist]);

  // Restore volume + last selection (resume only if it was playing).
  useEffect(() => {
    if (restoredRef.current) return;
    restoredRef.current = true;

    const savedVol = loadLS(AMBIENCE_LS.volume, 0.5);
    const clamped = Math.max(0, Math.min(1, savedVol));
    volumeRef.current = clamped;
    setVolume(clamped);

    const savedId = loadLS<string | null>(AMBIENCE_LS.soundId, null);
    const wasPlaying = loadLS(AMBIENCE_LS.playing, false);
    if (!savedId) return;

    const sound = AMBIENCE_SOUNDS.find((s) => s.id === savedId);
    if (!sound) return;

    currentRef.current = sound.id;
    setCurrent(sound.id);

    if (wasPlaying) {
      loadSound(sound, { autoplay: true });
    }
  }, [loadSound]);

  useEffect(() => {
    volumeRef.current = volume;
    saveLS(AMBIENCE_LS.volume, volume);
    const a = audioRef.current;
    if (a && playingRef.current && fadeRef.current === null) {
      a.volume = volume;
    }
  }, [volume]);

  useEffect(() => {
    return () => {
      sessionRef.current += 1;
      disposeAudio();
    };
  }, [disposeAudio]);

  const currentSound = AMBIENCE_SOUNDS.find((s) => s.id === current);

  return (
    <>
      {/* Floating trigger */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="glass-strong touch-target fixed bottom-[max(1rem,env(safe-area-inset-bottom,0px))] right-4 z-40 flex h-12 w-12 items-center justify-center rounded-full text-sm font-medium text-foreground transition hover:scale-105 sm:bottom-6 sm:right-6 sm:h-auto sm:w-auto sm:gap-2 sm:px-4 sm:py-3"
        style={{ boxShadow: playing ? "0 0 40px -5px var(--glow)" : undefined }}
      >
        <Headphones className={`h-4 w-4 ${playing ? "text-primary" : ""}`} />
        <span className="max-sm:sr-only">
          {currentSound ? `${currentSound.emoji} ${currentSound.name}` : "Ambience"}
        </span>
      </button>

      {open && (
        <div className="glass-strong fixed bottom-[calc(4.5rem+env(safe-area-inset-bottom,0px))] left-4 right-4 z-40 max-h-[min(70vh,420px)] animate-fade-in overflow-y-auto rounded-3xl p-4 sm:bottom-24 sm:left-auto sm:right-6 sm:w-72 sm:max-h-none">
          <div className="mb-3 flex items-center justify-between">
            <div className="font-display text-sm font-semibold">Ambience</div>
            <button
              onClick={() => setOpen(false)}
              className="touch-target grid h-10 w-10 place-items-center rounded-full text-muted-foreground transition hover:bg-foreground/5 hover:text-foreground"
              aria-label="Close ambience"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {AMBIENCE_SOUNDS.map((s) => {
              const isActive = current === s.id;
              const isLoading = loadingId === s.id;
              return (
                <button
                  key={s.id}
                  onClick={() => pick(s)}
                  className={`relative flex min-h-[4.5rem] flex-col items-center justify-center gap-1 rounded-2xl p-3 text-xs transition ${
                    isActive
                      ? "bg-primary/15 text-foreground ring-1 ring-primary"
                      : "bg-foreground/5 text-foreground/90 hover:bg-foreground/10"
                  }`}
                >
                  <span className="text-xl">{s.emoji}</span>
                  <span>{s.name}</span>
                  {isLoading && (
                    <Loader2 className="absolute right-1.5 top-1.5 h-3 w-3 animate-spin text-muted-foreground" />
                  )}
                </button>
              );
            })}
          </div>

          {current && (
            <div className="mt-3 space-y-2 rounded-2xl bg-foreground/5 p-3">
              <div className="flex items-center justify-between">
                <button
                  onClick={toggle}
                  className="touch-target grid h-11 w-11 place-items-center rounded-full bg-primary text-primary-foreground transition hover:scale-105"
                >
                  {playing ? <Pause className="h-4 w-4" /> : <Play className="ml-0.5 h-4 w-4" />}
                </button>
                <button onClick={stop} className="text-xs text-muted-foreground transition hover:text-foreground">
                  Stop
                </button>
              </div>
              <div className="flex items-center gap-2">
                <Volume2 className="h-3.5 w-3.5 text-muted-foreground" />
                <input
                  type="range"
                  min={0}
                  max={1}
                  step={0.01}
                  value={volume}
                  onChange={(e) => setVolume(+e.target.value)}
                  className="flex-1 accent-primary"
                />
              </div>
            </div>
          )}
        </div>
      )}
    </>
  );
}
