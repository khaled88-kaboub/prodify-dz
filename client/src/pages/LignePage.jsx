import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./LignePage.css"

const LignePage = () => {
  const [lignes, setLignes] = useState([]);
  const [form, setForm] = useState({ nom: "" });
  const [editId, setEditId] = useState(null); // 🟡 ID de la ligne à modifier
  const { user } = useContext(AuthContext);

  // 🔐 Token d'authentification
  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  // 🟢 Charger toutes les lignes
  const fetchLignes = async () => {
    try {
      const res = await axios.get("/lignes", config);
      setLignes(res.data);
    } catch (err) {
      console.error("Erreur de chargement des lignes :", err);
    }
  };

  useEffect(() => {
    if (user) fetchLignes();
  }, [user]);

  // 🟢 Ajouter ou modifier une ligne
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // 🔵 Mise à jour
        await axios.put(`/lignes/${editId}`, form, config);
        setEditId(null);
      } else {
        // 🟢 Création
        await axios.post("/lignes", form, config);
      }

      setForm({ nom: "" });
      fetchLignes();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  // 🟡 Préparer la modification
  const handleEdit = (ligne) => {
    setEditId(ligne._id);
    setForm({ nom: ligne.nom });
  };

  // 🔴 Supprimer une ligne
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/lignes/${id}`, config);
      fetchLignes();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  return (
    <div className="page-container">
      <div className="content">
      <h2>Gestion des Lignes de production</h2>

      {/* Formulaire */}
      <form  className="form" onSubmit={handleSubmit} style={{ marginBottom: "20px" }}>
        <input
          placeholder="Nom de la ligne"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          required
        />
        <button type="submit">
          {editId ? "Modifier" : "Ajouter"}
        </button>
        {editId && (
          <button className="cancel-btn" type="button" onClick={() => {
              setEditId(null);
              setForm({ nom: "" });
            }}
            
          >
            Annuler
          </button>
        )}
      </form>

      {/* Tableau */}
      <table className="styled-table">
        <thead>
          <tr>
            <th>Nom</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {lignes.map((ligne) => (
            <tr key={ligne._id}>
              <td>{ligne.nom}</td>
              <td className="actions-cell">
                <button className="edit-btn" onClick={() => handleEdit(ligne)}>Modifier</button>
                <button className="delete-btn" onClick={() => handleDelete(ligne._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
    </div>
  );
};

export default LignePage;
