import { Outlet } from "react-router-dom";
import Sidebar from "../Components/Sidebar";
import Navbar from "../Components/Navbar";
import CategoriePage from "./CategoriePage";
//import "./Dashboard.css";
const Dashboard = () => {
  return (
    <div className="dashboard">
      
      <div className="dashboard-content">
        
       
        <main className="main-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Dashboard;

