import { Cell } from "./Cell";
import type { GridRow } from "../hooks/useMathdle";
import "./Cell.css";
import "./Grid.css";

interface GridProps {
  target: string[];
  rows: GridRow[];
  currentGuess: string[];
  rowIndex: number;
  maxAttempts: number;
  isSymbolic: boolean;
  shakeRow: number | null;
  popRow: number | null;
}

export function Grid({
  target,
  rows,
  currentGuess,
  rowIndex,
  maxAttempts,
  isSymbolic,
  shakeRow,
  popRow,
}: GridProps) {
  const len = target.length;

  return (
    <div className="grid">
      {Array.from({ length: maxAttempts }, (_, r) => {
        const rowData = rows[r];
        const isCurrentRow = r === rowIndex;
        const rowClasses = [
          "grid-row",
          isSymbolic && "grid-row--wrap",
          shakeRow === r && "grid-row--shake",
          popRow === r && "grid-row--pop",
        ]
          .filter(Boolean)
          .join(" ");

        return (
          <div className={rowClasses} key={r}>
            {Array.from({ length: len }, (_, c) => {
              if (rowData) {
                return (
                  <Cell
                    key={c}
                    value={rowData.guess[c]}
                    state={rowData.result[c]}
                    isToken={isSymbolic}
                  />
                );
              }
              if (isCurrentRow && currentGuess[c] !== undefined) {
                return <Cell key={c} value={currentGuess[c]} state="filled" isToken={isSymbolic} />;
              }
              return <Cell key={c} isToken={isSymbolic} />;
            })}
          </div>
        );
      })}
    </div>
  );
}
