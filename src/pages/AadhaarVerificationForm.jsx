import React, { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CheckCircle } from "@mui/icons-material";
import { CircularProgress, Typography, Box } from "@mui/material";
import LoadingProgressButton from "../components/LoadingProgressButton"; // Adjust path as needed
import { 
  useAadhaarVerificationOtpSentMutation,
  useAadhaarVerificationOtpVerifyMutation
} from "../features/api/kycApiSlice"; // Update the import path as needed

const AadhaarVerificationForm = ({ onNext, onBack }) => {
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState(1); // 1: Enter Aadhaar, 2: Enter OTP, 3: Verification Complete
  const [focused, setFocused] = useState(null);
  const [error, setError] = useState(null);
  const [verificationKey, setVerificationKey] = useState("");
  
  // API mutation hooks
  const [sendOtp, { isLoading: isLoadingSendOtp }] = useAadhaarVerificationOtpSentMutation();
  const [verifyOtp, { isLoading: isLoadingVerifyOtp }] = useAadhaarVerificationOtpVerifyMutation();
  
  // Refs for OTP input fields
  const otpRefs = useRef([]);

  // Format Aadhaar number with spaces
  const formatAadhaar = (value) => {
    const digits = value.replace(/\D/g, "");
    let formatted = "";
    
    for (let i = 0; i < digits.length && i < 12; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += " ";
      }
      formatted += digits[i];
    }
    
    return formatted;
  };

  // Handle Aadhaar input change
  const handleAadhaarChange = (e) => {
    const formatted = formatAadhaar(e.target.value);
    setAadhaarNumber(formatted);
    setError(null);
  };

  // Handle OTP input change
  const handleOtpChange = (index, e) => {
    const value = e.target.value;
    
    // Allow only numbers
    if (value && !/^\d+$/.test(value)) return;
    
    const newOtp = [...otp];
    newOtp[index] = value.substring(0, 1);
    setOtp(newOtp);
    setError(null);
    
    // Auto-focus next input
    if (value && index < 5) {
      otpRefs.current[index + 1].focus();
    }
  };

  // Handle key down in OTP inputs (for backspace)
  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1].focus();
    }
  };

  // Submit Aadhaar for verification
  const handleAadhaarSubmit = async (e) => {
    e.preventDefault();
    
    // Validate Aadhaar number (12 digits)
    if (aadhaarNumber.replace(/\s/g, "").length !== 12) {
      setError("Please enter a valid 12-digit Aadhaar number");
      return;
    }
    
    // Show loading notification for long-running process
    const loadingToast = window.toast ? window.toast.loading("Sending OTP. This may take up to 30 seconds...") : null;
    
    try {
      // Call the API to send OTP
      const response = await sendOtp({
        aadhaarNumber: aadhaarNumber.replace(/\s/g, "")
      }).unwrap();
      
      // Dismiss loading toast
      if (loadingToast && window.toast) {
        window.toast.dismiss(loadingToast);
      }
      
      // Check if OTP was sent successfully
      if (response.data?.status === "generate_otp_success" && response.data?.isValidAadhaar) {
        // Store the verification key for the next step
        setVerificationKey(response.data.key);
        
        // Show success notification
        if (window.toast) {
          window.toast.success("OTP sent successfully");
        }
        
        setStep(2);
      } else {
        setError(response.data?.message || "Failed to send OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error sending OTP:", err);
      
      // Dismiss loading toast and show error
      if (loadingToast && window.toast) {
        window.toast.dismiss(loadingToast);
      }
      
      setError(err.data?.message || "Something went wrong. Please try again.");
    }
  };

  // Submit OTP for verification
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    
    // Validate OTP (all digits filled)
    if (otp.some(digit => digit === "")) {
      setError("Please enter the complete 6-digit OTP");
      return;
    }
    
    try {
      // Call the API to verify OTP
      const response = await verifyOtp({
        key: verificationKey,
        otp: otp.join("")
      }).unwrap();
      
      // Check if verification was successful - updated to match the correct response format
      if (response.isVerified === true) {
        // Show success notification
        if (window.toast) {
          window.toast.success("Aadhaar verified successfully");
        }
        setStep(3);
      } else {
        setError("Invalid OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error verifying OTP:", err);
      setError(err.data?.message || "Failed to verify OTP. Please try again.");
    }
  };

  // Handle OTP resend
  const handleResendOtp = async () => {
    try {
      // Reset error and OTP fields
      setError(null);
      setOtp(["", "", "", "", "", ""]);
      
      // Show loading notification
      const loadingToast = window.toast ? window.toast.loading("Resending OTP...") : null;
      
      // Call the API to resend OTP
      const response = await sendOtp({
        aadhaarNumber: aadhaarNumber.replace(/\s/g, "")
      }).unwrap();
      
      // Dismiss loading toast
      if (loadingToast && window.toast) {
        window.toast.dismiss(loadingToast);
      }
      
      // Update the verification key
      if (response.data?.status === "generate_otp_success") {
        setVerificationKey(response.data.key);
        
        // Show success notification
        if (window.toast) {
          window.toast.success("OTP resent successfully");
        }
      } else {
        setError(response.data?.message || "Failed to resend OTP. Please try again.");
      }
    } catch (err) {
      console.error("Error resending OTP:", err);
      setError(err.data?.message || "Something went wrong. Please try again.");
    }
  };

  // Complete verification and proceed to next step
  const handleComplete = () => {
    // Pass verification data to parent component
    onNext({
      aadhaarNumber: aadhaarNumber.replace(/\s/g, ""),
      isAadhaarVerified: true
    });
    
    // Navigate directly to nationality step
    window.location.href = "/steps/nationality";
  };

  return (
    <div className="w-full">
      {/* Title Section */}
      <div className="px-6 pt-6 pb-6 sm:px-10">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Aadhaar Verification</h2>
          <p className="text-gray-500 text-sm max-w-md mx-auto">
            Verify your identity with your Aadhaar number
          </p>
        </div>
        <div className="flex justify-center mt-4">
          <div className="h-1.5 w-16 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full"></div>
        </div>
      </div>

      {/* Step 1: Enter Aadhaar Number */}
      {step === 1 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="px-6 sm:px-10 pb-8"
        >
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  An OTP will be sent to the mobile number linked with your Aadhaar
                </p>
                {isLoadingSendOtp && <p className="text-xs text-blue-600 mt-1">This may take up to 30 seconds. Please wait...</p>}
              </div>
            </div>
          </div>
          
          <form onSubmit={handleAadhaarSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Aadhaar Number
              </label>
              <div className={`relative transition-all duration-300 ${
                focused === "aadhaar" 
                  ? "transform -translate-y-1" 
                  : ""
              }`}>
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 2a1 1 0 00-1 1v1a1 1 0 002 0V3a1 1 0 00-1-1zM4 4h3a3 3 0 006 0h3a2 2 0 012 2v9a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2zm2.5 7a1.5 1.5 0 100-3 1.5 1.5 0 000 3zm2.45 4a2.5 2.5 0 10-4.9 0h4.9zM12 9a1 1 0 100 2h3a1 1 0 100-2h-3zm-1 4a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  type="text"
                  value={aadhaarNumber}
                  onChange={handleAadhaarChange}
                  onFocus={() => setFocused("aadhaar")}
                  onBlur={() => setFocused(null)}
                  maxLength={14} // 12 digits + 2 spaces
                  placeholder="XXXX XXXX XXXX"
                  className={`w-full pl-10 pr-4 py-3.5 bg-gray-50 border rounded-xl focus:outline-none text-gray-800 transition-all duration-300 ${
                    focused === "aadhaar"
                      ? "border-blue-500 ring-2 ring-blue-100 shadow-lg"
                      : "border-gray-200 shadow-sm hover:border-gray-300"
                  }`}
                  required
                />
              </div>
              <p className="mt-2 text-xs text-gray-500">
                Enter the 12-digit number from your Aadhaar card
              </p>
            </div>
            
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
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={onBack}
                className="order-2 sm:order-1 inline-flex justify-center items-center py-3.5 px-6 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
              >
                <ChevronLeft fontSize="small" className="mr-1.5" />
                Back
              </button>
              
              <LoadingProgressButton
                type="submit"
                isLoading={isLoadingSendOtp}
                loadingText="Sending OTP"
                buttonText="Send OTP"
                maxTimeSeconds={30}
                icon={<ChevronRight fontSize="small" />}
                className="order-1 sm:order-2 inline-flex justify-center items-center py-3.5 px-6 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg focus:ring-blue-500"
              />
            </div>
          </form>
        </motion.div>
      )}

      {/* Step 2: Enter OTP */}
      {step === 2 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="px-6 sm:px-10 pb-8"
        >
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6 rounded-r-lg">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  {/* OTP has been sent to your registered mobile number ******{aadhaarNumber.substring(aadhaarNumber.length - 4)} */}
                  OTP has been sent to your Aadhaar registered mobile number
                </p>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleOtpSubmit}>
            <div className="mb-6">
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Enter OTP
              </label>
              <div className="flex justify-center items-center space-x-3 sm:space-x-4 mt-2">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    ref={el => otpRefs.current[index] = el}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    maxLength={1}
                    className="w-12 h-14 text-center text-lg font-bold bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 shadow-sm"
                    required
                  />
                ))}
              </div>
              <div className="text-center mt-4">
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isLoadingSendOtp}
                  className="text-blue-600 text-sm font-medium hover:text-blue-800 disabled:text-gray-400 disabled:cursor-not-allowed"
                >
                  {isLoadingSendOtp ? "Sending..." : "Resend OTP"}
                </button>
              </div>
            </div>
            
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
            
            <div className="flex flex-col sm:flex-row justify-between gap-3 mt-6">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="order-2 sm:order-1 inline-flex justify-center items-center py-3.5 px-6 text-sm font-semibold text-blue-600 bg-white border border-blue-600 rounded-xl hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out"
              >
                <ChevronLeft fontSize="small" className="mr-1.5" />
                Back
              </button>
              
              <LoadingProgressButton
                type="submit"
                isLoading={isLoadingVerifyOtp}
                loadingText="Verifying"
                buttonText="Verify OTP"
                maxTimeSeconds={15}
                icon={<ChevronRight fontSize="small" />}
                className="order-1 sm:order-2 inline-flex justify-center items-center py-3.5 px-6 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg focus:ring-blue-500"
              />
            </div>
          </form>
        </motion.div>
      )}

      {/* Step 3: Verification Complete */}
      {step === 3 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="px-6 sm:px-10 pb-8"
        >
          <div className="text-center py-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ 
                type: "spring",
                stiffness: 300,
                damping: 20,
                delay: 0.1
              }}
              className="mx-auto flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>
            
            <h3 className="text-xl font-bold text-gray-900 mb-2">Verification Successful</h3>
            <p className="text-gray-500 max-w-sm mx-auto mb-8">
              Your Aadhaar has been successfully verified. You can now continue with the next steps.
            </p>
            
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <button
                type="button"
                onClick={handleComplete}
                className="inline-flex justify-center items-center py-3.5 px-8 text-sm font-semibold rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 transition-all duration-300 ease-in-out text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md hover:shadow-lg focus:ring-blue-500"
              >
                Continue
                <ChevronRight fontSize="small" className="ml-1.5" />
              </button>
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default AadhaarVerificationForm;