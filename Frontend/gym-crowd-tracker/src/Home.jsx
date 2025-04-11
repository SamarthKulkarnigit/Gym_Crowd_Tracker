// Home.jsx
import React from "react";
import gymBanner from "./assets/pexels-anush-1229356.jpg"; // adjust path if assets is in /src/assets
import GoogleMapComponent from "./GoogleMapcomponents";

const Home = () => {
  return (
    <div style={{ textAlign: "center" }}>
      <h1 style={{ fontFamily: "Arial", marginBottom: "20px" }}>Welcome to Gym Tracker</h1>

      {/* Banner Image */}
      <img
        src={gymBanner}
        alt="Gym Banner"
        style={{
          width: "100%",
          maxHeight: "450px",
          objectFit: "cover",
          borderRadius: "12px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          marginBottom: "20px",
        }}
      />

      {/* Google Map */}
      <GoogleMapComponent />
    </div>
  );
};

export default Home;
