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
import { PlayModeMenu } from "./components/PlayModeMenu";
import { DailyScreen } from "./components/DailyScreen";
import { ScienceDailyScreen } from "./components/ScienceDailyScreen";
import { LegalNotice } from "./components/LegalNotice";
import { Keyboard } from "./components/Keyboard";
import { useMathdle } from "./hooks/useMathdle";
import { useScience } from "./hooks/useScience";
import { useChemistry } from "./hooks/useChemistry";
import { usePhysicsFormulas } from "./hooks/usePhysicsFormulas";
import { useMathDaily } from "./hooks/useMathDaily";
import { useScienceDaily } from "./hooks/useScienceDaily";
import { LEVELS } from "./game/config";
import type { Subject } from "./game/types";
import "./App.css";

type ScienceGame = "conversions" | "chimie" | "formules";
type PlayMode = "menu" | "serie" | "daily";

const SCIENCE_LEVELS = [
  { id: "facile" as const, label: "Facile", f: "F1" },
  { id: "moyen" as const, label: "Moyen", f: "F2" },
  { id: "difficile" as const, label: "Difficile", f: "F3" },
];

function App() {
  const [subject, setSubjectState] = useState<Subject | "menu">("menu");
  const [playMode, setPlayMode] = useState<PlayMode>("menu");
  const [scienceGame, setScienceGame] = useState<ScienceGame>("conversions");
  const [scienceStreak, setScienceStreak] = useState(0);
  const [showLegal, setShowLegal] = useState(false);
  const onCorrect = () => setScienceStreak((s) => s + 1);
  const onStreakReset = () => setScienceStreak(0);

  // Choisir une matière repart toujours sur le choix Série/Énigme du jour
  const setSubject = (s: Subject | "menu") => {
    setSubjectState(s);
    setPlayMode("menu");
  };

  const mathdle = useMathdle();
  const conversions = useScience(onCorrect);
  const chemistry = useChemistry(onCorrect, onStreakReset);
  const physics = usePhysicsFormulas(onCorrect);
  const mathDaily = useMathDaily();
  const scienceDaily = useScienceDaily();

  const isSymbolic = mathdle.level === "impossible";
  const levelCfg =
    mathdle.mode === "classique"
      ? LEVELS[mathdle.level]
      : LEVELS[mathdle.level === "impossible" ? "difficile" : mathdle.level];

  const activeScience =
    scienceGame === "conversions" ? conversions : scienceGame === "chimie" ? chemistry : physics;

  useEffect(() => {
    function handleKeydown(e: KeyboardEvent) {
      if (playMode === "daily" && subject === "math") {
        if (e.key === "Backspace") {
          e.preventDefault();
          mathDaily.backspace();
          return;
        }
        if (e.key === "Enter") {
          mathDaily.submitGuess();
          return;
        }
        if (/^[0-9+\-*/()=]$/.test(e.key)) mathDaily.typeChar(e.key);
        return;
      }
      if (playMode === "daily" && subject === "science") {
        if (e.key === "Backspace") {
          e.preventDefault();
          scienceDaily.backspace();
          return;
        }
        if (e.key === "Enter") {
          scienceDaily.check();
          return;
        }
        if (/^[0-9,.]$/.test(e.key)) scienceDaily.typeChar(e.key === "." ? "," : e.key);
        return;
      }
      if (playMode !== "serie") return;

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
  }, [subject, playMode, isSymbolic, mathdle, scienceGame, conversions, chemistry, physics, mathDaily, scienceDaily]);

  return (
    <div className="scene">
      <div className="calculator">
        <div className="calculator__brandrow">
          {subject === "menu" ? (
            <span className="calculator__brand">MATHDLE-92</span>
          ) : (
            <button
              type="button"
              className="calculator__menu-btn"
              onClick={() => (playMode !== "menu" ? setPlayMode("menu") : setSubject("menu"))}
            >
              ← MENU
            </button>
          )}
          {playMode === "serie" && subject === "math" && (
            <span className="calculator__lives" aria-label={`${mathdle.lives} vies sur ${mathdle.maxLives}`}>
              {"♥".repeat(mathdle.lives)}
              {"♡".repeat(mathdle.maxLives - mathdle.lives)}
            </span>
          )}
          {playMode === "serie" && subject === "science" && scienceGame === "chimie" && (
            <span className="calculator__lives" aria-label={`${chemistry.lives} vies sur ${chemistry.maxLives}`}>
              {"♥".repeat(chemistry.lives)}
              {"♡".repeat(chemistry.maxLives - chemistry.lives)}
            </span>
          )}
          {playMode === "serie" && (
            <span className="calculator__streak">
              SÉRIE <strong>{subject === "science" ? scienceStreak : mathdle.streak}</strong>
            </span>
          )}
          {playMode === "daily" && (
            <span className="calculator__streak">
              JOURS <strong>{subject === "science" ? scienceDaily.dayStreak : mathDaily.dayStreak}</strong>
            </span>
          )}
        </div>

        <div className="calculator__screen-frame">
          <div className="calculator__screen">
            {subject === "menu" && <SubjectMenu onChoose={setSubject} />}

            {subject !== "menu" && playMode === "menu" && (
              <PlayModeMenu
                subjectLabel={subject === "math" ? "Maths" : "Sciences"}
                dayStreak={subject === "science" ? scienceDaily.dayStreak : mathDaily.dayStreak}
                alreadyPlayedToday={
                  subject === "science" ? scienceDaily.alreadyPlayedToday : mathDaily.alreadyPlayedToday
                }
                onChoose={setPlayMode}
              />
            )}

            {subject === "math" && playMode === "daily" && (
              <DailyScreen
                kind="math"
                target={mathDaily.target}
                rows={mathDaily.rows}
                currentGuess={mathDaily.currentGuess}
                rowIndex={mathDaily.rowIndex}
                maxAttempts={mathDaily.maxAttempts}
                gameOver={mathDaily.gameOver}
                won={mathDaily.won}
                message={mathDaily.message}
                alreadyPlayedToday={mathDaily.alreadyPlayedToday}
                dayStreak={mathDaily.dayStreak}
                lastWon={mathDaily.lastWon}
              />
            )}

            {subject === "science" && playMode === "daily" && (
              <ScienceDailyScreen
                question={scienceDaily.question}
                input={scienceDaily.input}
                message={scienceDaily.message}
                attempts={scienceDaily.attempts}
                maxAttempts={scienceDaily.maxAttempts}
                gameOver={scienceDaily.gameOver}
                won={scienceDaily.won}
                alreadyPlayedToday={scienceDaily.alreadyPlayedToday}
                dayStreak={scienceDaily.dayStreak}
                lastWon={scienceDaily.lastWon}
              />
            )}

            {subject === "math" && playMode === "serie" && (
              <>
                <SoftkeyTabs level={mathdle.level} onChange={mathdle.setLevel} />
                <ModeSwitch mode={mathdle.mode} disabled={isSymbolic} onChange={mathdle.setMode} />

                {mathdle.mode === "classique" ? (
                  <div className="play-area">
                    {isSymbolic && mathdle.classique.nature && (
                      <p className="impossible-hint">
                        Indice : <strong>{mathdle.classique.nature}</strong>
                      </p>
                    )}
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

            {subject === "science" && playMode === "serie" && (
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
                    gameOver={chemistry.gameOver}
                    onSelectSlot={chemistry.selectSlot}
                    onSkip={chemistry.skip}
                    onCheck={chemistry.check}
                  />
                )}

                {scienceGame === "formules" && (
                  <PhysicsScreen
                    target={physics.target}
                    domaine={physics.domaine}
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
                  <ScienceInfoPanel subject={scienceGame} />
                </div>
              </>
            )}
          </div>
        </div>

        {subject === "math" && playMode === "serie" && (
          <Keyboard
            opKeys={levelCfg.keys}
            extraKeys={mathdle.mode === "classique" ? levelCfg.extraKeys : undefined}
            onKey={mathdle.mode === "classique" ? mathdle.classique.typeChar : mathdle.cible.typeChar}
            onBackspace={mathdle.mode === "classique" ? mathdle.classique.backspace : mathdle.cible.backspace}
            onSubmit={mathdle.mode === "classique" ? mathdle.classique.submitGuess : mathdle.cible.check}
            submitLabel={mathdle.mode === "classique" ? "Valider" : "OK"}
          />
        )}

        {subject === "math" && playMode === "daily" && !mathDaily.alreadyPlayedToday && (
          <Keyboard
            opKeys={["+", "-", "*", "/", "="]}
            onKey={mathDaily.typeChar}
            onBackspace={mathDaily.backspace}
            onSubmit={mathDaily.submitGuess}
            submitLabel="Valider"
          />
        )}

        {subject === "science" && playMode === "serie" && scienceGame === "conversions" && (
          <Keyboard
            opKeys={[","]}
            onKey={conversions.typeChar}
            onBackspace={conversions.backspace}
            onSubmit={conversions.check}
            submitLabel="Vérifier"
          />
        )}

        {subject === "science" && playMode === "serie" && scienceGame === "chimie" && (
          <Keyboard
            opKeys={[]}
            onKey={chemistry.typeChar}
            onBackspace={chemistry.backspace}
            onSubmit={chemistry.check}
            submitLabel="Vérifier"
          />
        )}

        {subject === "science" && playMode === "serie" && scienceGame === "formules" && (
          <Keyboard
            opKeys={physics.keys}
            extraKeys={physics.extraKeys}
            onKey={physics.typeChar}
            onBackspace={physics.backspace}
            onSubmit={physics.submitGuess}
            submitLabel="Valider"
          />
        )}

        {subject === "science" && playMode === "daily" && !scienceDaily.alreadyPlayedToday && (
          <Keyboard
            opKeys={[","]}
            onKey={scienceDaily.typeChar}
            onBackspace={scienceDaily.backspace}
            onSubmit={scienceDaily.check}
            submitLabel="Vérifier"
          />
        )}

        <button type="button" className="calculator__legal-link" onClick={() => setShowLegal(true)}>
          Mentions légales
        </button>
      </div>

      {showLegal && <LegalNotice onClose={() => setShowLegal(false)} />}

      {subject !== "menu" && (
        <aside className="desk-note">
          <p className="desk-note__pin">📌</p>
          <h2>Aide-mémoire</h2>
          {subject === "math" ? (
            <InfoPanel mode={mathdle.mode} level={mathdle.level} />
          ) : (
            <ScienceInfoPanel subject={scienceGame} />
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
