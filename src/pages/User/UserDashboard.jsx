import { Route, Routes } from "react-router";
import JobForm from "./JobForm";
import UserNavigation from "./UserNavigation";
import UserDetails from "./UserDetails";

export default function UserDashBooard() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<JobForm />} />
        <Route path="/profile" element={<UserDetails />} />
      </Routes>
      <UserNavigation />
    </>
  );
}
