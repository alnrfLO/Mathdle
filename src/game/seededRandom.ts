// Petit générateur pseudo-aléatoire déterministe (mulberry32) pour que
// l'énigme du jour soit la même pour tout le monde à une date donnée,
// sans avoir à réécrire toute la logique de génération existante :
// on substitue temporairement Math.random le temps de l'appel.

function mulberry32(seed: number) {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function withSeed<T>(seed: number, fn: () => T): T {
  const original = Math.random;
  Math.random = mulberry32(seed);
  try {
    return fn();
  } finally {
    Math.random = original;
  }
}

// Un entier stable pour la date du jour, avec un "sel" pour que deux
// énigmes différentes (maths / sciences) ne partagent pas la même graine.
export function todaySeed(salt: number): number {
  const d = new Date();
  const dateNum = d.getFullYear() * 10000 + (d.getMonth() + 1) * 100 + d.getDate();
  return dateNum * 31 + salt;
}

export function todayKey(): string {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}
