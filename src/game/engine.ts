// Moteur de jeu : vérification d'équations/expressions et comparaison façon Wordle
// Porté depuis legacy-reference.html (checkEquation, checkExpression, compareGuess)

import { evaluate } from "./parser";
import type { CellState, EquationCheckResult, ExpressionCheckResult } from "./types";

export function checkEquation(str: string): EquationCheckResult {
  const parts = str.split("=");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    return { valid: false, reason: "Il faut un signe = avec un membre de chaque côté" };
  }
  try {
    const left = evaluate(parts[0]);
    const right = evaluate(parts[1]);
    if (Math.abs(left - right) < 1e-9) return { valid: true, value: left };
    return { valid: false, reason: "Équation fausse" };
  } catch (e) {
    return { valid: false, reason: (e as Error).message };
  }
}

export function checkExpression(str: string): ExpressionCheckResult {
  try {
    return { valid: true, value: evaluate(str) };
  } catch (e) {
    return { valid: false, reason: (e as Error).message };
  }
}

// guess/target sont des tableaux de "tokens" : un caractère pour les niveaux
// facile/moyen/difficile, un token multi-caractères ("lim", "d/dx"...) pour
// le niveau impossible. La comparaison position par position fonctionne à
// l'identique dans les deux cas.
export function compareGuess(guess: string[], target: string[]): CellState[] {
  const n = target.length;
  const result: CellState[] = new Array(n).fill("absent");
  const stock: Record<string, number> = {};
  for (const tok of target) stock[tok] = (stock[tok] || 0) + 1;

  for (let i = 0; i < n; i++) {
    if (guess[i] === target[i]) {
      result[i] = "correct";
      stock[guess[i]]--;
    }
  }
  for (let i = 0; i < n; i++) {
    if (result[i] === "correct") continue;
    const tok = guess[i];
    if (stock[tok] > 0) {
      result[i] = "present";
      stock[tok]--;
    } else {
      result[i] = "absent";
    }
  }
  return result;
}
