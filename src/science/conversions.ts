// Génération et vérification de questions de conversion d'unités.
// Contrairement au mode Impossible (banque figée), ici la bonne réponse
// est réellement calculée, donc n'importe quelle valeur générée est vérifiable.

import { randInt } from "../game/generator";
import type { Difficulty } from "../game/types";

export interface ConversionQuestion {
  value: number;
  fromUnit: string;
  toUnit: string;
  answer: number;
  // Nombre de décimales attendues dans la réponse (0 = entier)
  decimals: number;
}

interface ConversionFamily {
  from: string;
  to: string;
  factor: number; // valeur convertie = value * factor
  decimals: number;
  genValue: () => number;
}

// Niveau Facile : conversions "à x10/x100/x1000/x60", résultats toujours entiers
const EASY_FAMILIES: ConversionFamily[] = [
  { from: "m", to: "cm", factor: 100, decimals: 0, genValue: () => randInt(1, 20) },
  { from: "cm", to: "m", factor: 0.01, decimals: 0, genValue: () => randInt(1, 20) * 100 },
  { from: "km", to: "m", factor: 1000, decimals: 0, genValue: () => randInt(1, 12) },
  { from: "m", to: "km", factor: 0.001, decimals: 0, genValue: () => randInt(1, 12) * 1000 },
  { from: "kg", to: "g", factor: 1000, decimals: 0, genValue: () => randInt(1, 15) },
  { from: "g", to: "kg", factor: 0.001, decimals: 0, genValue: () => randInt(1, 15) * 1000 },
  { from: "L", to: "mL", factor: 1000, decimals: 0, genValue: () => randInt(1, 15) },
  { from: "mL", to: "L", factor: 0.001, decimals: 0, genValue: () => randInt(1, 15) * 1000 },
  { from: "h", to: "min", factor: 60, decimals: 0, genValue: () => randInt(1, 10) },
  { from: "min", to: "h", factor: 1 / 60, decimals: 0, genValue: () => randInt(1, 10) * 60 },
  { from: "min", to: "s", factor: 60, decimals: 0, genValue: () => randInt(1, 10) },
  { from: "s", to: "min", factor: 1 / 60, decimals: 0, genValue: () => randInt(1, 10) * 60 },
];

// Niveau Moyen : vitesses (km/h <-> m/s), résultats à 1 décimale
const MEDIUM_FAMILIES: ConversionFamily[] = [
  { from: "km/h", to: "m/s", factor: 1 / 3.6, decimals: 1, genValue: () => randInt(10, 150) },
  { from: "m/s", to: "km/h", factor: 3.6, decimals: 1, genValue: () => randInt(1, 60) },
  { from: "g", to: "mg", factor: 1000, decimals: 0, genValue: () => randInt(1, 20) },
  { from: "mg", to: "g", factor: 0.001, decimals: 0, genValue: () => randInt(1, 20) * 1000 },
];

// Niveau Difficile : conversions chaînées / moins rondes, 1 à 2 décimales
const HARD_FAMILIES: ConversionFamily[] = [
  { from: "km/h", to: "m/s", factor: 1 / 3.6, decimals: 2, genValue: () => randInt(7, 340) },
  { from: "m/s", to: "km/h", factor: 3.6, decimals: 1, genValue: () => randInt(1, 90) },
  { from: "km", to: "cm", factor: 100000, decimals: 0, genValue: () => randInt(1, 5) },
  { from: "mL", to: "km", factor: 0, decimals: 0, genValue: () => 0 }, // placeholder retiré ci-dessous
];
// On retire l'entrée absurde ci-dessus (mL -> km n'a pas de sens physique)
HARD_FAMILIES.pop();
HARD_FAMILIES.push(
  { from: "h", to: "s", factor: 3600, decimals: 0, genValue: () => randInt(1, 5) },
  { from: "s", to: "h", factor: 1 / 3600, decimals: 2, genValue: () => randInt(1, 5) * 900 }
);

function round(n: number, decimals: number): number {
  const f = Math.pow(10, decimals);
  return Math.round(n * f) / f;
}

function pickFamilies(level: Difficulty): ConversionFamily[] {
  if (level === "difficile" || level === "impossible") return HARD_FAMILIES;
  if (level === "moyen") return MEDIUM_FAMILIES;
  return EASY_FAMILIES;
}

export function generateConversion(level: Difficulty): ConversionQuestion {
  const families = pickFamilies(level);
  const family = families[randInt(0, families.length - 1)];
  const value = family.genValue();
  const answer = round(value * family.factor, family.decimals);
  return {
    value,
    fromUnit: family.from,
    toUnit: family.to,
    answer,
    decimals: family.decimals,
  };
}

export function checkConversionAnswer(
  rawInput: string,
  question: ConversionQuestion
): { valid: boolean; parsed?: number; reason?: string } {
  const normalized = rawInput.trim().replace(",", ".");
  if (normalized === "") return { valid: false, reason: "Tape une réponse" };
  const parsed = Number(normalized);
  if (Number.isNaN(parsed)) return { valid: false, reason: "Ce n'est pas un nombre" };
  const tolerance = question.decimals === 0 ? 0.5 : 1 / Math.pow(10, question.decimals) / 2 + 0.01;
  const correct = Math.abs(parsed - question.answer) <= tolerance;
  return { valid: correct, parsed };
}
