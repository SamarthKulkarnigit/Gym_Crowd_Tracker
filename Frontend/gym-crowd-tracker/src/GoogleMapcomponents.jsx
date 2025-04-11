import React, { useEffect, useRef } from "react";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["marker"];
const center = { lat: 12.9716, lng: 77.5946 };

const mapOptions = {
  mapId: "471b8230d9134e90",
  center,
  zoom: 13,
  minZoom: 13,
  //maxZoom: 13,
};

// Predefined gym markers
const markers = [
  { lat: 12.9716, lng: 77.5946, color: "red", name: "Location A" },
  { lat: 12.975, lng: 77.59, color: "yellow", name: "Location B" },
  { lat: 12.978, lng: 77.596, color: "green", name: "Location C" },
  { lat: 12.87602224051442, lng: 77.59562093805964, color: "green", name: "Location D" },
];

const GoogleMapComponent = () => {
  const mapRef = useRef(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDuKrtDZNRCIUEnEToN9Ic1lhd4qCeUSu0",
    libraries,
  });

  useEffect(() => {
    if (isLoaded && !mapRef.current) {
      const map = new window.google.maps.Map(document.getElementById("map"), mapOptions);
      mapRef.current = map;

      // Add gym markers
      markers.forEach((marker) => addMarker(marker, map));

      // Add user location marker
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const userLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            };

            new google.maps.Marker({
              position: userLocation,
              map,
              title: "You are here",
              icon: {
                path: google.maps.SymbolPath.CIRCLE,
                scale: 10,
                fillColor: "#4285F4", // Google blue
                fillOpacity: 1,
                strokeColor: "white",
                strokeWeight: 2,
              },
            });
          },
          (error) => {
            console.error("Error getting user location:", error);
          }
        );
      }
    }
  }, [isLoaded]);

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

    mapMarker.addListener("mouseover", () => {
      infoWindow.open(map, mapMarker);
    });

    mapMarker.addListener("mouseout", () => {
      infoWindow.close();
    });
  };

  if (!isLoaded) return <div>Loading...</div>;

  return <div id="map" style={{ width: "60vw", height: "750px" }} />;
};

export default GoogleMapComponent;
