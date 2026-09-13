// Parser de formules chimiques simples (éléments, indices, groupes entre
// parenthèses) et vérification d'équilibrage réel par comptage d'atomes —
// contrairement au mode "Impossible" des maths, la réponse n'est pas
// pré-écrite : n'importe quel jeu de coefficients valide est accepté.

export type AtomCount = Record<string, number>;

function mergeInto(target: AtomCount, source: AtomCount, multiplier: number) {
  for (const el of Object.keys(source)) {
    target[el] = (target[el] || 0) + source[el] * multiplier;
  }
}

// Parse une formule comme "H2O", "Fe2O3", "Ca(OH)2", "Al2(SO4)3"
export function parseFormula(formula: string): AtomCount {
  let pos = 0;

  function readNumber(defaultVal: number): number {
    let numStr = "";
    while (pos < formula.length && formula[pos] >= "0" && formula[pos] <= "9") {
      numStr += formula[pos];
      pos++;
    }
    return numStr ? parseInt(numStr, 10) : defaultVal;
  }

  function parseGroup(): AtomCount {
    const counts: AtomCount = {};
    while (pos < formula.length && formula[pos] !== ")") {
      const c = formula[pos];
      if (c === "(") {
        pos++; // skip '('
        const inner = parseGroup();
        if (formula[pos] !== ")") throw new Error("Parenthèse manquante");
        pos++; // skip ')'
        const mult = readNumber(1);
        mergeInto(counts, inner, mult);
        continue;
      }
      if (c >= "A" && c <= "Z") {
        let symbol = c;
        pos++;
        if (pos < formula.length && formula[pos] >= "a" && formula[pos] <= "z") {
          symbol += formula[pos];
          pos++;
        }
        const count = readNumber(1);
        counts[symbol] = (counts[symbol] || 0) + count;
        continue;
      }
      throw new Error("Formule invalide : " + c);
    }
    return counts;
  }

  const result = parseGroup();
  if (pos !== formula.length) throw new Error("Caractères en trop dans la formule");
  return result;
}

export interface ChemEquation {
  reactants: string[];
  products: string[];
}

function gcd(a: number, b: number): number {
  return b === 0 ? a : gcd(b, a % b);
}

export interface BalanceResult {
  balanced: boolean;
  simplified: boolean;
  reason?: string;
}

export function checkBalance(equation: ChemEquation, coeffs: number[]): BalanceResult {
  const n = equation.reactants.length + equation.products.length;
  if (coeffs.length !== n || coeffs.some((c) => !c || c < 1)) {
    return { balanced: false, simplified: false, reason: "Remplis toutes les cases avec un nombre ≥ 1" };
  }

  const left: AtomCount = {};
  const right: AtomCount = {};
  equation.reactants.forEach((f, i) => mergeInto(left, parseFormula(f), coeffs[i]));
  equation.products.forEach((f, i) =>
    mergeInto(right, parseFormula(f), coeffs[equation.reactants.length + i])
  );

  const elements = new Set([...Object.keys(left), ...Object.keys(right)]);
  for (const el of elements) {
    if ((left[el] || 0) !== (right[el] || 0)) {
      return { balanced: false, simplified: false };
    }
  }

  const overallGcd = coeffs.reduce((g, c) => gcd(g, c), coeffs[0]);
  return { balanced: true, simplified: overallGcd === 1 };
}

const FACILE: ChemEquation[] = [
  { reactants: ["H2", "O2"], products: ["H2O"] },
  { reactants: ["N2", "H2"], products: ["NH3"] },
  { reactants: ["Na", "Cl2"], products: ["NaCl"] },
  { reactants: ["Mg", "O2"], products: ["MgO"] },
  { reactants: ["H2", "Cl2"], products: ["HCl"] },
  { reactants: ["K", "O2"], products: ["K2O"] },
];

const MOYEN: ChemEquation[] = [
  { reactants: ["CH4", "O2"], products: ["CO2", "H2O"] },
  { reactants: ["Fe", "O2"], products: ["Fe2O3"] },
  { reactants: ["Al", "O2"], products: ["Al2O3"] },
  { reactants: ["Zn", "HCl"], products: ["ZnCl2", "H2"] },
  { reactants: ["Ca", "O2"], products: ["CaO"] },
  { reactants: ["C2H6", "O2"], products: ["CO2", "H2O"] },
];

const DIFFICILE: ChemEquation[] = [
  { reactants: ["C3H8", "O2"], products: ["CO2", "H2O"] },
  { reactants: ["Fe2O3", "CO"], products: ["Fe", "CO2"] },
  { reactants: ["Al", "Fe2O3"], products: ["Al2O3", "Fe"] },
  { reactants: ["NH3", "O2"], products: ["NO", "H2O"] },
  { reactants: ["Ca", "H2O"], products: ["Ca(OH)2", "H2"] },
  { reactants: ["C4H10", "O2"], products: ["CO2", "H2O"] },
];

export function pickChemEquation(level: "facile" | "moyen" | "difficile"): ChemEquation {
  const bank = level === "facile" ? FACILE : level === "moyen" ? MOYEN : DIFFICILE;
  return bank[Math.floor(Math.random() * bank.length)];
}
