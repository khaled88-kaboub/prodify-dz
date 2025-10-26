import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./CategoriePage.css";

const CategoriePage = () => {
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({ nom: "" });
  const [editing, setEditing] = useState(null);
  const { user } = useContext(AuthContext);

  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  // 🟢 Charger les catégories
  const fetchCategories = async () => {
    try {
      const res = await axios.get("/categories", config);
      setCategories(res.data);
    } catch (err) {
      console.error("Erreur de chargement des catégories :", err);
    }
  };

  useEffect(() => {
    if (user) fetchCategories();
  }, [user]);

  // 🟢 Ajouter ou modifier une catégorie
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`/categories/${editing}`, form, config);
        setEditing(null);
      } else {
        await axios.post("/categories", form, config);
      }
      setForm({ nom: "" });
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de l’enregistrement :", err);
    }
  };

  // 🟢 Supprimer
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/categories/${id}`, config);
      fetchCategories();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  // 🟢 Pré-remplir le formulaire pour modification
  const handleEdit = (cat) => {
    setForm({ nom: cat.nom });
    setEditing(cat._id);
  };

  return (
    <div className="page-container">
      <div className="content">
        <h2>Gestion des Catégories</h2>

        <form className="form" onSubmit={handleSubmit}>
          <input
            placeholder="Nom de la catégorie"
            value={form.nom}
            onChange={(e) => setForm({ ...form, nom: e.target.value })}
          />
          <button type="submit">
            {editing ? "Modifier" : "Ajouter"}
          </button>
          {editing && (
            <button type="button" className="cancel-btn" onClick={() => {
              setEditing(null);
              setForm({ nom: "" });
            }}>
              Annuler
            </button>
          )}
        </form>

        <table className="styled-table">
          <thead>
            <tr>
              <th>Nom</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr key={cat._id}>
                <td>{cat.nom}</td>
                <td>
                  <button className="edit-btn" onClick={() => handleEdit(cat)}>
                    Modifier
                  </button>
                  <button
                    className="delete-btn"
                    onClick={() => handleDelete(cat._id)}
                  >
                    Supprimer
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default CategoriePage;
