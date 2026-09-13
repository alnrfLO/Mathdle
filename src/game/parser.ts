// Parser d'expressions mathématiques (+ - * / et parenthèses)
// Porté depuis legacy-reference.html (fonctions tokenize, parseExpression, evaluate)

import type { Token } from "./types";

export function tokenize(str: string): Token[] {
  const tokens: Token[] = [];
  let i = 0;
  while (i < str.length) {
    const c = str[i];
    if (c >= "0" && c <= "9") {
      let num = "";
      while (i < str.length && str[i] >= "0" && str[i] <= "9") {
        num += str[i];
        i++;
      }
      tokens.push({ type: "num", value: parseInt(num, 10) });
      continue;
    }
    if ("+-*/()".includes(c)) {
      tokens.push({ type: c as Token["type"] });
      i++;
      continue;
    }
    throw new Error("Caractère invalide : " + c);
  }
  return tokens;
}

export function parseExpression(tokens: Token[]): number {
  let pos = 0;
  const peek = () => tokens[pos];
  const consume = () => tokens[pos++];

  function parseFactor(): number {
    const t = peek();
    if (!t) throw new Error("Expression incomplète");
    if (t.type === "(") {
      consume();
      const val = parseExpr();
      const close = consume();
      if (!close || close.type !== ")") throw new Error("Parenthèse manquante");
      return val;
    }
    if (t.type === "num") {
      consume();
      return t.value as number;
    }
    throw new Error("Syntaxe invalide");
  }

  function parseTerm(): number {
    let val = parseFactor();
    while (peek() && (peek().type === "*" || peek().type === "/")) {
      const op = consume().type;
      const rhs = parseFactor();
      if (op === "*") val = val * rhs;
      else {
        if (rhs === 0) throw new Error("Division par zéro");
        val = val / rhs;
      }
    }
    return val;
  }

  function parseExpr(): number {
    let val = parseTerm();
    while (peek() && (peek().type === "+" || peek().type === "-")) {
      const op = consume().type;
      const rhs = parseTerm();
      val = op === "+" ? val + rhs : val - rhs;
    }
    return val;
  }

  const result = parseExpr();
  if (pos !== tokens.length) throw new Error("Caractères en trop");
  return result;
}

export function evaluate(str: string): number {
  return parseExpression(tokenize(str));
}
