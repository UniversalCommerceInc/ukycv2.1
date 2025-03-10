import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { Typography, Box, CircularProgress } from "@mui/material";
import { useDispatch } from "react-redux";
import { useRegisterMutation } from "../features/api/usersApiSlice";
import { setCredentials } from "../features/auth/authSlice";

function PersonalInfoForm({ onNext, onBack }) {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    username: "",
    email: "",
    password: "",
    gender: "",
    phone: "",
  });

  const [register, { isLoading }] = useRegisterMutation();
  const dispatch = useDispatch();
  const [error, setError] = useState(null);
  const [focused, setFocused] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
    setError(null);
  };

  const isFormComplete = () => {
    return Object.values(formData).every((value) => value.trim() !== "");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormComplete()) {
      try {
        const response = await register(formData).unwrap();
        console.log("Register response:", response);
        dispatch(setCredentials(response));
        onNext(formData);
      } catch (err) {
        setError(err?.data?.message || "Something went wrong. Please try again.");
      }
    }
  };

  return (
    <div className="w-full">
      {/* Title Section with Premium Styling */}
      <div className="px-6 pt-6 pb-8 sm:px-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Personal Information</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Please provide your details to create your account
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>
      </div>

      {/* Form Section */}
      <form onSubmit={handleSubmit} className="px-6 sm:px-10 pb-8">
        {/* Name Fields - Side by Side on larger screens */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-5">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              First Name
            </label>
            <div className={`relative transition-all duration-300 ${
              focused === "firstName" 
                ? "transform -translate-y-1" 
                : ""
            }`}>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onFocus={() => setFocused("firstName")}
                onBlur={() => setFocused(null)}
                className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                  focused === "firstName"
                    ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                    : "border-gray-200 shadow-sm hover:border-gray-300"
                }`}
                placeholder="John"
                required
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Last Name
            </label>
            <div className={`relative transition-all duration-300 ${
              focused === "lastName" 
                ? "transform -translate-y-1" 
                : ""
            }`}>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onFocus={() => setFocused("lastName")}
                onBlur={() => setFocused(null)}
                className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                  focused === "lastName"
                    ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                    : "border-gray-200 shadow-sm hover:border-gray-300"
                }`}
                placeholder="Doe"
                required
              />
            </div>
          </div>
        </div>
        
        {/* Username Field */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Username
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "username" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <span className="text-gray-400">@</span>
            </div>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onFocus={() => setFocused("username")}
              onBlur={() => setFocused(null)}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "username"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
              placeholder="johndoe"
              required
            />
          </div>
        </div>
        
        {/* Email Field */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Email
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "email" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
              </svg>
            </div>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onFocus={() => setFocused("email")}
              onBlur={() => setFocused(null)}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "email"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
              placeholder="john.doe@example.com"
              required
            />
          </div>
        </div>
        
        {/* Password Field with Toggle */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Password
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "password" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
              </svg>
            </div>
            <input
              type={passwordVisible ? "text" : "password"}
              name="password"
              value={formData.password}
              onChange={handleChange}
              onFocus={() => setFocused("password")}
              onBlur={() => setFocused(null)}
              className={`w-full pl-10 pr-10 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "password"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
              placeholder="••••••••"
              required
            />
            <button
              type="button"
              className="absolute inset-y-0 right-0 pr-3.5 flex items-center"
              onClick={() => setPasswordVisible(!passwordVisible)}
            >
              {passwordVisible ? (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
                  <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 hover:text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
                  <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
                </svg>
              )}
            </button>
          </div>
        </div>
        
        {/* Phone Field */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Phone Number
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "phone" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
            </div>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onFocus={() => setFocused("phone")}
              onBlur={() => setFocused(null)}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "phone"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
              placeholder="+1 (234) 567-8900"
              required
            />
          </div>
        </div>
        
        {/* Gender Selection */}
        <div className="mb-5">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Gender
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "gender" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              onFocus={() => setFocused("gender")}
              onBlur={() => setFocused(null)}
              className={`w-full px-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 appearance-none ${
                focused === "gender"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              } ${!formData.gender ? "text-gray-500" : ""}`}
              required
            >
              <option value="" disabled>Select your gender</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-3.5 text-gray-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-6 animate-fadeIn">
            <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 border-l-4 border-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          </div>
        )}
        
        {/* Navigation Buttons */}
        <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
          <button
            type="button"
            onClick={onBack}
            className="order-2 sm:order-1 inline-flex justify-center items-center py-3.5 px-6 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
          >
            <ChevronLeft fontSize="small" className="mr-1.5" />
            Back
          </button>
          
          <button
            type="submit"
            disabled={!isFormComplete() || isLoading}
            className={`order-1 sm:order-2 inline-flex justify-center items-center py-3.5 px-6 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out ${
              isFormComplete() && !isLoading
                ? "text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg focus:ring-blue-500"
                : "text-gray-400 bg-gray-200 cursor-not-allowed"
            }`}
          >
            {isLoading ? (
              <>
                <CircularProgress size={16} className="mr-2" color="inherit" />
                Processing
              </>
            ) : (
              <>
                Next
                <ChevronRight fontSize="small" className="ml-1.5" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PersonalInfoForm;