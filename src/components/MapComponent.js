import React from "react";
import { GoogleMap, HeatmapLayer, Marker, useLoadScript } from "@react-google-maps/api";
import Loader from "react-js-loader";

const MapComponent = ({
  mapContainerStyle,
  center,
  office,
  crimes,
  onLoad,
  crimesDetected,
}) => {
   
  
  console.log("Crimes:", crimes);
  console.log(crimesDetected);
  const temp = {lat: 40, lng: -74};
  const heatMapData = [
    {lat: 40, lng: -74},{lat: 40, lng: -74},
    {lat: 40, lng: -74},{lat: 40, lng: -74},{lat: 40, lng: -74},{lat: 40, lng: -74}
  ]
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
      onLoad={(map)=> onLoad(map)}
    >
      {office && (
        <div>
          
            <>
              <HeatmapLayer data={heatMapData.map(crime =>  window.google.maps.LatLng(crime.lat, crime.lng))} options={{radius:50}}/>
              <Marker position={temp} />{" "}
            </>
          
          
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
