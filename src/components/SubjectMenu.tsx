import type { Subject } from "../game/types";
import "./SubjectMenu.css";

interface SubjectMenuProps {
  onChoose: (subject: Subject) => void;
}

export function SubjectMenu({ onChoose }: SubjectMenuProps) {
  return (
    <div className="subject-menu">
      <p className="subject-menu__hint">Choisis une matière</p>
      <button type="button" className="subject-menu__item" onClick={() => onChoose("math")}>
        <span className="subject-menu__num">1</span>
        <span className="subject-menu__text">
          <span className="subject-menu__title">MATHS</span>
          <span className="subject-menu__desc">Équations, cible libre</span>
        </span>
      </button>
      <button type="button" className="subject-menu__item" onClick={() => onChoose("science")}>
        <span className="subject-menu__num">2</span>
        <span className="subject-menu__text">
          <span className="subject-menu__title">SCIENCES</span>
          <span className="subject-menu__desc">Conversions d'unités</span>
        </span>
      </button>
    </div>
  );
}
