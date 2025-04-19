import React from "react";
import { Link, useLocation } from "react-router-dom";

const NavItem = ({ 
  item, 
  isMobile = false, 
  onClick = () => {} 
}) => {
  const location = useLocation();
  const isActive = location.pathname === item.path;
  
  const baseClasses = isMobile 
    ? "flex items-center px-4 py-2 rounded-md transition-colors" 
    : "flex items-center text-sm font-medium transition-all duration-200 px-3 py-1 rounded-md";
  
  const activeClasses = "bg-gray-800 text-indigo-400 border-l-2 border-indigo-500";
  const inactiveClasses = "text-gray-300 hover:bg-gray-800 hover:text-indigo-300";

  // Check if this is the profile item with custom onClick handler
  if (item.name === "Profile" && item.customOnClick) {
    return (
      <a
        href="#"
        className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
        onClick={(e) => {
          e.preventDefault();
          item.customOnClick();
          onClick();
        }}
      >
        <span className={isMobile ? "mr-3" : "mr-2"}>{item.icon}</span>
        {item.name}
      </a>
    );
  }

  return (
    <Link
      to={item.path}
      className={`${baseClasses} ${isActive ? activeClasses : inactiveClasses}`}
      onClick={onClick}
    >
      <span className={isMobile ? "mr-3" : "mr-2"}>{item.icon}</span>
      {item.name}
    </Link>
  );
};

export default NavItem;