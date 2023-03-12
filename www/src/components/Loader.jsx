import React from "react";
import loader from "../assets/loader.png";

function Loader() {
  return (
    <div className="loader">
      <img src={loader} alt="Loading" />
      <p>Loading</p>
    </div>
  );
}
export default Loader;
