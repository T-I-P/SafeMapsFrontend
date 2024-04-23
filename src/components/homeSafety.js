import React from "react";
import { useState, useRef, useEffect } from "react";
import NavigationBar from "./navbar";
import HomeLocation from "./HomeLocation";
import HomeMap from "./homeMap";
import { useLoadScript } from "@react-google-maps/api";
import "./homesafety.css";

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
    for (let i = 0; i < pathCoordinates.length; i++) {
      for (let j = 0; j < pathCoordinates[i].length; j += 20) {
        const lat = pathCoordinates[i][j].lat;
        const lng = pathCoordinates[i][j].lng;

        const coordinateKey = `${lat},${lng}`;

        if (processedCoordinates.has(coordinateKey)) {
          continue;
        }

        processedCoordinates.add(coordinateKey);
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
