import { useState, useEffect, useContext } from "react";
import axios from "../api/axios";
import { AuthContext } from "../context/AuthContext";
import "./ProduitPage.css"

const ProduitPage = () => {
  const [produits, setProduits] = useState([]);
  const [categories, setCategories] = useState([]);
  const [form, setForm] = useState({
    nom: "",
    code: "",
    categorie: "",
    unite: "kg",
  });
  const [editId, setEditId] = useState(null);

  const { user } = useContext(AuthContext);

  // 🔐 Token d'authentification
  const config = {
    headers: {
      Authorization: `Bearer ${user?.token}`,
    },
  };

  // 🟢 Charger les produits
  const fetchProduits = async () => {
    try {
      const res = await axios.get("/produits", config);
      setProduits(res.data);
    } catch (err) {
      console.error("Erreur de chargement des produits :", err);
    }
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
    if (user) {
      fetchProduits();
      fetchCategories();
    }
  }, [user]);

  // 🟢 Soumission du formulaire (ajout ou modification)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        // ✏️ Modification
        await axios.put(`/produits/${editId}`, form, config);
      } else {
        // ➕ Ajout
        await axios.post("/produits", form, config);
      }

      // Réinitialisation
      setForm({ nom: "", code: "", categorie: "", unite: "kg" });
      setEditId(null);
      fetchProduits();
    } catch (err) {
      console.error("Erreur lors de l'enregistrement :", err);
    }
  };

  // ✏️ Préparer l'édition
  const handleEdit = (produit) => {
    setForm({
      nom: produit.nom,
      code: produit.code,
      categorie: produit.categorie?._id || "",
      unite: produit.unite,
    });
    setEditId(produit._id);
  };

  // 🗑️ Supprimer un produit
  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer ce produit ?")) return;
    try {
      await axios.delete(`/produits/${id}`, config);
      fetchProduits();
    } catch (err) {
      console.error("Erreur lors de la suppression :", err);
    }
  };

  // 🔄 Annuler la modification
  const handleCancelEdit = () => {
    setForm({ nom: "", code: "", categorie: "", unite: "kg" });
    setEditId(null);
  };

  return (
    <div className="container">
      <h2>🧾 Gestion des Produits</h2>

      {/* Formulaire */}
      <form onSubmit={handleSubmit} className="form">
        <input
          placeholder="Nom du produit"
          value={form.nom}
          onChange={(e) => setForm({ ...form, nom: e.target.value })}
          required
        />

        <input
          placeholder="Code"
          value={form.code}
          onChange={(e) => setForm({ ...form, code: e.target.value })}
        />

        <select
          value={form.categorie}
          onChange={(e) => setForm({ ...form, categorie: e.target.value })}
          required
        >
          <option value="">-- Sélectionner une catégorie --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.nom}
            </option>
          ))}
        </select>

        <input
          placeholder="Unité (ex: kg, L, pcs)"
          value={form.unite}
          onChange={(e) => setForm({ ...form, unite: e.target.value })}
        />

        <div>
          <button type="submit">{editId ? "Modifier" : "Ajouter"}</button>
          {editId && <button onClick={handleCancelEdit}>Annuler</button>}
        </div>
      </form>

      {/* Tableau */}
      <table>
        <thead>
          <tr>
            <th>Nom</th>
            <th>Code</th>
            <th>Catégorie</th>
            <th>Unité</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {produits.map((p) => (
            <tr key={p._id}>
              <td>{p.nom}</td>
              <td>{p.code}</td>
              <td>{p.categorie?.nom || "—"}</td>
              <td>{p.unite}</td>
              <td>
                <button onClick={() => handleEdit(p)}>Modifier</button>
                <button onClick={() => handleDelete(p._id)}>Supprimer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

     
    </div>
  );
};

export default ProduitPage;

