import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { BrowserRouter } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./Components/Navbar";
import Sidebar from "./Components/Sidebar";
import SplashScreen from "./pages/Splashscreen";
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    
    <BrowserRouter>
    
      <AuthProvider>
      <Sidebar/>
      <Navbar/>
        <App />
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);


