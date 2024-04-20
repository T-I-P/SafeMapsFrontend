import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import LogoSafeMap1 from "./LogoSafeMap1.png";
import LogoSafeMapWritten from "./LogoWritten.png";

const ForgotPassword = () => {
  return (
    <div style={{ display: "flex", alignItems: "center", height: "100vh" }}>
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "center" }}>
          <img src={LogoSafeMap1} alt="SafeMap Logo" style={{ width: "50%" }} />
        </div>
      </div>
      <div style={{ flex: 1 }}>
        <div style={{ textAlign: "center", width: "70%", margin: "0 auto" }}>
          <h2>Forgot Password?</h2>
          <p>
            Don't worry. Please enter the email you have associated with Safe
            Map.
          </p>
          <input
            type="email"
            placeholder="Email Address"
            style={{ width: "80%", height: "40px", marginBottom: "10px" }}
          />
          {/* Add reCaptcha component here */}
          <button
            style={{
              width: "80%",
              height: "40px",
              backgroundColor: "blue",
              color: "white",
            }}
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
