import React, { useEffect, useState, useContext } from "react";
import api from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./ProductionGroupStatsPage.css"; 

const ProductionGroupStatsPage = () => {
  const currentMonthNumber = new Date().getMonth() + 1;
  const [selectedMonth, setSelectedMonth] = useState(currentMonthNumber);
  const [statsData, setStatsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { user } = useContext(AuthContext);

  const listeMois = [
    { id: 1, nom: "Janvier" }, { id: 2, nom: "Février" }, { id: 3, nom: "Mars" },
    { id: 4, nom: "Avril" }, { id: 5, nom: "Mai" }, { id: 6, nom: "Juin" },
    { id: 7, nom: "Juillet" }, { id: 8, nom: "Août" }, { id: 9, nom: "Septembre" },
    { id: 10, nom: "Octobre" }, { id: 11, nom: "Novembre" }, { id: 12, nom: "Décembre" }
  ];

  // Vos groupes définis dans le modèle Mongoose
  const groupes = ["BOUFASSA", "MOUHAMMOU", "FEDALA"];

  const fetchGroupStats = async () => {
    try {
      setLoading(true);
      const config = {
        headers: { Authorization: `Bearer ${user?.token}` }
      };
      
      const res = await api.get(`/reports/stats-groupe-mensuel?month=${selectedMonth}`, config);
      setStatsData(res.data);
    } catch (err) {
      console.error("Erreur lors du chargement des statistiques par groupe :", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchGroupStats();
  }, [user, selectedMonth]);

  return (
    <div className="page-container">
      <div className="content">
        <div className="stats-header-container">
          <h2>📋 Analyse de Production par Groupe &amp; Produit</h2>
          
          <div className="filter-group">
            <label htmlFor="month-select">Choisir un mois : </label>
            <select 
              id="month-select"
              value={selectedMonth} 
              onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
              className="month-dropdown"
            >
              {listeMois.map((m) => (
                <option key={m.id} value={m.id}>{m.nom}</option>
              ))}
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading">Mise à jour des analyses...</div>
        ) : (
          <div className="table-responsive">
            <table className="styled-table group-stats-table">
              <thead>
                <tr>
                  <th rowSpan="2">Produit</th>
                  {groupes.map((g) => (
                    <th key={g} colSpan="2">Groupe {g}</th>
                  ))}
                </tr>
                <tr>
                  {groupes.map((g) => (
                    <React.Fragment key={`${g}-sub`}>
                      <th></th>
                      <th> </th>
                    </React.Fragment>
                  ))}
                </tr>
              </thead>
              <tbody>
                {statsData.length > 0 ? (
                  statsData.map((row) => (
                    <tr key={row.produit}>
                      <td className="product-cell"><strong>{row.produit}</strong></td>
                      {groupes.map((g) => (
                        <React.Fragment key={g}>
                          <td className={row[g]?.cartons === 0 ? "zero-val" : "value-val"}>
                            {row[g]?.cartons !== 0 ? row[g]?.cartons.toLocaleString() : "-"}
                          </td>
                          <td className={row[g]?.dechets === 0 ? "zero-val dechet-color" : "value-val dechet-color"}>
                            {row[g]?.dechets !== 0 ? row[g]?.dechets.toLocaleString() : "-"}
                          </td>
                        </React.Fragment>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={groupes.length * 2 + 1} className="no-data-cell">
                      Aucun rapport enregistré pour le mois de {listeMois.find(m => m.id === selectedMonth)?.nom}.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductionGroupStatsPage;