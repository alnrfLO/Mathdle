// Banque d'équations symboliques pré-écrites pour le niveau "impossible"
// (limites, intégrales, dérivées). Comparaison par position uniquement,
// pas de vérification symbolique réelle.
//
// Porté tel quel depuis legacy-reference.html, lignes 588-602

import { randInt } from "./generator";

export const IMPOSSIBLE_BANK: string[][] = [
  ["lim", "(", "x", "→", "0", ")", "x", "/", "x", "=", "1"],
  ["lim", "(", "x", "→", "∞", ")", "1", "/", "x", "=", "0"],
  ["lim", "(", "x", "→", "2", ")", "x²", "=", "4"],
  ["∫", "x", "dx", "=", "x²", "/", "2", "+", "C"],
  ["d/dx", "(", "x²", ")", "=", "2x"],
  ["d/dx", "(", "x", ")", "=", "1"],
  ["∫", "2x", "dx", "=", "x²", "+", "C"],
  ["lim", "(", "x", "→", "1", ")", "2x", "=", "2"],
  ["√", "4", "=", "2"],
  ["√", "9", "=", "3"],
  ["lim", "(", "x", "→", "3", ")", "x", "+", "1", "=", "4"],
  ["∫", "1", "dx", "=", "x", "+", "C"],
  ["lim", "(", "x", "→", "0", ")", "2x", "=", "0"],
  ["d/dx", "(", "2x", ")", "=", "2"],
];

export function pickImpossibleTarget(): string[] {
  return IMPOSSIBLE_BANK[randInt(0, IMPOSSIBLE_BANK.length - 1)].slice();
}
