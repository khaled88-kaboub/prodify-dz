import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios"; // Votre instance Axios corrigée
import { AuthContext } from "../context/AuthContext";
import "./ProductionStatsPage.css"; // Pour le style du tableau

const ProductionStatsPage = () => {
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useContext(AuthContext);

  // 🔐 Token d'authentification
  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };


  // Liste fixe des mois pour les entêtes du tableau
  const listeMois = [
    { id: 1, nom: "Janvier" },
    { id: 2, nom: "Février" },
    { id: 3, nom: "Mars" },
    { id: 4, nom: "Avril" },
    { id: 5, nom: "Mai" },
    { id: 6, nom: "Juin" },
    { id: 7, nom: "Juillet" },
    { id: 8, nom: "Août" },
    { id: 9, nom: "Septembre" },
    { id: 10, nom: "Octobre" },
    { id: 11, nom: "Novembre" },
    { id: 12, nom: "Décembre" },
  ];

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Appel de notre nouvelle route d'agrégation
      const res = await api.get("/reports/stats-mensuelles", config);
      setStatsData(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchStats();
  }, [user]);

  // Fonction utilitaire pour calculer le total annuel d'un produit (somme de la ligne)
  const calculerTotalLigne = (produitRow) => {
    return Array.from({ length: 12 }, (_, i) => produitRow[i + 1] || 0)
                .reduce((sum, val) => sum + val, 0);
  };

  if (loading) return <div className="loading">Chargement des statistiques...</div>;

  return (
    <div className="page-container">
      <div className="content">
        <h2>📊 Tableau Récapitulatif Mensuel (Boite/Bouteille)</h2>
        
        <div className="table-responsive">
          <table className="styled-table stats-table">
            <thead>
              <tr>
                <th>Produit</th>
                {listeMois.map((m) => (
                  <th key={m.id}>{m.nom}</th>
                ))}
                <th className="total-header">Total Annuel</th>
              </tr>
            </thead>
            <tbody>
              {statsData.length > 0 ? (
                statsData.map((row) => (
                  <tr key={row.produit}>
                    <td className="product-name-td"><strong>{row.produit}</strong></td>
                    {listeMois.map((m) => (
                      <td key={m.id} className={row[m.id] === 0 ? "cell-zero" : "cell-value"}>
                        {row[m.id] !== 0 ? row[m.id].toLocaleString() : "-"}
                      </td>
                    ))}
                    <td className="total-td">
                      <strong>{calculerTotalLigne(row).toLocaleString()}</strong>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={14} className="no-data">
                    Aucune donnée de production trouvée pour cette année.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductionStatsPage;