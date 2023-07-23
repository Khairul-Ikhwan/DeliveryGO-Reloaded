import "../../styles/dashboard.css";
import JobsPage from "../Jobs/JobsPage";
import DriverDetails from "./DriverDetails";
import DriverNavigation from "./DriverNavigation";

export default function DriverDashboard() {
  return (
    <>
      <DriverDetails />
      <DriverNavigation />
      <JobsPage />
    </>
  );
}
