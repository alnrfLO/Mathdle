// Banque d'équations symboliques pré-écrites pour le niveau "impossible"
// (limites, intégrales, dérivées). Comparaison par position uniquement,
// pas de vérification symbolique réelle.
//
// Chaque entrée porte aussi sa "nature" (limite / dérivée / intégrale /
// racine carrée), affichée comme indice avant de jouer pour donner un
// point de départ sans révéler la réponse.

import { randInt } from "./generator";

export interface ImpossibleTarget {
  tokens: string[];
  nature: string;
}

const IMPOSSIBLE_BANK: ImpossibleTarget[] = [
  // --- Limites ---
  { tokens: ["lim", "(", "x", "→", "0", ")", "x", "/", "x", "=", "1"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "∞", ")", "1", "/", "x", "=", "0"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "2", ")", "x²", "=", "4"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "1", ")", "2x", "=", "2"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "3", ")", "x", "+", "1", "=", "4"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "0", ")", "2x", "=", "0"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "4", ")", "x", "+", "2", "=", "6"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "5", ")", "x", "-", "3", "=", "2"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "6", ")", "x", "/", "2", "=", "3"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "7", ")", "x", "-", "7", "=", "0"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "3", ")", "x²", "=", "9"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "4", ")", "x²", "=", "1", "6"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "5", ")", "x²", "=", "2", "5"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "1", "0", ")", "x", "+", "5", "=", "1", "5"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "∞", ")", "2x", "/", "x", "=", "2"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "∞", ")", "x", "/", "2", "=", "∞"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "∞", ")", "x²", "=", "∞"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "9", ")", "x", "-", "9", "=", "0"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "8", ")", "x", "/", "4", "=", "2"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "6", ")", "x", "+", "4", "=", "1", "0"], nature: "Limite" },

  // --- Dérivées ---
  { tokens: ["d/dx", "(", "x²", ")", "=", "2x"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "x", ")", "=", "1"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "2x", ")", "=", "2"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "x", "+", "5", ")", "=", "1"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "x", "-", "3", ")", "=", "1"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "2x", "+", "1", ")", "=", "2"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "2x", "-", "4", ")", "=", "2"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "x²", "+", "1", ")", "=", "2x"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "x²", "-", "3", ")", "=", "2x"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "3", ")", "=", "0"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "7", ")", "=", "0"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "x²", "+", "2x", ")", "=", "2x", "+", "2"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "x²", "-", "2x", ")", "=", "2x", "-", "2"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "3", "x", ")", "=", "3"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "4", "x", ")", "=", "4"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "5", "x", ")", "=", "5"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "3", "x²", ")", "=", "6", "x"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "4", "x²", ")", "=", "8", "x"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "5", "x²", ")", "=", "1", "0", "x"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "x²", "+", "x", ")", "=", "2x", "+", "1"], nature: "Dérivée" },

  // --- Intégrales ---
  { tokens: ["∫", "x", "dx", "=", "x²", "/", "2", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "2x", "dx", "=", "x²", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "1", "dx", "=", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "0", "dx", "=", "C"], nature: "Intégrale" },
  { tokens: ["∫", "2", "dx", "=", "2", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "3", "dx", "=", "3", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "4", "dx", "=", "4", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "5", "dx", "=", "5", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "6", "dx", "=", "6", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "4", "x", "dx", "=", "2", "x²", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "6", "x", "dx", "=", "3", "x²", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "8", "x", "dx", "=", "4", "x²", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "1", "0", "x", "dx", "=", "5", "x²", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "(", "x", "+", "1", ")", "dx", "=", "x²", "/", "2", "+", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "(", "x", "-", "1", ")", "dx", "=", "x²", "/", "2", "-", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "(", "2x", "+", "1", ")", "dx", "=", "x²", "+", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["∫", "(", "2x", "-", "1", ")", "dx", "=", "x²", "-", "x", "+", "C"], nature: "Intégrale" },

  // --- Racines carrées ---
  { tokens: ["√", "4", "=", "2"], nature: "Racine carrée" },
  { tokens: ["√", "9", "=", "3"], nature: "Racine carrée" },
  { tokens: ["√", "0", "=", "0"], nature: "Racine carrée" },
  { tokens: ["√", "1", "=", "1"], nature: "Racine carrée" },
  { tokens: ["√", "1", "6", "=", "4"], nature: "Racine carrée" },
  { tokens: ["√", "2", "5", "=", "5"], nature: "Racine carrée" },
  { tokens: ["√", "3", "6", "=", "6"], nature: "Racine carrée" },
  { tokens: ["√", "4", "9", "=", "7"], nature: "Racine carrée" },
  { tokens: ["√", "6", "4", "=", "8"], nature: "Racine carrée" },
  { tokens: ["√", "8", "1", "=", "9"], nature: "Racine carrée" },
  { tokens: ["√", "1", "0", "0", "=", "1", "0"], nature: "Racine carrée" },
  { tokens: ["√", "1", "4", "4", "=", "1", "2"], nature: "Racine carrée" },
];

export function pickImpossibleTarget(): ImpossibleTarget {
  const picked = IMPOSSIBLE_BANK[randInt(0, IMPOSSIBLE_BANK.length - 1)];
  return { tokens: picked.tokens.slice(), nature: picked.nature };
}
