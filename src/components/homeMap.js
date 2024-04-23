import React from "react";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const HomeMap = ({
  mapContainerStyle,
  center,
  onLoad,
  office,
  houseList,
  crimes,
}) => {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
  });

  if (loadError) return <div>Error loading maps</div>;
  if (!isLoaded) return <div>Loading maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      zoom={10}
      center={center}
      onLoad={onLoad}
    >
      {office && (
        <div>
          <Marker position={office} />{" "}
          {houseList.map((house, idx) => (
            <Marker
              key={idx}
              position={house}
              icon={{
                url: "https://www.iconarchive.com/download/i103430/paomedia/small-n-flat/house.1024.png",
                scaledSize: new window.google.maps.Size(30, 30),
              }}
            />
          ))}{" "}
          {crimes.map((crime, idx) => (
            <Marker
              key={idx}
              position={crime}
              icon={{
                url: "https://th.bing.com/th/id/OIP.j22qDUlzZ-Urfey4qX1gyAHaHa?rs=1&pid=ImgDetMain",
                scaledSize: new window.google.maps.Size(15, 15),
              }}
            />
          ))}{" "}
        </div>
      )}
    </GoogleMap>
  );
};

export default HomeMap;
