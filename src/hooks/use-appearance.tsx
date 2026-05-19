import {
  createContext,
  useContext,
  useLayoutEffect,
  useState,
  type ReactNode,
} from "react";

import { loadLS, saveLS } from "@/lib/storage";
import { useTheme, type Theme } from "@/hooks/use-theme";

/* -------------------------------------------------- */
/* TYPES */
/* -------------------------------------------------- */

export type Accent = {
  id: string;
  name: string;
  primary: string;
  glow: string;
  glow2: string;
  swatch: string;
};

export type FontPair = {
  id: string;
  name: string;
  sans: string;
  display: string;
};

export type FontSize =
  | "sm"
  | "md"
  | "lg";

export type AppearanceState = {
  accent: string;
  blur: number;
  dim: number;
  glassOpacity: number;
  fontPair: string;
  fontSize: FontSize;
};

/* -------------------------------------------------- */
/* ACCENTS */
/* brighter / softer / premium */
/* -------------------------------------------------- */

export const ACCENTS: Accent[] = [

  // ===== CLEAN =====

  {
    id: "cloud",
    name: "Cloud",
    primary: "#8fa7ff",
    glow: "#c7d4ff",
    glow2: "#e5ebff",
    swatch: "#8fa7ff",
  },

  {
    id: "ice",
    name: "Ice Blue",
    primary: "#7fb8d8",
    glow: "#bfe1f2",
    glow2: "#e4f3fa",
    swatch: "#7fb8d8",
  },

  {
    id: "sage",
    name: "Soft Sage",
    primary: "#91ad91",
    glow: "#c7dcc7",
    glow2: "#eaf3ea",
    swatch: "#91ad91",
  },

  {
    id: "peach",
    name: "Peach",
    primary: "#e0a387",
    glow: "#f3d0bf",
    glow2: "#fff1ea",
    swatch: "#e0a387",
  },

  {
    id: "latte",
    name: "Cream Latte",
    primary: "#c7a98b",
    glow: "#e9d8c7",
    glow2: "#faf2ea",
    swatch: "#c7a98b",
  },

  // ===== LOFI =====

  {
    id: "lofi",
    name: "Lo-Fi Lavender",
    primary: "#9c8dc2",
    glow: "#cdc1ea",
    glow2: "#eee8fa",
    swatch: "#9c8dc2",
  },

  {
    id: "matcha",
    name: "Matcha",
    primary: "#8fa87c",
    glow: "#c9dbbc",
    glow2: "#edf5e7",
    swatch: "#8fa87c",
  },

  {
    id: "ocean",
    name: "Ocean Calm",
    primary: "#6fa8b5",
    glow: "#b8dce3",
    glow2: "#eaf6f8",
    swatch: "#6fa8b5",
  },

  {
    id: "rose",
    name: "Dusty Rose",
    primary: "#c28e98",
    glow: "#e7c7cd",
    glow2: "#faedf0",
    swatch: "#c28e98",
  },

  // ===== NEON =====

  {
    id: "neon-blue",
    name: "Neon Blue",
    primary: "#4d8dff",
    glow: "#9dc1ff",
    glow2: "#dce9ff",
    swatch: "#4d8dff",
  },

  {
    id: "cyber",
    name: "Cyber Cyan",
    primary: "#27c5df",
    glow: "#9de7f2",
    glow2: "#ddf9ff",
    swatch: "#27c5df",
  },

  {
    id: "neon-pink",
    name: "Neon Pink",
    primary: "#ef6eb4",
    glow: "#ffc0de",
    glow2: "#ffe7f3",
    swatch: "#ef6eb4",
  },

  {
    id: "purple",
    name: "Purple Dream",
    primary: "#9a73ff",
    glow: "#ccb8ff",
    glow2: "#efe9ff",
    swatch: "#9a73ff",
  },

  // ===== DARK ACADEMIA =====

  {
    id: "midnight",
    name: "Midnight",
    primary: "#6073b5",
    glow: "#b7c3eb",
    glow2: "#e7edff",
    swatch: "#6073b5",
  },

  {
    id: "wine",
    name: "Red Wine",
    primary: "#9b6070",
    glow: "#d9b3bc",
    glow2: "#f6e9ed",
    swatch: "#9b6070",
  },

  {
    id: "forest",
    name: "Forest Study",
    primary: "#5d8167",
    glow: "#afcfb7",
    glow2: "#e6f3e9",
    swatch: "#5d8167",
  },
  {
  id: "sandstone",
  name: "Sandstone",
  primary: "#b0aa84",
  glow: "#d7d2af",
  glow2: "#0f6a82",
  swatch: "#b0aa84",
},

{
  id: "florence",
  name: "Florence",
  primary: "#f4b042",
  glow: "#f6df91",
  glow2: "#b94c24",
  swatch: "#f4b042",
},

{
  id: "neutral-blue",
  name: "Neutral Blue",
  primary: "#4b6978",
  glow: "#94a8a0",
  glow2: "#d8d8cf",
  swatch: "#4b6978",
},

{
  id: "phaedra",
  name: "Phaedra",
  primary: "#ff663b",
  glow: "#dfe88b",
  glow2: "#12a38a",
  swatch: "#ff663b",
},

{
  id: "aspirin",
  name: "Aspirin C",
  primary: "#2796a5",
  glow: "#9fd3d6",
  glow2: "#f28a00",
  swatch: "#2796a5",
},

{
  id: "honey-pot",
  name: "Honey Pot",
  primary: "#f1cb4d",
  glow: "#ece5b4",
  glow2: "#c24e33",
  swatch: "#f1cb4d",
},

{
  id: "flat-ui",
  name: "Flat UI",
  primary: "#3f8fd2",
  glow: "#d4d7da",
  glow2: "#ea4d3d",
  swatch: "#3f8fd2",
},

{
  id: "vitamin",
  name: "Vitamin C",
  primary: "#f4da13",
  glow: "#b6d438",
  glow2: "#ff7d00",
  swatch: "#f4da13",
},
];

/* -------------------------------------------------- */
/* FONTS */
/* -------------------------------------------------- */

export const FONT_PAIRS: FontPair[] = [
  {
    id: "modern",
    name: "Modern",
    sans: "Inter",
    display: "Space Grotesk",
  },

  {
    id: "editorial",
    name: "Editorial",
    sans: "Work Sans",
    display: "Instrument Serif",
  },

  {
    id: "neo",
    name: "Neo",
    sans: "Manrope",
    display: "Sora",
  },

  {
    id: "mono",
    name: "Mono",
    sans: "JetBrains Mono",
    display: "Space Grotesk",
  },
];

/* -------------------------------------------------- */
/* FONT SIZES */
/* -------------------------------------------------- */

const SIZE_PX: Record<
  FontSize,
  number
> = {
  sm: 14,
  md: 16,
  lg: 18,
};

/* -------------------------------------------------- */
/* DEFAULT */
/* -------------------------------------------------- */

const DEFAULT: AppearanceState = {
  accent: "cloud",
  blur: 18,
  dim: 30,
  glassOpacity: 55,
  fontPair: "modern",
  fontSize: "md",
};

/* -------------------------------------------------- */
/* LOAD */
/* -------------------------------------------------- */

function loadAppearanceState(): AppearanceState {
  const saved =
    loadLS<Partial<AppearanceState>>(
      "focus.appearance",
      {}
    );

  return {
    accent:
      ACCENTS.some(
        (a) =>
          a.id === saved.accent
      )
        ? saved.accent!
        : DEFAULT.accent,

    fontPair:
      FONT_PAIRS.some(
        (f) =>
          f.id === saved.fontPair
      )
        ? saved.fontPair!
        : DEFAULT.fontPair,

    fontSize:
      saved.fontSize === "sm" ||
      saved.fontSize === "md" ||
      saved.fontSize === "lg"
        ? saved.fontSize
        : DEFAULT.fontSize,

    blur:
      typeof saved.blur ===
      "number"
        ? saved.blur
        : DEFAULT.blur,

    dim:
      typeof saved.dim ===
      "number"
        ? saved.dim
        : DEFAULT.dim,

    glassOpacity:
      typeof saved.glassOpacity ===
      "number"
        ? saved.glassOpacity
        : DEFAULT.glassOpacity,
  };
}

/* -------------------------------------------------- */
/* APPLY */
/* -------------------------------------------------- */

export function applyAppearance(
  state: AppearanceState,
  theme: Theme
) {
  if (typeof document === "undefined")
    return;

  const root =
    document.documentElement;

  const accent =
    ACCENTS.find(
      (x) => x.id === state.accent
    ) ?? ACCENTS[0];

  const glassAlpha =
    state.glassOpacity / 100;

  /* COLORS */

  root.style.setProperty(
    "--primary",
    accent.primary
  );

  /* softer glow */
  root.style.setProperty(
    "--glow",
    accent.glow
  );

  root.style.setProperty(
    "--glow-2",
    accent.glow2
  );

  root.style.setProperty(
    "--ring",
    accent.primary
  );

  root.style.setProperty(
    "--primary-foreground",
    theme === "dark"
      ? "#ffffff"
      : "#ffffff"
  );

  /* GLASS */

  if (theme === "dark") {
    root.style.setProperty(
      "--glass-bg",
      `rgba(20,20,24,${glassAlpha})`
    );

    root.style.setProperty(
      "--glass-border",
      `rgba(255,255,255,0.08)`
    );
  } else {
    root.style.setProperty(
      "--glass-bg",
      `rgba(255,255,255,${glassAlpha})`
    );

    root.style.setProperty(
      "--glass-border",
      `rgba(255,255,255,0.7)`
    );
  }

  root.style.setProperty(
    "--glass-blur",
    `${state.blur}px`
  );

  root.style.setProperty(
    "--glass-blur-strong",
    `${state.blur + 8}px`
  );

  root.style.setProperty(
    "--bg-dim",
    `${state.dim / 100}`
  );

  /* FONTS */

  const fonts =
    FONT_PAIRS.find(
      (x) =>
        x.id === state.fontPair
    ) ?? FONT_PAIRS[0];

  root.style.setProperty(
    "--app-font-sans",
    `"${fonts.sans}", ui-sans-serif, system-ui`
  );

  root.style.setProperty(
    "--app-font-display",
    `"${fonts.display}", "${fonts.sans}", sans-serif`
  );

  root.style.fontSize =
    `${SIZE_PX[state.fontSize]}px`;
}

/* -------------------------------------------------- */
/* CONTEXT */
/* -------------------------------------------------- */

const Ctx = createContext<{
  state: AppearanceState;

  setAccent: (
    id: string
  ) => void;

  setBlur: (
    n: number
  ) => void;

  setDim: (
    n: number
  ) => void;

  setGlassOpacity: (
    n: number
  ) => void;

  setFontPair: (
    id: string
  ) => void;

  setFontSize: (
    s: FontSize
  ) => void;

  reset: () => void;
} | null>(null);

/* -------------------------------------------------- */
/* PROVIDER */
/* -------------------------------------------------- */

export function AppearanceProvider({
  children,
}: {
  children: ReactNode;
}) {
  const { theme } =
    useTheme();

  const [state, setState] =
    useState<AppearanceState>(
      loadAppearanceState
    );

  useLayoutEffect(() => {
    applyAppearance(
      state,
      theme
    );

    saveLS(
      "focus.appearance",
      state
    );
  }, [state, theme]);

  return (
    <Ctx.Provider
      value={{
        state,

        setAccent: (id) =>
          setState((s) => ({
            ...s,
            accent: id,
          })),

        setBlur: (n) =>
          setState((s) => ({
            ...s,
            blur: n,
          })),

        setDim: (n) =>
          setState((s) => ({
            ...s,
            dim: n,
          })),

        setGlassOpacity: (n) =>
          setState((s) => ({
            ...s,
            glassOpacity: n,
          })),

        setFontPair: (id) =>
          setState((s) => ({
            ...s,
            fontPair: id,
          })),

        setFontSize: (sz) =>
          setState((s) => ({
            ...s,
            fontSize: sz,
          })),

        reset: () =>
          setState(DEFAULT),
      }}
    >
      {children}
    </Ctx.Provider>
  );
}

/* -------------------------------------------------- */
/* HOOK */
/* -------------------------------------------------- */

export function useAppearance() {
  const ctx =
    useContext(Ctx);

  if (!ctx) {
    throw new Error(
      "useAppearance must be used within AppearanceProvider"
    );
  }

  return ctx;
}