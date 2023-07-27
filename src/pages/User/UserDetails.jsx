import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { sendRequest } from "../../helpers/send-helper";
import LogOutButton from "../../components/Login/LogOutButton";
import "../../styles/details.css";

export default function UserDetails() {
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userPfp: "",
  });
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

  const updateUserDetails = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await sendRequest(
        "/api/users/update",
        "POST",
        updatedUser,
        {
          Authorization: `Bearer ${token}`,
        }
      );
      if (response.message === "User updated successfully") {
        setUser((prevUser) => ({
          ...prevUser,
          userEmail: updatedUser.userEmail || prevUser.userEmail,
          userPhone: updatedUser.userPhone || prevUser.userPhone,
        }));
      }
      setEditMode(false);
    } catch (error) {
      console.error("Error updating user details:", error);
      if (error.message === "Network Error") {
        console.error(
          "Network error occurred. Check your internet connection."
        );
      } else {
        alert("Update Failed");
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
      {editMode ? (
        <form onSubmit={updateUserDetails}>
          <label>
            Email:
            <input
              type="email"
              value={updatedUser.userEmail}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  userEmail: e.target.value,
                })
              }
            />
          </label>
          <label>
            Phone:
            <input
              type="tel"
              value={updatedUser.userPhone}
              onChange={(e) =>
                setUpdatedUser({
                  ...updatedUser,
                  userPhone: e.target.value,
                })
              }
            />
          </label>
          <button type="submit">Update</button>
          <button type="button" onClick={() => setEditMode(false)}>
            Cancel
          </button>
        </form>
      ) : (
        <>
          <p>Email: {user.userEmail}</p>
          <p>Phone: {user.userPhone}</p>
          <button
            onClick={() => {
              setUpdatedUser(user);
              setEditMode(true);
            }}
          >
            Edit
          </button>
        </>
      )}
      <LogOutButton path="/user" />
    </div>
  );
}
