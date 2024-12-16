import React from "react";
import avatarImg from "../assets/images/avatar_base.png";
import eyebrowLeftImg from "../assets/images/avatar_eb_left.png";
import eyebrowRightImg from "../assets/images/avatar_eb_right.png";

const Avatar = () => {
  return (
    <div className="bg-gray-400 h-32 w-32 overflow-hidden rounded-full relative mt-4">
      <img
        className="avatar"
        src={avatarImg}
        alt={`Avatar for David Beltrà`}
      ></img>
      <img className="avatar-eb-l" alt="" src={eyebrowLeftImg}></img>
      <img className="avatar-eb-r" alt="" src={eyebrowRightImg}></img>
    </div>
  );
};

export default Avatar;
