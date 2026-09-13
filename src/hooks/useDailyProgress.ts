import { useCallback, useEffect, useState } from "react";
import { todayKey } from "../game/seededRandom";

interface DailyRecord {
  streak: number;
  lastDate: string;
  lastWon: boolean;
}

const DEFAULT_RECORD: DailyRecord = { streak: 0, lastDate: "", lastWon: false };

// Suivi très simple de la série de jours réussis, persisté en localStorage
// (c'est un vrai site déployé, pas un artifact — le stockage navigateur
// est donc tout à fait approprié ici).
export function useDailyProgress(storageKey: string) {
  const key = `mathdle_daily_${storageKey}`;
  const [record, setRecord] = useState<DailyRecord>(DEFAULT_RECORD);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setRecord(JSON.parse(raw));
    } catch {
      // localStorage indisponible (navigation privée, etc.) : on continue
      // simplement sans persistance plutôt que de planter.
    }
    setLoaded(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const today = todayKey();
  const alreadyPlayedToday = record.lastDate === today;

  const complete = useCallback(
    (won: boolean) => {
      setRecord((prev) => {
        const next: DailyRecord = {
          streak: won ? prev.streak + 1 : 0,
          lastDate: today,
          lastWon: won,
        };
        try {
          localStorage.setItem(key, JSON.stringify(next));
        } catch {
          // idem : tant pis si on ne peut pas persister
        }
        return next;
      });
    },
    [key, today]
  );

  return { record, alreadyPlayedToday, complete, loaded };
}
