import "./Banner.css";

interface BannerProps {
  won: boolean;
  target: string[];
  isSymbolic: boolean;
  lives: number;
  maxLives: number;
  streakJustReset: boolean;
  onNewGame: () => void;
}

export function Banner({
  won,
  target,
  isSymbolic,
  lives,
  maxLives,
  streakJustReset,
  onNewGame,
}: BannerProps) {
  const sep = isSymbolic ? " " : "";

  let lifeNote: string | null = null;
  if (!won) {
    lifeNote = streakJustReset
      ? "Plus de vies — série remise à zéro."
      : `Il te reste ${lives}/${maxLives} vie${lives > 1 ? "s" : ""}.`;
  }

  return (
    <div className="banner">
      <h3 className={"banner__title" + (won ? " banner__title--won" : " banner__title--lost")}>
        {won ? "Trouvé !" : "Perdu"}
      </h3>
      <p className="banner__text">L'équation était {target.join(sep)}.</p>
      {lifeNote && <p className="banner__lives">{lifeNote}</p>}
      <button type="button" className="banner__btn" onClick={onNewGame}>
        Nouvelle partie
      </button>
    </div>
  );
}
