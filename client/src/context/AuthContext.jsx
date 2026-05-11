import { createContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(JSON.parse(localStorage.getItem("user")) || null);

  const register = async (form) => {
    try {
      const res = await axios.post("https://prodify-dz.onrender.com/api/users/register", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/"); // ✅ redirige vers dashboard
    } catch (err) {
      console.error(err);
      alert("Erreur lors de l’inscription");
    }
  };

  const login = async (form) => {
    try {
      const res = await axios.post("https://prodify-dz.onrender.com/api/users/login", form);
      localStorage.setItem("user", JSON.stringify(res.data));
      setUser(res.data);
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Identifiants invalides");
    }
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, register, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
