import React from "react";
import { Link } from "react-router-dom";

const Logo = () => {
  return (
    <Link to="/" className="text-white font-bold text-xl flex items-center">
      <span className="bg-indigo-800 h-8 w-8 rounded-full flex items-center justify-center mr-2 shadow-md">
        <span className="text-white font-bold">C</span>
      </span>
      <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
        CodeSangam
      </span>
    </Link>
  );
};

export default Logo;