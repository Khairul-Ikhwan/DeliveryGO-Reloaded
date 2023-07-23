import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { sendRequest } from "../../helpers/send-helper";
import LogOutButton from "../../components/Login/LogOutButton";
import "../../styles/details.css";

export default function UserDetails() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await sendRequest("/api/users/getUser", "POST", null, {
        Authorization: `Bearer ${token}`,
      });
      const { userName, userEmail, userPhone, userPfp } = response.user;
      setUser({ userName, userEmail, userPhone, userPfp });
    } catch (error) {
      console.error("Error fetching user details:", error);
      if (error.message === "Network Error") {
        console.error(
          "Network error occurred. Check your internet connection."
        );
      } else {
        navigate("/user");
      }
    }
  };

  useEffect(() => {
    fetchUserDetails();
  }, [navigate]);

  if (!user) {
    return <p>Loading...</p>;
  }

  return (
    <div className="details">
      <img src={user.userPfp} alt="Profile" />
      <h3>Welcome {user.userName}!</h3>
      <p>Email: {user.userEmail}</p>
      <p>Phone: {user.userPhone}</p>
      <LogOutButton path="/user" />
    </div>
  );
}
