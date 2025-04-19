import { useDispatch } from "react-redux";
import { logoutUser } from "../store/AuthSlice"; // You would need to create this
import ApiRequest from "../services/ApiRequest";
import { USER_BASE_URL } from "../constants";
import { useNavigate } from "react-router-dom";

export const useAuthActions = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const logout = async () => {
    try {
      const apirequest = new ApiRequest(`${USER_BASE_URL}/logout`)
      const response = await apirequest.postRequest({})
      
      
      if (response.success) {
        dispatch(logoutUser());
        navigate("/")
      } else {
        console.error("Logout failed");
      }
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  return { logout };
};