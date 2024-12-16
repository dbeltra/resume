import React, { useEffect, useRef } from "react";
import avatarImg from "../assets/images/avatar_base.png";
import eyebrowLeftImg from "../assets/images/avatar_eb_left.png";
import eyebrowRightImg from "../assets/images/avatar_eb_right.png";
import eyeImg from "../assets/images/eyeball.png";

const Avatar = () => {
  const leftEyebrowRef = useRef(null);
  const rightEyebrowRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftEyeRef = useRef(null);
  const timeoutRef = useRef(null);

  // Function to generate a random delay between 5 and 10 seconds
  const randomDelay = (min, max) => Math.random() * (max - min) + min;

  // Function to trigger the animation
  const triggerAnimation = () => {
    const elements = [leftEyebrowRef.current, rightEyebrowRef.current];
    elements.forEach((element) => {
      element.style.animation = "none";
      void element.offsetHeight;
      element.style.animation = `raise-brow 1s linear 0s 1`;
    });
  };

  // Start the animation cycle
  const startAnimationSequence = () => {
    const delay = randomDelay(5, 10);
    triggerAnimation();

    // Schedule the next animation with a random delay
    timeoutRef.current = setTimeout(
      () => {
        startAnimationSequence();
      },
      (2 + delay) * 1000,
    );
  };

  // Cleanup function to clear timeouts
  const cleanup = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  };

  // Initialize the animation cycle
  useEffect(() => {
    startAnimationSequence();

    return () => {
      cleanup();
    };
  }, []);

  const handleMouseMove = (event) => {
    const avatar = leftEyeRef.current.parentNode;
    const avatarRect = avatar.getBoundingClientRect();
    const mouseX = event.clientX;

    const leftEyePosition =
      mouseX < avatarRect.left
        ? 59 // left position
        : mouseX > avatarRect.right
          ? 63 // right position
          : 59 + (4 * (mouseX - avatarRect.left)) / avatarRect.width; // interpolate between left and right

    const rightEyePosition =
      mouseX < avatarRect.left
        ? 79 // left position
        : mouseX > avatarRect.right
          ? 81 // right position
          : 79 + (2 * (mouseX - avatarRect.left)) / avatarRect.width; // interpolate between left and right

    leftEyeRef.current.style.left = `${leftEyePosition}px`;
    rightEyeRef.current.style.left = `${rightEyePosition}px`;
  };

  // Add mouse move event listener to the window
  useEffect(() => {
    window.addEventListener("mousemove", handleMouseMove);

    // Cleanup function to remove the event listener
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return (
    <div className="bg-gray-400 h-32 w-32 overflow-hidden rounded-full relative">
      <img
        className="avatar"
        src={avatarImg}
        alt={`Avatar for David Beltrà`}
      ></img>
      <img
        ref={leftEyebrowRef}
        className="avatar-eb-l"
        alt=""
        src={eyebrowLeftImg}
      ></img>
      <img
        ref={rightEyebrowRef}
        className="avatar-eb-r"
        alt=""
        src={eyebrowRightImg}
      ></img>
      <img ref={leftEyeRef} className="avatar-eye-l" alt="" src={eyeImg}></img>
      <img ref={rightEyeRef} className="avatar-eye-r" alt="" src={eyeImg}></img>
    </div>
  );
};

export default Avatar;
