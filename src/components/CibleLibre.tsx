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
      <div className="target-frame">
        <svg className="target-frame__circle" viewBox="0 0 120 120" aria-hidden="true">
          <path
            d="M60,4 C90,4 116,26 116,60 C116,94 92,116 59,116 C27,116 4,93 4,59 C4,27 29,4 60,4 Z"
            fill="none"
            stroke="var(--chalk-yellow)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
        </svg>
        <div className="target-frame__num">{target}</div>
        <div className="target-frame__label">à atteindre</div>
      </div>

      <p className="constraint">
        Utilise exactement <b>{config.length}</b> caractères. Opérateurs autorisés :{" "}
        <b>{config.keys.join(" ")}</b>
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
