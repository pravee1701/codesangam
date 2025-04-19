import React from "react";
import NavItem from "./NavItem";
import Button from "../Button";
import { LogOut } from "../Icons/index";
import { useNavigate } from "react-router-dom";
import { useAuthActions } from "../../hooks/useAuthActions"; // You'd need to create this hook

const NavList = ({ 
  items, 
  authStatus, 
  isMobile = false, 
  onItemClick = () => {} 
}) => {
  const navigate = useNavigate();
  const { logout } = useAuthActions();

  const handleLogout = () => {
    // Call API to logout
    logout();
    onItemClick();
  };

  return (
    <>
      {items.map((item) => (
        <NavItem
          key={item.name}
          item={item}
          isMobile={isMobile}
          onClick={() => {
            onItemClick();
            if (item.name !== "Profile") {
              navigate(item.path);
            }
          }}
        />
      ))}
      
      {authStatus && (
        <Button 
          variant={isMobile ? "mobile" : "default"}
          onClick={handleLogout}
        >
          <LogOut className={isMobile ? "w-4 h-4 mr-3" : "w-4 h-4 mr-2"} />
          Logout
        </Button>
      )}
    </>
  );
};

export default NavList;