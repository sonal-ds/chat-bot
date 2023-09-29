import * as React from "react";
import "../../index.css";


/**
 * Function to create a loader for page loading
 * @returns : Loader
 */
export default function LoadingSpinner() {
  
  return (
    <div className="spinner-main">
    <div className="spinner-container ">
      <div className="loading-spinner">
      </div>
    </div>
    </div>
  );
}