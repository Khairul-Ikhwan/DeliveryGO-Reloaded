import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import UserSignUp from "../User/UserSignUp";
import UserLogin from "../User/UserLogin";
import { sendRequest } from "../../helpers/send-helper";

export default function UserPage() {
  const [showSignUp, setShowSignUp] = useState(false);
  const navigate = useNavigate();

  const handleToggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  useEffect(() => {
    const checkUser = async (token) => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };
        const response = await sendRequest(
          "/api/users/getUser",
          "POST",
          null,
          headers
        );

        if (response && response.user) {
          navigate("/user/dashboard");
        }
      } catch (error) {
        console.error("Error checking user existence:", error);
      }
    };

    const token = localStorage.getItem("token");
    if (token) {
      checkUser(token);
    }
  }, [navigate]);

  return (
    <div className="page user">
      {showSignUp ? (
        <UserSignUp onSignUpClick={handleToggleSignUp} />
      ) : (
        <UserLogin onSignUpClick={handleToggleSignUp} />
      )}
    </div>
  );
}
