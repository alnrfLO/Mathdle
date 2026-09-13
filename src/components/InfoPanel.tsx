import { useState, type ReactNode } from "react";
import type { Difficulty, GameMode } from "../game/types";
import "./InfoPanel.css";

interface InfoPanelProps {
  mode: GameMode;
  level: Difficulty;
}

export function InfoPanel({ mode, level }: InfoPanelProps) {
  const [open, setOpen] = useState(false);

  let content: ReactNode;
  if (mode === "classique" && level === "impossible") {
    content = (
      <>
        <b>Impossible :</b> l'équation secrète vient d'une banque de limites, intégrales et
        dérivées. Un indice affiché en haut te donne sa nature (limite, dérivée, intégrale ou
        racine carrée) pour te donner un point de départ. Les cases se comparent comme
        d'habitude, mais aucune vérification mathématique n'est faite sur tes essais : tape ce
        que tu penses être juste, la couleur des cases est ton autre indice.
      </>
    );
  } else if (mode === "classique") {
    content = (
      <>
        <b>Classique :</b> devine l'équation secrète avant d'épuiser tes essais. Après chaque
        tentative, chaque case devient{" "}
        <b style={{ color: "var(--state-correct)" }}>verte</b> (bon caractère, bonne place),{" "}
        <b style={{ color: "var(--state-present)" }}>orange</b> (bon caractère, mauvaise place),
        ou <b style={{ color: "var(--ink-dim)" }}>grise</b> (absent). Ta tentative doit être une
        équation vraie de la même longueur.
      </>
    );
  } else {
    content = (
      <>
        <b>Cible libre :</b> un nombre à atteindre s'affiche. Construis une expression qui donne
        exactement ce résultat, en utilisant pile le nombre de caractères imposé.
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
