import type { ConversionQuestion } from "../science/conversions";
import type { MessageState } from "../hooks/useMathdle";
import "./DailyScreen.css";
import "./ScienceScreen.css";

interface ScienceDailyScreenProps {
  question: ConversionQuestion;
  input: string;
  message: MessageState;
  attempts: number;
  maxAttempts: number;
  gameOver: boolean;
  won: boolean;
  alreadyPlayedToday: boolean;
  dayStreak: number;
  lastWon: boolean;
}

export function ScienceDailyScreen({
  question,
  input,
  message,
  gameOver,
  won,
  alreadyPlayedToday,
  dayStreak,
  lastWon,
}: ScienceDailyScreenProps) {
  if (alreadyPlayedToday) {
    return (
      <div className="daily">
        <p className="daily__eyebrow">ÉNIGME DU JOUR</p>
        <p className={"daily__result" + (lastWon ? " daily__result--won" : "")}>
          {lastWon ? "Déjà réussie aujourd'hui ✓" : "Déjà tentée aujourd'hui — perdu"}
        </p>
        <p className="daily__streak">Série de jours : {dayStreak} 🔥</p>
        <p className="daily__comeback">Reviens demain pour la prochaine !</p>
      </div>
    );
  }

  return (
    <div className="science">
      <p className="science__eyebrow">ÉNIGME DU JOUR · SÉRIE {dayStreak} 🔥</p>

      <div className="science__readout">
        <div className="science__question">
          {question.value} {question.fromUnit}
        </div>
        <div className="science__arrow">=</div>
        <div className="science__answer-line">
          {input || <span className="science__placeholder">?</span>}
          {!gameOver && <span className="science__cursor">▏</span>}
          <span className="science__unit">{question.toUnit}</span>
        </div>
      </div>

      <div className={"message" + (message.variant ? ` message--${message.variant}` : "")}>
        {message.text}
      </div>

      {gameOver && (
        <p className={"daily__result" + (won ? " daily__result--won" : "")}>
          {won ? "Trouvé ! Reviens demain 🔥" : "Reviens demain pour la suivante"}
        </p>
      )}
    </div>
  );
}
