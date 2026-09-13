import type { Difficulty } from "../game/types";
import "./SoftkeyTabs.css";

interface SoftkeyTabsProps {
  level: Difficulty;
  onChange: (level: Difficulty) => void;
}

const TABS: { id: Difficulty; label: string; f: string }[] = [
  { id: "facile", label: "Facile", f: "F1" },
  { id: "moyen", label: "Moyen", f: "F2" },
  { id: "difficile", label: "Difficile", f: "F3" },
  { id: "impossible", label: "Impossible", f: "F4" },
];

export function SoftkeyTabs({ level, onChange }: SoftkeyTabsProps) {
  return (
    <div className="softkeys">
      {TABS.map((t) => {
        const isActive = level === t.id;
        const classes = [
          "softkey",
          t.id === "impossible" && "softkey--danger",
          isActive && "softkey--active",
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <button key={t.id} type="button" className={classes} onClick={() => onChange(t.id)}>
            <span className="softkey__f">{t.f}</span>
            <span className="softkey__label">{t.label}</span>
          </button>
        );
      })}
    </div>
  );
}
