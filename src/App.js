// prettier-ignore
import { GoogleMap, useLoadScript, Marker, MAP_PANE , Circle} from '@react-google-maps/api';
import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import Location from "./components/location";
import NavigationBar from "./components/navbar";
import { Nav } from "react-bootstrap";
import Loader from "react-js-loader";

const App = () => {
  const [office, setOffice] = useState(null);
  const [destination, setDestination] = useState(null);

  const mapRef = useRef();

  const [location, setLocation] = useState(null);
  const [mapContainerStyle, setMapContainerStyle] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [center, setCenter] = useState(null);
  const [Circle, setCircle] = useState(null);
  const [sourceLocation, setSourceLocation] = useState("");
  const [crimesDetected, setCrimesDetected] = useState(false);
  const [routes, setRoutes] = useState([]);
  const [routesContainer, setRoutesContainer] = useState([]);
  const [loader, setLoader] = useState(false);

  const [crimes, setCrimes] = useState([]);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [progress, setProgress] = useState(0);
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

  const checkSafety = () => {
    console.log(routes, crimes);
    const R = 6371; // Radius of the earth in km
    const maxDistance = 5; // Max distance in km

    let crimesLst = [];
    for (let path of routes) {
      let currCrimes = 0;
      for (let i = 0; i < path.length; i++) {
        const lat1 = path[i].lat;
        const lon1 = path[i].lng;

        for (let j = 0; j < crimes.length; j++) {
          const lat2 = crimes[j].lat;
          const lon2 = crimes[j].lng;

          const dLat = deg2rad(lat2 - lat1);
          const dLon = deg2rad(lon2 - lon1);
          const a =
            Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(deg2rad(lat1)) *
              Math.cos(deg2rad(lat2)) *
              Math.sin(dLon / 2) *
              Math.sin(dLon / 2);
          const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
          const distance = R * c; // Distance in km

          if (distance <= maxDistance) {
            currCrimes++;
          }
        }
      }
      crimesLst.push(currCrimes);
    }
    console.log(crimesLst);
    const safestRouteIndex = crimesLst.indexOf(Math.min(...crimesLst));
    plotSafestRoute(safestRouteIndex);
  };

  const plotSafestRoute = async (safestIndex) => {
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
            setRoutesContainer((routesContainer) => [
              ...routesContainer,
              route,
            ]);
            let color = "red";
            console.log(response.routes.indexOf(route), safestIndex);
            if (response.routes.indexOf(route) === safestIndex) {
              color = "green";
              const directionsRenderer =
                new window.google.maps.DirectionsRenderer({
                  map: mapRef.current,
                  directions: response,
                  routeIndex: response.routes.indexOf(route),
                  polylineOptions: { strokeColor: color },
                });
            }
          });
        } else {
          console.log("Directions request failed due to " + status);
        }
      },
    );
  };

  function deg2rad(deg) {
    return deg * (Math.PI / 180);
  }

  const mapCrimeData = async () => {
    if (pathCoordinates.length === 0) {
      return;
    }
    setCircle({
      lat: pathCoordinates[0][parseInt(pathCoordinates[0].length / 2)].lat, // default latitude
      lng: pathCoordinates[0][parseInt(pathCoordinates[0].length / 2)].lng, // default longitude
    });
    //console.log(pathCoordinates)
    setLoader(true);
    for (let i = 0; i < pathCoordinates.length; i++) {
      for (let j = 0; j < pathCoordinates[i].length; j += 10) {
        console.log("========================", j, pathCoordinates[i][j]);
        const response = await fetch("http://127.0.0.1:3000/fetchCrimeData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            latitude: pathCoordinates[i][j].lat,
            longitude: pathCoordinates[i][j].lng,
            radius: 0.02,
          }),
        });
        const crimeData = await response.json();
        let newCrimes = [...crimes];

        console.log(j, crimeData);
        if (crimeData.data !== undefined) {
          for (let k = 0; k < crimeData.data.length; k++) {
            const temp = {
              lat: parseFloat(crimeData.data[k].lat),
              lng: parseFloat(crimeData.data[k].lon),
            };
            newCrimes.push(temp);
          }
        }
        setCrimes((prevCrimes) => [...prevCrimes, ...newCrimes]);
        if (j > 17) {
          await new Promise((resolve) => setTimeout(resolve, 6000));
        } else {
          await new Promise((resolve) => setTimeout(resolve, 3000));
        }
        setProgress((prevProgress) => prevProgress + 10);
      }
    }
    setCrimesDetected(true);
    setLoader(false);
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
            setRoutesContainer((routesContainer) => [
              ...routesContainer,
              route,
            ]);
            const directionsRenderer =
              new window.google.maps.DirectionsRenderer({
                map: mapRef.current,
                directions: response,
                routeIndex: response.routes.indexOf(route),
                polylineOptions: { strokeColor: "red" },
              });
            // Log the coordinates of all the points along the path
            const currentpathCoordinates = route.overview_path.map((latLng) => {
              return { lat: latLng.lat(), lng: latLng.lng() };
            });

            setRoutes((routes) => [...routes, currentpathCoordinates]);
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
    <div>
      <NavigationBar />
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
          <button onClick={checkSafety} disabled={!crimesDetected}>
            Get Safest Route
          </button>
          {loader && (
            <div>
              <center>
                <progress value={progress} max={pathCoordinates[0].length} />
                <span className="progress-text">
                  {((progress / pathCoordinates[0].length) * 100).toFixed(0)}%
                </span>
              </center>
            </div>
          )}
          {/* {loader && <Loader type="spinner-cub"  title={"Mapping Crime data"} size={50} />} */}
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
    </div>
  );
};

export default App;
