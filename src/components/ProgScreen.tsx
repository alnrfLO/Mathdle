import { Grid } from "./Grid";
import type { GridRow, MessageState } from "../hooks/useMathdle";
import "./PhysicsScreen.css";

interface ProgScreenProps {
  titre: string;
  enonce: string;
  target: string[];
  rows: GridRow[];
  currentGuess: string[];
  rowIndex: number;
  maxAttempts: number;
  gameOver: boolean;
  won: boolean;
  message: MessageState;
  onSkip: () => void;
  onSubmit: () => void;
}

export function ProgScreen({
  titre,
  enonce,
  target,
  rows,
  currentGuess,
  rowIndex,
  maxAttempts,
  gameOver,
  won,
  message,
  onSkip,
  onSubmit,
}: ProgScreenProps) {
  return (
    <div className="physics">
      <p className="chem__eyebrow">{titre.toUpperCase()}</p>

      <p className="chem__hint">{enonce}</p>

      <div
        className={"message" + (message.variant ? ` message--${message.variant}` : "")}
      >
        {message.text}
      </div>

      <Grid
        target={target}
        rows={rows}
        currentGuess={currentGuess}
        rowIndex={rowIndex}
        maxAttempts={maxAttempts}
        gameOver={gameOver}
        isSymbolic
        shakeRow={null}
        popRow={null}
      />

      {gameOver && (
        <div className="physics__reveal">
          <p className={won ? "physics__reveal-text physics__reveal-text--won" : "physics__reveal-text"}>
            {won ? "Trouvé !" : `Perdu — c'était ${target.join(" ")}`}
          </p>
          <button type="button" className="science-btn science-btn--primary" onClick={onSkip}>
            Nouvel exercice
          </button>
        </div>
      )}

      {!gameOver && (
        <div className="science__actions">
          <button type="button" className="science-btn" onClick={onSkip}>
            Passer
          </button>
          <button type="button" className="science-btn science-btn--primary" onClick={onSubmit}>
            Valider
          </button>
        </div>
      )}
    </div>
  );
}
