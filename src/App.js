// prettier-ignore
import { GoogleMap, useLoadScript, Marker, MAP_PANE , Circle, HeatmapLayer} from '@react-google-maps/api';
import { useState, useEffect, useCallback, useRef } from "react";
import "./App.css";
import Location from "./components/location";
import NavigationBar from "./components/navbar";
import { Nav } from "react-bootstrap";
import Loader from "react-js-loader";
import React from "react";
import MapComponent from "./components/MapComponent";
import LocationInput from "./components/LocationInput";

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
  const libraries = ["places", "visualization"];

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
    console.log("pathCoordinates", pathCoordinates);
    mapCrimeData();
  }, [pathCoordinates]);

  const checkSafety = async () => {
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
    console.log("Safety check complete");
    const safestRouteIndex = crimesLst.indexOf(Math.min(...crimesLst));
    await plotSafestRoute(safestRouteIndex);
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

  function getIconUrl(crimeType) {
    switch (crimeType) {
      case "Theft":
        return "https://banner2.cleanpng.com/20180328/djq/kisspng-computer-icons-theft-clip-art-thief-5abc3187dd2736.2586388115222828879059.jpg";
      case "Assault":
        return "https://cdn.imgbin.com/1/10/11/imgbin-assault-crime-harassment-computer-icons-others-w093SDEJVH7XMvdCZU34ZN37h.jpg";
      case "Burglary":
        return "https://banner2.cleanpng.com/20190628/xhc/kisspng-clip-art-portable-network-graphics-arrest-police-o-download-chain-clipart-handcuff-handcuffs-clipar-5d15d6ddf2fbd8.0076761215617123499953.jpg";
      default:
        return "https://th.bing.com/th/id/OIP.j22qDUlzZ-Urfey4qX1gyAHaHa?rs=1&pid=ImgDetMain";
    }
  }

  const mapCrimeData = async () => {
    if (pathCoordinates.length === 0) {
      return;
    }

    setLoader(true);
    // for (let i = 0; i < pathCoordinates.length; i++) {
    //   for (let j = 0; j < pathCoordinates[i].length; j += 10) {
    //     console.log("========================", j, pathCoordinates[i][j]);
    //     const response = await fetch("http://127.0.0.1:3000/fetchCrimeData", {
    //       method: "POST",
    //       headers: {
    //         "Content-Type": "application/json",
    //       },
    //       body: JSON.stringify({
    //         latitude: pathCoordinates[i][j].lat,
    //         longitude: pathCoordinates[i][j].lng,
    //         radius: 0.02,
    //       }),
    //     });
    //     const crimeData = await response.json();
    //     let newCrimes = [...crimes];

    //     console.log(j, crimeData);
    //     if (crimeData.data !== undefined) {
    //       for (let k = 0; k < crimeData.data.length; k++) {
    //         const temp = {
    //           lat: parseFloat(crimeData.data[k].lat),
    //           lng: parseFloat(crimeData.data[k].lon),
    //         };
    //         newCrimes.push(temp);
    //       }
    //     }
    //     setCrimes((prevCrimes) => [...prevCrimes, ...newCrimes]);
    //     if (j > 17) {
    //       await new Promise((resolve) => setTimeout(resolve, 6000));
    //     } else {
    //       await new Promise((resolve) => setTimeout(resolve, 3000));
    //     }
    //     setProgress((prevProgress) => prevProgress + 10);
    //   }
    // }
    const api_url = process.env.REACT_APP_FETCH_CRIME_DATA;
    let convertedPathCoordinates = pathCoordinates.map((path) =>
      path.map((point) => [point.lat, point.lng]),
    );
    console.log(convertedPathCoordinates)
    const response = await fetch(api_url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        route_list: convertedPathCoordinates,
      }),
    });

    const allCrimes = await response.json();
    console.log(allCrimes.data)
    const crimeData = allCrimes.data;
    const flattenedCrimeData = crimeData.flat().map((crime) => ({
      lat: parseFloat(crime.latitude),
      lng: parseFloat(crime.longitude),
    }));

    let tempCrimes = new Set()
    for (let i = 0; i < crimeData.length; i++) {
      for (let j = 0; j < crimeData[i].length; j++) {
        for (let k = 0; k < crimeData[i][j].crimeData.length; k++) {
          const crime = crimeData[i][j].crimeData[k];
          const temp = {
            lat: parseFloat(crime.lat),
            lng: parseFloat(crime.lon),
            date: crime.date,
            type: crime.type,
            iconUrl: getIconUrl(crime.type),
          };
          tempCrimes.add(JSON.stringify(temp));
          
        }
      }
    }

    setCrimes(Array.from(tempCrimes).map(JSON.parse));
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
      width: "70vw",
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
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavigationBar />
      <div className="app-container">
        <div className="location-container" style={{ textAlign: "center" }}>
          <center>
            <img src="/sm_192_logo.png" className="logo-safemap" />
            <h1 style={{ margin: 0, color: "white", paddingBottom: "2vw" }}>
              SafeMap
            </h1>
          </center>

          <LocationInput
            setOffice={setOffice}
            setDestination={setDestination}
            fetchDirections={fetchDirections}
            checkSafety={checkSafety}
            crimesDetected={crimesDetected}
            loader={loader}
            progress={progress}
            pathCoordinates={pathCoordinates}
          />
          {loader && (
            <Loader type="spinner-cub" title={"Mapping Crime data"} size={50} />
          )}
        </div>

        <div style={{ flexGrow: 1, width: "100%" }}>
          {loaded && (
            <div className="map">
              <center>
                <MapComponent
                  mapContainerStyle={mapContainerStyle}
                  center={center}
                  office={office}
                  crimes={crimes}
                  onLoad={onLoad}
                  crimesDetected={crimesDetected}
                />
              </center>
            </div>
          )}
        </div>
      </div>
    </div>
    // <div>
    //   <NavigationBar />
    //   <div className="app-container">
    //     <div className="location-container" style={{ textAlign: 'center'}}>
    //       <h1 style={{ margin: 0 , color: 'white', paddingBottom: '2vw'}}>SafeMap</h1>

    //       <LocationInput
    //           setOffice={setOffice}
    //           setDestination={setDestination}
    //           fetchDirections={fetchDirections}
    //           checkSafety={checkSafety}
    //           crimesDetected={crimesDetected}
    //           loader={loader}
    //           progress={progress}
    //           pathCoordinates={pathCoordinates}
    //       />
    //       {/* {loader && <Loader type="spinner-cub"  title={"Mapping Crime data"} size={50} />} */}
    //     </div>

    //       <div>
    //         {loaded && (
    //           <div className="map">
    //           <center>
    //             <MapComponent
    //               mapContainerStyle={mapContainerStyle}
    //               center={center}
    //               office={office}
    //               crimes={crimes}
    //               onLoad={onLoad}
    //             />
    //           </center>
    //         </div>
    //       )}
    //     </div>
    //   </div>
    // </div>
  );
};

export default App;
