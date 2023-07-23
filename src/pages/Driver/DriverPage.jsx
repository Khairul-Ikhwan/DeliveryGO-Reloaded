import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import DriverLogin from "./DriverLogin";
import DriverSignUp from "./DriverSignUp";
import "../App/App.css";

export default function DriverPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const handleToggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/driver/dashboard");
    }
  }, [navigate]);

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
