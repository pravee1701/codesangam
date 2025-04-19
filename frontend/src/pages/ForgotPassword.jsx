import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ApiRequest from "../services/ApiRequest.js";
import { USER_BASE_URL } from "../constants.js";
import { useNavigate } from 'react-router-dom';
import Input from '../components/Input'; 
import { EmailIcon, HomeIcon } from '../components/Icons';


export const ForgotPassword = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [message, setMessage] = useState('');

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        setError('');
        setMessage('');

        try {
            const apiRequest = new ApiRequest(`${USER_BASE_URL}/forgot-password`); // Replace with your actual endpoint
            const response = await apiRequest.postRequest({ email: data.email });

            if (response.success) {
                setMessage(response.message || 'Password reset link sent to your email.');
            } else {
                setError(response.message || 'Failed to send reset link. Please try again.');
            }
        } catch (error) {
            console.error("Forgot password request failed:", error);
            setError('An error occurred. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gray-900"
            style={{
                backgroundImage: `url(/api/placeholder/1920/1080)`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
            }}
        >
            <div className="absolute inset-0 bg-gray-900 opacity-70"></div>
            <div className="relative z-10 w-full max-w-md px-8 py-12 bg-gray-800 bg-opacity-50 rounded-lg shadow-lg backdrop-blur-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">Forgot Password</h1>
                    <p className="mt-2 text-gray-400">Enter your email to reset your password</p>
                </div>

                {error && (
                    <div className="px-4 py-3 mb-4 text-sm font-medium text-red-400 bg-red-900 bg-opacity-30 border border-red-800 rounded-lg">
                        <div className="flex">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"></path>
                            </svg>
                            {error}
                        </div>
                    </div>
                )}

                {message && (
                    <div className="px-4 py-3 mb-4 text-sm font-medium text-green-400 bg-green-900 bg-opacity-30 border border-green-800 rounded-lg">
                        <div className="flex">
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                            </svg>
                            {message}
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div>
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="user@example.com"
                            leftIcon={<EmailIcon />}
                            error={errors.email?.message}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
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
                                <svg className="w-5 h-5 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                            ) : "Reset Password"}
                        </button>
                    </div>
                </form>

                <div className="text-center mt-6">
                    <button
                        type="button"
                        onClick={() => navigate("/login")}
                        className="text-blue-400 hover:text-blue-300 transition-colors duration-300"
                    >
                        Back to Login
                    </button>
                </div>
            </div>
        </div>
    );
};
