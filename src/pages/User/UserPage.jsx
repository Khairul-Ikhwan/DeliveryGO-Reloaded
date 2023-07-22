import { useState } from "react";
import UserSignUp from "../User/UserSignUp";
import UserLogin from "../User/UserLogin";

export default function UserPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleToggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  return (
    <>
      {showSignUp ? (
        <UserSignUp onSignUpClick={handleToggleSignUp} />
      ) : (
        <UserLogin onSignUpClick={handleToggleSignUp} />
      )}
    </>
  );
}
