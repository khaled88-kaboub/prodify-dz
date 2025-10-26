import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import logo from "../assets/logo.jpg";

import "./ReportPage.css";

import { exportReportToPDF } from "./exportReportToPDF";




const ReportPage = () => {
  const [reports, setReports] = useState([]);
  const [categories, setCategories] = useState([]);
  const [produits, setProduits] = useState([]);
  const [filteredProduits, setFilteredProduits] = useState([]); // 🔥 produits selon catégorie
  const [lignes, setLignes] = useState([]);

  const [form, setForm] = useState({
    date: "",
    groupe: "",
    shift: "",
    categorieProduit: "",
    produit: "",
    ligneProduction: "",
    nombreCartons: "",
    dechetsKg: "",
    remarques: "",
  });

  const [editingId, setEditingId] = useState(null);
  const { user } = useContext(AuthContext);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  // 🟢 Charger toutes les données liées
  const fetchData = async () => {
    try {
      const [repRes, catRes, prodRes, ligneRes] = await Promise.all([
        axios.get("/reports", config),
        axios.get("/categories", config),
        axios.get("/produits", config),
        axios.get("/lignes", config),
      ]);
      setReports(repRes.data);
      setCategories(catRes.data);
      setProduits(prodRes.data);
      setLignes(ligneRes.data);
    } catch (err) {
      console.error("Erreur de chargement :", err);
    }
  };

  useEffect(() => {
    if (user) fetchData();
  }, [user]);

  // 🟢 Filtrer les produits selon la catégorie sélectionnée
  useEffect(() => {
    if (form.categorieProduit) {
      const filtered = produits.filter(
        (p) => p.categorie?._id === form.categorieProduit || p.categorie === form.categorieProduit
      );
      setFilteredProduits(filtered);
    } else {
      setFilteredProduits([]);
    }
  }, [form.categorieProduit, produits]);

  // 🟢 Ajouter ou modifier un rapport
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/reports/${editingId}`, form, config);
      } else {
        await axios.post("/reports", form, config);
      }
      setForm({
        date: "",
        groupe: "",
        shift: "",
        categorieProduit: "",
        produit: "",
        ligneProduction: "",
        nombreCartons: "",
        dechetsKg: "",
        remarques: "",
      });
      setEditingId(null);
      fetchData();
    } catch (err) {
      console.error("Erreur lors de la sauvegarde :", err);
    }
  };

  // 🟢 Supprimer un rapport
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce rapport ?")) {
      try {
        await axios.delete(`/reports/${id}`, config);
        fetchData();
      } catch (err) {
        console.error("Erreur de suppression :", err);
      }
    }
  };

  const exportToExcel = () => {
    // 🔹 Convertir les rapports en un format lisible pour Excel
    const dataToExport = reports.map((r) => ({
      Date: new Date(r.date).toLocaleDateString(),
      Groupe: r.groupe,
      Shift: r.shift,
      Catégorie: r.categorieProduit?.nom || "",
      Produit: r.produit?.nom || "",
      Ligne: r.ligneProduction?.nom || "",
      "Nombre de cartons": r.nombreCartons,
      "Déchets (kg)": r.dechetsKg,
      Remarques: r.remarques || "",
      Utilisateur: r.user?.username || "",
    }));
  
    // 🔹 Créer une feuille Excel
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Rapports");
  
    // 🔹 Générer et télécharger le fichier
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, `Rapports_Production_${new Date().toLocaleDateString()}.xlsx`);
  };
  
  
const exportToPDF = () => {
  const doc = new jsPDF("l", "pt", "a4"); // format paysage A4

  // 🏭 --- En-tête personnalisé ---
  const currentDate = new Date().toLocaleDateString();

  // Logo (optionnel)
  try {
    doc.addImage(logo, "PNG", 40, 20, 50, 50); // x, y, largeur, hauteur
  } catch (e) {
    console.warn("Logo introuvable, vérifie le chemin dans /src/assets/logo.png");
  }

  // Titre principal
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.text("ProdManager - Rapports de Production", 120, 45);

  // Date du rapport
  doc.setFontSize(12);
  doc.setTextColor(100);
  doc.text(`Date d’export : ${currentDate}`, 120, 65);

  // Ligne de séparation
  doc.setDrawColor(100);
  doc.line(40, 75, 800, 75);

  // --- Tableau principal ---
  const tableColumn = [
    "Date",
    "Groupe",
    "Shift",
    "Catégorie",
    "Produit",
    "Ligne",
    "Cartons",
    "Déchets (kg)",
    "Remarques",
  ];

  const tableRows = reports.map((r) => [
    new Date(r.date).toLocaleDateString(),
    r.groupe,
    r.shift,
    r.categorieProduit?.nom || "",
    r.produit?.nom || "",
    r.ligneProduction?.nom || "",
    r.nombreCartons,
    r.dechetsKg,
    r.remarques || "",
  ]);

  autoTable(doc, {
    head: [tableColumn],
    body: tableRows,
    startY: 90,
    styles: { fontSize: 9, halign: "center" },
    headStyles: {
      fillColor: [41, 128, 185],
      textColor: 255,
      fontStyle: "bold",
    },
    alternateRowStyles: { fillColor: [245, 245, 245] },
    margin: { top: 90 },
  });

  // Pied de page
  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(10);
    doc.text(
      `Page ${i} / ${pageCount}`,
      doc.internal.pageSize.getWidth() - 80,
      doc.internal.pageSize.getHeight() - 20
    );
  }

  // 🔹 Enregistrer le fichier
  doc.save(`Rapports_Production_${currentDate}.pdf`);
};


  
  // 🟢 Pré-remplir le formulaire pour modification
  const handleEdit = (rep) => {
    setForm({
      date: rep.date ? rep.date.slice(0, 10) : "",
      groupe: rep.groupe,
      shift: rep.shift,
      categorieProduit: rep.categorieProduit?._id || "",
      produit: rep.produit?._id || "",
      ligneProduction: rep.ligneProduction?._id || "",
      nombreCartons: rep.nombreCartons,
      dechetsKg: rep.dechetsKg,
      remarques: rep.remarques || "",
    });
    setEditingId(rep._id);
  };

  return (
    <div className="report-page">
      {/*<button onClick={() => exportReportToPDF(reports)}>📄 Exporter PDF</button>*/}
      <h2>📋 Gestion des Rapports de Production</h2>

      <form onSubmit={handleSubmit} className="report-form">
        <div className="form-grid">

        
        
        <input
        className="forme-group"
          type="date"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          required
        />
        

<select
          value={form.groupe}
          onChange={(e) => setForm({ ...form, groupe: e.target.value })}
          required
          className="forme-group"
        >
          <option value="">-- Choisir un groupe --</option>
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>

        <select
          value={form.shift}
          onChange={(e) => setForm({ ...form, shift: e.target.value })}
          required
          className="forme-group"
        >
          <option value="">-- Choisir un shift --</option>
          <option value="06:00-14:00">06:00-14:00</option>
          <option value="14:00-22:00">14:00-22:00</option>
          <option value="22:00-06:00">22:00-06:00</option>
        </select>

        {/* 🟢 Catégorie */}
        <select
        className="forme-group"
          value={form.categorieProduit}
          onChange={(e) => setForm({ ...form, categorieProduit: e.target.value, produit: "" })}
          required
        >
          <option value="">-- Catégorie --</option>
          {categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.nom}
            </option>
          ))}
        </select>

        {/* 🟢 Produit selon catégorie */}
        <select
          value={form.produit}
          onChange={(e) => setForm({ ...form, produit: e.target.value })}
          required
          className="forme-group"
        >
          <option value="">-- Produit --</option>
          {filteredProduits.map((p) => (
            <option key={p._id} value={p._id}>
              {p.nom}
            </option>
          ))}
        </select>

        <select
          value={form.ligneProduction}
          onChange={(e) => setForm({ ...form, ligneProduction: e.target.value })}
          required
          className="forme-group"
        >
          <option value="">-- Ligne de production --</option>
          {lignes.map((l) => (
            <option key={l._id} value={l._id}>
              {l.nom}
            </option>
          ))}
        </select>

        <input
          type="number"
          placeholder="Nombre de cartons"
          value={form.nombreCartons}
          onChange={(e) => setForm({ ...form, nombreCartons: e.target.value })}
          required
          className="forme-group"
        />
        <input
          type="number"
          placeholder="Déchets (kg)"
          value={form.dechetsKg}
          onChange={(e) => setForm({ ...form, dechetsKg: e.target.value })}
          required
          className="forme-group"
        />
        
         </div>
         <textarea
          placeholder="Remarques"
          value={form.remarques}
          onChange={(e) => setForm({ ...form, remarques: e.target.value })}
          className="forme-group"
        />
        <button type="submit">
          {editingId ? "Modifier le rapport" : "Ajouter le rapport"}
        </button>
      </form>

      <h3>📑 Liste des Rapports</h3>

      <div style={{ textAlign: "right", marginBottom: "10px" }}>
      <button onClick={exportToExcel} className="export-btn">
       📤 Exporter vers Excel
      </button>
 

      <button
       onClick={exportToPDF}
       className="export-btn"
       style={{ backgroundColor: "#e74c3c", marginLeft: "10px" }}
  >
    📄 Exporter vers PDF
  </button>
</div>

      <table className="report-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Groupe</th>
            <th>Shift</th>
            <th>Catégorie</th>
            <th>Produit</th>
            <th>Ligne</th>
            <th>Cartons</th>
            <th>Déchets</th>
            <th>Remarques</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r) => (
            <tr key={r._id}>
              <td>{new Date(r.date).toLocaleDateString()}</td>
              <td>{r.groupe}</td>
              <td>{r.shift}</td>
              <td>{r.categorieProduit?.nom}</td>
              <td>{r.produit?.nom}</td>
              <td>{r.ligneProduction?.nom}</td>
              <td>{r.nombreCartons}</td>
              <td>{r.dechetsKg}</td>
              <td>{r.remarques}</td>
              <td>
                <button onClick={() => handleEdit(r)}>✏️</button>
                <button onClick={() => handleDelete(r._id)}>🗑️</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      

</div>

    
  );
};

export default ReportPage;
