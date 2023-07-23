import { Route, Routes } from "react-router";
import JobForm from "./JobForm";
import DriverNavigation from "../Driver/DriverNavigation";

export default function UserDashBooard() {
  return (
    <>
      <Routes>
        <Route path="/*" element={<JobForm />} />
      </Routes>
      <DriverNavigation />
    </>
  );
}
