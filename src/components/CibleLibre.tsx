import { Cell } from "./Cell";
import type { CibleLevelConfig } from "../game/config";
import type { MessageState } from "../hooks/useMathdle";
import "./Cell.css";
import "./CibleLibre.css";

interface CibleLibreProps {
  target: number;
  input: string;
  config: CibleLevelConfig;
  message: MessageState;
  onClear: () => void;
  onCheck: () => void;
}

export function CibleLibre({ target, input, config, message, onClear, onCheck }: CibleLibreProps) {
  return (
    <div className="cible">
      <div className="target-readout">
        <span className="target-readout__label">CIBLE</span>
        <span className="target-readout__num">{target}</span>
      </div>

      <p className="constraint">
        {config.length} caractères · <b>{config.keys.join(" ")}</b>
      </p>

      <div className="cible-input">
        {Array.from({ length: config.length }, (_, i) => (
          <Cell key={i} value={input[i]} state={input[i] ? "filled" : "empty"} />
        ))}
      </div>

      <div className={"message" + (message.variant ? ` message--${message.variant}` : "")}>
        {message.text}
      </div>

      <div className="cible-actions">
        <button type="button" className="cible-btn" onClick={onClear}>
          Effacer
        </button>
        <button type="button" className="cible-btn cible-btn--primary" onClick={onCheck}>
          Vérifier
        </button>
      </div>
    </div>
  );
}
