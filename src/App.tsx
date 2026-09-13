import { useEffect } from "react";
import { Header } from "./components/Header";
import { DifficultyTabs } from "./components/DifficultyTabs";
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
  const { level, mode, streak, setLevel, setMode, newGame, classique, cible } = useMathdle();

  const isSymbolic = level === "impossible";
  const levelCfg = mode === "classique" ? LEVELS[level] : LEVELS[level === "impossible" ? "difficile" : level];

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
    <div className="app-shell">
      <Header streak={streak} />

      <main className="app-main">
        <DifficultyTabs level={level} onChange={setLevel} />
        <ModeSwitch mode={mode} disabled={isSymbolic} onChange={setMode} />

        <div className="mobile-only">
          <InfoPanel mode={mode} level={level} />
        </div>

        {mode === "classique" ? (
          <div className="play-area">
            <div className={"message" + (classique.message.variant ? ` message--${classique.message.variant}` : "")}>
              {classique.message.text}
            </div>
            <Grid
              target={classique.target}
              rows={classique.rows}
              currentGuess={classique.currentGuess}
              rowIndex={classique.rowIndex}
              maxAttempts={classique.maxAttempts}
              isSymbolic={isSymbolic}
              shakeRow={classique.shakeRow}
              popRow={classique.popRow}
            />
            {classique.showBanner && (
              <Banner
                won={classique.won}
                target={classique.target}
                isSymbolic={isSymbolic}
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

        <div className="mobile-keyboard">
          <Keyboard
            opKeys={levelCfg.keys}
            extraKeys={mode === "classique" ? levelCfg.extraKeys : undefined}
            onKey={mode === "classique" ? classique.typeChar : cible.typeChar}
            onBackspace={mode === "classique" ? classique.backspace : cible.backspace}
            onSubmit={mode === "classique" ? classique.submitGuess : cible.check}
            submitLabel={mode === "classique" ? "Valider" : "OK"}
          />
        </div>
      </main>

      <aside className="app-sidebar">
        <InfoPanel mode={mode} level={level} />
        <div className="sidebar-keyboard">
          <p className="sidebar-keyboard__hint">
            Tu peux aussi utiliser ton clavier physique — chiffres, opérateurs, Entrée, Retour
            arrière.
          </p>
          <Keyboard
            opKeys={levelCfg.keys}
            extraKeys={mode === "classique" ? levelCfg.extraKeys : undefined}
            onKey={mode === "classique" ? classique.typeChar : cible.typeChar}
            onBackspace={mode === "classique" ? classique.backspace : cible.backspace}
            onSubmit={mode === "classique" ? classique.submitGuess : cible.check}
            submitLabel={mode === "classique" ? "Valider" : "OK"}
          />
        </div>
      </aside>

      <footer className="app-footer">
        Mathdle — fait pour s'entraîner, pas pour tricher en cours.
      </footer>
    </div>
  );
}

export default App;
