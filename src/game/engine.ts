// Moteur de jeu : vérification d'équations/expressions et comparaison façon Wordle
//
// Logique de référence à porter : legacy-reference.html, lignes 516-548
// (fonctions checkEquation, checkExpression, compareGuess)


import type { CellState, EquationCheckResult, ExpressionCheckResult } from "./types";

export function checkEquation(_str: string): EquationCheckResult {
  // TODO: porter la logique de legacy-reference.html ligne 516
  // Rappel : split sur "=", évaluer les deux membres, comparer avec une tolérance (1e-9)
  throw new Error("not implemented");
}

export function checkExpression(_str: string): ExpressionCheckResult {
  // TODO: porter la logique de legacy-reference.html ligne 527
  throw new Error("not implemented");
}

// Compare un guess à une target caractère par caractère, façon Wordle.
// Algo en 2 passes pour gérer correctement les doublons :
// passe 1 = marquer les "correct", passe 2 = marquer "present"/"absent"
// à partir du stock de caractères restants.
export function compareGuess(_guess: string, _target: string): CellState[] {
  // TODO: porter la logique de legacy-reference.html ligne 532
  throw new Error("not implemented");
}
