import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useJsApiLoader } from "@react-google-maps/api";

const libraries = ["marker"];

const GoogleMapComponent = () => {
  const mapRef = useRef(null);
  const [userLocation, setUserLocation] = useState(null);
  const [gyms, setGyms] = useState([]);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: "AIzaSyDuKrtDZNRCIUEnEToN9Ic1lhd4qCeUSu0", // Replace with your key
    libraries,
  });

  // Step 1: Get user's location
  useEffect(() => {
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

  // Step 2: Fetch gyms from backend
  useEffect(() => {
    const fetchGyms = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/gyms");
        console.log(res.data)
        setGyms(res.data);
      } catch (err) {
        console.error("Error fetching gyms:", err);
      }
    };
    fetchGyms();
  }, []);

  // Step 3: Initialize map (once)
  useEffect(() => {
    if (isLoaded && userLocation && !mapRef.current) {
      const map = new window.google.maps.Map(document.getElementById("map"), {
        center: userLocation,
        zoom: 13,
       // minZoom: 13,
        mapId: "471b8230d9134e90",
      });
      mapRef.current = map;

      // Add user location marker
      new google.maps.Marker({
        position: userLocation,
        map,
        title: "You are here",
        icon: {
          url: "/icons/588a6660d06f6719692a2d16.png",
          scaledSize: new google.maps.Size(40, 40),
        },
      });
    }
  }, [isLoaded, userLocation]);

  // Step 4: Add gym markers when gyms are fetched and map is ready
  useEffect(() => {
    if (gyms.length > 0 && mapRef.current) {
      gyms.forEach((gym) => addMarker(gym, mapRef.current));
    }
  }, [gyms]);

  const getColor = (current, capacity) => {
    const percent = (current / capacity) * 100;
    if (percent < 40) return "green";
    if (percent < 80) return "yellow";
    return "red";
  };

  const addMarker = (gym, map) => {
    const color = getColor(gym.currentCount, gym.capacity);
    const infoWindow = new window.google.maps.InfoWindow({
      content: `
        <div style="
          background-color: white;
          padding: 10px;
          border-radius: 5px;
          font-family: Arial, sans-serif;
          font-size: 14px;
          color: black;
          width: 160px;
          box-shadow: 2px 2px 10px rgba(0,0,0,0.2);
        ">
          <strong>${gym.name}</strong><br/>
          Max Capacity: ${gym.capacity}<br/>
          Current: ${gym.currentCount}
        </div>
      `,
    });

    const [lng, lat] = gym.location.coordinates;

    const marker = new window.google.maps.Marker({
      position: { lat, lng },
      map,
      icon: {
        path: window.google.maps.SymbolPath.CIRCLE,
        scale: 10,
        fillColor: color,
        fillOpacity: 1,
        strokeWeight: 2,
        strokeColor: "#ffffff",
      },
    });

    marker.addListener("mouseover", () => infoWindow.open(map, marker));
    marker.addListener("mouseout", () => infoWindow.close());
  };

  if (!isLoaded) return <div>Loading Map...</div>;
  if (!userLocation) return <div>Getting your location...</div>;

  return <div id="map" style={{ width: "60vw", height: "750px" }} />;
};

export default GoogleMapComponent;
