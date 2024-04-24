import React from "react";
import Location from "./location";
import { Button } from "react-bootstrap";
//import { FaRoute, FaShieldAlt } from 'react-icons/fa';
import "bootstrap/dist/css/bootstrap.min.css";

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
  const buttonStyle = {
    backgroundColor: "white", // Set background color to white
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
        placeholder={"Enter Source Location"}
      />
      <Location
        key="destination"
        setOffice={(position) => {
          setDestination(position);
        }}
        placeholder={"Enter Destination Location"}
      />

      <Button onClick={fetchDirections} className="my-2" style={buttonStyle}>
        Get Directions
      </Button>
      <Button
        onClick={checkSafety}
        disabled={!crimesDetected}
        className="my-2"
        style={buttonStyle}
      >
        Get Safest Route
      </Button>


    </div>
  );
};

export default LocationInput;
