import { useState, useEffect } from "react";
import { Mail, Shield, Key, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import ApiRequest from "../services/ApiRequest";
import { USER_BASE_URL } from "../constants";

export default function ProfilePage({ isOpen, onClose }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const apiRequest = new ApiRequest(`${USER_BASE_URL}/current-user`);
        const response = await apiRequest.getRequest();

        if (!response.success) {
          throw new Error("Failed to fetch user data");
        }

        const userData = await response.data;
        setUser(userData);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
        console.error("Error fetching user data:", err);
      }
    };

    if (isOpen) {
      fetchUserData();
    }
  }, [isOpen]);

  const handleChangePassword = () => {
    onClose(); 
    navigate("/change-password");
  };

  return (
    <>
      {/* Profile Sidebar */}
      <div
        className={`fixed inset-y-0 right-0 transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        } transition-transform duration-300 ease-in-out z-50`}
      >
        <div className="w-80 h-full bg-gray-800 shadow-lg flex flex-col text-gray-100">
          <div className="p-6 border-b border-gray-700">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold">Profile</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-white">
                <ChevronRight size={24} />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
              </div>
            ) : error ? (
              <div className="text-center py-6">
                <div className="text-red-500 text-xl mb-2">!</div>
                <p className="text-gray-400 text-sm">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 text-sm text-blue-400 hover:text-blue-300"
                >
                  Try Again
                </button>
              </div>
            ) : user ? (
              <>
                <div className="mb-8 flex items-center">
                  <div className="w-16 h-16 rounded-full bg-gray-700 flex items-center justify-center text-2xl font-bold">
                    {user.name?.charAt(0) || "U"}
                  </div>
                  <div className="ml-4">
                    <h3 className="font-semibold text-lg">{user.name}</h3>
                    <p className="text-gray-400 text-sm">{user.role}</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-3 text-gray-300">
                    <Mail size={18} />
                    <span>{user.email}</span>
                  </div>

                  <div className="flex items-center space-x-3 text-gray-300">
                    <Shield size={18} />
                    <span>{user.role}</span>
                  </div>
                </div>

                <div className="mt-8">
                  <button
                    className="flex items-center space-x-3 w-full py-3 px-4 hover:bg-gray-700 rounded-lg transition-colors"
                    onClick={handleChangePassword}
                  >
                    <Key size={18} />
                    <span>Change Password</span>
                  </button>
                </div>
              </>
            ) : null}
          </div>
        </div>
      </div>

      {/* Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 z-40"
          onClick={onClose}
        />
      )}
    </>
  );
}
