import "./Header.css";

interface HeaderProps {
  streak: number;
}

export function Header({ streak }: HeaderProps) {
  return (
    <header className="app-header">
      <div className="title-block">
        <h1>
          Mathdle
          <svg className="title-block__underline" viewBox="0 0 140 10" preserveAspectRatio="none" aria-hidden="true">
            <path
              d="M2,6 C 30,2 60,9 80,5 C 100,2 120,7 138,4"
              stroke="var(--chalk-yellow)"
              strokeWidth="2.5"
              fill="none"
              strokeLinecap="round"
            />
          </svg>
        </h1>
        <p>Devine l'équation, chiffre par chiffre.</p>
      </div>
      <div className="stats">
        <span>Série</span>
        <strong>{streak}</strong>
      </div>
    </header>
  );
}
