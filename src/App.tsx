import { useEffect, useState } from "react";
import { SoftkeyTabs } from "./components/SoftkeyTabs";
import { ModeSwitch } from "./components/ModeSwitch";
import { InfoPanel } from "./components/InfoPanel";
import { ScienceInfoPanel } from "./components/ScienceInfoPanel";
import { Grid } from "./components/Grid";
import { Banner } from "./components/Banner";
import { CibleLibre } from "./components/CibleLibre";
import { ScienceScreen } from "./components/ScienceScreen";
import { SubjectMenu } from "./components/SubjectMenu";
import { Keyboard } from "./components/Keyboard";
import { useMathdle } from "./hooks/useMathdle";
import { useScience } from "./hooks/useScience";
import { LEVELS } from "./game/config";
import type { Subject } from "./game/types";
import "./App.css";

const SCIENCE_LEVELS = [
  { id: "facile" as const, label: "Facile", f: "F1" },
  { id: "moyen" as const, label: "Moyen", f: "F2" },
  { id: "difficile" as const, label: "Difficile", f: "F3" },
];

function App() {
  const [subject, setSubject] = useState<Subject | "menu">("menu");
  const mathdle = useMathdle();
  const science = useScience();

  const isSymbolic = mathdle.level === "impossible";
  const levelCfg =
    mathdle.mode === "classique"
      ? LEVELS[mathdle.level]
      : LEVELS[mathdle.level === "impossible" ? "difficile" : mathdle.level];

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (subject === "math") {
        if (e.key === "Backspace") {
          e.preventDefault();
          if (mathdle.mode === "classique") mathdle.classique.backspace();
          else mathdle.cible.backspace();
          return;
        }
        if (e.key === "Enter") {
          if (mathdle.mode === "classique") mathdle.classique.submitGuess();
          else mathdle.cible.check();
          return;
        }
        if (!isSymbolic && /^[0-9+\-*/()=]$/.test(e.key)) {
          if (mathdle.mode === "classique") mathdle.classique.typeChar(e.key);
          else mathdle.cible.typeChar(e.key);
        }
      } else if (subject === "science") {
        if (e.key === "Backspace") {
          e.preventDefault();
          science.backspace();
          return;
        }
        if (e.key === "Enter") {
          science.check();
          return;
        }
        if (/^[0-9,.]$/.test(e.key)) {
          science.typeChar(e.key === "." ? "," : e.key);
        }
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [subject, isSymbolic, mathdle, science]);

  return (
    <div className="scene">
      <div className="calculator">
        <div className="calculator__brandrow">
          {subject === "menu" ? (
            <span className="calculator__brand">MATHDLE-92</span>
          ) : (
            <button type="button" className="calculator__menu-btn" onClick={() => setSubject("menu")}>
              ← MENU
            </button>
          )}
          {subject === "math" && (
            <span className="calculator__lives" aria-label={`${mathdle.lives} vies sur ${mathdle.maxLives}`}>
              {"♥".repeat(mathdle.lives)}
              {"♡".repeat(mathdle.maxLives - mathdle.lives)}
            </span>
          )}
          <span className="calculator__streak">
            SÉRIE <strong>{subject === "science" ? science.streak : mathdle.streak}</strong>
          </span>
        </div>

        <div className="calculator__screen-frame">
          <div className="calculator__screen">
            {subject === "menu" && <SubjectMenu onChoose={setSubject} />}

            {subject === "math" && (
              <>
                <SoftkeyTabs level={mathdle.level} onChange={mathdle.setLevel} />
                <ModeSwitch mode={mathdle.mode} disabled={isSymbolic} onChange={mathdle.setMode} />

                {mathdle.mode === "classique" ? (
                  <div className="play-area">
                    <div
                      className={
                        "message" +
                        (mathdle.classique.message.variant
                          ? ` message--${mathdle.classique.message.variant}`
                          : "")
                      }
                    >
                      {mathdle.classique.message.text}
                    </div>
                    <Grid
                      target={mathdle.classique.target}
                      rows={mathdle.classique.rows}
                      currentGuess={mathdle.classique.currentGuess}
                      rowIndex={mathdle.classique.rowIndex}
                      maxAttempts={mathdle.classique.maxAttempts}
                      gameOver={mathdle.classique.gameOver}
                      isSymbolic={isSymbolic}
                      shakeRow={mathdle.classique.shakeRow}
                      popRow={mathdle.classique.popRow}
                    />
                    {mathdle.classique.showBanner && (
                      <Banner
                        won={mathdle.classique.won}
                        target={mathdle.classique.target}
                        isSymbolic={isSymbolic}
                        lives={mathdle.lives}
                        maxLives={mathdle.maxLives}
                        streakJustReset={mathdle.classique.streakJustReset}
                        onNewGame={mathdle.newGame}
                      />
                    )}
                  </div>
                ) : (
                  <CibleLibre
                    target={mathdle.cible.target}
                    input={mathdle.cible.input}
                    config={mathdle.cible.config}
                    message={mathdle.cible.message}
                    onClear={mathdle.cible.clear}
                    onCheck={mathdle.cible.check}
                  />
                )}

                <div className="screen-only-info">
                  <InfoPanel mode={mathdle.mode} level={mathdle.level} />
                </div>
              </>
            )}

            {subject === "science" && (
              <>
                <div className="softkeys">
                  {SCIENCE_LEVELS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      className={"softkey" + (science.level === t.id ? " softkey--active" : "")}
                      onClick={() => science.setLevel(t.id)}
                    >
                      <span className="softkey__f">{t.f}</span>
                      <span className="softkey__label">{t.label}</span>
                    </button>
                  ))}
                </div>

                <ScienceScreen
                  question={science.question}
                  input={science.input}
                  message={science.message}
                  streak={science.streak}
                  onSkip={science.skip}
                  onCheck={science.check}
                />

                <div className="screen-only-info">
                  <ScienceInfoPanel />
                </div>
              </>
            )}
          </div>
        </div>

        {subject === "math" && (
          <Keyboard
            opKeys={levelCfg.keys}
            extraKeys={mathdle.mode === "classique" ? levelCfg.extraKeys : undefined}
            onKey={mathdle.mode === "classique" ? mathdle.classique.typeChar : mathdle.cible.typeChar}
            onBackspace={mathdle.mode === "classique" ? mathdle.classique.backspace : mathdle.cible.backspace}
            onSubmit={mathdle.mode === "classique" ? mathdle.classique.submitGuess : mathdle.cible.check}
            submitLabel={mathdle.mode === "classique" ? "Valider" : "OK"}
          />
        )}

        {subject === "science" && (
          <Keyboard
            opKeys={[","]}
            onKey={science.typeChar}
            onBackspace={science.backspace}
            onSubmit={science.check}
            submitLabel="Vérifier"
          />
        )}
      </div>

      {subject !== "menu" && (
        <aside className="desk-note">
          <p className="desk-note__pin">📌</p>
          <h2>Aide-mémoire</h2>
          {subject === "math" ? (
            <InfoPanel mode={mathdle.mode} level={mathdle.level} />
          ) : (
            <ScienceInfoPanel />
          )}
          <p className="desk-note__footer">
            Mathdle — fait pour s'entraîner, pas pour tricher en cours.
          </p>
        </aside>
      )}
    </div>
  );
}

export default App;
