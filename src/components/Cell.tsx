import type { CellState } from "../game/types";

interface CellProps {
  value?: string;
  state?: CellState | "filled" | "empty";
  isToken?: boolean;
}

export function Cell({ value, state = "empty", isToken = false }: CellProps) {
  const classes = ["cell", isToken && "cell--token", state !== "empty" && `cell--${state}`]
    .filter(Boolean)
    .join(" ");
  return <div className={classes}>{value}</div>;
}
