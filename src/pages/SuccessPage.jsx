import React from "react";
import { FaCheckCircle, FaTimesCircle, FaHourglassHalf, FaShieldAlt, FaIdCard, FaArrowRight } from "react-icons/fa";
import { useParams, useNavigate } from "react-router-dom";
import { useGetKycDataQuery } from "../features/api/kycApiSlice";

const SuccessPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, error } = useGetKycDataQuery(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="text-center p-8">
          <div className="inline-block relative w-20 h-20 mb-6">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-gray-200"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-600 border-r-blue-600 animate-spin"></div>
          </div>
          <p className="text-gray-800 font-medium text-xl">Processing Verification</p>
          <p className="text-gray-500 mt-2">Please wait while we retrieve your status</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-50">
        <div className="bg-white rounded-xl shadow-lg p-10 max-w-md text-center border border-gray-100">
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-5 rounded-full">
              <FaTimesCircle className="text-red-500 text-5xl" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Verification Error</h2>
          <p className="text-gray-600 mb-8">
            We encountered an issue while retrieving your verification data. Please try again.
          </p>
          <button
            onClick={() => window.location.reload()}
            className="w-full py-4 bg-blue-600 text-white rounded-lg font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const { kyc } = data;
  const { name, email, kycStatus, selfieImage } = kyc;
  const firstName = name.split(" ")[0];

  // Determine status styles based on verification status
  let statusIcon, statusColor, statusBg, badgeColor, badgeBg;
  
  if (kycStatus === "Verified") {
    statusIcon = <FaCheckCircle className="text-green-500 text-6xl" />;
    statusColor = "text-green-500";
    statusBg = "bg-green-50";
    badgeColor = "text-white";
    badgeBg = "bg-green-500";
  } else if (kycStatus === "Rejected") {
    statusIcon = <FaTimesCircle className="text-red-500 text-6xl" />;
    statusColor = "text-red-500";
    statusBg = "bg-red-50";
    badgeColor = "text-white";
    badgeBg = "bg-red-500";
  } else {
    statusIcon = <FaHourglassHalf className="text-yellow-500 text-6xl" />;
    statusColor = "text-yellow-500";
    statusBg = "bg-yellow-50";
    badgeColor = "text-gray-800";
    badgeBg = "bg-yellow-400";
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg border border-gray-200 overflow-hidden">
        <div className="p-10 text-center">
          {/* Status Icon */}
          <div className="flex justify-center mb-8">
            <div className={`${statusBg} p-6 rounded-full shadow-md`}>
              {statusIcon}
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-3">
            {kycStatus === "Verified"
              ? `Congratulations, ${firstName}!`
              : kycStatus === "Rejected"
              ? `Hello, ${firstName}`
              : `Thank You, ${firstName}`}
          </h1>

          {/* Description */}
          <p className="text-gray-600 mb-8 text-lg leading-relaxed">
            {kycStatus === "Verified"
              ? "Your identity has been successfully verified. You now have full access to all platform features."
              : kycStatus === "Rejected"
              ? "We regret to inform you that your verification was unsuccessful. Please review your submission and try again."
              : "Your verification is currently under review. We'll notify you via email once the process is complete."}
          </p>

          {/* User Selfie with premium styling */}
          {selfieImage && (
            <div className="flex justify-center mb-8">
              <div className="relative">
                <div className="rounded-full p-2 bg-gray-100">
                  <img
                    src={selfieImage}
                    alt="User Selfie"
                    crossOrigin="anonymous"
                    className="w-32 h-32 rounded-full border-4 border-white object-cover shadow-md"
                  />
                </div>
                {kycStatus === "Verified" && (
                  <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-1.5 shadow-md border border-gray-100">
                    <FaShieldAlt className="text-green-500 text-xl" />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Verification details */}
          <div className="flex justify-between items-center mb-8 p-4 rounded-xl bg-gray-50 border border-gray-100">
            <div className="flex items-center">
              <FaIdCard className="text-blue-500 text-2xl mr-3" />
              <div className="text-left">
                <p className="text-gray-500 text-sm">Verification ID</p>
                <p className="text-gray-800 font-mono text-xs">{id.substring(0, 8)}...{id.substring(id.length - 4)}</p>
              </div>
            </div>
            <div className={`px-4 py-1.5 rounded-full ${badgeBg} ${badgeColor} text-sm font-semibold shadow-sm`}>
              {kycStatus}
            </div>
          </div>

          {/* View Details Button with premium styling */}
          <button
  className="w-full py-4 px-6 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 flex items-center justify-center relative overflow-hidden group"
  onClick={() => navigate(`/kyc/${kyc.id}`)}
>
  <div className="absolute top-0 left-0 w-full h-full bg-white/10 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-in-out"></div>
  <span>View Verification Details</span>
  <FaArrowRight className="ml-2 group-hover:translate-x-1 transition-transform duration-300" />
</button>
          
          {/* Email notification */}
          {email && (
            <p className="mt-6 text-gray-500 text-sm">
              Confirmation sent to <span className="font-medium text-gray-700">{email}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessPage;