import React from "react";
import './suggestion.css'


function Suggestion({suggestion, index, handleSelectSuggestion}){

    
    return (
    <div className="suggestion-container">
        <p className="suggestion-value" key={index} onClick={() => handleSelectSuggestion(suggestion)}>
            {suggestion.description}
        </p>
    </div>
    )


}

export default Suggestion;