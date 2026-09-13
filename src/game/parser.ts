// Parser d'expressions mathématiques (+ - * / et parenthèses)
//
// Logique de référence à porter : legacy-reference.html, lignes 455-514
// (fonctions tokenize, parseExpression, evaluate)
//
// À toi de jouer : porte la logique JS vanilla vers TS en typant
// avec les types Token définis dans ./types.ts

import type { Token } from "./types";

export function tokenize(_str: string): Token[] {
  // TODO: porter la logique de legacy-reference.html ligne 455
  throw new Error("not implemented");
}

export function parseExpression(_tokens: Token[]): number {
  // TODO: porter la logique de legacy-reference.html ligne 472
  // (contient 3 sous-fonctions internes : parseFactor, parseTerm, parseExpr)
  throw new Error("not implemented");
}

export function evaluate(str: string): number {
  return parseExpression(tokenize(str));
}
