import React, { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["marker"]; 

const center = { lat: 12.9716, lng: 77.5946 }; 

const mapOptions = {
  mapId: "471b8230d9134e90", 
  center,
  zoom:13,
};

const GoogleMapComponent = () => {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDuKrtDZNRCIUEnEToN9Ic1lhd4qCeUSu0", 
    libraries, 
  });

  useEffect(() => {
    if (isLoaded && !mapRef.current) {
    
      const map = new window.google.maps.Map(document.getElementById("map"), mapOptions);

    
      new google.maps.Marker({
        position: { lat: 12.9716, lng: 77.5946 },
        map,
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 20,
          fillColor: "#FFFF00", 
          fillOpacity: 1,
          strokeWeight: 2,
          strokeColor: "#ffffff",
        }
        
      });
      

      mapRef.current = map;
    }
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading...</div>;

  return <div id="map" style={{ width: "60vw", height: "750px" }} />;
};

export default GoogleMapComponent;

