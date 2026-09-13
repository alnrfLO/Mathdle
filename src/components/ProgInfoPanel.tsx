import { useState } from "react";
import "./InfoPanel.css";

type ProgType = "trous" | "blanche";

interface ProgInfoPanelProps {
  progType: ProgType;
}

export function ProgInfoPanel({ progType }: ProgInfoPanelProps) {
  const [open, setOpen] = useState(false);

  const content =
    progType === "trous" ? (
      <>
        <b>Extrait à trous :</b> le squelette du code (mots-clés, ponctuation) est déjà affiché.
        Clique sur une case vide et tape le bon token pour la remplir. Une fois tout rempli,
        vérifie — comme en Chimie, une équation vide te coûte une vie si tu épuises tes essais.
      </>
    ) : (
      <>
        <b>Page blanche :</b> devine tout le code, token par token, avant d'épuiser tes essais —
        comme le mode Impossible des maths. Chaque case devient{" "}
        <b style={{ color: "var(--state-correct)" }}>verte</b> (bon token, bonne place) ou{" "}
        <b style={{ color: "var(--state-present)" }}>orange</b> (bon token, mauvaise place) après
        validation. Même exercice, même solution, quel que soit le langage choisi.
      </>
    );

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
