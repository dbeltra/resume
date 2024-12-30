import React from "react";
import ImgNotFound from "../assets/images/notfound.webp";
import MessageWindow from "../components/MessageWindow";

const NotFound = () => {
  return (
    <MessageWindow
      message="Sorry, but it looks like you're a bit lost."
      image={ImgNotFound}
      imgAlt="Jack from Lost saying: We have to go back!"
      buttonAction={() => window.history.back()}
      buttonText="Go back"
    />
  );
};

export default NotFound;
