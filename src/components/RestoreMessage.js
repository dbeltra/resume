import React from "react";
import Button from "../components/button";
import ImgOops from "../assets/images/oops.webp";

export const RestoreMessage = ({ onRestore }) => (
  <div className="fixed inset-0 flex items-center justify-center bg-page-bg bg-cover bg-center">
    <div className=" p-8 rounded-lg shadow-lg text-center bg-black/10">
      <h2 className="text-xl text-gray-200 mb-4">
        Don't worry, everything is under control!
      </h2>
      <img
        className="mb-4"
        alt="Jack from Lost saying: We have to go back!"
        src={ImgOops}
      ></img>
      <Button onClick={onRestore} text="Restore window"></Button>
    </div>
  </div>
);
