import "./Banner.css";

interface BannerProps {
  won: boolean;
  target: string[];
  isSymbolic: boolean;
  onNewGame: () => void;
}

export function Banner({ won, target, isSymbolic, onNewGame }: BannerProps) {
  const sep = isSymbolic ? " " : "";
  return (
    <div className="banner">
      <h3 className={"banner__title" + (won ? " banner__title--won" : " banner__title--lost")}>
        {won ? "Trouvé !" : "Perdu"}
      </h3>
      <p className="banner__text">L'équation était {target.join(sep)}.</p>
      <button type="button" className="banner__btn" onClick={onNewGame}>
        Nouvelle partie
      </button>
    </div>
  );
}
