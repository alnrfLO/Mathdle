// Génération d'équations aléatoires valides par niveau de difficulté
//
// Logique de référence à porter : legacy-reference.html, lignes 549-602
// (fonctions randInt, generateEquation)

import type { Difficulty } from "./types";

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Génère une équation "a op b = résultat" (ou plus complexe pour "difficile")
// valide et cohérente avec le niveau demandé. Le niveau "impossible" n'est
// pas généré ici : voir bank.ts (banque d'équations pré-écrites).
export function generateEquation(_level: Exclude<Difficulty, "impossible">): string {
  // TODO: porter la logique de legacy-reference.html ligne 551
  // 3 branches selon level : "facile" (+ -), "moyen" (+ - * /),
  // "difficile" (deux opérations avec parenthèses, résultat borné 0-999)
  throw new Error("not implemented");
}
