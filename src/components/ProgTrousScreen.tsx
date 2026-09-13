import type { MessageState } from "../hooks/useMathdle";
import "./ChemistryScreen.css";

interface ProgTrousScreenProps {
  titre: string;
  enonce: string;
  tokens: string[];
  answers: (string | null)[];
  blanks: number[];
  activeIndex: number;
  message: MessageState;
  gameOver: boolean;
  onSelectSlot: (i: number) => void;
  onSkip: () => void;
  onCheck: () => void;
}

export function ProgTrousScreen({
  titre,
  enonce,
  tokens,
  answers,
  blanks,
  activeIndex,
  message,
  gameOver,
  onSelectSlot,
  onSkip,
  onCheck,
}: ProgTrousScreenProps) {
  const blankSet = new Set(blanks);

  return (
    <div className="chem">
      <p className="chem__eyebrow">{titre.toUpperCase()}</p>

      <p className="chem__hint">{enonce}</p>

      <div className="chem__equation" style={{ flexWrap: "wrap", rowGap: "8px" }}>
        {tokens.map((tok, i) =>
          blankSet.has(i) ? (
            <button
              key={i}
              type="button"
              className={"chem__slot" + (activeIndex === i ? " chem__slot--active" : "")}
              onClick={() => onSelectSlot(i)}
              disabled={gameOver}
            >
              {answers[i] ?? ""}
            </button>
          ) : (
            <span className="chem__formula" key={i}>
              {tok}
            </span>
          )
        )}
      </div>

      <div className={"message" + (message.variant ? ` message--${message.variant}` : "")}>
        {message.text}
      </div>

      {gameOver ? (
        <div className="science__actions">
          <button type="button" className="science-btn science-btn--primary" onClick={onSkip}>
            Nouvel exercice
          </button>
        </div>
      ) : (
        <div className="science__actions">
          <button type="button" className="science-btn" onClick={onSkip}>
            Passer
          </button>
          <button type="button" className="science-btn science-btn--primary" onClick={onCheck}>
            Vérifier
          </button>
        </div>
      )}
    </div>
  );
}
