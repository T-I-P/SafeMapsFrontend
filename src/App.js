// prettier-ignore
import { GoogleMap, useLoadScript, Marker, MAP_PANE , Circle} from '@react-google-maps/api';
import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import Location from "./components/location";

const App = () => {
  const [office, setOffice] = useState(null);
  const [destination, setDestination] = useState(null);
  const mapRef = useRef();

  const [location, setLocation] = useState(null);
  const [mapContainerStyle, setMapContainerStyle] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [center, setCenter] = useState(null);
  const [sourceLocation, setSourceLocation] = useState("");

  const [crimes, setCrimes] = useState([]);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const libraries = ["places"];

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }

  useEffect(() => {
    handleLocationClick();
  }, []);
  useEffect(() => {
    mapCrimeData();
  }, [pathCoordinates]);

  const mapCrimeData = async () => {
    if (pathCoordinates.length === 0) {
      return;
    }
    //console.log(pathCoordinates)
    for (var i = 0; i < pathCoordinates.length; i++) {
      const response = await fetch("http://127.0.0.1:3000/fetchCrimeData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          latitude:
            pathCoordinates[i][parseInt(pathCoordinates[i].length / 2)].lat,
          longitude:
            pathCoordinates[i][parseInt(pathCoordinates[i].length / 2)].lng,
          radius: 3.0,
        }),
      });
      const crimeData = await response.json();
      let newCrimes = [...crimes];
      for (let i = 0; i < crimeData.data.length; i++) {
        const temp = {
          lat: parseFloat(crimeData.data[i].lat),
          lng: parseFloat(crimeData.data[i].lon),
        };
        newCrimes.push(temp);
      }
      setCrimes([...crimes, ...newCrimes]);
    }
  };

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLocation({ latitude, longitude });
    setSourceLocation(`Your Location`);
    setLoaded(true);

    setMapContainerStyle({
      width: "60vw",
      height: "90vh",
    });
    setCenter({
      lat: latitude, // default latitude
      lng: longitude, // default longitude
    });
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  const fetchDirections = async () => {
    if (!office) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    // Convert location object to string
    let locationString = `${location.latitude}, ${location.longitude}`;
    if (office !== null) {
      locationString = `${office.lat}, ${office.lng}`;
    }
    const destinationString = `${destination.lat}, ${destination.lng}`;

    directionsService.route(
      {
        origin: locationString,
        destination: destinationString,
        travelMode: window.google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true,
      },
      (response, status) => {
        if (status === "OK") {
          // Create a new DirectionsRenderer for each route
          response.routes.forEach((route) => {
            const directionsRenderer =
              new window.google.maps.DirectionsRenderer({
                map: mapRef.current,
                directions: response,
                routeIndex: response.routes.indexOf(route),
              });
            // Log the coordinates of all the points along the path
            const currentpathCoordinates = route.overview_path.map((latLng) => {
              return { lat: latLng.lat(), lng: latLng.lng() };
            });

            setPathCoordinates([...pathCoordinates, currentpathCoordinates]);
          });
        } else {
          console.log("Directions request failed due to " + status);
        }
      },
    );
  };

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  if (loadError) {
    return <div>Error loading maps</div>;
  }

  if (!isLoaded) {
    return <div>Loading maps</div>;
  }

  const onLoad = (map) => {
    mapRef.current = map;
  };

  return (
    <div className="app-container">
      <div className="location-container">
        <h1 className="logo-heading">SafeMap</h1>
        <div className="location-input-container">
          <Location
            key="origin"
            setOffice={(position) => {
              setOffice(position);
              mapRef.current.panTo(position);
            }}
            placeholder={"Enter Source Location"}
          />
          <Location
            key="destination"
            setOffice={(position) => {
              setDestination(position);
            }}
            placeholder={"Enter Destination Location"}
          />
        </div>

        <button onClick={fetchDirections}>Get Directions</button>
      </div>

      <div>
        {loaded && (
          <div className="map">
            <center>
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
            </center>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;
