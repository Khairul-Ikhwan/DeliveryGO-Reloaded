import { Routes, Route } from "react-router";
import DesktopNav from "../../components/Navbars/DesktopNav";
import DriverLogin from "../../components/Login/DriverLogin";
import DriverDashboard from "../Driver/DriverDashboard";
import "./App.css";
import HomePage from "./HomePage";
import UserLogin from "../../components/Login/UserLogin";

export default function App() {
  return (
    <main className="App">
      <DesktopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
      </Routes>
    </main>
  );
}
