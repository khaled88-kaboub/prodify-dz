import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import "./Navbar.css"; // 🧩 Import du style

const Navbar = () => {
  const { user } = useContext(AuthContext);

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <h3 className="navbar-title"></h3>
      </div>
      <div className="navbar-right">
        {user ? (
          <p className="navbar-user">
            👋 Bonjour, <strong>{user.name}</strong>
          </p>
        ) : (
          <p className="navbar-user">Non connecté</p>
        )}
      </div>
    </nav>
  );
};

export default Navbar;

