import React, { useEffect, useRef, useState } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["marker"];

const markers = [
  { lat: 12.9716, lng: 77.5946, color: "red", name: "Location A" },
  { lat: 12.975, lng: 77.59, color: "yellow", name: "Location B" },
  { lat: 12.978, lng: 77.596, color: "green", name: "Location C" },
  { lat: 12.87602224051442, lng: 77.59562093805964, color: "green", name: "Location D" },
];

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDuKrtDZNRCIUEnEToN9Ic1lhd4qCeUSu0",
    libraries,
  });

  useEffect(() => {
    // Step 1: Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLoc = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(userLoc);
        },
        (error) => {
          console.error("Error getting user location:", error);
        }
      );
    }
  }, []);

  useEffect(() => {
    // Step 2: Once both map and user location are ready, initialize map
    if (isLoaded && userLocation && !mapRef.current) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        mapId: "471b8230d9134e90",
        center: userLocation,
        zoom: 13,
        minZoom: 13,
      });
      mapRef.current = map;

      // User marker
      new google.maps.Marker({
        position: userLocation,
        map,
        title: "You are here",
        icon: {
          path: google.maps.SymbolPath.CIRCLE,
          scale: 10,
          fillColor: "#4285F4",
          fillOpacity: 1,
          strokeColor: "white",
          strokeWeight: 2,
        },
      });

      // Gym markers
      markers.forEach((marker) => addMarker(marker, map));
    }
  }, [isLoaded, userLocation]);

  const addMarker = (marker, map) => {
    const maxCapacity = Math.floor(Math.random() * 51) + 50;
    const currentCapacity = Math.floor(Math.random() * maxCapacity);

    const infoWindow = new google.maps.InfoWindow({
      content: `
        <div style="
          background-color: white;
          padding: 10px;
          border-radius: 5px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          color: black;
          width: 150px;
          box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
        ">
          <strong>${marker.name}</strong><br/>
          Max Capacity: ${maxCapacity}<br/>
          Current Capacity: ${currentCapacity}
        </div>
      `,
    });

    const mapMarker = new google.maps.Marker({
      position: { lat: marker.lat, lng: marker.lng },
      map,
      icon: {
        path: google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: marker.color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff",
      },
    });

    mapMarker.addListener("mouseover", () => infoWindow.open(map, mapMarker));
    mapMarker.addListener("mouseout", () => infoWindow.close());
  };

  if (!isLoaded) return <div>Loading Map...</div>;
  if (!userLocation) return <div>Getting your location...</div>;

  return <div id="map" style={{ width: "60vw", height: "750px" }} />;
};

export default GoogleMapComponent;