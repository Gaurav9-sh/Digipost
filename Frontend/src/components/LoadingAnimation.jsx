import React from "react";
import "../styles/components/LoadingAnimation.css";

const LoadingAnimation = () => {
  return (
    <div className="loading-animation-container">
      <h1 className="loading-text">
        Digital Postbox
        <span className="dots">
          <span>.</span>
          <span>.</span>
          <span>.</span>
        </span>
      </h1>
    </div>
  );
};

export default LoadingAnimation;
