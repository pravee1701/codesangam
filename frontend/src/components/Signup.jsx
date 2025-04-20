import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import ApiRequest from "../services/ApiRequest.js";
import { USER_BASE_URL } from "../constants.js";
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import Input from './Input'; // Import the Input component

export const Signup = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm();

    const onSubmit = async (data) => {
        setIsLoading(true);
        try {
            const apiRequest = new ApiRequest(`${USER_BASE_URL}/register`);
            const response = await apiRequest.postRequest({ ...data });

            if (response.success) {
                console.log("registration successful", response);
                navigate("/login");
            }
        } catch (error) {
            console.error("Registration failed:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleGoogleLogin = () => {
        window.location.href = `${import.meta.env.VITE_GOOGLE_LOGIN_REDIRECT_URL}`;
    };

    const handleGithubLogin = () => {
        window.location.href = `${import.meta.env.VITE_GITHUB_LOGIN_REDIRECT_URL}`;
    };

    return (
        <div className="flex min-h-screen bg-gray-900">
            {/* Left side with image (unchanged) */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-gray-800 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900 to-purple-900 opacity-80"></div>
                <img
                    src="https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8bGFwdG9wfGVufDB8fDB8fHww"
                    alt="Signup illustration"
                    className="absolute inset-0 w-full h-full object-cover mix-blend-overlay opacity-60"
                />
                <div className="relative z-10 flex flex-col justify-center px-16 text-white">
                    <h2 className="text-5xl font-bold mb-6">Start your journey with us</h2>
                    <p className="text-xl mb-8">Join thousands of users who trust our platform for their needs.</p>
                    <div className="flex space-x-2">
                        <span className="h-2 w-16 bg-blue-500 rounded-full"></span>
                        <span className="h-2 w-4 bg-purple-500 rounded-full"></span>
                        <span className="h-2 w-8 bg-pink-500 rounded-full"></span>
                    </div>
                </div>
            </div>

            {/* Right side with form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center px-8 py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold tracking-tight text-white">Create Account</h1>
                        <p className="mt-3 text-gray-400">Join our community and start exploring</p>
                    </div>

                    <div className="flex flex-col space-y-4 mb-8">
                        <button
                            type="button"
                            onClick={handleGoogleLogin}
                            className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-gray-200 transition-colors duration-300 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M21.35,11.1H12.18V13.83H18.69C18.36,17.64 15.19,19.27 12.19,19.27C8.36,19.27 5,16.25 5,12C5,7.9 8.2,4.73 12.2,4.73C15.29,4.73 17.1,6.7 17.1,6.7L19,4.72C19,4.72 16.56,2 12.1,2C6.42,2 2.03,6.8 2.03,12C2.03,17.05 6.16,22 12.25,22C17.6,22 21.5,18.33 21.5,12.91C21.5,11.76 21.35,11.1 21.35,11.1V11.1Z" />
                            </svg>
                            <span>Sign up with Google</span>
                        </button>

                        <button
                            type="button"
                            onClick={handleGithubLogin}
                            className="flex items-center justify-center w-full px-4 py-3 space-x-2 text-gray-200 transition-colors duration-300 bg-gray-800 rounded-lg border border-gray-700 hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="currentColor" d="M12,2A10,10 0 0,0 2,12C2,16.42 4.87,20.17 8.84,21.5C9.34,21.58 9.5,21.27 9.5,21C9.5,20.77 9.5,20.14 9.5,19.31C6.73,19.91 6.14,17.97 6.14,17.97C5.68,16.81 5.03,16.5 5.03,16.5C4.12,15.88 5.1,15.9 5.1,15.9C6.1,15.97 6.63,16.93 6.63,16.93C7.5,18.45 8.97,18 9.54,17.76C9.63,17.11 9.89,16.67 10.17,16.42C7.95,16.17 5.62,15.31 5.62,11.5C5.62,10.39 6,9.5 6.65,8.79C6.55,8.54 6.2,7.5 6.75,6.15C6.75,6.15 7.59,5.88 9.5,7.17C10.29,6.95 11.15,6.84 12,6.84C12.85,6.84 13.71,6.95 14.5,7.17C16.41,5.88 17.25,6.15 17.25,6.15C17.8,7.5 17.45,8.54 17.35,8.79C18,9.5 18.38,10.39 18.38,11.5C18.38,15.32 16.04,16.16 13.81,16.41C14.17,16.72 14.5,17.33 14.5,18.26C14.5,19.6 14.5,20.68 14.5,21C14.5,21.27 14.66,21.59 15.17,21.5C19.14,20.16 22,16.42 22,12A10,10 0 0,0 12,2Z" />
                            </svg>
                            <span>Sign up with GitHub</span>
                        </button>
                    </div>

                    <div className="flex items-center justify-center mb-8">
                        <div className="w-full border-t border-gray-700"></div>
                        <span className="px-4 text-sm text-gray-400">or continue with</span>
                        <div className="w-full border-t border-gray-700"></div>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Name Input */}
                        <Input
                            label="Full Name"
                            type="text"
                            placeholder="John Doe"
                            error={errors.name?.message}
                            {...register("username", {
                                required: "Name is required"
                            })}
                        />

                        {/* Email Input */}
                        <Input
                            label="Email Address"
                            type="email"
                            placeholder="user@example.com"
                            error={errors.email?.message}
                            {...register("email", {
                                required: "Email is required",
                                pattern: {
                                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                    message: "Invalid email address"
                                }
                            })}
                        />

                        {/* Password Input */}
                        <Input
                            label="Password"
                            type="password"
                            placeholder="••••••••"
                            error={errors.password?.message}
                            togglePassword={true}
                            {...register("password", {
                                required: "Password is required",
                                minLength: {
                                    value: 6,
                                    message: "Password must be at least 6 characters"
                                }
                            })}
                        />

                        <div className="pt-2">
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
                                ) : "Create Account"}
                            </button>
                        </div>
                    </form>

                    <div className="text-center mt-8">
                        <p className="text-sm text-gray-400">
                            Already have an account?{" "}
                            <button
                                type="button"
                                onClick={() => navigate("/login")}
                                className="font-medium text-blue-400 hover:text-blue-300 transition-colors"
                            >
                                Sign in
                            </button>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};
