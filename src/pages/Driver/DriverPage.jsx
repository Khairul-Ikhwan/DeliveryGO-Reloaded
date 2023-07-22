import { useState } from "react";
import DriverLogin from "./DriverLogin";
import DriverSignUp from "./DriverSignUp";

export default function DriverPage() {
  const [showSignUp, setShowSignUp] = useState(false);

  const handleToggleSignUp = () => {
    setShowSignUp(!showSignUp);
  };

  return (
    <>
      {showSignUp ? (
        <DriverSignUp onSignUpClick={handleToggleSignUp} />
      ) : (
        <DriverLogin onSignUpClick={handleToggleSignUp} />
      )}
    </>
  );
}
