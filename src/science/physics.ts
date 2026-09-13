// Banque de formules physiques (mécanique façon "Impossible" : comparaison
// des tokens par position, pas de vérification symbolique réelle — ce n'est
// pas possible ici comme pour la chimie, donc assumé comme un mini quiz).

export interface PhysicsLevelConfig {
  maxAttempts: number;
  keys: string[]; // touches "opérateur" (symboles courants)
  extraKeys: string[]; // touches "2nd" (lettres/grandeurs)
  bank: string[][];
}

export const PHYSICS_LEVELS: Record<"facile" | "moyen" | "difficile", PhysicsLevelConfig> = {
  facile: {
    maxAttempts: 6,
    keys: ["=", "×", "/"],
    extraKeys: ["v", "d", "t", "F", "m", "a", "P", "g"],
    bank: [
      ["v", "=", "d", "/", "t"],
      ["F", "=", "m", "×", "a"],
      ["P", "=", "m", "×", "g"],
      ["d", "=", "v", "×", "t"],
    ],
  },
  moyen: {
    maxAttempts: 7,
    keys: ["=", "×", "/", "²"],
    extraKeys: ["E", "m", "c", "P", "U", "I", "W", "F", "d"],
    bank: [
      ["E", "=", "m", "c", "²"],
      ["P", "=", "U", "×", "I"],
      ["W", "=", "F", "×", "d"],
      ["U", "=", "R", "×", "I"],
    ],
  },
  difficile: {
    maxAttempts: 8,
    keys: ["=", "×", "/", "²", "(", ")"],
    extraKeys: ["E", "m", "v", "F", "G", "m1", "m2", "r"],
    bank: [
      ["E", "=", "(", "1", "/", "2", ")", "m", "v", "²"],
      ["F", "=", "G", "(", "m1", "m2", ")", "/", "r", "²"],
      ["P", "=", "F", "/", "S"],
      ["λ", "=", "c", "/", "f"],
    ],
  },
};

export function pickPhysicsFormula(level: "facile" | "moyen" | "difficile"): string[] {
  const bank = PHYSICS_LEVELS[level].bank;
  return bank[Math.floor(Math.random() * bank.length)].slice();
}
