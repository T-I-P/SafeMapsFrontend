import React from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import Loader from "react-js-loader";

const MapComponent = ({ mapContainerStyle, center, office, crimes, onLoad }) => {
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

export default MapComponent;
