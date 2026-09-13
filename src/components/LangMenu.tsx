import type { ProgLang } from "../game/programming";
import { PROG_LANG_LABELS } from "../game/programming";
import "./SubjectMenu.css";

interface LangMenuProps {
  onChoose: (lang: ProgLang) => void;
}

const LANGS: ProgLang[] = ["javascript", "python", "java", "cpp"];

export function LangMenu({ onChoose }: LangMenuProps) {
  return (
    <div className="subject-menu">
      <p className="subject-menu__hint">Programmation · choisis un langage</p>
      {LANGS.map((lang, i) => (
        <button key={lang} type="button" className="subject-menu__item" onClick={() => onChoose(lang)}>
          <span className="subject-menu__num">{i + 1}</span>
          <span className="subject-menu__text">
            <span className="subject-menu__title">{PROG_LANG_LABELS[lang].toUpperCase()}</span>
          </span>
        </button>
      ))}
    </div>
  );
}
