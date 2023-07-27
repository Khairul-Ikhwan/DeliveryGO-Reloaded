import { useState } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { sendRequest } from "../../helpers/send-helper";
import "../../styles/forms.css";

export default function UserSignUp({ onSignUpClick }) {
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    userName: "",
    userEmail: "",
    userPhone: "",
    userPfp: "https://picsum.photos/200/200",
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
      setErrorMessage("Password mismatch");
      return;
    }

    try {
      setIsLoading(true);
      const emailData = {
        email: formData.userEmail,
        subject: "Hello from DeliveryGO!",
        htmlPath: "controllers/emailTemplates/userSignUp.html",
      };

      const response = await sendRequest("/api/users/create", "POST", formData);

      const sendEmail = await sendRequest(
        "/api/emails/sendEmail",
        "POST",
        emailData
      );
      localStorage.setItem("token", response.token);
      navigate("/user/dashboard");
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      setErrorMessage("Error creating user:", error);
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
        {errorMessage && <msg className="error-message">{errorMessage}</msg>}
        <button type="submit" disabled={isSubmitDisabled}>
          {isLoading ? "Loading..." : "Register"}
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
