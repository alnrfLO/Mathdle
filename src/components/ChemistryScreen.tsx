import type { ChemEquation } from "../science/chemistry";
import type { MessageState } from "../hooks/useMathdle";
import "./ChemistryScreen.css";

interface ChemistryScreenProps {
  equation: ChemEquation;
  coeffs: (number | null)[];
  activeIndex: number;
  message: MessageState;
  onSelectSlot: (i: number) => void;
  onSkip: () => void;
  onCheck: () => void;
}

export function ChemistryScreen({
  equation,
  coeffs,
  activeIndex,
  message,
  onSelectSlot,
  onSkip,
  onCheck,
}: ChemistryScreenProps) {
  const compounds = [...equation.reactants, ...equation.products];
  const reactantCount = equation.reactants.length;

  return (
    <div className="chem">
      <p className="chem__eyebrow">ÉQUILIBRE LA RÉACTION</p>

      <div className="chem__equation">
        {compounds.map((formula, i) => (
          <span className="chem__term" key={i}>
            {i > 0 && (
              <span className="chem__sep">{i === reactantCount ? "→" : "+"}</span>
            )}
            <button
              type="button"
              className={"chem__slot" + (activeIndex === i ? " chem__slot--active" : "")}
              onClick={() => onSelectSlot(i)}
            >
              {coeffs[i] ?? ""}
            </button>
            <span className="chem__formula">{formula}</span>
          </span>
        ))}
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
