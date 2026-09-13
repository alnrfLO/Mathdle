import { useCallback, useEffect, useState } from "react";
import { isBlankable, pickProgExercise } from "../game/programming";
import type { ProgExercise, ProgLang, ProgLevel } from "../game/programming";
import type { MessageState } from "./useMathdle";

const EMPTY_MESSAGE: MessageState = { text: "", variant: "" };
const MAX_ATTEMPTS = 4;
const MAX_LIVES = 3;

function blankIndices(ex: ProgExercise): number[] {
  return ex.tokens.map((t, i) => (isBlankable(t) ? i : -1)).filter((i) => i !== -1);
}

function emptyAnswers(ex: ProgExercise): (string | null)[] {
  return new Array(ex.tokens.length).fill(null);
}

export function useProgATrous(lang: ProgLang, level: ProgLevel, onCorrect: () => void, onStreakReset: () => void) {
  const [exercise, setExercise] = useState<ProgExercise>(() => pickProgExercise(lang, level));
  const [answers, setAnswers] = useState<(string | null)[]>(() => emptyAnswers(exercise));
  const [activeIndex, setActiveIndex] = useState<number>(() => blankIndices(exercise)[0] ?? 0);
  const [message, setMessage] = useState<MessageState>(EMPTY_MESSAGE);
  const [attempts, setAttempts] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [gameOver, setGameOver] = useState(false);

  const blanks = blankIndices(exercise);

  const newExercise = useCallback((l: ProgLang, lvl: ProgLevel) => {
    const ex = pickProgExercise(l, lvl);
    setExercise(ex);
    setAnswers(emptyAnswers(ex));
    setActiveIndex(blankIndices(ex)[0] ?? 0);
    setAttempts(0);
    setMessage(EMPTY_MESSAGE);
    setGameOver(false);
  }, []);

  // Langage et niveau sont partagés avec le mode "page blanche" (gérés par
  // l'appelant) : on régénère un exercice frais dès que l'un des deux change.
  useEffect(() => {
    newExercise(lang, level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [lang, level]);

  const selectSlot = useCallback(
    (i: number) => {
      if (gameOver) return;
      setActiveIndex(i);
    },
    [gameOver]
  );

  const typeChar = useCallback(
    (token: string) => {
      if (gameOver) return;
      setAnswers((a) => {
        const next = [...a];
        next[activeIndex] = token;
        return next;
      });
      // avance au prochain trou vide
      const idx = blanks.indexOf(activeIndex);
      const nextBlank = blanks.slice(idx + 1).find((i) => answers[i] === null);
      if (nextBlank !== undefined) setActiveIndex(nextBlank);
    },
    [gameOver, activeIndex, blanks, answers]
  );

  const backspace = useCallback(() => {
    if (gameOver) return;
    setAnswers((a) => {
      const next = [...a];
      next[activeIndex] = null;
      return next;
    });
  }, [gameOver, activeIndex]);

  const check = useCallback(() => {
    if (gameOver) return;
    const allCorrect = blanks.every((i) => answers[i] === exercise.tokens[i]);
    const allFilled = blanks.every((i) => answers[i] !== null);

    if (!allFilled) {
      setMessage({ text: "Remplis tous les trous avant de vérifier", variant: "error" });
      return;
    }

    if (allCorrect) {
      setMessage({ text: "Correct !", variant: "success" });
      setLives(MAX_LIVES);
      onCorrect();
      window.setTimeout(() => newExercise(lang, level), 1100);
      return;
    }

    const attemptsLeft = MAX_ATTEMPTS - (attempts + 1);
    if (attemptsLeft > 0) {
      setAttempts((a) => a + 1);
      setMessage({
        text: `Pas encore ça (${attemptsLeft} essai${attemptsLeft > 1 ? "s" : ""} restant${attemptsLeft > 1 ? "s" : ""})`,
        variant: "error",
      });
      return;
    }

    // Plus d'essais : ça coûte une vie, on affiche la solution et on
    // attend un clic manuel pour continuer (pas de relance auto).
    const solution = exercise.tokens.join(" ");
    const remainingLives = lives - 1;
    if (remainingLives <= 0) {
      onStreakReset();
      setLives(MAX_LIVES);
      setMessage({ text: `Plus de vies — série remise à zéro. C'était : ${solution}`, variant: "error" });
    } else {
      setLives(remainingLives);
      setMessage({ text: `Perdu — c'était : ${solution} (${remainingLives}/${MAX_LIVES} vies)`, variant: "error" });
    }
    setGameOver(true);
  }, [gameOver, blanks, answers, exercise, attempts, lives, lang, level, newExercise, onCorrect, onStreakReset]);

  const skip = useCallback(() => newExercise(lang, level), [lang, level, newExercise]);

  return {
    exercise,
    answers,
    activeIndex,
    blanks,
    message,
    attempts,
    maxAttempts: MAX_ATTEMPTS,
    lives,
    maxLives: MAX_LIVES,
    gameOver,
    keys: exercise.keys,
    extraKeys: exercise.extraKeys,
    selectSlot,
    typeChar,
    backspace,
    check,
    skip,
  };
}
