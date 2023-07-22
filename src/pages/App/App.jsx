import { Routes, Route } from "react-router";
import DesktopNav from "../../components/Navbars/DesktopNav";
import "./App.css";
import HomePage from "./HomePage";
import DriverPage from "../Driver/DriverPage";
import UserPage from "../User/UserPage";
import DriverDashboard from "../Driver/DriverDashboard";

export default function App() {
  return (
    <main className="App">
      <DesktopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/driver" element={<DriverPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
      </Routes>
    </main>
  );
}
