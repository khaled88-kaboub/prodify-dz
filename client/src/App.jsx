// client/src/App.jsx
import { Routes, Route, Router } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Dashboard from "./pages/Dashboard";
import ProtectedRoute from "./Components/ProtectedRoute";
import LignePage from "./pages/LignePage";
import CategoriePage from "./pages/CategoriePage";
import ProduitPage from "./pages/ProduitPage";
import ReportPage from "./pages/ReportPage";
import Navbar from "./Components/Navbar";
import Splashscreen from "./pages/Splashscreen";
import ReportChartPage from "./pages/ReportChartPage";
import Sidebar from "./Components/Sidebar";
//import Navbar from "./Components/Navbar";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";






function App() {
  return (
    
        
    <Routes>
      
      <Route path="/splash" element={<Splashscreen />} />
      


      <Route path="/rapport-graph" element={<ReportChartPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/ligne" element={<LignePage />} />
      <Route path="/categorie" element={<CategoriePage />} />
      <Route path="/produit" element={<ProduitPage />} />
      <Route path="/rapport" element={<ReportPage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
            
          </ProtectedRoute>
        }
      />
    </Routes>
    
  );
}

export default App;
