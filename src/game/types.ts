// Types partagés du jeu Mathdle

export type Subject = "math" | "science";

export type Difficulty = "facile" | "moyen" | "difficile" | "impossible";

export type GameMode = "classique" | "cible";

export type CellState = "correct" | "present" | "absent" | "empty";

// Un token produit par le tokenizer (voir parser.ts)
export type TokenType = "num" | "+" | "-" | "*" | "/" | "(" | ")";

export interface Token {
  type: TokenType;
  value?: number; // uniquement pour type === "num"
}

// Résultat de la vérification d'une équation "gauche = droite"
export interface EquationCheckResult {
  valid: boolean;
  value?: number; // valeur commune des deux membres si valid === true
  reason?: string; // message d'erreur si valid === false
}

// Résultat de la vérification d'une simple expression (mode Cible libre)
export interface ExpressionCheckResult {
  valid: boolean;
  value?: number;
  reason?: string;
}

export interface LevelConfig {
  maxAttempts: number;
  keys: string[];
}
