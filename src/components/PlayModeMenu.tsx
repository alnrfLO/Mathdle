import "./SubjectMenu.css";

interface PlayModeMenuProps {
  subjectLabel: string;
  dayStreak: number;
  alreadyPlayedToday: boolean;
  onChoose: (mode: "serie" | "daily") => void;
}

export function PlayModeMenu({ subjectLabel, dayStreak, alreadyPlayedToday, onChoose }: PlayModeMenuProps) {
  return (
    <div className="subject-menu">
      <p className="subject-menu__hint">{subjectLabel} · choisis un mode</p>
      <button type="button" className="subject-menu__item" onClick={() => onChoose("serie")}>
        <span className="subject-menu__num">1</span>
        <span className="subject-menu__text">
          <span className="subject-menu__title">MODE SÉRIE</span>
          <span className="subject-menu__desc">Parties illimitées, à ton rythme</span>
        </span>
      </button>
      <button type="button" className="subject-menu__item" onClick={() => onChoose("daily")}>
        <span className="subject-menu__num">2</span>
        <span className="subject-menu__text">
          <span className="subject-menu__title">ÉNIGME DU JOUR</span>
          <span className="subject-menu__desc">
            {alreadyPlayedToday
              ? "Déjà jouée aujourd'hui"
              : dayStreak > 0
                ? `Série de jours : ${dayStreak} 🔥`
                : "Une seule chance, chaque jour"}
          </span>
        </span>
      </button>
    </div>
  );
}
