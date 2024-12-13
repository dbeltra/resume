import React from "react";

const Button = ({ url, text, variant = "primary", image = null }) => {
  const variantStyles = {
    primary: "bg-primary text-white hover:bg-primary-700",
    secondary: "bg-gray-400 text-white hover:bg-gray-500",
  };

  return (
    <a
      href={`https://${url}`}
      role="button"
      target="_blank"
      rel="noopener noreferrer"
      className={`
        inline-flex items-center justify-center 
        rounded px-4 py-2 
        transition-colors duration-200 
        ${variantStyles[variant] || variantStyles.primary}
      `}
    >
      {image && <img src={image} alt="" className="mr-2 h-5 w-5" />}
      {text}
    </a>
  );
};

export default Button;
