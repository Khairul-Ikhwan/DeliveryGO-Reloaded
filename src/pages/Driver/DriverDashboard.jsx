import { Route, Routes } from "react-router";
import "../../styles/dashboard.css";
import JobsPage from "../Jobs/JobsPage";
import DriverDetails from "./DriverDetails";
import DriverNavigation from "./DriverNavigation";
import DriverAcceptedJobs from "./DriverAcceptedJobs";
import DriverCompletedJobs from "./DriverCompletedJobs";

export default function DriverDashboard() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<JobsPage />} />
        <Route path="/active-jobs" element={<DriverAcceptedJobs />} />
        <Route path="/profile" element={<DriverDetails />} />
        <Route path="/completed" element={<DriverCompletedJobs />} />
      </Routes>
      <DriverNavigation />
    </>
  );
}
