import usePlacesAutoComplete, {getGeocode, getLatLng} from "use-places-autocomplete"
import Suggestion from "./suggestion";


const Location = ({setOffice}) =>{


    
    const {ready, value, setValue, suggestions: {status, data}, clearSuggestions} = usePlacesAutoComplete();

    const renderSuggestions = () => {
        if (status === "OK") {
            return (
                <div>
                    {data.map((suggestion, index) => (
                            <Suggestion suggestion={suggestion} index={index} handleSelectSuggestion={handleSelectSuggestion}></Suggestion>
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
            setOffice({ lat, lng });
        } catch (error) {
            console.error('Error selecting suggestion:', error);
        }
    };

    return (<div>

        <input value = {value} onChange={(e) => setValue(e.target.value)} disabled={!ready} placeholder="Search an address"/>
        {renderSuggestions()}
    </div>)

}

export default Location;