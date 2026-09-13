import { useCallback, useState } from "react";
import { compareGuess } from "../game/engine";
import { pickProgExercise } from "../game/programming";
import type { ProgExercise, ProgLang } from "../game/programming";
import type { CellState } from "../game/types";
import { todaySeed, withSeed } from "../game/seededRandom";
import { useDailyProgress } from "./useDailyProgress";
import type { GridRow, MessageState } from "./useMathdle";

const EMPTY_MESSAGE: MessageState = { text: "", variant: "" };
const DAILY_LEVEL = "moyen" as const;
// Un sel différent par langage pour que les 4 énigmes du jour ne soient pas
// forcément la même variante d'exercice.
const LANG_SALT: Record<ProgLang, number> = { javascript: 10, python: 11, java: 12, cpp: 13 };

export function useProgDaily(lang: ProgLang) {
  const { record, alreadyPlayedToday, complete, loaded } = useDailyProgress(`prog-${lang}`);

  const [exercise] = useState<ProgExercise>(() =>
    withSeed(todaySeed(LANG_SALT[lang]), () => pickProgExercise(lang, DAILY_LEVEL))
  );
  const target = exercise.tokens;
  const maxAttempts = 8;

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
      setMessage({ text: `Ta réponse doit faire ${target.length} tokens`, variant: "error" });
      return;
    }
    setMessage(EMPTY_MESSAGE);
    const result: CellState[] = compareGuess(currentGuess, target);
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
  }, [locked, currentGuess, target, rowIndex, complete]);

  return {
    exercise,
    target,
    rows,
    currentGuess,
    rowIndex,
    maxAttempts,
    gameOver,
    won,
    message,
    keys: exercise.keys,
    extraKeys: exercise.extraKeys,
    typeChar,
    backspace,
    submitGuess,
    alreadyPlayedToday,
    dayStreak: record.streak,
    lastWon: record.lastWon,
    loaded,
  };
}
