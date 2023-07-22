import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { sendRequest } from "../../helpers/send-helper";
import "../../styles/forms.css";

export default function UserSignUp({ onSignUpClick }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userPfp: "",
    userPassword: "",
    userBlk: "",
    userStreet: "",
    userUnit: "",
    userPostal: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.userPassword !== formData.confirmPassword) {
      console.error("Password mismatch");
      return;
    }

    try {
      const response = await sendRequest("/api/users/create", "POST", formData);
      localStorage.setItem("token", response.token);
      navigate("/user/dashboard");
      console.log("User created successfully");
      console.log(response);
    } catch (error) {
      console.error("Error creating user:", error);
    }
  };

  const isSubmitDisabled =
    formData.userPassword !== formData.confirmPassword ||
    formData.confirmPassword === "";

  return (
    <div className="forms-container">
      <form onSubmit={handleSubmit}>
        <header>User Sign Up</header>
        <div>
          <input
            type="text"
            placeholder="Name"
            name="userName"
            value={formData.userName}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="email"
            placeholder="Email"
            name="userEmail"
            value={formData.userEmail}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="tel"
            placeholder="Phone Number (include +65)"
            name="userPhone"
            value={formData.userPhone}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div>
          <input
            type="url"
            placeholder="Profile Picture URL"
            name="userPfp"
            value={formData.userPfp}
            onChange={handleChange}
            required
          />
        </div> */}
        <div>
          <input
            type="password"
            placeholder="Password"
            name="userPassword"
            value={formData.userPassword}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="Confirm Password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>
        {/* <div>
          <input
            type="text"
            placeholder="Block/House Number"
            name="userBlk"
            value={formData.userBlk}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Street Name"
            name="userStreet"
            value={formData.userStreet}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Unit Number"
            name="userUnit"
            value={formData.userUnit}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <input
            type="text"
            placeholder="Postal Code"
            name="userPostal"
            value={formData.userPostal}
            onChange={handleChange}
            required
          />
        </div> */}
        <button type="submit" disabled={isSubmitDisabled}>
          Register
        </button>
        <p>
          <NavLink to="#" onClick={onSignUpClick}>
            Have a user account? Login here!
          </NavLink>
        </p>
      </form>
    </div>
  );
}