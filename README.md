# Mathdle

Un jeu façon Wordle/Nerdle, mais avec des équations mathématiques — et
maintenant des sciences. Devine l'équation secrète, atteins une cible avec
tes propres opérations, équilibre une réaction chimique ou retrouve une
formule de physique, le tout dans l'interface d'une calculatrice graphique.

**Jouer en ligne :** [mathdlee.vercel.app](https://mathdlee.vercel.app)

## Fonctionnalités

### Maths

- **Classique** — devine l'équation secrète en un nombre limité d'essais,
  avec un retour case par case façon Wordle (bon chiffre/bonne place, bon
  chiffre/mauvaise place, absent).
  - 4 niveaux : Facile, Moyen, Difficile, et **Impossible** (limites,
    intégrales, dérivées — comparaison symbolique par position).
  - Système de vies : une défaite ne casse pas direct la série, il faut
    épuiser 3 vies. Une victoire recharge tout.
- **Cible libre** — construis une expression qui tombe pile sur un nombre
  donné, avec un nombre de caractères imposé.

### Sciences

- **Conversions d'unités** — convertis une valeur dans l'unité demandée
  (longueurs, masses, volumes, temps, vitesses...). Pas d'essais limités,
  on peut corriger sa réponse.
- **Chimie** — équilibre une vraie équation chimique en tapant les
  coefficients dans des cases cliquables. La vérification compte
  réellement les atomes de chaque côté (parser de formules avec indices
  et parenthèses), ce n'est pas une réponse pré-écrite. 4 essais, 3 vies.
- **Formules physiques** — devine une formule (v = d/t, E = mc²...) case
  par case, même mécanique que le mode Impossible des maths.

Les trois mini-jeux partagent une seule série de bonnes réponses.

### Mode Série vs Énigme du jour

Chaque matière propose deux façons de jouer :

- **Mode Série** — parties illimitées, à volonté.
- **Énigme du jour** — une seule tentative par jour, la même pour tout le
  monde (graine pseudo-aléatoire basée sur la date). Une série de jours
  réussis d'affilée est suivie en local (localStorage).

## Stack technique

- [React](https://react.dev) + [TypeScript](https://www.typescriptlang.org)
- [Vite](https://vite.dev)
- Polices auto-hébergées via [Fontsource](https://fontsource.org)
  (JetBrains Mono, VT323) — pas d'appel à un CDN externe
- Déployé sur [Vercel](https://vercel.com)

Aucune dépendance de state management externe : tout l'état de jeu vit
dans des hooks React (`useMathdle`, `useScience`, `useChemistry`,
`usePhysicsFormulas`, `useMathDaily`, `useScienceDaily`).

## Lancer le projet en local

```bash
git clone https://github.com/alnrfLO/mathdle.git
cd mathdle
npm install
npm run dev
```

Build de production :

```bash
npm run build
```

## Structure du projet

```
src/
  game/            logique pure des maths (parser, moteur, générateur, config)
  science/         logique pure des sciences (conversions, chimie, physique)
  hooks/           state React par mode de jeu
  components/      composants d'affichage
  App.tsx          routage matière / mode de jeu, clavier physique
```

## Auteur

**Rafael Antunes Oliveira** — étudiant en développement web (BUT MMI)
- Portfolio : [rafatns.vercel.app](https://rafatns.vercel.app)
- GitHub : [@alnrfLO](https://github.com/alnrfLO)
- Contact : rafael.atns.dev@gmail.com

Projet personnel, à but pédagogique — fait pour s'entraîner, pas pour
tricher en cours. Mentions légales disponibles directement dans l'app.
