import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import Input from "../components/Input";
import { LockIcon } from "../components/Icons";
import { ChevronRight } from "lucide-react";
import ApiRequest from "../services/ApiRequest"
import { USER_BASE_URL } from "../constants";

export const ChangePassword = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const {
    register,
    handleSubmit,
    getValues,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const {oldPassword, newPassword, confirmPassword} = data
      
      if(newPassword !== confirmPassword){
        setError("Passwords do not match")
      }
      const apirequest = new ApiRequest(`${USER_BASE_URL}/change-password`)
      const response = await apirequest.postRequest({oldPassword, newPassword})
      
      if(!response.success){
        setError(response.message || "Check Password before submittng")
      } else {
        setSuccess(response.message || "Password changed successfully")
        navigate('/')
      }
    } catch (error) {
      setError('Updation failed. Please try again.');
    } finally{
      setIsLoading(false);
    }
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-gray-900"
      style={{
        backgroundImage: `url(/api/placeholder/1920/1080)`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
      <div className="relative z-10 w-full max-w-md px-8 py-12 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md">
        <div className="flex items-center mb-8 space-x-3">
          <button
            onClick={() => navigate("/")}
            className="text-blue-400 hover:text-blue-300 transition-colors duration-300 flex items-center"
          >
            <ChevronRight className="transform rotate-180" size={20} />
            <span>Back to Home</span>
          </button>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white">Change Password</h1>
          <p className="mt-2 text-gray-400">Update your password securely</p>
        </div>

        {error && (
          <div className="px-4 py-3 mb-4 text-sm font-medium text-red-400 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg">
            <div className="flex">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {error}
            </div>
          </div>
        )}

        {success && (
          <div className="px-4 py-3 mb-4 text-sm font-medium text-green-400 bg-green-900 bg-opacity-30 border border-green-800 rounded-lg">
            <div className="flex">
              <svg
                className="w-5 h-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                ></path>
              </svg>
              {success}
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <Input
              label="Current Password"
              type="password"
              leftIcon={<LockIcon />}
              error={errors.currentPassword?.message}
              {...register("oldPassword", { required: "Current password is required" })}
            />
          </div>

          <div>
            <Input
              label="New Password"
              type="password"
              leftIcon={<LockIcon />}
              error={errors.newPassword?.message}
              {...register("newPassword", {
                required: "New password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
              })}
            />
          </div>

          <div>
            <Input
              label="Confirm New Password"
              type="password"
              leftIcon={<LockIcon />}
              error={errors.confirmPassword?.message}
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) => value === getValues("newPassword") || "Passwords do not match",
              })}
            />
          </div>

          <div>
            <button
              type="submit"
              disabled={isLoading}
              className="flex justify-center w-full px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 border border-transparent rounded-lg shadow-sm hover:from-blue-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-gray-900 disabled:opacity-50 disabled:cursor-not-allowed transform transition-all duration-300 hover:scale-105"
            >
              {isLoading ? (
                <svg
                  className="w-5 h-5 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              ) : (
                "Change Password"
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
