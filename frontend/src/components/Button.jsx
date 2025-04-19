import React from "react";

const Button = ({ 
  children, 
  onClick, 
  className = "", 
  variant = "default"
}) => {
  const baseClasses = "flex items-center text-sm font-medium transition-all duration-200 px-3 py-1 rounded-md";
  
  const variantClasses = {
    default: "text-gray-300 hover:bg-gray-800 hover:text-indigo-300",
    active: "bg-gray-800 text-indigo-400 border-l-2 border-indigo-500",
    mobile: "flex items-center px-4 py-2 rounded-md transition-colors text-gray-300 hover:bg-gray-800 hover:text-indigo-300"
  };

  return (
    <button 
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default Button;