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


  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDq1ljbECXLB3qe8nFx0JCp0j98m7ep7zo",
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

                <Location setOffice = {(position) => {
              setOffice(position)
              mapRef.current.panTo(position);
            }}/>
                <Location setOffice = {(position) => {
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
              {office && <div><Marker position={office}/> <Circle center={office} radius={15000}/></div>}

            </GoogleMap>
          </center>
        </div>
        }
      </div>

    </div>
  );
};

export default App;