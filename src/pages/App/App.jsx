import { Routes, Route } from "react-router";
import DesktopNav from "../../components/Navbars/DesktopNav";

import DriverDashboard from "../Driver/DriverDashboard";
import "./App.css";
import HomePage from "./HomePage";
import DriverLogin from "../Driver/DriverLogin";
import UserLogin from "../User/UserLogin";
import DriverSignUp from "../Driver/DriverSignUp";

export default function App() {
  return (
    <main className="App">
      <DesktopNav />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/user/login" element={<UserLogin />} />
        <Route path="/driver/login" element={<DriverLogin />} />
        <Route path="driver/signup" element={<DriverSignUp />} />
        <Route path="/driver/dashboard" element={<DriverDashboard />} />
      </Routes>
    </main>
  );
}
