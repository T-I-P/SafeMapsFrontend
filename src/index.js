import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import HomeSafety from "./components/homeSafety";

import Login from "./login";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_LOGIN_CLIENT_ID}>
    <Router>
      <Routes>
        <Route element={<Login />} exact path="/" />
        <Route element={<App />} path="/app" />
        <Route element={<HomeSafety />} path="/homeSafety" />
      </Routes>
    </Router>
  </GoogleOAuthProvider>,
);

const port = process.env.PORT || 3001;

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
