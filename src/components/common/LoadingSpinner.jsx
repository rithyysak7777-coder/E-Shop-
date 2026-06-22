import React from "react";
import "../pages/adminCrud.css";

const LoadingSpinner = ({ message = "Loading...", minHeight }) => {
  const containerStyle = minHeight ? { minHeight } : {};

  return (
    <div className="spinner-container" style={containerStyle}>
      <div className="spinner-ring" />
      {message && <div className="spinner-message">{message}</div>}
    </div>
  );
};

export default LoadingSpinner;
