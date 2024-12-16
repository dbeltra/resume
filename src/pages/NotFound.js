import React from "react";
import Button from "../components/button";

import ImgNotFound from "../assets/images/notfound.webp";

const NotFound = () => {
  return (
    <div className="bg-center justify-center items-start h-screen bg-page-bg bg-cover flex">
      <div className="flex flex-col text-center items-center text-white">
        <h1 className="text-7xl font-bold mt-10">404</h1>
        <p className="text-3xl font-bold mb-2">Page not found</p>
        <p className="text-xl mb-6">
          Sorry, but it looks like you're a bit lost.
        </p>
        <img className="" src={ImgNotFound}></img>
        <button
          className="bg-primary  hover:bg-primary-700 inline-flex items-center justify-center 
          rounded px-4 py-2 transition-colors duration-200 w-1/3 mt-4"
          onClick={() => window.history.back()}
        >
          Go Back
        </button>
      </div>
    </div>
  );
};

export default NotFound;
