import type { Difficulty } from "../game/types";
import "./DifficultyTabs.css";

interface DifficultyTabsProps {
  level: Difficulty;
  onChange: (level: Difficulty) => void;
}

const TABS: { id: Difficulty; label: string }[] = [
  { id: "facile", label: "Facile" },
  { id: "moyen", label: "Moyen" },
  { id: "difficile", label: "Difficile" },
  { id: "impossible", label: "Impossible" },
];

export function DifficultyTabs({ level, onChange }: DifficultyTabsProps) {
  return (
    <div className="tabs">
      {TABS.map((t) => {
        const isActive = level === t.id;
        const classes = [
          "tab",
          t.id === "impossible" && "tab--impossible",
          isActive && "tab--active",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <button key={t.id} type="button" className={classes} onClick={() => onChange(t.id)}>
            {t.label}
          </button>
        );
      })}
    </div>
  );
}
