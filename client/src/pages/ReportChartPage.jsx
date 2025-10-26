import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import html2canvas from "html2canvas"; // ✅ pour capturer le graphique
import "./ReportChartPage.css";

const ReportChartPage = () => {
  const [chartData, setChartData] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const { user } = useContext(AuthContext);
  const chartRef = useRef(); // ✅ référence du graphique pour export

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  // Charger les rapports depuis le backend
  const fetchReports = async () => {
    try {
      const res = await axios.get("/reports", config);
      const data = res.data;

      // Regrouper par date et produit
      const grouped = {};
      data.forEach((rep) => {
        const date = rep.date.slice(0, 10);
        const produit =
          typeof rep.produit === "object"
            ? rep.produit.nom || "Inconnu"
            : rep.produit || "Inconnu";

        if (!grouped[date]) grouped[date] = {};
        grouped[date][produit] =
          (grouped[date][produit] || 0) + Number(rep.nombreCartons || 0);
      });

      const formatted = Object.entries(grouped)
        .map(([date, produits]) => ({ date, ...produits }))
        .sort((a, b) => new Date(a.date) - new Date(b.date));

      const produitsUniques = [
        ...new Set(
          data
            .map((rep) =>
              typeof rep.produit === "object" ? rep.produit.nom : rep.produit
            )
            .filter(Boolean)
        ),
      ];

      setChartData(formatted);
      setProductTypes(produitsUniques);
    } catch (err) {
      console.error("Erreur lors du chargement des rapports :", err);
    }
  };

  useEffect(() => {
    if (user) fetchReports();
  }, [user]);

  // ✅ Fonction pour exporter le graphique en image
  const exportChartAsImage = async () => {
    const chartElement = chartRef.current;
    if (!chartElement) return;

    const canvas = await html2canvas(chartElement, { backgroundColor: "#fff" });
    const image = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = image;
    link.download = "rapport_production.png";
    link.click();
  };

  const colors = [
    "#007bff",
    "#28a745",
    "#dc3545",
    "#ffc107",
    "#6f42c1",
    "#20c997",
    "#fd7e14",
  ];

  return (
    <div className="chart-page">
      <h2>📈 Évolution de la production</h2>

      {/* --- Barre supérieure avec filtres + export --- */}
      <div className="top-bar">
        <div className="filter-buttons">
          <button
            className={selectedProduct === "all" ? "active" : ""}
            onClick={() => setSelectedProduct("all")}
          >
            Tous les produits
          </button>

          {productTypes.map((produit) => (
            <button
              key={produit}
              className={selectedProduct === produit ? "active" : ""}
              onClick={() => setSelectedProduct(produit)}
            >
              {produit}
            </button>
          ))}
        </div>

        <button className="export-btn" onClick={exportChartAsImage}>
          📸 Exporter en image
        </button>
      </div>

      {/* --- Graphique --- */}
      <div ref={chartRef}>
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={420}>
            <LineChart
              data={chartData}
              margin={{ top: 20, right: 30, bottom: 10, left: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis
                label={{
                  value: "Cartons",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <Tooltip />
              <Legend />

              {productTypes
                .filter((produit) =>
                  selectedProduct === "all" ? true : produit === selectedProduct
                )
                .map((produit, index) => (
                  <Line
                    key={produit}
                    type="monotone"
                    dataKey={produit}
                    stroke={colors[index % colors.length]}
                    strokeWidth={3}
                    dot={{ r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="no-data">Aucune donnée à afficher pour le moment.</p>
        )}
      </div>
    </div>
  );
};

export default ReportChartPage;

