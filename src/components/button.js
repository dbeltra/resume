import React from "react";

const Button = ({
  url,
  text,
  variant = "primary",
  image = null,
  onClick,
  type = "button",
}) => {
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-700",
    secondary: "bg-gray-400 text-white hover:bg-gray-500",
  };

  const baseStyles = `
    inline-flex items-center justify-center 
    rounded px-4 py-2 
    transition-colors duration-200 
    ${variantStyles[variant] || variantStyles.primary}
  `;

  // If URL is provided, render an anchor tag
  if (url) {
    return (
      <a
        href={url.startsWith("http") ? url : `https://${url}`}
        role="button"
        target="_blank"
        rel="noopener noreferrer"
        className={baseStyles}
      >
        {image && <img src={image} alt="" className="mr-2 h-5 w-5" />}
        {text}
      </a>
    );
  }

  // Otherwise render a button
  return (
    <button type={type} onClick={onClick} className={baseStyles}>
      {image && <img src={image} alt="" className="mr-2 h-5 w-5" />}
      {text}
    </button>
  );
};

export default Button;
