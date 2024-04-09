import React from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";

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
    <div>
      <center>
        <h1>Login</h1>
        <form>
          <label>
            Username:
            <input type="text" name="username" />
          </label>
          <br />
          <label>
            Password:
            <input type="password" name="password" />
          </label>
          <br />
          <button type="submit">Login</button>
        </form>
        Or
        <br />
        <GoogleLogin
          onSuccess={responseGoogle}
          onError={() => {
            console.log("Login Failed");
          }}
        />
      </center>
    </div>
  );
};

export default Login;
