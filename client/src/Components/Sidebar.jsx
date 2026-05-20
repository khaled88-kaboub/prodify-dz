import { useState, useContext } from "react";
import { NavLink } from "react-router-dom";
import {
  FaCogs,
  FaBox,
  FaList,
  FaClipboardList,
  FaSignOutAlt,
  FaBars,
  FaChartLine,
  FaTimes,
  FaInfoCircle,
  FaEnvelope,
  FaTachometerAlt
} from "react-icons/fa";
import { AuthContext } from "../context/AuthContext";
import "./Sidebar2.css";

const Sidebar = () => {
  const { logout } = useContext(AuthContext);
  const [isOpen, setIsOpen] = useState(true);

  // 🔹 Fermer le menu après clic sur un lien
  const handleLinkClick = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Bouton toggle (menu hamburger) */}
      <button className="sidebar-toggle" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`sidebar ${isOpen ? "open" : "closed"}`}>
        <h2 className="sidebar-logo">Prodify-dz</h2>

        <nav className="sidebar-nav">

        <NavLink to="/dashboard" className="sidebar-link" onClick={handleLinkClick}>
            <FaTachometerAlt className="icon" /> Dashboard
          </NavLink>

          <NavLink to="/ligne" className="sidebar-link" onClick={handleLinkClick}>
            <FaCogs className="icon" /> Lignes de production
          </NavLink>

          <NavLink to="/categorie" className="sidebar-link" onClick={handleLinkClick}>
            <FaList className="icon" /> Catégories de produits
          </NavLink>

          <NavLink to="/produit" className="sidebar-link" onClick={handleLinkClick}>
            <FaBox className="icon" /> Produits
          </NavLink>

          <NavLink to="/rapport" className="sidebar-link" onClick={handleLinkClick}>
            <FaClipboardList className="icon" /> Rapport
          </NavLink>

          <NavLink to="/rapport-graph" className="sidebar-link" onClick={handleLinkClick}>
            <FaChartLine className="icon" /> Graphisme
          </NavLink>

          <NavLink to="/rapportshift-graph" className="sidebar-link" onClick={handleLinkClick}>
            <FaChartLine className="icon" /> Graphisme shift
          </NavLink>

          <NavLink to="/stats" className="sidebar-link" onClick={handleLinkClick}>
            <FaChartLine className="icon" /> Production annuelle
          </NavLink>

          <NavLink to="/stats-group" className="sidebar-link" onClick={handleLinkClick}>
            <FaChartLine className="icon" /> Production shift
          </NavLink>

          <NavLink to="/about" className="sidebar-link" onClick={handleLinkClick}>
            <FaInfoCircle className="icon" /> À propos
          </NavLink>

          <NavLink to="/contact" className="sidebar-link" onClick={handleLinkClick}>
            <FaEnvelope className="icon" /> Contact
          </NavLink>
        </nav>

        <button className="sidebar-logout" onClick={() => { logout(); setIsOpen(false); }}>
          <FaSignOutAlt className="icon" /> Déconnexion
        </button>
      </aside>
    </>
  );
};

export default Sidebar;
