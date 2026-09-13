import { useCallback, useEffect, useState } from "react";
import { checkConversionAnswer, generateConversion } from "../science/conversions";
import type { ConversionQuestion } from "../science/conversions";
import type { Difficulty } from "../game/types";
import type { MessageState } from "./useMathdle";

const EMPTY_MESSAGE: MessageState = { text: "", variant: "" };

export function useScience(onCorrect: () => void) {
  const [level, setLevel] = useState<Exclude<Difficulty, "impossible">>("facile");
  const [question, setQuestion] = useState<ConversionQuestion>(() => generateConversion("facile"));
  const [input, setInput] = useState("");
  const [message, setMessage] = useState<MessageState>(EMPTY_MESSAGE);

  const newQuestion = useCallback((lvl: Exclude<Difficulty, "impossible">) => {
    setQuestion(generateConversion(lvl));
    setInput("");
    setMessage(EMPTY_MESSAGE);
  }, []);

  useEffect(() => {
    newQuestion(level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const changeLevel = useCallback(
    (lvl: Exclude<Difficulty, "impossible">) => {
      setLevel(lvl);
      newQuestion(lvl);
    },
    [newQuestion]
  );

  const typeChar = useCallback((ch: string) => {
    setInput((s) => (s.length < 8 ? s + ch : s));
  }, []);

  const backspace = useCallback(() => {
    setInput((s) => s.slice(0, -1));
  }, []);

  const check = useCallback(() => {
    const result = checkConversionAnswer(input, question);
    if (!result.valid) {
      setMessage({
        text: result.reason ?? "Pas tout à fait — réessaie",
        variant: "error",
      });
      return;
    }
    setMessage({ text: `Exact ! ${input} ${question.toUnit}`, variant: "success" });
    onCorrect();
    window.setTimeout(() => newQuestion(level), 1000);
  }, [input, question, level, newQuestion, onCorrect]);

  // Passer une question ne coûte ni ne rapporte rien : c'est juste une
  // question à choix unique, pas un mode à tentatives limitées.
  const skip = useCallback(() => newQuestion(level), [level, newQuestion]);

  return {
    level,
    question,
    input,
    message,
    setLevel: changeLevel,
    typeChar,
    backspace,
    check,
    skip,
    clear: () => setInput(""),
  };
}
