import type { ReactNode } from "react";
import { classifyReaction } from "../science/chemistry";
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

// Découpe une formule ("Ca(OH)2", "Al2(SO4)3") pour passer ses chiffres en
// indice, sans changer la police (contrairement à des caractères unicode
// ₀₋₉, ça reste dans la même fonte que le reste de l'écran LCD).
function renderFormula(formula: string): ReactNode {
  return formula.split(/([0-9]+)/).map((part, i) => (/^[0-9]+$/.test(part) ? <sub key={i}>{part}</sub> : part));
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
  const nature = classifyReaction(equation);

  return (
    <div className="chem">
      <p className="chem__eyebrow">ÉQUILIBRE LA RÉACTION</p>

      <p className="chem__hint">
        Indice : <strong>{nature}</strong>
      </p>

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
            <span className="chem__formula">{renderFormula(formula)}</span>
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
