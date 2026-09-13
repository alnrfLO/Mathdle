import "./LegalNotice.css";

interface LegalNoticeProps {
  onClose: () => void;
}

export function LegalNotice({ onClose }: LegalNoticeProps) {
  return (
    <div className="legal-overlay" onClick={onClose}>
      <div className="legal-sheet" onClick={(e) => e.stopPropagation()}>
        <button type="button" className="legal-sheet__close" onClick={onClose} aria-label="Fermer">
          ✕
        </button>

        <h2>Mentions légales</h2>

        <h3>Éditeur du site</h3>
        <p>
          Mathdle est un projet personnel développé par Rafael Antunes Oliveira, étudiant en
          développement web, dans un cadre non commercial et à but pédagogique.
          <br />
          Contact : rafael.atns.dev@gmail.com
          <br />
          GitHub : github.com/alnrfLO
        </p>

        <h3>Hébergement</h3>
        <p>
          Ce site est hébergé par Vercel Inc. — 340 S Lemon Ave #4133, Walnut, CA 91789,
          États-Unis (vercel.com).
        </p>

        <h3>Propriété intellectuelle</h3>
        <p>
          Le code source est disponible sur GitHub (github.com/alnrfLO/mathdle). Les contenus de
          ce site sont la propriété de l'auteur, sauf mention contraire.
        </p>

        <h3>Données personnelles</h3>
        <p>
          Ce site ne collecte aucune donnée personnelle et ne dépose aucun cookie de suivi. La
          progression à l'énigme du jour (série de jours réussis) est stockée uniquement dans le
          navigateur (localStorage), n'est jamais transmise à un serveur, et disparaît si tu vides
          les données de navigation du site.
        </p>
      </div>
    </div>
  );
}
