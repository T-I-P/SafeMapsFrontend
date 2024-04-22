import React, { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { useNavigate } from "react-router-dom";
import LogoSafeMap1 from "./LogoSafeMap1.png";
import LogoSafeMapWritten from "./LogoWritten.png";
import "./AccountSettings.css";

const AccountSettings = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState("/default_profile.png");

  const navigate = useNavigate();

  const handleFileInput = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    // Upload logic here
  };

  const handleLogout = async () => {
    navigate("/");
  };

  return (
    <div className="settings-container">
      <h1>Account Settings</h1>
      <img src={preview} alt="Profile Preview" className="profile-preview" />
      <input
        type="file"
        onChange={handleFileInput}
        accept="image/*"
        style={{ display: "none" }}
        id="fileInput"
      />
      <label htmlFor="fileInput" className="upload-button">
        + Profile Picture
      </label>
      <button onClick={handleUpload}>Upload</button>

      <p>Name: </p>
      <p>User Name: </p>
      <p>Birthday: </p>

      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default AccountSettings;
