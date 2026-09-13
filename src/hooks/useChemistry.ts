import { useCallback, useState } from "react";
import { checkBalance, pickChemEquation } from "../science/chemistry";
import type { ChemEquation } from "../science/chemistry";
import type { MessageState } from "./useMathdle";

const EMPTY_MESSAGE: MessageState = { text: "", variant: "" };
const MAX_ATTEMPTS = 4;
const MAX_LIVES = 3;
type Level = "facile" | "moyen" | "difficile";

function emptyCoeffs(eq: ChemEquation): (number | null)[] {
  return new Array(eq.reactants.length + eq.products.length).fill(null);
}

function formatSolution(eq: ChemEquation): string {
  const compounds = [...eq.reactants, ...eq.products];
  const reactantCount = eq.reactants.length;
  return compounds
    .map((f, i) => {
      const prefix = i === reactantCount ? "→ " : i > 0 ? "+ " : "";
      return `${prefix}${eq.coeffs[i]} ${f}`;
    })
    .join(" ");
}

export function useChemistry(onCorrect: () => void, onStreakReset: () => void) {
  const [level, setLevelState] = useState<Level>("facile");
  const [equation, setEquation] = useState<ChemEquation>(() => pickChemEquation("facile"));
  const [coeffs, setCoeffs] = useState<(number | null)[]>(() => emptyCoeffs(equation));
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState<MessageState>(EMPTY_MESSAGE);
  const [attempts, setAttempts] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);

  const newEquation = useCallback((lvl: Level) => {
    const eq = pickChemEquation(lvl);
    setEquation(eq);
    setCoeffs(emptyCoeffs(eq));
    setActiveIndex(0);
    setAttempts(0);
    setMessage(EMPTY_MESSAGE);
  }, []);

  const setLevel = useCallback(
    (lvl: Level) => {
      setLevelState(lvl);
      newEquation(lvl);
    },
    [newEquation]
  );

  const selectSlot = useCallback((i: number) => setActiveIndex(i), []);

  const total = equation.reactants.length + equation.products.length;

  const typeChar = useCallback(
    (d: string) => {
      const digit = Number(d);
      if (Number.isNaN(digit)) return;
      setCoeffs((c) => {
        const next = [...c];
        next[activeIndex] = digit;
        return next;
      });
      setActiveIndex((i) => Math.min(i + 1, total - 1));
    },
    [activeIndex, total]
  );

  const backspace = useCallback(() => {
    setCoeffs((c) => {
      const next = [...c];
      if (next[activeIndex] !== null) {
        next[activeIndex] = null;
      }
      return next;
    });
  }, [activeIndex]);

  const check = useCallback(() => {
    const filled = coeffs.map((c) => c ?? 0);
    const result = checkBalance(equation, filled);

    if (result.balanced && result.simplified) {
      setMessage({ text: "Équilibré !", variant: "success" });
      setLives(MAX_LIVES);
      onCorrect();
      window.setTimeout(() => newEquation(level), 1100);
      return;
    }

    const attemptsLeft = MAX_ATTEMPTS - (attempts + 1);
    if (attemptsLeft > 0) {
      setAttempts((a) => a + 1);
      const reason = !result.balanced
        ? result.reason ?? "Pas encore équilibré"
        : "Équilibré, mais simplifiable — trouve la proportion la plus simple";
      setMessage({ text: `${reason} (${attemptsLeft} essai${attemptsLeft > 1 ? "s" : ""} restant${attemptsLeft > 1 ? "s" : ""})`, variant: "error" });
      return;
    }

    // Plus d'essais pour cette équation : ça coûte une vie
    const remainingLives = lives - 1;
    if (remainingLives <= 0) {
      onStreakReset();
      setLives(MAX_LIVES);
      setMessage({
        text: `Plus de vies — série remise à zéro. C'était ${formatSolution(equation)}`,
        variant: "error",
      });
    } else {
      setLives(remainingLives);
      setMessage({
        text: `Perdu — c'était ${formatSolution(equation)} (${remainingLives}/${MAX_LIVES} vies)`,
        variant: "error",
      });
    }
    window.setTimeout(() => newEquation(level), 1700);
  }, [coeffs, equation, level, attempts, lives, newEquation, onCorrect, onStreakReset]);

  const skip = useCallback(() => newEquation(level), [level, newEquation]);

  return {
    level,
    equation,
    coeffs,
    activeIndex,
    message,
    attempts,
    maxAttempts: MAX_ATTEMPTS,
    lives,
    maxLives: MAX_LIVES,
    setLevel,
    selectSlot,
    typeChar,
    backspace,
    check,
    skip,
  };
}
