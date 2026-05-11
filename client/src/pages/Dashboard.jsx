import { useEffect, useState, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import { BarChart, Bar, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from "recharts";
import "./Dashboard.css";

const Dashboard = () => {
  const { user } = useContext(AuthContext);
  const [dailyData, setDailyData] = useState([]);

  useEffect(() => {
    const fetchDailyData = async () => {
      try {
        const res = await axios.get("/reports/daily", {
          headers: { Authorization: `Bearer ${user?.token}` },
        });
        setDailyData(res.data);
      } catch (err) {
        console.error("Erreur lors du chargement du dashboard :", err);
      }
    };

    if (user) fetchDailyData();
  }, [user]);

  return (
    <div className="dashboard">
      <h2>📊 Production du jour</h2>
      <p style={{ color: "#555" }}>
        {new Date().toLocaleDateString("fr-FR", {
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
        })}
      </p>

      {dailyData.length === 0 ? (
        <p>Aucune production enregistrée aujourd’hui.</p>
      ) : (
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={dailyData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="produitNom" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="totalCartons" fill="#3498db" radius={[10, 10, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default Dashboard;


