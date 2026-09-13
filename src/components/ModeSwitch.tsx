import type { GameMode } from "../game/types";
import "./ModeSwitch.css";

interface ModeSwitchProps {
  mode: GameMode;
  disabled: boolean;
  onChange: (mode: GameMode) => void;
}

export function ModeSwitch({ mode, disabled, onChange }: ModeSwitchProps) {
  return (
    <div className="mode-switch">
      <button
        type="button"
        className={"mode-btn" + (mode === "classique" ? " mode-btn--active" : "")}
        onClick={() => onChange("classique")}
      >
        Classique
      </button>
      <button
        type="button"
        className={"mode-btn" + (mode === "cible" ? " mode-btn--active" : "")}
        disabled={disabled}
        onClick={() => onChange("cible")}
      >
        Cible libre
      </button>
    </div>
  );
}
