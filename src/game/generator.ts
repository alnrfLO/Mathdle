// Génération d'équations aléatoires valides par niveau de difficulté
// Porté depuis legacy-reference.html (randInt, generateEquation)

import type { Difficulty } from "./types";

export function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function generateEquation(level: Exclude<Difficulty, "impossible">): string {
  for (let attempt = 0; attempt < 500; attempt++) {
    if (level === "facile") {
      const a = randInt(1, 40);
      const b = randInt(1, 40);
      const op = Math.random() < 0.5 ? "+" : "-";
      let x = a;
      let y = b;
      if (op === "-" && x < y) {
        const t = x;
        x = y;
        y = t;
      }
      const result = op === "+" ? x + y : x - y;
      return `${x}${op}${y}=${result}`;
    }

    if (level === "moyen") {
      const ops = ["+", "-", "*", "/"];
      const op = ops[randInt(0, 3)];
      let a: number, b: number, result: number;
      if (op === "/") {
        b = randInt(2, 9);
        result = randInt(2, 12);
        a = b * result;
      } else if (op === "*") {
        a = randInt(2, 12);
        b = randInt(2, 9);
        result = a * b;
      } else {
        a = randInt(1, 50);
        b = randInt(1, 50);
        if (op === "-" && a < b) {
          const t = a;
          a = b;
          b = t;
        }
        result = op === "+" ? a + b : a - b;
      }
      return `${a}${op}${b}=${result}`;
    }

    if (level === "difficile") {
      const ops = ["+", "-", "*"];
      const op1 = ops[randInt(0, 2)];
      const op2 = ops[randInt(0, 2)];
      const a = randInt(1, 12);
      const b = randInt(1, 12);
      const c = randInt(1, 12);
      const inner = op1 === "+" ? a + b : op1 === "-" ? a - b : a * b;
      const result = op2 === "+" ? inner + c : op2 === "-" ? inner - c : inner * c;
      if (result < 0 || result > 999) continue;
      return `(${a}${op1}${b})${op2}${c}=${result}`;
    }
  }
  return level === "facile" ? "5+3=8" : level === "moyen" ? "6*4=24" : "(3+2)*4=20";
}
