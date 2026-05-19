import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

import {
  loadLS,
  saveLS,
} from "@/lib/storage";

export type BgPreset = {
  id: string;
  name: string;
  background: string;
};

export const PRESETS: BgPreset[] = [
  {
    id: "midnight",
    name: "Midnight",
    background:
      "linear-gradient(135deg, #0f172a 0%, #111827 100%)",
  },

  {
    id: "ocean",
    name: "Ocean",
    background:
      "linear-gradient(135deg, #0f2027 0%, #203a43 50%, #2c5364 100%)",
  },

  {
    id: "violet",
    name: "Violet",
    background:
      "linear-gradient(135deg, #232526 0%, #414345 100%)",
  },

  {
    id: "sunset",
    name: "Sunset",
    background:
      "linear-gradient(135deg, #1e130c 0%, #9a8478 100%)",
  },

  {
    id: "emerald",
    name: "Emerald",
    background:
      "linear-gradient(135deg, #0f2027 0%, #134e5e 50%, #71b280 100%)",
  },

  {
    id: "rose",
    name: "Rose",
    background:
      "linear-gradient(135deg, #200122 0%, #6f0000 100%)",
  },

  {
    id: "aurora",
    name: "Aurora",
    background:
      "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)",
  },

  {
    id: "cream",
    name: "Cream",
    background:
      "linear-gradient(135deg, #ece9e6 0%, #ffffff 100%)",
  },
];

type State = {
  presetId: string;
};

function loadBackgroundState(): State {
  const saved = loadLS<State>(
    "focus.bg",
    {
      presetId: "midnight",
    }
  );

  const presetExists =
    PRESETS.some(
      (p) => p.id === saved.presetId
    );

  return {
    presetId: presetExists
      ? saved.presetId
      : "midnight",
  };
}

type BackgroundContext = {
  state: State;

  setPreset: (id: string) => void;

  currentBackground: string;
};

const Ctx =
  createContext<BackgroundContext | null>(
    null
  );

export function BackgroundProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [state, setState] =
    useState<State>(
      loadBackgroundState
    );

  useEffect(() => {
    saveLS("focus.bg", state);
  }, [state]);

  const currentBackground =
    useMemo(() => {
      return (
        PRESETS.find(
          (p) =>
            p.id === state.presetId
        )?.background ??
        PRESETS[0].background
      );
    }, [state.presetId]);

  return (
    <Ctx.Provider
      value={{
        state,

        currentBackground,

        setPreset: (id) => {
          if (
            !PRESETS.some(
              (p) => p.id === id
            )
          ) {
            return;
          }

          setState({
            presetId: id,
          });
        },
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

export function useBackground() {
  const ctx = useContext(Ctx);

  if (!ctx) {
    throw new Error(
      "useBackground must be used within BackgroundProvider"
    );
  }

  return ctx;
}