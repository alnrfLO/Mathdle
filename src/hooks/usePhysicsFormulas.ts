import { useCallback, useState } from "react";
import { compareGuess } from "../game/engine";
import { PHYSICS_LEVELS, pickPhysicsFormula } from "../science/physics";
import type { CellState } from "../game/types";
import type { GridRow, MessageState } from "./useMathdle";

const EMPTY_MESSAGE: MessageState = { text: "", variant: "" };
type Level = "facile" | "moyen" | "difficile";

export function usePhysicsFormulas(onCorrect: () => void) {
  const [level, setLevelState] = useState<Level>("facile");
  const [target, setTarget] = useState<string[]>(() => pickPhysicsFormula("facile"));
  const [rows, setRows] = useState<GridRow[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [rowIndex, setRowIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState<MessageState>(EMPTY_MESSAGE);

  const newFormula = useCallback((lvl: Level) => {
    setTarget(pickPhysicsFormula(lvl));
    setRows([]);
    setCurrentGuess([]);
    setRowIndex(0);
    setGameOver(false);
    setWon(false);
    setMessage(EMPTY_MESSAGE);
  }, []);

  const setLevel = useCallback(
    (lvl: Level) => {
      setLevelState(lvl);
      newFormula(lvl);
    },
    [newFormula]
  );

  const typeChar = useCallback(
    (ch: string) => {
      if (gameOver) return;
      setCurrentGuess((g) => (g.length < target.length ? [...g, ch] : g));
    },
    [gameOver, target.length]
  );

  const backspace = useCallback(() => {
    if (gameOver) return;
    setCurrentGuess((g) => g.slice(0, -1));
  }, [gameOver]);

  const submitGuess = useCallback(() => {
    if (gameOver) return;
    if (currentGuess.length !== target.length) {
      setMessage({ text: `Ta réponse doit faire ${target.length} tokens`, variant: "error" });
      return;
    }
    setMessage(EMPTY_MESSAGE);
    const result: CellState[] = compareGuess(currentGuess, target);
    setRows((r) => [...r, { guess: currentGuess, result }]);
    const hasWon = result.every((r) => r === "correct");
    const nextRowIndex = rowIndex + 1;
    setRowIndex(nextRowIndex);
    setCurrentGuess([]);

    if (hasWon) {
      setGameOver(true);
      setWon(true);
      onCorrect();
    } else if (nextRowIndex >= PHYSICS_LEVELS[level].maxAttempts) {
      setGameOver(true);
      setWon(false);
    }
  }, [gameOver, currentGuess, target, rowIndex, level, onCorrect]);

  const skip = useCallback(() => newFormula(level), [level, newFormula]);

  return {
    level,
    target,
    rows,
    currentGuess,
    rowIndex,
    gameOver,
    won,
    message,
    maxAttempts: PHYSICS_LEVELS[level].maxAttempts,
    keys: PHYSICS_LEVELS[level].keys,
    extraKeys: PHYSICS_LEVELS[level].extraKeys,
    setLevel,
    typeChar,
    backspace,
    submitGuess,
    skip,
  };
}
