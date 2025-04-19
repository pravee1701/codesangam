import React, { useState } from "react";
import { useSelector } from "react-redux";
import Logo from "../Logo";
import NavList from "./NavList";
import MobileNav from "./MobileNav";
import { Menu, X } from "../Icons";
import { HomeIcon, LogIn, UserPlus, User, Calendar, Trophy, BookmarkIcon } from "../Icons";

const Header = ({ onProfileClick }) => {
  const authStatus = useSelector((state) => state.auth.isLoggedIn);
  const [menuOpen, setMenuOpen] = useState(false);

  const navItems = [
    { name: "Home", path: "/", active: true, icon: <HomeIcon /> },
    { name: "Login", path: "/login", active: !authStatus, icon: <LogIn /> },
    { name: "SignUp", path: "/signup", active: !authStatus, icon: <UserPlus /> },
    { name: "Past Contest", path: "/past-contest", active: authStatus, icon: <Trophy className="w-4 h-4" /> },
    { name: "Upcoming Contest", path: "/upcoming-contest", active: authStatus, icon: <Calendar className="w-4 h-4" /> },
    { 
      name: "Profile", 
      path: "/current-user",
      active: authStatus, 
      icon: <User className="w-4 h-4" />,
      customOnClick: onProfileClick 
    },
    {
      name: "Bookmarks",
      path: "/bookmarks",
      active: authStatus,
      icon: <BookmarkIcon className="w-4 h-4" />,
    }
  ];

  // Filter items based on auth status
  const filteredNavItems = navItems.filter(item => 
    item.active && (item.name === "Login" || item.name === "SignUp" ? !authStatus : true)
  );

  const handleMobileItemClick = () => {
    setMenuOpen(false);
  };

  return (
    <header className="w-full bg-gray-900 border-b border-gray-800 shadow-lg">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Logo />
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            <NavList 
              items={filteredNavItems} 
              authStatus={authStatus} 
              onItemClick={() => {}} // No need to close anything in desktop mode
            />
          </nav>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-gray-300 hover:text-indigo-300 focus:outline-none p-2 rounded-md bg-gray-800"
            >
              {menuOpen ? (
                <X className="h-5 w-5" />
              ) : (
                <Menu className="h-5 w-5" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      <MobileNav 
        isOpen={menuOpen} 
        items={filteredNavItems} 
        authStatus={authStatus} 
        onItemClick={handleMobileItemClick}
      />
    </header>
  );
};

export default Header;