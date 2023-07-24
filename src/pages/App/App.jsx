import { Routes, Route } from "react-router";
import DesktopNav from "../../components/Navbars/DesktopNav";
import "./App.css";
import HomePage from "./HomePage";
import DriverPage from "../Driver/DriverPage";
import UserPage from "../User/UserPage";
import DriverDashboard from "../Driver/DriverDashboard";
import UserDashBooard from "../User/UserDashboard";
import NotFoundPage from "./NotFoundPage";

export default function App() {
  return (
    <main className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/*" element={<NotFoundPage />} />
        <Route path="/driver" element={<DriverPage />} />
        <Route path="/user" element={<UserPage />} />
        <Route path="/driver/dashboard/*" element={<DriverDashboard />} />
        <Route path="/user/dashboard/*" element={<UserDashBooard />} />
      </Routes>
    </main>
  );
}
