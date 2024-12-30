import React from "react";
import Button from "../components/button";

export const MessageWindow = ({
  message,
  image,
  imgAlt,
  buttonAction,
  buttonText,
}) => (
  <div className="fixed inset-0 flex items-center justify-center bg-page-bg bg-cover bg-center">
    <div className=" p-8 rounded-lg shadow-lg text-center bg-black/10">
      <h2 className="text-xl text-gray-200 mb-4">{message}</h2>
      <img className="mb-4" alt={imgAlt} src={image}></img>
      <Button onClick={buttonAction} text={buttonText}></Button>
    </div>
  </div>
);

export default MessageWindow;
