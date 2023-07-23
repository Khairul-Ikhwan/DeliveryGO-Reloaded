import { Route, Routes } from "react-router";
import "../../styles/dashboard.css";
import JobsPage from "../Jobs/JobsPage";
import DriverDetails from "./DriverDetails";
import DriverNavigation from "./DriverNavigation";

export default function DriverDashboard() {
  return (
    <>
      <Routes>
        <Route path="/" element={<JobsPage />} />
        <Route path="/profile" element={<DriverDetails />} />
      </Routes>
      <DriverNavigation />
    </>
  );
}
