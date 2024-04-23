import React from "react";
import Location from "./location";

const HomeLocation = ({setOffice, setZipCode}) => {


        return (

            <div className="location-input-container">

            <Location
                key="origin"
                // setOffice={(position) => {
                //     setOffice(position);
                //     mapRef.current.panTo(position);
                //   }}
                setOffice={setOffice}
                setZipCode={setZipCode}
                placeholder={"Enter Relocation Location"}
            />

            </div>

        )

};


export default HomeLocation;