import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import LogoSafeMap1 from "./LogoSafeMap1.png";
import LogoSafeMapWritten from "./LogoWritten.png";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    if (response.profileObj) {
      // if login is successful
      navigate("/app"); // redirect to App component
    }
    navigate("/app");
  };

  const handleGuestLogin = () => {
    //will move to the signup.js when sign up button is called
    navigate("/guestLogin");
  };

  return (
    <div
      style={{ display: "flex", flexDirection: "column", alignItems: "center" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          width: "calc(100% - 1in)",
          padding: "10px",
          marginBottom: "20px",
        }}
      >
        {/*Helps with the alignment so that it is not flush with the side*/}
        <div style={{ marginLeft: "0.15in" }}>
          <img
            src={LogoSafeMapWritten}
            alt="SafeMap Logo"
            style={{ height: "45px" }}
          />
        </div>
        {/* <button
          style={{
            background: "#19396C",
            color: "white",
            border: "none",
            borderRadius: "8px",
            padding: "10px 20px",
            cursor: "pointer",
            fontSize: "16px",
          }}
          onClick={handleSignUpClick}
        > */}
        {/* Sign Up
        </button>{" "} */}
        {/* Increased button size */}
      </div>
      {/*Alignment of the imagw*/}
      <div style={{ width: "300px", textAlign: "center" }}>
        <img
          src={LogoSafeMap1}
          alt="Your Image"
          style={{ width: "130%", marginBottom: "20px", marginLeft: "-45px" }}
        />
        <h1>Sign In</h1>
        <form>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="text"
              placeholder="Email Address"
              name="username"
              style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <input
              type="password"
              placeholder="Password"
              name="password"
              style={{ width: "100%", padding: "10px", borderRadius: "5px" }}
            />
          </div>
          <button
            type="submit"
            style={{
              background: "#19396C",
              color: "white",
              border: "none",
              borderRadius: "5px",
              padding: "8px 15px",
              cursor: "pointer",
            }}
          >
            Sign In
          </button>
        </form>
        <a
          href="/forgotPassword"
          style={{
            color: "#19396C",
            textDecoration: "none",
            padding: "10px",
            marginTop: "20px",
          }}
        >
          Forgot password?
        </a>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "100%",
          }}
        ></div>
        <a
          href="/app"
          style={{ color: "#19396C", textDecoration: "none", padding: "10px" }}
        >
          Guest Login
        </a>
      </div>
      <div style={{ display: "flex", alignItems: "center" }}>
        <hr style={{ width: "45%", margin: "0", marginTop: "15px" }} />
        <span style={{ color: "#19396C", padding: "10px" }}>OR</span>
        <hr style={{ width: "45%", margin: "0", marginBottom: "5px" }} />
      </div>
      <p>Sign in with</p>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "40px",
        }}
      >
        <GoogleLogin
          onSuccess={responseGoogle}
          onFailure={() => {
            console.log("Login Failed");
          }}
        />
      </div>
    </div>
  );
};

export default Login;
