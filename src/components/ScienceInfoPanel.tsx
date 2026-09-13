import { useState } from "react";
import "./InfoPanel.css";

export function ScienceInfoPanel() {
  const [open, setOpen] = useState(false);

  return (
    <div className="info-panel">
      <div className="info-toggle">
        <button type="button" onClick={() => setOpen((o) => !o)}>
          Comment jouer ?
        </button>
      </div>
      <div className={"info-box" + (open ? " info-box--open" : "")}>
        <b>Conversions :</b> une valeur avec son unité s'affiche, convertis-la dans l'unité
        demandée. Pas de nombre d'essais limité — tu peux corriger ta réponse et revérifier, ou
        passer la question si elle te bloque.
      </div>
    </div>
  );
}
