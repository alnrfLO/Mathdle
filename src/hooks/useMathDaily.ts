import { useCallback, useState } from "react";
import { checkEquation, compareGuess } from "../game/engine";
import { generateEquation } from "../game/generator";
import { LEVELS } from "../game/config";
import { todaySeed, withSeed } from "../game/seededRandom";
import { useDailyProgress } from "./useDailyProgress";
import type { GridRow, MessageState } from "./useMathdle";

const EMPTY_MESSAGE: MessageState = { text: "", variant: "" };
const DAILY_LEVEL = "moyen" as const;

export function useMathDaily() {
  const { record, alreadyPlayedToday, complete, loaded } = useDailyProgress("math");
  const maxAttempts = LEVELS[DAILY_LEVEL].maxAttempts;

  const [target] = useState<string[]>(() =>
    withSeed(todaySeed(1), () => generateEquation(DAILY_LEVEL)).split("")
  );
  const [rows, setRows] = useState<GridRow[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [rowIndex, setRowIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState<MessageState>(EMPTY_MESSAGE);

  const locked = alreadyPlayedToday || gameOver;

  const typeChar = useCallback(
    (ch: string) => {
      if (locked) return;
      setCurrentGuess((g) => (g.length < target.length ? [...g, ch] : g));
    },
    [locked, target.length]
  );

  const backspace = useCallback(() => {
    if (locked) return;
    setCurrentGuess((g) => g.slice(0, -1));
  }, [locked]);

  const submitGuess = useCallback(() => {
    if (locked) return;
    if (currentGuess.length !== target.length) {
      setMessage({ text: `Ta réponse doit faire ${target.length} caractères`, variant: "error" });
      return;
    }
    const check = checkEquation(currentGuess.join(""));
    if (!check.valid) {
      setMessage({ text: `Équation invalide — ${check.reason}`, variant: "error" });
      return;
    }
    setMessage(EMPTY_MESSAGE);
    const result = compareGuess(currentGuess, target);
    setRows((r) => [...r, { guess: currentGuess, result }]);
    const hasWon = result.every((r) => r === "correct");
    const next = rowIndex + 1;
    setRowIndex(next);
    setCurrentGuess([]);

    if (hasWon) {
      setGameOver(true);
      setWon(true);
      complete(true);
    } else if (next >= maxAttempts) {
      setGameOver(true);
      setWon(false);
      complete(false);
    }
  }, [locked, currentGuess, target, rowIndex, maxAttempts, complete]);

  return {
    target,
    rows,
    currentGuess,
    rowIndex,
    maxAttempts,
    gameOver,
    won,
    message,
    level: DAILY_LEVEL,
    typeChar,
    backspace,
    submitGuess,
    alreadyPlayedToday,
    dayStreak: record.streak,
    lastWon: record.lastWon,
    loaded,
  };
}
