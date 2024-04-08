import React from "react";


function Safety({routes, crimes}) {

    for(var i = 0; i < routes.length; i++){
        for(var j = 0; j < crimes.length; j++){
            if(routes[i].lat === crimes[j].lat && routes[i].lng === crimes[j].lng){
                console.log("Dangerous Route");
            }
        }
    }

}

export default Safety;