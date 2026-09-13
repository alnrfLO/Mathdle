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
  "String", "string",
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
      {
        titre: "Nombre pair",
        enonce: "Fonction qui renvoie vrai si n est pair, faux sinon.",
        tokens: ["function", "estPair", "(", "n", ")", "{", "return", "n", "%", "2", "===", "0", ";", "}"],
        keys: ["(", ")", "{", "}", ";", "%", "==="],
        extraKeys: ["function", "estPair", "n", "return"],
      },
      {
        titre: "Carré d'un nombre",
        enonce: "Fonction qui renvoie le carré du nombre n.",
        tokens: ["function", "carre", "(", "n", ")", "{", "return", "n", "*", "n", ";", "}"],
        keys: ["(", ")", "{", "}", ";", "*"],
        extraKeys: ["function", "carre", "n", "return"],
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
      {
        titre: "Minimum de deux valeurs",
        enonce: "Fonction qui renvoie le plus petit des deux nombres a et b.",
        tokens: [
          "function", "minimum", "(", "a", ",", "b", ")", "{",
          "if", "(", "a", "<", "b", ")", "{", "return", "a", ";", "}",
          "return", "b", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ",", ";", "<"],
        extraKeys: ["function", "minimum", "a", "b", "if", "return"],
      },
      {
        titre: "Somme de 1 à n",
        enonce: "Fonction qui renvoie la somme des entiers de 1 à n.",
        tokens: [
          "function", "sommeN", "(", "n", ")", "{",
          "let", "total", "=", "0", ";",
          "for", "(", "let", "i", "=", "1", ";", "i", "<=", "n", ";", "i", "++", ")", "{",
          "total", "=", "total", "+", "i", ";",
          "}",
          "return", "total", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "=", "<=", "++", "+"],
        extraKeys: ["function", "sommeN", "n", "let", "total", "for", "i", "return"],
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
      {
        titre: "FizzBuzz",
        enonce: 'Fonction qui renvoie "Fizz" si n est multiple de 3, "Buzz" si multiple de 5, "FizzBuzz" si multiple des deux, sinon n en texte.',
        tokens: [
          "function", "fizzbuzz", "(", "n", ")", "{",
          "if", "(", "n", "%", "1", "5", "===", "0", ")", "{", "return", '"FizzBuzz"', ";", "}",
          "if", "(", "n", "%", "3", "===", "0", ")", "{", "return", '"Fizz"', ";", "}",
          "if", "(", "n", "%", "5", "===", "0", ")", "{", "return", '"Buzz"', ";", "}",
          "return", "String", "(", "n", ")", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "%", "==="],
        extraKeys: ["function", "fizzbuzz", "n", "if", "return", "String", '"FizzBuzz"', '"Fizz"', '"Buzz"'],
      },
      {
        titre: "Fibonacci",
        enonce: "Fonction qui renvoie le n-ième terme de la suite de Fibonacci (0, 1, 1, 2, 3, 5...).",
        tokens: [
          "function", "fibonacci", "(", "n", ")", "{",
          "let", "a", "=", "0", ";",
          "let", "b", "=", "1", ";",
          "for", "(", "let", "i", "=", "0", ";", "i", "<", "n", ";", "i", "++", ")", "{",
          "let", "t", "=", "a", "+", "b", ";",
          "a", "=", "b", ";",
          "b", "=", "t", ";",
          "}",
          "return", "a", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "=", "<", "++", "+"],
        extraKeys: ["function", "fibonacci", "n", "let", "a", "b", "for", "i", "t", "return"],
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
      {
        titre: "Nombre pair",
        enonce: "Fonction qui renvoie vrai si n est pair, faux sinon.",
        tokens: ["def", "estPair", "(", "n", ")", ":", "return", "n", "%", "2", "==", "0"],
        keys: ["(", ")", ":", "%", "=="],
        extraKeys: ["def", "estPair", "n", "return"],
      },
      {
        titre: "Carré d'un nombre",
        enonce: "Fonction qui renvoie le carré du nombre n.",
        tokens: ["def", "carre", "(", "n", ")", ":", "return", "n", "*", "n"],
        keys: ["(", ")", ":", "*"],
        extraKeys: ["def", "carre", "n", "return"],
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
      {
        titre: "Minimum de deux valeurs",
        enonce: "Fonction qui renvoie le plus petit des deux nombres a et b.",
        tokens: [
          "def", "minimum", "(", "a", ",", "b", ")", ":",
          "if", "a", "<", "b", ":", "return", "a",
          "return", "b",
        ],
        keys: ["(", ")", ":", ",", "<"],
        extraKeys: ["def", "minimum", "a", "b", "if", "return"],
      },
      {
        titre: "Somme de 1 à n",
        enonce: "Fonction qui renvoie la somme des entiers de 1 à n.",
        tokens: [
          "def", "sommeN", "(", "n", ")", ":",
          "total", "=", "0",
          "for", "i", "in", "range", "(", "1", ",", "n", "+", "1", ")", ":",
          "total", "=", "total", "+", "i",
          "return", "total",
        ],
        keys: ["(", ")", ":", ",", "=", "+"],
        extraKeys: ["def", "sommeN", "n", "total", "for", "i", "in", "range", "return"],
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
      {
        titre: "FizzBuzz",
        enonce: 'Fonction qui renvoie "Fizz" si n est multiple de 3, "Buzz" si multiple de 5, "FizzBuzz" si multiple des deux, sinon n en texte.',
        tokens: [
          "def", "fizzbuzz", "(", "n", ")", ":",
          "if", "n", "%", "1", "5", "==", "0", ":", "return", '"FizzBuzz"',
          "if", "n", "%", "3", "==", "0", ":", "return", '"Fizz"',
          "if", "n", "%", "5", "==", "0", ":", "return", '"Buzz"',
          "return", "str", "(", "n", ")",
        ],
        keys: ["(", ")", ":", "%", "=="],
        extraKeys: ["def", "fizzbuzz", "n", "if", "return", "str", '"FizzBuzz"', '"Fizz"', '"Buzz"'],
      },
      {
        titre: "Fibonacci",
        enonce: "Fonction qui renvoie le n-ième terme de la suite de Fibonacci (0, 1, 1, 2, 3, 5...).",
        tokens: [
          "def", "fibonacci", "(", "n", ")", ":",
          "a", "=", "0",
          "b", "=", "1",
          "for", "i", "in", "range", "(", "n", ")", ":",
          "t", "=", "a", "+", "b",
          "a", "=", "b",
          "b", "=", "t",
          "return", "a",
        ],
        keys: ["(", ")", ":", "=", "+"],
        extraKeys: ["def", "fibonacci", "n", "a", "b", "for", "i", "in", "range", "t", "return"],
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
      {
        titre: "Nombre pair",
        enonce: "Fonction qui renvoie vrai si n est pair, faux sinon.",
        tokens: ["boolean", "estPair", "(", "int", "n", ")", "{", "return", "n", "%", "2", "==", "0", ";", "}"],
        keys: ["(", ")", "{", "}", ";", "%", "=="],
        extraKeys: ["boolean", "estPair", "int", "n", "return"],
      },
      {
        titre: "Carré d'un nombre",
        enonce: "Fonction qui renvoie le carré du nombre n.",
        tokens: ["int", "carre", "(", "int", "n", ")", "{", "return", "n", "*", "n", ";", "}"],
        keys: ["(", ")", "{", "}", ";", "*"],
        extraKeys: ["int", "carre", "n", "return"],
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
      {
        titre: "Minimum de deux valeurs",
        enonce: "Fonction qui renvoie le plus petit des deux nombres a et b.",
        tokens: [
          "int", "minimum", "(", "int", "a", ",", "int", "b", ")", "{",
          "if", "(", "a", "<", "b", ")", "{", "return", "a", ";", "}",
          "return", "b", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ",", ";", "<"],
        extraKeys: ["int", "minimum", "a", "b", "if", "return"],
      },
      {
        titre: "Somme de 1 à n",
        enonce: "Fonction qui renvoie la somme des entiers de 1 à n.",
        tokens: [
          "int", "sommeN", "(", "int", "n", ")", "{",
          "int", "total", "=", "0", ";",
          "for", "(", "int", "i", "=", "1", ";", "i", "<=", "n", ";", "i", "++", ")", "{",
          "total", "=", "total", "+", "i", ";",
          "}",
          "return", "total", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "=", "<=", "++", "+"],
        extraKeys: ["int", "sommeN", "n", "total", "for", "i", "return"],
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
      {
        titre: "FizzBuzz",
        enonce: 'Fonction qui renvoie "Fizz" si n est multiple de 3, "Buzz" si multiple de 5, "FizzBuzz" si multiple des deux, sinon n en texte.',
        tokens: [
          "String", "fizzbuzz", "(", "int", "n", ")", "{",
          "if", "(", "n", "%", "1", "5", "==", "0", ")", "{", "return", '"FizzBuzz"', ";", "}",
          "if", "(", "n", "%", "3", "==", "0", ")", "{", "return", '"Fizz"', ";", "}",
          "if", "(", "n", "%", "5", "==", "0", ")", "{", "return", '"Buzz"', ";", "}",
          "return", "String", ".", "valueOf", "(", "n", ")", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "%", "==", "."],
        extraKeys: ["String", "fizzbuzz", "int", "n", "if", "return", "valueOf", '"FizzBuzz"', '"Fizz"', '"Buzz"'],
      },
      {
        titre: "Fibonacci",
        enonce: "Fonction qui renvoie le n-ième terme de la suite de Fibonacci (0, 1, 1, 2, 3, 5...).",
        tokens: [
          "int", "fibonacci", "(", "int", "n", ")", "{",
          "int", "a", "=", "0", ";",
          "int", "b", "=", "1", ";",
          "for", "(", "int", "i", "=", "0", ";", "i", "<", "n", ";", "i", "++", ")", "{",
          "int", "t", "=", "a", "+", "b", ";",
          "a", "=", "b", ";",
          "b", "=", "t", ";",
          "}",
          "return", "a", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "=", "<", "++", "+"],
        extraKeys: ["int", "fibonacci", "n", "a", "b", "for", "i", "t", "return"],
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
      {
        titre: "Nombre pair",
        enonce: "Fonction qui renvoie vrai si n est pair, faux sinon.",
        tokens: ["bool", "estPair", "(", "int", "n", ")", "{", "return", "n", "%", "2", "==", "0", ";", "}"],
        keys: ["(", ")", "{", "}", ";", "%", "=="],
        extraKeys: ["bool", "estPair", "int", "n", "return"],
      },
      {
        titre: "Carré d'un nombre",
        enonce: "Fonction qui renvoie le carré du nombre n.",
        tokens: ["int", "carre", "(", "int", "n", ")", "{", "return", "n", "*", "n", ";", "}"],
        keys: ["(", ")", "{", "}", ";", "*"],
        extraKeys: ["int", "carre", "n", "return"],
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
      {
        titre: "Minimum de deux valeurs",
        enonce: "Fonction qui renvoie le plus petit des deux nombres a et b.",
        tokens: [
          "int", "minimum", "(", "int", "a", ",", "int", "b", ")", "{",
          "if", "(", "a", "<", "b", ")", "{", "return", "a", ";", "}",
          "return", "b", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ",", ";", "<"],
        extraKeys: ["int", "minimum", "a", "b", "if", "return"],
      },
      {
        titre: "Somme de 1 à n",
        enonce: "Fonction qui renvoie la somme des entiers de 1 à n.",
        tokens: [
          "int", "sommeN", "(", "int", "n", ")", "{",
          "int", "total", "=", "0", ";",
          "for", "(", "int", "i", "=", "1", ";", "i", "<=", "n", ";", "i", "++", ")", "{",
          "total", "=", "total", "+", "i", ";",
          "}",
          "return", "total", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "=", "<=", "++", "+"],
        extraKeys: ["int", "sommeN", "n", "total", "for", "i", "return"],
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
      {
        titre: "FizzBuzz",
        enonce: 'Fonction qui renvoie "Fizz" si n est multiple de 3, "Buzz" si multiple de 5, "FizzBuzz" si multiple des deux, sinon n en texte.',
        tokens: [
          "string", "fizzbuzz", "(", "int", "n", ")", "{",
          "if", "(", "n", "%", "1", "5", "==", "0", ")", "{", "return", '"FizzBuzz"', ";", "}",
          "if", "(", "n", "%", "3", "==", "0", ")", "{", "return", '"Fizz"', ";", "}",
          "if", "(", "n", "%", "5", "==", "0", ")", "{", "return", '"Buzz"', ";", "}",
          "return", "to_string", "(", "n", ")", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "%", "=="],
        extraKeys: ["string", "fizzbuzz", "int", "n", "if", "return", "to_string", '"FizzBuzz"', '"Fizz"', '"Buzz"'],
      },
      {
        titre: "Fibonacci",
        enonce: "Fonction qui renvoie le n-ième terme de la suite de Fibonacci (0, 1, 1, 2, 3, 5...).",
        tokens: [
          "int", "fibonacci", "(", "int", "n", ")", "{",
          "int", "a", "=", "0", ";",
          "int", "b", "=", "1", ";",
          "for", "(", "int", "i", "=", "0", ";", "i", "<", "n", ";", "i", "++", ")", "{",
          "int", "t", "=", "a", "+", "b", ";",
          "a", "=", "b", ";",
          "b", "=", "t", ";",
          "}",
          "return", "a", ";", "}",
        ],
        keys: ["(", ")", "{", "}", ";", "=", "<", "++", "+"],
        extraKeys: ["int", "fibonacci", "n", "a", "b", "for", "i", "t", "return"],
      },
    ],
  },
};

export function pickProgExercise(lang: ProgLang, level: ProgLevel): ProgExercise {
  const bank = PROG_BANK[lang][level];
  return bank[Math.floor(Math.random() * bank.length)];
}
