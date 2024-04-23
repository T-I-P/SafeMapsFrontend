import usePlacesAutoComplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import Suggestion from "./suggestion";
import React from "react";

const Location = ({ setOffice, placeholder, setZipCode }) => {
  const {
    ready,
    value,
    setValue,
    suggestions: { status, data },
    clearSuggestions,
  } = usePlacesAutoComplete();

  const renderSuggestions = () => {
    if (status === "OK") {
      return (
        <div>
          {data.map((suggestion, index) => (
            <Suggestion
              key={index}
              suggestion={suggestion}
              index={index}
              handleSelectSuggestion={handleSelectSuggestion}
            ></Suggestion>
          ))}
        </div>
      );
    }
  };

  const handleSelectSuggestion = async (suggestion) => {
    setValue(suggestion.description, false);
    clearSuggestions();

    try {
      
      const results = await getGeocode({ address: suggestion.description });
      
      const { lat, lng } = await getLatLng(results[0]);
      if(setZipCode) {
        const addressComponents = results[0].address_components;
        const zipCodeObj = addressComponents.find(component => component.types.includes('postal_code'));
        if (zipCodeObj) {
          setZipCode(zipCodeObj.long_name);
        }
     

      }
      setOffice({ lat, lng });
    } catch (error) {
      console.error("Error selecting suggestion:", error);
    }
  };

  return (
    <div className="location">
      <center>
        <input
          value={value}
          onChange={(e) => setValue(e.target.value)}
          disabled={!ready}
          placeholder={placeholder}
        />
        {renderSuggestions()}
      </center>
    </div>
  );
};

export default Location;
