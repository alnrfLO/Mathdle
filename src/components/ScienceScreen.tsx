import type { ConversionQuestion } from "../science/conversions";
import type { MessageState } from "../hooks/useMathdle";
import "./ScienceScreen.css";

interface ScienceScreenProps {
  question: ConversionQuestion;
  input: string;
  message: MessageState;
  streak: number;
  onSkip: () => void;
  onCheck: () => void;
}

export function ScienceScreen({ question, input, message, streak, onSkip, onCheck }: ScienceScreenProps) {
  return (
    <div className="science">
      <p className="science__eyebrow">CONVERSION · SÉRIE {streak}</p>

      <div className="science__readout">
        <div className="science__question">
          {question.value} {question.fromUnit}
        </div>
        <div className="science__arrow">=</div>
        <div className="science__answer-line">
          {input || <span className="science__placeholder">?</span>}
          <span className="science__cursor">▏</span>
          <span className="science__unit">{question.toUnit}</span>
        </div>
      </div>

      <div className={"message" + (message.variant ? ` message--${message.variant}` : "")}>
        {message.text}
      </div>

      <div className="science__actions">
        <button type="button" className="science-btn" onClick={onSkip}>
          Passer
        </button>
        <button type="button" className="science-btn science-btn--primary" onClick={onCheck}>
          Vérifier
        </button>
      </div>
    </div>
  );
}
