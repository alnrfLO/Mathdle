import { useState, type ReactNode } from "react";
import "./InfoPanel.css";

type ScienceGame = "conversions" | "chimie" | "formules";

interface ScienceInfoPanelProps {
  subject: ScienceGame;
}

export function ScienceInfoPanel({ subject }: ScienceInfoPanelProps) {
  const [open, setOpen] = useState(false);

  let content: ReactNode;
  if (subject === "chimie") {
    content = (
      <>
        <b>Chimie :</b> équilibre l'équation en remplissant chaque case avec le bon coefficient
        (≥ 1). Un indice affiché en haut donne le type de réaction (synthèse, décomposition,
        combustion ou déplacement) pour te donner un point de départ. Contrairement au mode
        Impossible des maths, c'est un vrai calcul sur les atomes : n'importe quelle proportion
        correcte et la plus simple possible est acceptée.
      </>
    );
  } else if (subject === "formules") {
    content = (
      <>
        <b>Formules :</b> devine la formule physique secrète avant d'épuiser tes essais, comme en
        mode Classique — chaque case devient{" "}
        <b style={{ color: "var(--state-correct)" }}>verte</b> (bon caractère, bonne place) ou{" "}
        <b style={{ color: "var(--state-present)" }}>orange</b> (bon caractère, mauvaise place)
        après validation.
      </>
    );
  } else {
    content = (
      <>
        <b>Conversions :</b> une valeur avec son unité s'affiche, convertis-la dans l'unité
        demandée. Pas de nombre d'essais limité — tu peux corriger ta réponse et revérifier, ou
        passer la question si elle te bloque.
      </>
    );
  }

  return (
    <div className="info-panel">
      <div className="info-toggle">
        <button type="button" onClick={() => setOpen((o) => !o)}>
          Comment jouer ?
        </button>
      </div>
      <div className={"info-box" + (open ? " info-box--open" : "")}>{content}</div>
    </div>
  );
}
