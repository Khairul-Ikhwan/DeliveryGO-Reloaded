import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../helpers/send-helper";
import LogOutButton from "../../components/Login/LogOutButton";

export default function DriverDashboard() {
  const [driver, setDriver] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await sendRequest(
          "/api/drivers/find-driver",
          "POST",
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        const { driverName, driverEmail, driverPhone, driverPfp } =
          response.driver;
        setDriver({ driverName, driverEmail, driverPhone, driverPfp });
      } catch (error) {
        console.error("Error fetching driver details:", error);
        if (error.message === "Network Error") {
          console.error(
            "Network error occurred. Check your internet connection."
          );
        } else {
          navigate("/driver/login");
        }
      }
    };

    fetchDriverDetails();
  }, [navigate]);

  if (!driver) {
    return <p>Loading...</p>;
  }

  return (
    <>
      <h1>This is {driver.driverName}'s dashboard</h1>
      <h3>Welcome {driver.driverName}!</h3>
      <p>Email: {driver.driverEmail}</p>
      <p>Phone: {driver.driverPhone}</p>
      <img src={driver.driverPfp} alt="Profile" />
      <LogOutButton path="/driver/login" />
    </>
  );
}
