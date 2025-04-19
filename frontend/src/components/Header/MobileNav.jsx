import React from "react";
import NavList from "./NavList";

const MobileNav = ({ isOpen, items, authStatus, onItemClick }) => {
  return (
    <div
      className={`md:hidden bg-gray-900 border-t border-gray-800 transition-all duration-300 ease-in-out ${
        isOpen ? "max-h-96 opacity-100 py-3" : "max-h-0 opacity-0 overflow-hidden"
      }`}
    >
      <div className="container mx-auto px-4 flex flex-col space-y-2">
        <NavList 
          items={items} 
          authStatus={authStatus} 
          isMobile={true}
          onItemClick={onItemClick}
        />
      </div>
    </div>
  );
};

export default MobileNav;
