// Banque de formules physiques (mécanique façon "Impossible" : comparaison
// des tokens par position, pas de vérification symbolique réelle — ce n'est
// pas possible ici comme pour la chimie, donc assumé comme un mini quiz).
//
// Chaque formule porte aussi son "domaine" (Mécanique / Énergie / Électricité /
// Ondes / Gravitation / Pression), affiché comme indice avant de jouer.

export interface PhysicsFormula {
  tokens: string[];
  domaine: string;
}

export interface PhysicsLevelConfig {
  maxAttempts: number;
  keys: string[]; // touches "opérateur" (symboles courants)
  extraKeys: string[]; // touches "2nd" (lettres/grandeurs)
  bank: PhysicsFormula[];
}

export const PHYSICS_LEVELS: Record<"facile" | "moyen" | "difficile", PhysicsLevelConfig> = {
  facile: {
    maxAttempts: 6,
    keys: ["=", "×", "/"],
    extraKeys: ["v", "d", "t", "F", "m", "a", "P", "g"],
    bank: [
      { tokens: ["v", "=", "d", "/", "t"], domaine: "Mécanique" },
      { tokens: ["F", "=", "m", "×", "a"], domaine: "Mécanique" },
      { tokens: ["P", "=", "m", "×", "g"], domaine: "Mécanique" },
      { tokens: ["d", "=", "v", "×", "t"], domaine: "Mécanique" },
      { tokens: ["t", "=", "d", "/", "v"], domaine: "Mécanique" },
      { tokens: ["a", "=", "F", "/", "m"], domaine: "Mécanique" },
      { tokens: ["m", "=", "F", "/", "a"], domaine: "Mécanique" },
      { tokens: ["g", "=", "P", "/", "m"], domaine: "Mécanique" },
      { tokens: ["m", "=", "P", "/", "g"], domaine: "Mécanique" },
    ],
  },
  moyen: {
    maxAttempts: 7,
    keys: ["=", "×", "/", "²"],
    extraKeys: ["E", "m", "c", "P", "U", "I", "W", "F", "d", "R", "t"],
    bank: [
      { tokens: ["E", "=", "m", "c", "²"], domaine: "Énergie" },
      { tokens: ["P", "=", "U", "×", "I"], domaine: "Électricité" },
      { tokens: ["W", "=", "F", "×", "d"], domaine: "Énergie" },
      { tokens: ["U", "=", "R", "×", "I"], domaine: "Électricité" },
      { tokens: ["I", "=", "U", "/", "R"], domaine: "Électricité" },
      { tokens: ["R", "=", "U", "/", "I"], domaine: "Électricité" },
      { tokens: ["F", "=", "W", "/", "d"], domaine: "Énergie" },
      { tokens: ["d", "=", "W", "/", "F"], domaine: "Énergie" },
      { tokens: ["m", "=", "E", "/", "c", "²"], domaine: "Énergie" },
      { tokens: ["I", "=", "P", "/", "U"], domaine: "Électricité" },
      { tokens: ["U", "=", "P", "/", "I"], domaine: "Électricité" },
      { tokens: ["W", "=", "P", "×", "t"], domaine: "Énergie" },
      { tokens: ["t", "=", "W", "/", "P"], domaine: "Énergie" },
      { tokens: ["P", "=", "W", "/", "t"], domaine: "Énergie" },
    ],
  },
  difficile: {
    maxAttempts: 8,
    keys: ["=", "×", "/", "²", "(", ")"],
    extraKeys: ["E", "m", "v", "F", "G", "m1", "m2", "r", "P", "S", "λ", "c", "f", "ρ", "g", "h"],
    bank: [
      { tokens: ["E", "=", "(", "1", "/", "2", ")", "m", "v", "²"], domaine: "Énergie" },
      { tokens: ["F", "=", "G", "(", "m1", "m2", ")", "/", "r", "²"], domaine: "Gravitation" },
      { tokens: ["P", "=", "F", "/", "S"], domaine: "Pression" },
      { tokens: ["λ", "=", "c", "/", "f"], domaine: "Ondes" },
      { tokens: ["S", "=", "F", "/", "P"], domaine: "Pression" },
      { tokens: ["F", "=", "P", "×", "S"], domaine: "Pression" },
      { tokens: ["f", "=", "c", "/", "λ"], domaine: "Ondes" },
      { tokens: ["c", "=", "λ", "×", "f"], domaine: "Ondes" },
      { tokens: ["m", "=", "2", "E", "/", "v", "²"], domaine: "Énergie" },
      { tokens: ["G", "=", "F", "r", "²", "/", "(", "m1", "m2", ")"], domaine: "Gravitation" },
      { tokens: ["P", "=", "ρ", "×", "g", "×", "h"], domaine: "Pression" },
      { tokens: ["h", "=", "P", "/", "(", "ρ", "×", "g", ")"], domaine: "Pression" },
    ],
  },
};

export function pickPhysicsFormula(level: "facile" | "moyen" | "difficile"): PhysicsFormula {
  const bank = PHYSICS_LEVELS[level].bank;
  const picked = bank[Math.floor(Math.random() * bank.length)];
  return { tokens: picked.tokens.slice(), domaine: picked.domaine };
}
