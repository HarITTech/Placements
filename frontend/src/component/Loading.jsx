// Loading.jsx
import React from "react";
import "./Loading.css"; // Create this CSS for the animation

const Loading = () => {
  return (
    <div className="loading-overlay">
      <div className="spinner"></div>
    </div>
  );
};

export default Loading;
