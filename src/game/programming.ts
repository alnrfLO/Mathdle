// Banque d'exercices de programmation, façon "Impossible" (comparaison des
// tokens par position, pas de vraie exécution — Java/C++ ne peuvent de toute
// façon pas s'exécuter dans le navigateur sans serveur). Même exercice
// traduit dans les 4 langages, pour que la logique à trouver soit identique.
//
// Deux façons de jouer un même exercice (voir useProgPageBlanche /
// useProgATrous) :
// - "Page blanche" : deviner toute la séquence de tokens, comme le mode
//   Impossible des maths ou les Formules physiques.
// - "Extrait à trous" : le squelette (mots-clés, ponctuation) est déjà
//   affiché, seuls les tokens "intéressants" (identifiants, valeurs,
//   opérateurs) sont à deviner — voir isBlankable().

export type ProgLang = "javascript" | "python" | "java" | "cpp";
export type ProgLevel = "facile" | "moyen" | "difficile";

export interface ProgExercise {
  titre: string;
  enonce: string;
  tokens: string[];
  keys: string[]; // ponctuation / opérateurs
  extraKeys: string[]; // mots-clés / identifiants (hors chiffres, toujours dispo)
}

export const PROG_LANG_LABELS: Record<ProgLang, string> = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  cpp: "C++",
};

// Tokens jamais mis à trou : ponctuation structurelle + mots-clés de
// contrôle. Tout le reste (noms, valeurs, opérateurs) devient un trou.
const ALWAYS_VISIBLE = new Set([
  "(", ")", "{", "}", ",", ";", ":",
  "function", "def", "return", "if", "for", "in", "range", "boolean", "bool", "int", "let",
]);

export function isBlankable(token: string): boolean {
  return !ALWAYS_VISIBLE.has(token);
}

export const PROG_BANK: Record<ProgLang, Record<ProgLevel, ProgExercise[]>> = {
  javascript: {
    facile: [
      {
        titre: "Somme de deux nombres",
        enonce: "Fonction qui prend deux nombres a et b et renvoie leur somme.",
        tokens: ["function", "somme", "(", "a", ",", "b", ")", "{", "return", "a", "+", "b", ";", "}"],
        keys: ["(", ")", "{", "}", ",", ";", "+"],
        extraKeys: ["function", "somme", "a", "b", "return"],
      },
    ],
    moyen: [
      {
        titre: "Maximum de deux valeurs",
        enonce: "Fonction qui renvoie le plus grand des deux nombres a et b.",
        tokens: [
          "function", "maximum", "(", "a", ",", "b", ")", "{",
          "if", "(", "a", ">", "b", ")", "{", "return", "a", ";", "}",
          "return", "b", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ",", ";", ">"],
        extraKeys: ["function", "maximum", "a", "b", "if", "return"],
      },
    ],
    difficile: [
      {
        titre: "Nombre premier",
        enonce: "Fonction qui renvoie vrai si n est un nombre premier, faux sinon.",
        tokens: [
          "function", "estPremier", "(", "n", ")", "{",
          "if", "(", "n", "<", "2", ")", "{", "return", "false", ";", "}",
          "for", "(", "let", "i", "=", "2", ";", "i", "<", "n", ";", "i", "++", ")", "{",
          "if", "(", "n", "%", "i", "===", "0", ")", "{", "return", "false", ";", "}",
          "}",
          "return", "true", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "<", "=", "%", "===", "++"],
        extraKeys: ["function", "estPremier", "n", "i", "if", "for", "let", "return", "false", "true"],
      },
    ],
  },
  python: {
    facile: [
      {
        titre: "Somme de deux nombres",
        enonce: "Fonction qui prend deux nombres a et b et renvoie leur somme.",
        tokens: ["def", "somme", "(", "a", ",", "b", ")", ":", "return", "a", "+", "b"],
        keys: ["(", ")", ":", ",", "+"],
        extraKeys: ["def", "somme", "a", "b", "return"],
      },
    ],
    moyen: [
      {
        titre: "Maximum de deux valeurs",
        enonce: "Fonction qui renvoie le plus grand des deux nombres a et b.",
        tokens: [
          "def", "maximum", "(", "a", ",", "b", ")", ":",
          "if", "a", ">", "b", ":", "return", "a",
          "return", "b",
        ],
        keys: ["(", ")", ":", ",", ">"],
        extraKeys: ["def", "maximum", "a", "b", "if", "return"],
      },
    ],
    difficile: [
      {
        titre: "Nombre premier",
        enonce: "Fonction qui renvoie vrai si n est un nombre premier, faux sinon.",
        tokens: [
          "def", "estPremier", "(", "n", ")", ":",
          "if", "n", "<", "2", ":", "return", "False",
          "for", "i", "in", "range", "(", "2", ",", "n", ")", ":",
          "if", "n", "%", "i", "==", "0", ":", "return", "False",
          "return", "True",
        ],
        keys: ["(", ")", ":", ",", "<", "%", "=="],
        extraKeys: ["def", "estPremier", "n", "i", "if", "for", "in", "range", "return", "False", "True"],
      },
    ],
  },
  java: {
    facile: [
      {
        titre: "Somme de deux nombres",
        enonce: "Fonction qui prend deux nombres a et b et renvoie leur somme.",
        tokens: ["int", "somme", "(", "int", "a", ",", "int", "b", ")", "{", "return", "a", "+", "b", ";", "}"],
        keys: ["(", ")", "{", "}", ",", ";", "+"],
        extraKeys: ["int", "somme", "a", "b", "return"],
      },
    ],
    moyen: [
      {
        titre: "Maximum de deux valeurs",
        enonce: "Fonction qui renvoie le plus grand des deux nombres a et b.",
        tokens: [
          "int", "maximum", "(", "int", "a", ",", "int", "b", ")", "{",
          "if", "(", "a", ">", "b", ")", "{", "return", "a", ";", "}",
          "return", "b", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ",", ";", ">"],
        extraKeys: ["int", "maximum", "a", "b", "if", "return"],
      },
    ],
    difficile: [
      {
        titre: "Nombre premier",
        enonce: "Fonction qui renvoie vrai si n est un nombre premier, faux sinon.",
        tokens: [
          "boolean", "estPremier", "(", "int", "n", ")", "{",
          "if", "(", "n", "<", "2", ")", "{", "return", "false", ";", "}",
          "for", "(", "int", "i", "=", "2", ";", "i", "<", "n", ";", "i", "++", ")", "{",
          "if", "(", "n", "%", "i", "==", "0", ")", "{", "return", "false", ";", "}",
          "}",
          "return", "true", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "<", "=", "%", "==", "++"],
        extraKeys: ["boolean", "estPremier", "int", "n", "i", "if", "for", "return", "false", "true"],
      },
    ],
  },
  cpp: {
    facile: [
      {
        titre: "Somme de deux nombres",
        enonce: "Fonction qui prend deux nombres a et b et renvoie leur somme.",
        tokens: ["int", "somme", "(", "int", "a", ",", "int", "b", ")", "{", "return", "a", "+", "b", ";", "}"],
        keys: ["(", ")", "{", "}", ",", ";", "+"],
        extraKeys: ["int", "somme", "a", "b", "return"],
      },
    ],
    moyen: [
      {
        titre: "Maximum de deux valeurs",
        enonce: "Fonction qui renvoie le plus grand des deux nombres a et b.",
        tokens: [
          "int", "maximum", "(", "int", "a", ",", "int", "b", ")", "{",
          "if", "(", "a", ">", "b", ")", "{", "return", "a", ";", "}",
          "return", "b", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ",", ";", ">"],
        extraKeys: ["int", "maximum", "a", "b", "if", "return"],
      },
    ],
    difficile: [
      {
        titre: "Nombre premier",
        enonce: "Fonction qui renvoie vrai si n est un nombre premier, faux sinon.",
        tokens: [
          "bool", "estPremier", "(", "int", "n", ")", "{",
          "if", "(", "n", "<", "2", ")", "{", "return", "false", ";", "}",
          "for", "(", "int", "i", "=", "2", ";", "i", "<", "n", ";", "i", "++", ")", "{",
          "if", "(", "n", "%", "i", "==", "0", ")", "{", "return", "false", ";", "}",
          "}",
          "return", "true", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "<", "=", "%", "==", "++"],
        extraKeys: ["bool", "estPremier", "int", "n", "i", "if", "for", "return", "false", "true"],
      },
    ],
  },
};

export function pickProgExercise(lang: ProgLang, level: ProgLevel): ProgExercise {
  const bank = PROG_BANK[lang][level];
  return bank[Math.floor(Math.random() * bank.length)];
}
