import { useCallback, useState } from "react";
import { checkConversionAnswer, generateConversion } from "../science/conversions";
import type { ConversionQuestion } from "../science/conversions";
import { todaySeed, withSeed } from "../game/seededRandom";
import { useDailyProgress } from "./useDailyProgress";
import type { MessageState } from "./useMathdle";

const EMPTY_MESSAGE: MessageState = { text: "", variant: "" };
const DAILY_LEVEL = "moyen" as const;
const MAX_ATTEMPTS = 3;

export function useScienceDaily() {
  const { record, alreadyPlayedToday, complete, loaded } = useDailyProgress("science");

  const [question] = useState<ConversionQuestion>(() =>
    withSeed(todaySeed(2), () => generateConversion(DAILY_LEVEL))
  );
  const [input, setInput] = useState("");
  const [attempts, setAttempts] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);
  const [message, setMessage] = useState<MessageState>(EMPTY_MESSAGE);

  const locked = alreadyPlayedToday || gameOver;

  const typeChar = useCallback(
    (ch: string) => {
      if (locked) return;
      setInput((s) => (s.length < 8 ? s + ch : s));
    },
    [locked]
  );

  const backspace = useCallback(() => {
    if (locked) return;
    setInput((s) => s.slice(0, -1));
  }, [locked]);

  const check = useCallback(() => {
    if (locked) return;
    const result = checkConversionAnswer(input, question);
    if (result.valid) {
      setGameOver(true);
      setWon(true);
      setMessage({ text: `Exact ! ${input} ${question.toUnit}`, variant: "success" });
      complete(true);
      return;
    }
    const nextAttempts = attempts + 1;
    setAttempts(nextAttempts);
    if (nextAttempts >= MAX_ATTEMPTS) {
      setGameOver(true);
      setWon(false);
      setMessage({
        text: `Perdu — la bonne réponse était ${question.answer} ${question.toUnit}`,
        variant: "error",
      });
      complete(false);
    } else {
      setMessage({
        text: `${result.reason ?? "Ce n'est pas ça"} (${MAX_ATTEMPTS - nextAttempts} essai${MAX_ATTEMPTS - nextAttempts > 1 ? "s" : ""} restant${MAX_ATTEMPTS - nextAttempts > 1 ? "s" : ""})`,
        variant: "error",
      });
    }
  }, [locked, input, question, attempts, complete]);

  return {
    question,
    input,
    message,
    attempts,
    maxAttempts: MAX_ATTEMPTS,
    gameOver,
    won,
    typeChar,
    backspace,
    check,
    alreadyPlayedToday,
    dayStreak: record.streak,
    lastWon: record.lastWon,
    loaded,
  };
}
