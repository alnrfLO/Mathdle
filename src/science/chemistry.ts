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
  // Coefficients corrects les plus simples, utilisés uniquement pour
  // révéler la réponse en cas d'échec — jamais pour la vérification,
  // qui reste un vrai calcul sur ce que tape le joueur.
  coeffs: number[];
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
  { reactants: ["H2", "O2"], products: ["H2O"], coeffs: [2, 1, 2] },
  { reactants: ["N2", "H2"], products: ["NH3"], coeffs: [1, 3, 2] },
  { reactants: ["Na", "Cl2"], products: ["NaCl"], coeffs: [2, 1, 2] },
  { reactants: ["Mg", "O2"], products: ["MgO"], coeffs: [2, 1, 2] },
  { reactants: ["H2", "Cl2"], products: ["HCl"], coeffs: [1, 1, 2] },
  { reactants: ["K", "O2"], products: ["K2O"], coeffs: [4, 1, 2] },
  { reactants: ["Li", "O2"], products: ["Li2O"], coeffs: [4, 1, 2] },
  { reactants: ["Na", "O2"], products: ["Na2O"], coeffs: [4, 1, 2] },
  { reactants: ["H2", "F2"], products: ["HF"], coeffs: [1, 1, 2] },
  { reactants: ["S", "O2"], products: ["SO2"], coeffs: [1, 1, 1] },
  { reactants: ["C", "O2"], products: ["CO2"], coeffs: [1, 1, 1] },
  { reactants: ["Zn", "S"], products: ["ZnS"], coeffs: [1, 1, 1] },
];

const MOYEN: ChemEquation[] = [
  { reactants: ["CH4", "O2"], products: ["CO2", "H2O"], coeffs: [1, 2, 1, 2] },
  { reactants: ["Fe", "O2"], products: ["Fe2O3"], coeffs: [4, 3, 2] },
  { reactants: ["Al", "O2"], products: ["Al2O3"], coeffs: [4, 3, 2] },
  { reactants: ["Zn", "HCl"], products: ["ZnCl2", "H2"], coeffs: [1, 2, 1, 1] },
  { reactants: ["Ca", "O2"], products: ["CaO"], coeffs: [2, 1, 2] },
  { reactants: ["C2H6", "O2"], products: ["CO2", "H2O"], coeffs: [2, 7, 4, 6] },
  { reactants: ["Mg", "HCl"], products: ["MgCl2", "H2"], coeffs: [1, 2, 1, 1] },
  { reactants: ["Na", "H2O"], products: ["NaOH", "H2"], coeffs: [2, 2, 2, 1] },
  { reactants: ["CaCO3"], products: ["CaO", "CO2"], coeffs: [1, 1, 1] },
  { reactants: ["P4", "O2"], products: ["P2O5"], coeffs: [1, 5, 2] },
  { reactants: ["C2H4", "O2"], products: ["CO2", "H2O"], coeffs: [1, 3, 2, 2] },
  { reactants: ["CuO", "H2"], products: ["Cu", "H2O"], coeffs: [1, 1, 1, 1] },
];

const DIFFICILE: ChemEquation[] = [
  { reactants: ["C3H8", "O2"], products: ["CO2", "H2O"], coeffs: [1, 5, 3, 4] },
  { reactants: ["Fe2O3", "CO"], products: ["Fe", "CO2"], coeffs: [1, 3, 2, 3] },
  { reactants: ["Al", "Fe2O3"], products: ["Al2O3", "Fe"], coeffs: [2, 1, 1, 2] },
  { reactants: ["NH3", "O2"], products: ["NO", "H2O"], coeffs: [4, 5, 4, 6] },
  { reactants: ["Ca", "H2O"], products: ["Ca(OH)2", "H2"], coeffs: [1, 2, 1, 1] },
  { reactants: ["C4H10", "O2"], products: ["CO2", "H2O"], coeffs: [2, 13, 8, 10] },
  { reactants: ["C6H12O6", "O2"], products: ["CO2", "H2O"], coeffs: [1, 6, 6, 6] },
  {
    reactants: ["Al2(SO4)3", "NaOH"],
    products: ["Al(OH)3", "Na2SO4"],
    coeffs: [1, 6, 2, 3],
  },
  { reactants: ["Fe3O4", "H2"], products: ["Fe", "H2O"], coeffs: [1, 4, 3, 4] },
  { reactants: ["KClO3"], products: ["KCl", "O2"], coeffs: [2, 2, 3] },
  { reactants: ["C8H18", "O2"], products: ["CO2", "H2O"], coeffs: [2, 25, 16, 18] },
  { reactants: ["C2H5OH", "O2"], products: ["CO2", "H2O"], coeffs: [1, 3, 2, 3] },
];

export function pickChemEquation(level: "facile" | "moyen" | "difficile"): ChemEquation {
  const bank = level === "facile" ? FACILE : level === "moyen" ? MOYEN : DIFFICILE;
  return bank[Math.floor(Math.random() * bank.length)];
}

// Type de réaction déduit de la forme de l'équation (nombre de réactifs/produits,
// présence de O2, motif "combustion" CO2+H2O), affiché comme indice avant de jouer.
export function classifyReaction(eq: ChemEquation): string {
  if (eq.reactants.length === 1 && eq.products.length >= 2) return "Décomposition";

  const hasO2Reactant = eq.reactants.includes("O2");
  const isCombustionProducts =
    eq.products.length === 2 && eq.products.includes("CO2") && eq.products.includes("H2O");
  if (hasO2Reactant && isCombustionProducts) return "Combustion";

  if (eq.reactants.length >= 2 && eq.products.length === 1) return "Synthèse";

  return "Déplacement";
}
