import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useSelector } from "react-redux";

const ForLoggedInUsers = () => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const isLoginCheckDone = useSelector(
    (state) => state.auth.isLogInCheckDone
  );

  const navigate = useNavigate();


  useEffect(() => {
    if (isLoginCheckDone && !isLoggedIn) {
      navigate("/login");
    }
  }, [isLoginCheckDone, isLoggedIn, navigate]);

  if (isLoginCheckDone) {
    return <Outlet />;
  }
  return <></>;
};

export default ForLoggedInUsers;
