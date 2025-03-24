import React, { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

// ✅ Move libraries outside the component (Fix performance warning)
const libraries = ["marker"]; 

// ✅ Define center (Bengaluru coordinates)
const center = { lat: 12.9716, lng: 77.5946 }; 

// ✅ Add Map ID (Fix map initialization warning)
const mapOptions = {
  mapId: "471b8230d9134e90", // Replace with your actual Map ID
  center,
  zoom: 13,
};

const GoogleMapComponent = () => {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDuKrtDZNRCIUEnEToN9Ic1lhd4qCeUSu0", // Replace with your API key
    libraries, // ✅ Use constant libraries variable
  });

  useEffect(() => {
    if (isLoaded && !mapRef.current) {
      // ✅ Use mapOptions to include Map ID
      const map = new window.google.maps.Map(document.getElementById("map"), mapOptions);

      // ✅ Use AdvancedMarkerElement correctly
      new window.google.maps.marker.AdvancedMarkerElement({
        map,
        position: center,
        title: "Bengaluru Gym",
      });

      mapRef.current = map;
    }
  }, [isLoaded]);

  if (!isLoaded) return <div>Loading...</div>;

  return <div id="map" style={{ width: "100%", height: "500px" }} />;
};

export default GoogleMapComponent;

