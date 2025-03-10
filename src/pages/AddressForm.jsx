import React, { useState } from "react";
import { ChevronLeft, ChevronRight, LocationOn, Apartment, LocationCity, Map, Home } from "@mui/icons-material";
import { Box, Typography, CircularProgress } from "@mui/material";
import { useKycMutation } from "../features/api/kycApiSlice"; // Import the mutation
import { setKycId } from "../features/auth/kycSlice";
import { useDispatch } from "react-redux";

function AddressForm({ onBack, onNext, nationalityData }) {
  const [formData, setFormData] = useState({
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    zipCode: "",
  });

  const [kyc, { isLoading, error }] = useKycMutation(); // Use the mutation hook
  const dispatch = useDispatch();
  const [focused, setFocused] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async () => {
    const mergedData = { ...nationalityData, ...formData }; // Merge previous form data
    console.log("Merged Form Data:", mergedData); // Log merged data

    try {
      // Call the KYC API
      const response = await kyc(mergedData).unwrap();
      const kycId = response?.kyc?.id;
      console.log("KYC ID:", kycId);

      // Pass KYC ID to the next step
      if (kycId) {
        dispatch(setKycId(kycId));
        onNext(kycId); // Pass KYC ID to StepperRoutes
      }
    } catch (apiError) {
      console.error("API Error:", apiError);
    }
  };

  return (
    <div className="w-full">
      {/* Title Section */}
      <div className="px-6 pt-6 pb-6 sm:px-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Address Information</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Please provide your current residential address details
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>
      </div>

      <form className="px-6 sm:px-10 pb-8 space-y-6">
        {/* Address Line 1 */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address Line 1
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "addressLine1" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <LocationOn className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="addressLine1"
              value={formData.addressLine1}
              onChange={handleChange}
              onFocus={() => setFocused("addressLine1")}
              onBlur={() => setFocused(null)}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "addressLine1"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
              placeholder="Street address or P.O. Box"
              required
            />
          </div>
        </div>

        {/* Address Line 2 */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Address Line 2 <span className="text-sm font-normal text-gray-500">(Optional)</span>
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "addressLine2" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Apartment className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="addressLine2"
              value={formData.addressLine2}
              onChange={handleChange}
              onFocus={() => setFocused("addressLine2")}
              onBlur={() => setFocused(null)}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "addressLine2"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
              placeholder="Apartment, suite, unit, building, floor, etc."
            />
          </div>
        </div>

        {/* City/State row for larger screens */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* City */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              City/District
            </label>
            <div className={`relative transition-all duration-300 ${
              focused === "city" 
                ? "transform -translate-y-1" 
                : ""
            }`}>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <LocationCity className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleChange}
                onFocus={() => setFocused("city")}
                onBlur={() => setFocused(null)}
                className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                  focused === "city"
                    ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                    : "border-gray-200 shadow-sm hover:border-gray-300"
                }`}
                placeholder="Enter city or district"
                required
              />
            </div>
          </div>

          {/* State */}
          <div className="relative">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              State/Province
            </label>
            <div className={`relative transition-all duration-300 ${
              focused === "state" 
                ? "transform -translate-y-1" 
                : ""
            }`}>
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Map className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                name="state"
                value={formData.state}
                onChange={handleChange}
                onFocus={() => setFocused("state")}
                onBlur={() => setFocused(null)}
                className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                  focused === "state"
                    ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                    : "border-gray-200 shadow-sm hover:border-gray-300"
                }`}
                placeholder="Enter state or province"
                required
              />
            </div>
          </div>
        </div>

        {/* Zip Code */}
        <div className="relative">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Zip/Postal Code
          </label>
          <div className={`relative transition-all duration-300 ${
            focused === "zipCode" 
              ? "transform -translate-y-1" 
              : ""
          }`}>
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
              <Home className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              name="zipCode"
              value={formData.zipCode}
              onChange={handleChange}
              onFocus={() => setFocused("zipCode")}
              onBlur={() => setFocused(null)}
              className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                focused === "zipCode"
                  ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                  : "border-gray-200 shadow-sm hover:border-gray-300"
              }`}
              placeholder="Enter postal or zip code"
              required
            />
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 animate-fadeIn">
            <div className="flex items-center p-4 text-sm text-red-800 rounded-lg bg-red-50 border-l-4 border-red-500">
              <svg xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0 w-5 h-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error?.data?.message || "Something went wrong. Please try again."}
            </div>
          </div>
        )}

        {/* Buttons */}
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
            type="button"
            onClick={handleSubmit}
            disabled={isLoading}
            className="order-1 sm:order-2 inline-flex justify-center items-center py-3.5 px-6 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg focus:ring-blue-500"
          >
            {isLoading ? (
              <>
                <CircularProgress size={16} className="mr-2" color="inherit" />
                Processing...
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

export default AddressForm;