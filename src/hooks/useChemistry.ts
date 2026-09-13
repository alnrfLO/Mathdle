import { useCallback, useState } from "react";
import { checkBalance, pickChemEquation } from "../science/chemistry";
import type { ChemEquation } from "../science/chemistry";
import type { MessageState } from "./useMathdle";

const EMPTY_MESSAGE: MessageState = { text: "", variant: "" };
type Level = "facile" | "moyen" | "difficile";

function emptyCoeffs(eq: ChemEquation): (number | null)[] {
  return new Array(eq.reactants.length + eq.products.length).fill(null);
}

export function useChemistry(onCorrect: () => void) {
  const [level, setLevelState] = useState<Level>("facile");
  const [equation, setEquation] = useState<ChemEquation>(() => pickChemEquation("facile"));
  const [coeffs, setCoeffs] = useState<(number | null)[]>(() => emptyCoeffs(equation));
  const [activeIndex, setActiveIndex] = useState(0);
  const [message, setMessage] = useState<MessageState>(EMPTY_MESSAGE);

  const newEquation = useCallback((lvl: Level) => {
    const eq = pickChemEquation(lvl);
    setEquation(eq);
    setCoeffs(emptyCoeffs(eq));
    setActiveIndex(0);
    setMessage(EMPTY_MESSAGE);
  }, []);

  const setLevel = useCallback(
    (lvl: Level) => {
      setLevelState(lvl);
      newEquation(lvl);
    },
    [newEquation]
  );

  const selectSlot = useCallback(
    (i: number) => setActiveIndex(i),
    []
  );

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
    if (!result.balanced) {
      setMessage({ text: result.reason ?? "Pas encore équilibré", variant: "error" });
      return;
    }
    if (!result.simplified) {
      setMessage({
        text: "Équilibré, mais simplifiable — trouve la proportion la plus simple",
        variant: "error",
      });
      return;
    }
    setMessage({ text: "Équilibré !", variant: "success" });
    onCorrect();
    window.setTimeout(() => newEquation(level), 1100);
  }, [coeffs, equation, level, newEquation, onCorrect]);

  const skip = useCallback(() => newEquation(level), [level, newEquation]);

  return {
    level,
    equation,
    coeffs,
    activeIndex,
    message,
    setLevel,
    selectSlot,
    typeChar,
    backspace,
    check,
    skip,
  };
}
