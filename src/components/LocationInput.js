import React from "react";
import Location from "./location";
import { Button } from "react-bootstrap";
//import { FaRoute, FaShieldAlt } from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";
import "./locationInput.css";

const LocationInput = ({
  setOffice,
  setDestination,
  fetchDirections,
  checkSafety,
  crimesDetected,
  loader,
  progress,
  pathCoordinates,
}) => {
  const buttonStyle = { // Set background color to white
    color: "black", // Set text color to black
    borderColor: "#ccc", // Optional: add a light gray border
    boxShadow: "0 2px 4px rgba(0,0,0,0.1)", // Optional: add a subtle shadow for better UI
  };
  return (
    <div className="location-input-container">
      <Location
        key="origin"
        // setOffice={(position) => {
        //     setOffice(position);
        //     mapRef.current.panTo(position);
        //   }}
        setOffice={setOffice}
        placeholder={"Enter Source"}
      />
      <Location
        key="destination"
        setOffice={(position) => {
          setDestination(position);
        }}
        placeholder={"Enter Destination"}
      />

      <Button onClick={fetchDirections} className="my-1" style={buttonStyle}>
        
        <img src="https://png.pngtree.com/png-vector/20190508/ourmid/pngtree-arrow-right-vector-icon-png-image_1027236.jpg " className="direction"/>
        Get Directions
      </Button>
      <Button
        onClick={checkSafety}
        disabled={!crimesDetected}
        className="my-2"
        style={buttonStyle}
      >
        <img src = "https://spng.pngfind.com/pngs/s/114-1147878_location-poi-pin-marker-position-red-map-google.png " className="safest"/>
        Get Safest Route
      </Button>
    </div>
  );
};

export default LocationInput;
