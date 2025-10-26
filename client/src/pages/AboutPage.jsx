import "./AboutPage.css";
import { FaIndustry, FaChartLine, FaUsers, FaCogs } from "react-icons/fa";

const AboutPage = () => {
  return (
    <div className="about-page">
      <h2>À propos de <span className="highlight">Prodify-dz</span></h2>

      <section className="about-section">
        <p>
          <strong>Prodify-dz</strong> est une application web conçue pour la gestion et le
          suivi de la production industrielle. Elle permet de centraliser toutes
          les données de production — lignes, produits, catégories et rapports —
          dans un seul espace intuitif et sécurisé.
        </p>

        <p>
          Grâce à son interface claire et ses outils d’analyse, elle aide les
          responsables et les opérateurs à <strong>optimiser les performances</strong>,
          <strong>suivre la production en temps réel</strong> et <strong>réduire les erreurs</strong>.
        </p>
      </section>

      <section className="features">
        
        <h3>🔧 Fonctionnalités principales</h3>
        <div className="features-grid">
          <div className="feature-card">
            <FaIndustry className="icon" />
            <h4>Suivi de production</h4>
            <p>Visualisez la production quotidienne par ligne et par produit.</p>
          </div>
          <div className="feature-card">
            <FaChartLine className="icon" />
            <h4>Rapports & statistiques</h4>
            <p>Analysez les performances grâce à des rapports détaillés et graphiques.</p>
          </div>
          <div className="feature-card">
            <FaUsers className="icon" />
            <h4>Gestion des équipes</h4>
            <p>Associez chaque production à un groupe, un shift et un opérateur.</p>
          </div>
          <div className="feature-card">
            <FaCogs className="icon" />
            <h4>Interface intuitive</h4>
            <p>Une navigation fluide et rapide pour une utilisation sans formation.</p>
          </div>
        </div>
      </section>

      <section className="mission">
        <h3>🎯 Notre mission</h3>
        <p>
          Offrir aux entreprises industrielles un outil moderne et simple pour
          digitaliser la gestion de production, améliorer la productivité et
          faciliter la prise de décision.
        </p>
      </section>
    </div>
  );
};

export default AboutPage;
