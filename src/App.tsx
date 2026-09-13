import { useEffect, useState } from "react";
import { SoftkeyTabs } from "./components/SoftkeyTabs";
import { ModeSwitch } from "./components/ModeSwitch";
import { InfoPanel } from "./components/InfoPanel";
import { ScienceInfoPanel } from "./components/ScienceInfoPanel";
import { Grid } from "./components/Grid";
import { Banner } from "./components/Banner";
import { CibleLibre } from "./components/CibleLibre";
import { ScienceScreen } from "./components/ScienceScreen";
import { ChemistryScreen } from "./components/ChemistryScreen";
import { PhysicsScreen } from "./components/PhysicsScreen";
import { SubjectMenu } from "./components/SubjectMenu";
import { Keyboard } from "./components/Keyboard";
import { useMathdle } from "./hooks/useMathdle";
import { useScience } from "./hooks/useScience";
import { useChemistry } from "./hooks/useChemistry";
import { usePhysicsFormulas } from "./hooks/usePhysicsFormulas";
import { LEVELS } from "./game/config";
import type { Subject } from "./game/types";
import "./App.css";

type ScienceGame = "conversions" | "chimie" | "formules";

const SCIENCE_LEVELS = [
  { id: "facile" as const, label: "Facile", f: "F1" },
  { id: "moyen" as const, label: "Moyen", f: "F2" },
  { id: "difficile" as const, label: "Difficile", f: "F3" },
];

function App() {
  const [subject, setSubject] = useState<Subject | "menu">("menu");
  const [scienceGame, setScienceGame] = useState<ScienceGame>("conversions");
  const [scienceStreak, setScienceStreak] = useState(0);
  const onCorrect = () => setScienceStreak((s) => s + 1);

  const mathdle = useMathdle();
  const conversions = useScience(onCorrect);
  const chemistry = useChemistry(onCorrect);
  const physics = usePhysicsFormulas(onCorrect);

  const isSymbolic = mathdle.level === "impossible";
  const levelCfg =
    mathdle.mode === "classique"
      ? LEVELS[mathdle.level]
      : LEVELS[mathdle.level === "impossible" ? "difficile" : mathdle.level];

  const activeScience =
    scienceGame === "conversions" ? conversions : scienceGame === "chimie" ? chemistry : physics;

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
        if (scienceGame === "conversions") {
          if (e.key === "Backspace") {
            e.preventDefault();
            conversions.backspace();
            return;
          }
          if (e.key === "Enter") {
            conversions.check();
            return;
          }
          if (/^[0-9,.]$/.test(e.key)) {
            conversions.typeChar(e.key === "." ? "," : e.key);
          }
        } else if (scienceGame === "chimie") {
          if (e.key === "Backspace") {
            e.preventDefault();
            chemistry.backspace();
            return;
          }
          if (e.key === "Enter") {
            chemistry.check();
            return;
          }
          if (/^[0-9]$/.test(e.key)) {
            chemistry.typeChar(e.key);
          }
        } else if (scienceGame === "formules") {
          if (e.key === "Backspace") {
            e.preventDefault();
            physics.backspace();
            return;
          }
          if (e.key === "Enter") {
            physics.submitGuess();
            return;
          }
          if (/^[0-9]$/.test(e.key)) {
            physics.typeChar(e.key);
          }
        }
      }
    }
    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, [subject, isSymbolic, mathdle, scienceGame, conversions, chemistry, physics]);

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
            SÉRIE <strong>{subject === "science" ? scienceStreak : mathdle.streak}</strong>
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
                      className={
                        "softkey" +
                        (activeScience.level === t.id ? " softkey--active" : "")
                      }
                      onClick={() => activeScience.setLevel(t.id)}
                    >
                      <span className="softkey__f">{t.f}</span>
                      <span className="softkey__label">{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className="mode-switch mode-switch--triple">
                  <button
                    type="button"
                    className={"mode-btn" + (scienceGame === "conversions" ? " mode-btn--active" : "")}
                    onClick={() => setScienceGame("conversions")}
                  >
                    Conversions
                  </button>
                  <button
                    type="button"
                    className={"mode-btn" + (scienceGame === "chimie" ? " mode-btn--active" : "")}
                    onClick={() => setScienceGame("chimie")}
                  >
                    Chimie
                  </button>
                  <button
                    type="button"
                    className={"mode-btn" + (scienceGame === "formules" ? " mode-btn--active" : "")}
                    onClick={() => setScienceGame("formules")}
                  >
                    Formules
                  </button>
                </div>

                {scienceGame === "conversions" && (
                  <ScienceScreen
                    question={conversions.question}
                    input={conversions.input}
                    message={conversions.message}
                    streak={scienceStreak}
                    onSkip={conversions.skip}
                    onCheck={conversions.check}
                  />
                )}

                {scienceGame === "chimie" && (
                  <ChemistryScreen
                    equation={chemistry.equation}
                    coeffs={chemistry.coeffs}
                    activeIndex={chemistry.activeIndex}
                    message={chemistry.message}
                    onSelectSlot={chemistry.selectSlot}
                    onSkip={chemistry.skip}
                    onCheck={chemistry.check}
                  />
                )}

                {scienceGame === "formules" && (
                  <PhysicsScreen
                    target={physics.target}
                    rows={physics.rows}
                    currentGuess={physics.currentGuess}
                    rowIndex={physics.rowIndex}
                    maxAttempts={physics.maxAttempts}
                    gameOver={physics.gameOver}
                    won={physics.won}
                    message={physics.message}
                    onSkip={physics.skip}
                    onSubmit={physics.submitGuess}
                  />
                )}

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

        {subject === "science" && scienceGame === "conversions" && (
          <Keyboard
            opKeys={[","]}
            onKey={conversions.typeChar}
            onBackspace={conversions.backspace}
            onSubmit={conversions.check}
            submitLabel="Vérifier"
          />
        )}

        {subject === "science" && scienceGame === "chimie" && (
          <Keyboard
            opKeys={[]}
            onKey={chemistry.typeChar}
            onBackspace={chemistry.backspace}
            onSubmit={chemistry.check}
            submitLabel="Vérifier"
          />
        )}

        {subject === "science" && scienceGame === "formules" && (
          <Keyboard
            opKeys={physics.keys}
            extraKeys={physics.extraKeys}
            onKey={physics.typeChar}
            onBackspace={physics.backspace}
            onSubmit={physics.submitGuess}
            submitLabel="Valider"
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
