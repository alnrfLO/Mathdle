import "./Keyboard.css";

interface KeyboardProps {
  opKeys: string[];
  extraKeys?: string[];
  onKey: (ch: string) => void;
  onBackspace: () => void;
  onSubmit: () => void;
  submitLabel: string;
}

const DIGITS_ROW_1 = ["1", "2", "3", "4", "5"];
const DIGITS_ROW_2 = ["6", "7", "8", "9", "0"];

export function Keyboard({
  opKeys,
  extraKeys,
  onKey,
  onBackspace,
  onSubmit,
  submitLabel,
}: KeyboardProps) {
  return (
    <div className="keyboard">
      <div className="kb-row">
        {DIGITS_ROW_1.map((k) => (
          <button key={k} type="button" className="key" onClick={() => onKey(k)}>
            {k}
          </button>
        ))}
      </div>
      <div className="kb-row">
        {DIGITS_ROW_2.map((k) => (
          <button key={k} type="button" className="key" onClick={() => onKey(k)}>
            {k}
          </button>
        ))}
      </div>
      <div className="kb-row">
        {opKeys.map((k) => (
          <button key={k} type="button" className="key key--op" onClick={() => onKey(k)}>
            {k}
          </button>
        ))}
      </div>
      {extraKeys && extraKeys.length > 0 && (
        <div className="kb-row">
          {extraKeys.map((k) => (
            <button key={k} type="button" className="key key--symbol" onClick={() => onKey(k)}>
              {k}
            </button>
          ))}
        </div>
      )}
      <div className="kb-row">
        <button type="button" className="key key--wide" onClick={onBackspace}>
          Effacer
        </button>
        <button type="button" className="key key--wide key--enter" onClick={onSubmit}>
          {submitLabel}
        </button>
      </div>
    </div>
  );
}
