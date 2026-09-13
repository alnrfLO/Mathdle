// Config des niveaux (mode Classique) et des contraintes du mode Cible libre
// Porté depuis legacy-reference.html (LEVELS, CIBLE_LEVELS)

import type { Difficulty, LevelConfig } from "./types";

export const LEVELS: Record<Difficulty, LevelConfig & { extraKeys?: string[] }> = {
  facile: { maxAttempts: 6, keys: ["+", "-", "="] },
  moyen: { maxAttempts: 6, keys: ["+", "-", "*", "/", "="] },
  difficile: { maxAttempts: 8, keys: ["+", "-", "*", "(", ")", "="] },
  impossible: {
    maxAttempts: 8,
    keys: ["+", "-", "*", "/", "(", ")", "="],
    extraKeys: ["lim", "∫", "dx", "d/dx", "√", "π", "∞", "→", "x²", "2x", "C"],
  },
};

export interface CibleLevelConfig {
  length: number;
  keys: string[];
  targetRange: [number, number];
}

export const CIBLE_LEVELS: Record<Exclude<Difficulty, "impossible">, CibleLevelConfig> = {
  facile: { length: 3, keys: ["+", "-"], targetRange: [0, 18] },
  moyen: { length: 5, keys: ["+", "-", "*", "/"], targetRange: [-20, 60] },
  difficile: { length: 7, keys: ["+", "-", "*", "(", ")"], targetRange: [-40, 100] },
};
