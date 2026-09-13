import { useCallback, useEffect, useState } from "react";
import { checkEquation, checkExpression, compareGuess } from "../game/engine";
import { generateEquation, randInt } from "../game/generator";
import { pickImpossibleTarget } from "../game/bank";
import { CIBLE_LEVELS, LEVELS } from "../game/config";
import type { CellState, Difficulty, GameMode } from "../game/types";

export interface GridRow {
  guess: string[];
  result: CellState[];
}

export interface MessageState {
  text: string;
  variant: "error" | "success" | "";
}

const EMPTY_MESSAGE: MessageState = { text: "", variant: "" };
const MAX_LIVES = 3;

function freshClassiqueTarget(level: Difficulty): string[] {
  return level === "impossible" ? pickImpossibleTarget() : generateEquation(level).split("");
}

export function useMathdle() {
  const [level, setLevelState] = useState<Difficulty>("facile");
  const [mode, setModeState] = useState<GameMode>("classique");
  const [streak, setStreak] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [streakJustReset, setStreakJustReset] = useState(false);

  // --- Mode Classique ---
  const [target, setTarget] = useState<string[]>(() => freshClassiqueTarget("facile"));
  const [rows, setRows] = useState<GridRow[]>([]);
  const [currentGuess, setCurrentGuess] = useState<string[]>([]);
  const [rowIndex, setRowIndex] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [showBanner, setShowBanner] = useState(false);
  const [classiqueMessage, setClassiqueMessage] = useState<MessageState>(EMPTY_MESSAGE);
  const [shakeRow, setShakeRow] = useState<number | null>(null);
  const [popRow, setPopRow] = useState<number | null>(null);

  // --- Mode Cible libre ---
  const [cibleTarget, setCibleTarget] = useState(0);
  const [cibleInput, setCibleInput] = useState("");
  const [cibleMessage, setCibleMessage] = useState<MessageState>(EMPTY_MESSAGE);

  const startClassique = useCallback((lvl: Difficulty) => {
    setTarget(freshClassiqueTarget(lvl));
    setRows([]);
    setCurrentGuess([]);
    setRowIndex(0);
    setGameOver(false);
    setWon(false);
    setShowBanner(false);
    setClassiqueMessage(EMPTY_MESSAGE);
    setStreakJustReset(false);
  }, []);

  const startCible = useCallback((lvl: Exclude<Difficulty, "impossible">) => {
    const cfg = CIBLE_LEVELS[lvl];
    setCibleTarget(randInt(cfg.targetRange[0], cfg.targetRange[1]));
    setCibleInput("");
    setCibleMessage(EMPTY_MESSAGE);
  }, []);

  // Démarre une partie classique au montage
  useEffect(() => {
    startClassique("facile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setLevel = useCallback(
    (lvl: Difficulty) => {
      setLevelState(lvl);
      if (lvl === "impossible") {
        // Pas de mode Cible libre pour ce niveau : on force Classique
        setModeState("classique");
        startClassique(lvl);
        return;
      }
      if (mode === "classique") {
        startClassique(lvl);
      } else {
        startCible(lvl);
      }
    },
    [mode, startClassique, startCible]
  );

  const setMode = useCallback(
    (m: GameMode) => {
      setModeState(m);
      if (m === "cible" && level === "impossible") {
        setLevelState("difficile");
        startCible("difficile");
      } else if (m === "cible") {
        startCible(level as Exclude<Difficulty, "impossible">);
      } else {
        startClassique(level);
      }
    },
    [level, startCible, startClassique]
  );

  const triggerShake = useCallback((row: number) => {
    setShakeRow(row);
    // reset pour permettre de rejouer l'animation sur la même ligne
    window.setTimeout(() => setShakeRow((r) => (r === row ? null : r)), 360);
  }, []);

  const typeChar = useCallback(
    (ch: string) => {
      if (mode === "classique") {
        if (gameOver) return;
        setCurrentGuess((g) => (g.length < target.length ? [...g, ch] : g));
      } else {
        const cfg = CIBLE_LEVELS[level as Exclude<Difficulty, "impossible">];
        setCibleInput((s) => (s.length < cfg.length ? s + ch : s));
      }
    },
    [mode, gameOver, target.length, level]
  );

  const backspace = useCallback(() => {
    if (mode === "classique") {
      if (gameOver) return;
      setCurrentGuess((g) => g.slice(0, -1));
    } else {
      setCibleInput((s) => s.slice(0, -1));
    }
  }, [mode, gameOver]);

  const submitGuess = useCallback(() => {
    if (gameOver) return;
    if (currentGuess.length !== target.length) {
      triggerShake(rowIndex);
      setClassiqueMessage({
        text: `Ta réponse doit faire ${target.length} caractères`,
        variant: "error",
      });
      return;
    }
    if (level !== "impossible") {
      const check = checkEquation(currentGuess.join(""));
      if (!check.valid) {
        triggerShake(rowIndex);
        setClassiqueMessage({ text: `Équation invalide — ${check.reason}`, variant: "error" });
        return;
      }
    }
    setClassiqueMessage(EMPTY_MESSAGE);
    const result = compareGuess(currentGuess, target);
    const finishedRowIndex = rowIndex;
    setRows((r) => [...r, { guess: currentGuess, result }]);
    const hasWon = result.every((r) => r === "correct");
    const nextRowIndex = rowIndex + 1;
    setRowIndex(nextRowIndex);
    setCurrentGuess([]);
    setPopRow(finishedRowIndex);
    window.setTimeout(() => setPopRow((r) => (r === finishedRowIndex ? null : r)), 260);

    if (hasWon) {
      setGameOver(true);
      setWon(true);
      setStreak((s) => s + 1);
      setLives(MAX_LIVES);
      setStreakJustReset(false);
      setShowBanner(true);
    } else if (nextRowIndex >= LEVELS[level].maxAttempts) {
      setGameOver(true);
      setWon(false);
      setShowBanner(true);
      const remaining = lives - 1;
      if (remaining <= 0) {
        setStreak(0);
        setLives(MAX_LIVES);
        setStreakJustReset(true);
      } else {
        setLives(remaining);
        setStreakJustReset(false);
      }
    }
  }, [gameOver, currentGuess, target, rowIndex, level, triggerShake, lives]);

  const checkCible = useCallback(() => {
    const cfg = CIBLE_LEVELS[level as Exclude<Difficulty, "impossible">];
    if (cibleInput.length !== cfg.length) {
      setCibleMessage({ text: `Il faut exactement ${cfg.length} caractères`, variant: "error" });
      return;
    }
    const check = checkExpression(cibleInput);
    if (!check.valid) {
      setCibleMessage({ text: `Expression invalide — ${check.reason}`, variant: "error" });
      return;
    }
    if (Math.abs((check.value as number) - cibleTarget) < 1e-9) {
      setStreak((s) => s + 1);
      setCibleMessage({ text: `Exact ! ${cibleInput} = ${cibleTarget}`, variant: "success" });
      window.setTimeout(() => startCible(level as Exclude<Difficulty, "impossible">), 1100);
    } else {
      setCibleMessage({ text: `Ça donne ${check.value}, pas ${cibleTarget}`, variant: "error" });
    }
  }, [level, cibleInput, cibleTarget, startCible]);

  const newGame = useCallback(() => {
    if (mode === "classique") startClassique(level);
    else startCible(level as Exclude<Difficulty, "impossible">);
  }, [mode, level, startClassique, startCible]);

  return {
    level,
    mode,
    streak,
    lives,
    maxLives: MAX_LIVES,
    setLevel,
    setMode,
    newGame,
    classique: {
      target,
      rows,
      currentGuess,
      rowIndex,
      gameOver,
      won,
      showBanner,
      streakJustReset,
      message: classiqueMessage,
      shakeRow,
      popRow,
      maxAttempts: LEVELS[level].maxAttempts,
      typeChar,
      backspace,
      submitGuess,
    },
    cible: {
      target: cibleTarget,
      input: cibleInput,
      message: cibleMessage,
      config: CIBLE_LEVELS[level === "impossible" ? "difficile" : level],
      typeChar,
      backspace,
      check: checkCible,
      clear: () => setCibleInput(""),
    },
  };
}
