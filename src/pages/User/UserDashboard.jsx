import { Route, Routes } from "react-router";
import JobForm from "./JobForm";
import UserNavigation from "./UserNavigation";
import UserDetails from "./UserDetails";
import OngoingOrders from "./OngoingOrders";
import "../../styles/dashboard.css";

export default function UserDashboard() {
  return (
    <>
      <Routes>
        <Route path="/" element={<JobForm />} />
        <Route path="/active-jobs" element={<OngoingOrders />} />
        <Route path="/profile" element={<UserDetails />} />
      </Routes>
      <UserNavigation />
    </>
  );
}
