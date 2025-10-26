import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Splashscreen.css";

const SplashScreen = () => {
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    // Incrémente la barre progressivement
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          // Après 5 secondes → redirige vers la page principale
          setTimeout(() => navigate("/dashboard"), 500);
          return 100;
        }
        return prev + 2; // 2% toutes les 100ms = 5 secondes
      });
    }, 100);
    return () => clearInterval(interval);
  }, [navigate]);

  return (
    <div className="splash-container">
      <div className="splash-card">
        <h1 className="splash-title">🏭 ProdManager</h1>
        <p className="splash-text">Chargement en cours...</p>

        <div className="progress-bar">
          <div className="progress-fill" style={{ width: `${progress}%` }}></div>
        </div>

        <p className="progress-percent">{progress}%</p>
      </div>
    </div>
  );
};

export default SplashScreen;
