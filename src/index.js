import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";

import Login from "./login";
import ForgotPassword from "./forgotPassword";
import GuestLogin from "./guestLogin";
import AccountInfo from "./accountInfo";
import Logout from "./logout";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID}>
    <Router>
      <Routes>
        <Route element={<Login />} exact path="/" />
        <Route element={<App />} path="/app" />
        <Route element={<ForgotPassword />} path="/forgotPassword" />
        <Route element={<GuestLogin />} path="/guestLogin" />
        <Route element={<AccountInfo />} path="/accountInfo" />
        <Route element={<Logout />} path="/logout" />
      </Routes>
    </Router>
  </GoogleOAuthProvider>,
);

const port = process.env.PORT || 3001;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
