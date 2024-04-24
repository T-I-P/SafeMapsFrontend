import React from "react";
import { useState, useRef, useEffect } from "react";
import NavigationBar from "./navbar";
import HomeLocation from "./HomeLocation";
import HomeMap from "./homeMap";
import { useLoadScript } from "@react-google-maps/api";
import "./homesafety.css";
import Loader from "react-js-loader";

const HomeSafety = () => {
  const [office, setOffice] = useState(null);
  const [center, setCenter] = useState(null);
  const [mapContainerStyle, setMapContainerStyle] = useState(null);
  const [location, setLocation] = useState(null);
  const [zipCode, setZipCode] = useState(null);
  const mapRef = useRef();
  const libraries = ["places"];
  const [houseList, setHouseList] = useState([]);
  const [crimes, setCrimes] = useState([]);
  const [pathCoordinates, setPathCoordinates] = useState([]);
  const [progress, setProgress] = useState(0);
  const [loader, setLoader] = useState(false);
  const [crimesDetected, setCrimesDetected] = useState(false);

  useEffect(() => {
    handleLocationClick();
  }, []);

  function handleLocationClick() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(success, error);
    } else {
      console.log("Geolocation not supported");
    }
  }

  function success(position) {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;

    setLocation({ latitude, longitude });

    setMapContainerStyle({
      width: "70vw",
      height: "90vh",
      margin: "auto",
    });
    setCenter({
      lat: latitude, // default latitude
      lng: longitude, // default longitude
    });
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

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

  const mapCrimeData = async () => {
    if (pathCoordinates.length === 0) {
      return;
    }

    setLoader(true);
    const processedCoordinates = new Set();
    const api_url = process.env.REACT_APP_FETCH_CRIME_DATA;
    let convertedPathCoordinates = pathCoordinates.map((path) =>
      path.map((point) => [point.lat, point.lng]),
    );
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
    const crimeData = allCrimes.data;
    const flattenedCrimeData = crimeData.flat().map((crime) => ({
      lat: parseFloat(crime.latitude),
      lng: parseFloat(crime.longitude),
    }));

    for (let i = 0; i < crimeData.length; i++) {
      for (let j = 0; j < crimeData[i].length; j++) {
        for (let k = 0; k < crimeData[i][j].crimeData.length; k++) {
          const crime = crimeData[i][j].crimeData[k];
          const temp = {
            lat: parseFloat(crime.lat),
            lng: parseFloat(crime.lon),
          };
          setCrimes((prevCrimes) => [...prevCrimes, temp]);
        }
      }
    }

    setCrimesDetected(true);
    setLoader(false);
  };

  const fetchDirections = async (source, color) => {
    if (!office) {
      return;
    }

    const directionsService = new window.google.maps.DirectionsService();

    // Convert location object to string
    const locationString = `${source.lat}, ${source.lng}`;

    const destinationString = `${office.lat}, ${office.lng}`;

    directionsService.route(
      {
        origin: locationString,
        destination: destinationString,
        travelMode: window.google.maps.TravelMode.WALKING,
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
                polylineOptions: { strokeColor: color },
                suppressMarkers: true,
              });
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

  const handleHomeAPI = async () => {
    console.log(zipCode);
    if (zipCode !== null) {
      const url = `https://zillow-com4.p.rapidapi.com/properties/search?location=${zipCode}`;
      const response = await fetch(url, {
        method: "GET",
        params: {
          location: zipCode,
        },
        headers: {
          "X-RapidAPI-Key":
            "838521e75amshd5d352c5b5020b1p1b3e69jsn39226c67a128",
          "X-RapidAPI-Host": "zillow-com4.p.rapidapi.com",
        },
      });
      const houses = await response.json();
      const colors = ["red", "blue", "green", "yellow", "purple", "orange"];
      for (var i = 0; i < houses.data.length; i++) {
        const latLong = {
          lat: houses.data[i].location.latitude,
          lng: houses.data[i].location.longitude,
        };
        fetchDirections(latLong, colors[i % colors.length]);
        setHouseList((prevhouseLst) => [...prevhouseLst, latLong]);
      }
      console.log(houseList);
    }
  };

  const countCrimes = async (house) => {
    let crimeCount = 0;
    console.log(crimes);
    for (var i = 0; i < crimes.length; i++) {
      const crime = crimes[i];

      const distance =
        window.google.maps.geometry.spherical.computeDistanceBetween(
          new window.google.maps.LatLng(house.lat, house.lng),
          new window.google.maps.LatLng(crime.lat, crime.lng),
        );
      if (distance < 1000) {
        crimeCount++;
      }
    }
    return crimeCount;
  };

  const handleCrimeMap = async () => {
    if (houseList.length === 0) {
      return;
    }

    await mapCrimeData();
  };

  const handleSafestHouseClick = async () => {
    for (var i = 0; i < houseList.length; i++) {
      const house = houseList[i];
      console.log(house);
      const crimeCount = await countCrimes(house);
      console.log(crimeCount);
    }
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100vh" }}>
      <NavigationBar />
      <div className="app-container">
        <div>
          <div className="location-container" style={{ textAlign: "center" }}>
            <h1 style={{ margin: 0, color: "white", paddingBottom: "2vw" }}>
              SafeMap
            </h1>
            <center>
              <HomeLocation setZipCode={setZipCode} setOffice={setOffice} />
              <button className="sideBar-button" onClick={handleHomeAPI}>
                {" "}
                Get Home List{" "}
              </button>
              <button className="sideBar-button" onClick={handleCrimeMap}>
                {" "}
                Crimes Near{" "}
              </button>
              <button
                className="sideBar-button"
                onClick={handleSafestHouseClick}
              >
                {" "}
                Get Safest House{" "}
              </button>
              {loader && (
            <Loader type="spinner-cub" title={"Mapping Crime data"} size={50} />
          )}
            </center>
          </div>
        </div>
        <HomeMap
          crimes={crimes}
          houseList={houseList}
          mapContainerStyle={mapContainerStyle}
          onLoad={onLoad}
          center={center}
          office={office}
        />
      </div>
    </div>
  );
};

export default HomeSafety;
