import { GoogleMap, useLoadScript, Marker, MAP_PANE , Circle} from '@react-google-maps/api';
import { useState, useEffect, useCallback, useRef } from 'react';
import './App.css';
import Location from './components/location';



const App = () => {

  const [office, setOffice] = useState(null)
  const mapRef = useRef()

  const [location, setLocation] = useState(null);
  const [mapContainerStyle, setMapContainerStyle] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [center, setCenter] = useState(null);
  const [sourceLocation, setSourceLocation] = useState('');
  const [destination, setDestination] = useState('');
  const libraries = ['places'];

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
    console.log(position)
    setLocation({ latitude, longitude });
    setSourceLocation('Your Location')
    setLoaded(true);
    console.log(`Latitude: ${latitude}, Longitude: ${longitude}`);
    setMapContainerStyle({
      width: '80vw',
      height: '80vh',
    })
    setCenter({
      lat: latitude, // default latitude
      lng: longitude, // default longitude
    })
    
  }

  function error() {
    console.log("Unable to retrieve your location");
  }

  const fetchDirections = () => {
    if (!office) {
      return;
    }
  
    const directionsService = new window.google.maps.DirectionsService();
  
    // Convert location object to string
    const locationString = `${location.latitude}, ${location.longitude}`;
  
    directionsService.route(
      {
        origin: locationString,
        destination: office,
        travelMode: window.google.maps.TravelMode.WALKING,
        provideRouteAlternatives: true
      },
      (response, status) => {
        if (status === 'OK') {
          // Create a new DirectionsRenderer for each route
          console.log(response.routes)
          response.routes.forEach((route) => {
            const directionsRenderer = new window.google.maps.DirectionsRenderer({
              map: mapRef.current,
              directions: response,
              routeIndex: response.routes.indexOf(route),
            });
          });
        } else {
          console.log('Directions request failed due to ' + status);
        }
      }
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

  const onLoad = (map)=>{

    mapRef.current = map
  }

  
  return (
    <div >
      <div>

        <button onClick={handleLocationClick}>
            Get location
        </button>
      </div>
      
      <div> 
        {loaded && 
        <div className='map'>

          <center>
            <div className='location-container'>

                <Location key="origin" setOffice = {(position) => {
              setOffice(position)
              mapRef.current.panTo(position);
            }}/>
                <Location key = "destination" setOffice = {(position) => {
              setOffice(position)
              mapRef.current.panTo(position);
            }}/>
            </div>
            <GoogleMap
              mapContainerStyle={mapContainerStyle}
              zoom={10}
              center={center}
              onLoad={onLoad}
            >
              {office && <div><Marker position={office}/> </div>}

            </GoogleMap>
            <div>
              <button onClick={fetchDirections}>Get Directions</button>
            </div>
          </center>
        </div>
        }
      </div>

    </div>
  );
};

export default App;