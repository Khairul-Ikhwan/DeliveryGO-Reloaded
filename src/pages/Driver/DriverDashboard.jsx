import { useEffect, useState } from "react";
import { verifyToken } from "../../../utilities/jwt";

export default function DriverDashboard({ token }) {
  const [driverName, setDriverName] = useState("");

  useEffect(() => {
    const fetchDriverName = async () => {
      try {
        // Verify the token
        const decoded = verifyToken(token);
        if (decoded) {
          // Make an API call to fetch the driver's name using the token
          const response = await fetch("/api/driver/name", {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          setDriverName(data.name);
        }
      } catch (error) {
        console.error("Failed to fetch driver name:", error);
      }
    };

    if (token) {
      fetchDriverName();
    }
  }, [token]);

  return (
    <>
      <h1>This is the driver's dashboard</h1>
      <h3>Welcome {driverName ? driverName : "Driver"}!</h3>
    </>
  );
}
