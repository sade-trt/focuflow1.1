export type AmbienceSound = {
  id: string;
  name: string;
  emoji: string;
  file: string;
};

export const AMBIENCE_SOUNDS: AmbienceSound[] = [
  // Real rain ambience
  {
    id: "rain",
    name: "Rain",
    emoji: "🌧️",
    file: "/sounds/rain.mp3",
  },

  // Actual lo-fi background music
  {
    id: "lofi",
    name: "Lo-Fi",
    emoji: "🎧",
    file: "/sounds/lofi.mp3",
  },

  // Forest ambience with birds/wind
  {
    id: "forest",
    name: "Forest",
    emoji: "🌲",
    file: "/sounds/forest.mp3",
  },

  // Water stream ambience
  {
    id: "stream",
    name: "Stream",
    emoji: "💧",
    file: "/sounds/stream.mp3",
  },

  // Cafe ambience
  {
    id: "cafe",
    name: "Cafe",
    emoji: "☕",
    file: "/sounds/cafe.mp3",
  },

  // Fireplace crackling
  {
    id: "fireplace",
    name: "Fireplace",
    emoji: "🔥",
    file: "/sounds/fire.mp3",
  },
];

export const AMBIENCE_LS = {
  volume: "focus.ambience.vol",
  soundId: "focus.ambience.id",
  playing: "focus.ambience.playing",
} as const;