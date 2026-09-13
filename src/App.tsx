import { useEffect } from "react";
import { SoftkeyTabs } from "./components/SoftkeyTabs";
import { ModeSwitch } from "./components/ModeSwitch";
import { InfoPanel } from "./components/InfoPanel";
import { Grid } from "./components/Grid";
import { Banner } from "./components/Banner";
import { CibleLibre } from "./components/CibleLibre";
import { Keyboard } from "./components/Keyboard";
import { useMathdle } from "./hooks/useMathdle";
import { LEVELS } from "./game/config";
import "./App.css";

function App() {
  const { level, mode, streak, lives, maxLives, setLevel, setMode, newGame, classique, cible } =
    useMathdle();

  const isSymbolic = level === "impossible";
  const levelCfg =
    mode === "classique" ? LEVELS[level] : LEVELS[level === "impossible" ? "difficile" : level];

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (e.key === "Backspace") {
        e.preventDefault();
        if (mode === "classique") classique.backspace();
        else cible.backspace();
        return;
      }
      if (e.key === "Enter") {
        if (mode === "classique") classique.submitGuess();
        else cible.check();
        return;
      }
      if (!isSymbolic && /^[0-9+\-*/()=]$/.test(e.key)) {
        if (mode === "classique") classique.typeChar(e.key);
        else cible.typeChar(e.key);
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [mode, isSymbolic, classique, cible]);

  return (
    <div className="scene">
      <div className="calculator">
        <div className="calculator__brandrow">
          <span className="calculator__brand">MATHDLE-92</span>
          <span className="calculator__lives" aria-label={`${lives} vies sur ${maxLives}`}>
            {"♥".repeat(lives)}
            {"♡".repeat(maxLives - lives)}
          </span>
          <span className="calculator__streak">
            SÉRIE <strong>{streak}</strong>
          </span>
        </div>

        <div className="calculator__screen-frame">
          <div className="calculator__screen">
            <SoftkeyTabs level={level} onChange={setLevel} />
            <ModeSwitch mode={mode} disabled={isSymbolic} onChange={setMode} />

            {mode === "classique" ? (
              <div className="play-area">
                <div
                  className={
                    "message" +
                    (classique.message.variant ? ` message--${classique.message.variant}` : "")
                  }
                >
                  {classique.message.text}
                </div>
                <Grid
                  target={classique.target}
                  rows={classique.rows}
                  currentGuess={classique.currentGuess}
                  rowIndex={classique.rowIndex}
                  maxAttempts={classique.maxAttempts}
                  gameOver={classique.gameOver}
                  isSymbolic={isSymbolic}
                  shakeRow={classique.shakeRow}
                  popRow={classique.popRow}
                />
                {classique.showBanner && (
                  <Banner
                    won={classique.won}
                    target={classique.target}
                    isSymbolic={isSymbolic}
                    lives={lives}
                    maxLives={maxLives}
                    streakJustReset={classique.streakJustReset}
                    onNewGame={newGame}
                  />
                )}
              </div>
            ) : (
              <CibleLibre
                target={cible.target}
                input={cible.input}
                config={cible.config}
                message={cible.message}
                onClear={cible.clear}
                onCheck={cible.check}
              />
            )}

            <div className="screen-only-info">
              <InfoPanel mode={mode} level={level} />
            </div>
          </div>
        </div>

        <Keyboard
          opKeys={levelCfg.keys}
          extraKeys={mode === "classique" ? levelCfg.extraKeys : undefined}
          onKey={mode === "classique" ? classique.typeChar : cible.typeChar}
          onBackspace={mode === "classique" ? classique.backspace : cible.backspace}
          onSubmit={mode === "classique" ? classique.submitGuess : cible.check}
          submitLabel={mode === "classique" ? "Valider" : "OK"}
        />
      </div>

      <aside className="desk-note">
        <p className="desk-note__pin">📌</p>
        <h2>Aide-mémoire</h2>
        <InfoPanel mode={mode} level={level} />
        <p className="desk-note__footer">
          Mathdle — fait pour s'entraîner, pas pour tricher en cours.
        </p>
      </aside>
    </div>
  );
}

export default App;
