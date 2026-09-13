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
  { tokens: ["lim", "(", "x", "→", "0", ")", "x", "/", "x", "=", "1"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "∞", ")", "1", "/", "x", "=", "0"], nature: "Limite" },
  { tokens: ["lim", "(", "x", "→", "2", ")", "x²", "=", "4"], nature: "Limite" },
  { tokens: ["∫", "x", "dx", "=", "x²", "/", "2", "+", "C"], nature: "Intégrale" },
  { tokens: ["d/dx", "(", "x²", ")", "=", "2x"], nature: "Dérivée" },
  { tokens: ["d/dx", "(", "x", ")", "=", "1"], nature: "Dérivée" },
  { tokens: ["∫", "2x", "dx", "=", "x²", "+", "C"], nature: "Intégrale" },
  { tokens: ["lim", "(", "x", "→", "1", ")", "2x", "=", "2"], nature: "Limite" },
  { tokens: ["√", "4", "=", "2"], nature: "Racine carrée" },
  { tokens: ["√", "9", "=", "3"], nature: "Racine carrée" },
  { tokens: ["lim", "(", "x", "→", "3", ")", "x", "+", "1", "=", "4"], nature: "Limite" },
  { tokens: ["∫", "1", "dx", "=", "x", "+", "C"], nature: "Intégrale" },
  { tokens: ["lim", "(", "x", "→", "0", ")", "2x", "=", "0"], nature: "Limite" },
  { tokens: ["d/dx", "(", "2x", ")", "=", "2"], nature: "Dérivée" },
];

export function pickImpossibleTarget(): ImpossibleTarget {
  const picked = IMPOSSIBLE_BANK[randInt(0, IMPOSSIBLE_BANK.length - 1)];
  return { tokens: picked.tokens.slice(), nature: picked.nature };
}
