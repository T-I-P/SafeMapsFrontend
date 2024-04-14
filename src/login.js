import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const navigate = useNavigate();

  const responseGoogle = (response) => {
    if (response.profileObj) {
      // if login is successful
      navigate("/app"); // redirect to App component
    }
    navigate("/app");
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <center>
          <h1>Login</h1>
          <form>
            <label>
              Username :
              <input type="text" name="username" />
            </label>
            <br />
            <label>
              Password :
              <input type="password" name="password" />
            </label>
            <br />
            <button type="submit">Login</button>
          </form>
          <br />
          Or
          <br />
          <br />
          <GoogleLogin
            onSuccess={responseGoogle}
            onError={() => {
              console.log("Login Failed");
            }}
          />
        </center>
      </div>
    </div>
  );
};

export default Login;
