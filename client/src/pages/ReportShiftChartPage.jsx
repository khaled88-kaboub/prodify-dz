import React, { useEffect, useState, useContext, useRef } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import {
  BarChart, // Utilisation d'un BarChart souvent plus lisible pour les shifts
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import html2canvas from "html2canvas";
import "./ReportChartPage.css"; 

const ReportShiftChartPage = () => {
  const [chartData, setChartData] = useState([]);
  const [productTypes, setProductTypes] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState("all");
  const { user } = useContext(AuthContext);
  const chartRef = useRef();

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` },
  };

  const fetchReports = async () => {
    try {
      const res = await axios.get("/reports", config);
      const data = res.data;

      // 1. Groupement par Date ET Shift
      const grouped = {};
      data.forEach((rep) => {
        const dateShort = rep.date.slice(5, 10); // MM-JJ pour plus de clarté
        const shift = rep.shift;
        const labelX = `${dateShort} (${shift})`; // Ex: "05-10 (06:00-14:00)"
        
        const produit =
          typeof rep.produit === "object"
            ? rep.produit.nom || "Inconnu"
            : rep.produit || "Inconnu";

        if (!grouped[labelX]) {
          grouped[labelX] = { 
            name: labelX, 
            fullDate: rep.date, // Pour le tri chronologique
            shift: shift 
          };
        }

        grouped[labelX][produit] = (grouped[labelX][produit] || 0) + Number(rep.nombreCartons || 0);
      });

      // 2. Formatage et Tri (par date puis par shift)
      const formatted = Object.values(grouped).sort((a, b) => {
        return new Date(a.fullDate) - new Date(b.fullDate);
      });

      // 3. Extraire les noms de produits pour les barres
      const produitsUniques = [
        ...new Set(
          data
            .map((rep) => (typeof rep.produit === "object" ? rep.produit.nom : rep.produit))
            .filter(Boolean)
        ),
      ];

      setChartData(formatted);
      setProductTypes(produitsUniques);
    } catch (err) {
      console.error("Erreur chargement shifts:", err);
    }
  };

  useEffect(() => {
    if (user) fetchReports();
  }, [user]);

  const exportChartAsImage = async () => {
    const canvas = await html2canvas(chartRef.current, { backgroundColor: "#fff" });
    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = "production_par_shift.png";
    link.click();
  };

  const colors = ["#007bff", "#28a745", "#dc3545", "#ffc107", "#6f42c1", "#20c997"];

  return (
    <div className="chart-page">
      <h2>📊 Production par Shift</h2>

      <div className="top-bar">
        <div className="filter-buttons">
          <button 
            className={selectedProduct === "all" ? "active" : ""} 
            onClick={() => setSelectedProduct("all")}
          >
            Tous les produits
          </button>
          {productTypes.map((p) => (
            <button 
              key={p} 
              className={selectedProduct === p ? "active" : ""} 
              onClick={() => setSelectedProduct(p)}
            >
              {p}
            </button>
          ))}
        </div>
        <button className="export-btn" onClick={exportChartAsImage}>📸 Export</button>
      </div>

      <div ref={chartRef} className="chart-container">
        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 60 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                interval={0} 
                height={80} 
                tick={{fontSize: 12}}
              />
              <YAxis label={{ value: 'Cartons', angle: -90, position: 'insideLeft' }} />
              <Tooltip />
              <Legend verticalAlign="top" />
              
              {productTypes
                .filter(p => selectedProduct === "all" ? true : p === selectedProduct)
                .map((p, index) => (
                  <Bar 
                    key={p} 
                    dataKey={p} 
                    stackId="a" // Optionnel: retirez stackId si vous voulez des barres côte à côte
                    fill={colors[index % colors.length]} 
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p>Chargement des données...</p>
        )}
      </div>
    </div>
  );
};

export default ReportShiftChartPage;