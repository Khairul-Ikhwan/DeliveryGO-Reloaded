import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import DriverLogin from "./DriverLogin";
import DriverSignUp from "./DriverSignUp";
import "../App/App.css";
import { sendRequest } from "../../helpers/send-helper";

export default function DriverPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const handleToggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      checkDriver(token);
    }
  });

  const checkDriver = async (token) => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };
      const response = await sendRequest(
        "/api/drivers/find-driver",
        "POST",
        null,
        headers
      );

      if (response && response.driver) {
        navigate("/driver/dashboard");
      }
    } catch (error) {
      console.error("Error checking driver existence:", error);
    }
  };

  return (
    <>
      <div className="page driver">
        {showSignUp ? (
          <DriverSignUp onSignUpClick={handleToggleSignUp} />
        ) : (
          <DriverLogin onSignUpClick={handleToggleSignUp} />
        )}
      </div>
    </>
  );
}
