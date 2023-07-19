import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendRequest } from "../../helpers/send-helper";

export default function DriverDashboard() {
  const [driver, setDriver] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchDriverDetails = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token from localStorage
        console.log("Token:", token); // Log the token value
        const response = await sendRequest(
          "/api/drivers/find-driver",
          "POST",
          null,
          {
            Authorization: `Bearer ${token}`, // Include the token in the request headers
          }
        );
        console.log("Response:", response); // Log the response
        setDriver(response.driver);
      } catch (error) {
        console.error("Error fetching driver details:", error);
        if (error.message === "Network Error") {
          // Handle network error separately
          console.error(
            "Network error occurred. Check your internet connection."
          );
        } else {
          navigate("/driver/login"); // Redirect to login page for unsuccessful responses
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
      <img src={driver.driverPfp} alt="Profile Picture" />
    </>
  );
}
