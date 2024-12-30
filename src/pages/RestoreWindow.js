import React from "react";
import ImgOops from "../assets/images/oops.webp";
import MessageWindow from "../components/MessageWindow";

const RestoreMessage = ({ onRestore }) => {
  return (
    <MessageWindow
      message="Don't worry, everything is under control!"
      image={ImgOops}
      imgAlt="This is fine meme image, with a dog sitting in a room on fire"
      buttonAction={onRestore}
      buttonText="Restore window"
    />
  );
};

export default RestoreMessage;
