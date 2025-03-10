// import React, { useState } from "react";
// import {
//   FaEnvelope,
//   FaIdCard,
//   FaCalendarAlt,
//   FaFlag,
//   FaLocationArrow,
//   FaExclamationTriangle,
// } from "react-icons/fa";
// import { MdClose } from "react-icons/md";
// import Navbar from "../components/Navbar";
// import { useParams, useNavigate } from "react-router-dom";
// import { useGetKycDataQuery } from "../features/api/kycApiSlice";

// const CustomerDetail = () => {
//   const { id } = useParams();
//   const navigate = useNavigate();
//   const { data, error, isLoading } = useGetKycDataQuery(id);
//   const [selectedImage, setSelectedImage] = useState(null);

//   const openImageModal = (imageUrl) => setSelectedImage(imageUrl);
//   const closeImageModal = () => setSelectedImage(null);

//   const handleResubmit = () => {
//     navigate("/steps/nationality", { state: { resubmitting: true } });
//   };

//   if (isLoading) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <div className="loader border-t-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
//         <p className="text-lg text-gray-700 ml-4">Loading KYC details...</p>
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="flex justify-center items-center min-h-screen">
//         <p className="text-lg text-red-500">
//           Unable to fetch KYC details. Please try again.
//         </p>
//       </div>
//     );
//   }

//   const kyc = data?.kyc;
//   // console.log("kyc", kyc)

//   return (
//     <>
//       {/* Navbar (Uncomment if needed) */}
//       {/* <Navbar /> */}
//       <div className="p-8 max-w-4xl mx-auto bg-gradient-to-r from-blue-50 to-indigo-100 rounded-lg shadow-2xl">
//         <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-center text-blue-700 mb-6 sm:mb-8">
//           Customer KYC Details
//         </h1>

//         {/* Personal Info Section */}
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-6">
//     {/* Header Section */}
//     <div className="flex flex-col sm:flex-row sm:items-start mb-4 gap-4">
//       {/* Image */}
//       <img
//   src={kyc.selfieImage ? encodeURI(kyc.selfieImage) : "https://via.placeholder.com/150"}
//   alt="Selfie"
//   crossOrigin="anonymous"
//   onClick={() => kyc.selfieImage && openImageModal(kyc.selfieImage)}
//   className={`w-24 h-24 object-cover rounded-full shadow-lg border-2 mx-auto sm:mx-0 ${
//     kyc.selfieImage ? "border-blue-300 cursor-pointer" : "border-gray-300"
//   } hover:opacity-90 transition-transform transform hover:scale-105`}
// />


//       {/* Personal Info */}
//       <div className="flex-grow text-center sm:text-left">
//         <h2 className="text-lg sm:text-2xl font-semibold text-gray-800">{kyc.name}</h2>
//         <p className="text-gray-500 flex items-center justify-center sm:justify-start mt-2">
//           <FaEnvelope className="mr-2 text-blue-400" /> {kyc.email || "N/A"}
//         </p>
//       </div>

//       {/* Status Badge */}
//       <div className="text-center sm:text-right">
//         <span
//           className={`px-4 py-2 rounded-full text-sm font-semibold text-white inline-block ${
//             kyc.kycStatus === "Rejected"
//               ? "bg-red-600"
//               : kyc.kycStatus === "Verified"
//               ? "bg-green-600"
//               : "bg-yellow-500"
//           }`}
//         >
//           {kyc.kycStatus}
//         </span>
//       </div>
//     </div>

//     {/* Details Section */}
//     <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4 text-gray-700">
//       <DetailItem
//         icon={<FaCalendarAlt />}
//         label="Date of Birth"
//         value={new Date(kyc.dob).toLocaleDateString()}
//       />
//       <DetailItem icon={<FaFlag />} label="Nationality" value={kyc.nationality} />
//       <DetailItem icon={<FaIdCard />} label="ID Number" value={kyc.idNumber} />
//       <DetailItem
//         icon={<FaLocationArrow />}
//         label="Address"
//         value={`${kyc.addressLine1}, ${kyc.city}, ${kyc.state} - ${kyc.zipCode}`}
//       />
//     </div>
//   </div>

//         {/* Document Info Section */}
//         <div className="bg-white p-4 sm:p-6 rounded-lg shadow-lg mb-6">
//           <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-4">
//             Document Information
//           </h2>
//           <div className="flex flex-col sm:flex-row items-center mb-4">
//             <img
//               src={kyc.documentImage || "https://via.placeholder.com/400x200"}
//               alt="Document"
//               crossOrigin="anonymous"
//               onClick={() => kyc.documentImage && openImageModal(kyc.documentImage)}
//               className={`w-24 h-16 sm:w-32 sm:h-20 rounded-lg border-2 ${
//                 kyc.documentImage ? "border-gray-300 cursor-pointer" : "border-gray-400"
//               } shadow-lg hover:opacity-90 transition-transform transform hover:scale-105 sm:mr-4`}
//             />
//             <div>
//               <p className="text-gray-800">
//                 <strong>Document Type:</strong> {kyc.documentType || "N/A"}
//               </p>
//               <p className="mt-1 text-gray-800">
//                 <strong>ID Number:</strong> {kyc.idNumber || "N/A"}
//               </p>
//             </div>
//           </div>
//         </div>

// {kyc?.kycStatus === "Rejected" && (      <div className="p-4 bg-yellow-100 rounded-lg shadow-md flex flex-col sm:flex-row items-start sm:items-center mb-8 gap-4">
//     {/* Icon Section */}
//     <div className="w-12 h-12 flex items-center justify-center bg-yellow-300 text-yellow-700 rounded-full">
//       <FaExclamationTriangle className="text-xl" />
//     </div>

//     {/* Text Section */}
//     <div className="flex-grow">
//       <p className="text-gray-800 font-medium mb-2">
//         Your KYC submission was rejected.
//       </p>
//       <p className="text-sm text-gray-600">
//         Please review your details and resubmit the necessary information to complete the verification process.
//       </p>
//     </div>

//     {/* Button Section */}
//     <div className="w-full sm:w-auto">
//       <button
//         onClick={handleResubmit}
//         className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-md transition-transform transform hover:scale-105 whitespace-nowrap"
//       >
//         Resubmit Now
//       </button>
//     </div>
//   </div>)
// }
//         {/* Resubmission Section (Moved to Bottom) */}
  

//         {/* Image Modal */}
//         {selectedImage && (
//           <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
//             <div className="relative">
//               <img
//                 src={selectedImage}
//                 crossOrigin="anonymous"
//                 alt="Full View"
//                 className="max-w-full max-h-screen rounded-lg shadow-lg"
//               />
//               <button
//                 onClick={closeImageModal}
//                 className="absolute top-3 right-3 text-white hover:text-red-500"
//               >
//                 <MdClose className="text-3xl" />
//               </button>
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   );
// };

// const DetailItem = ({ icon, label, value }) => (
//   <div className="flex items-center">
//     <div className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-blue-100 text-blue-600 rounded-lg mr-4">
//       {icon}
//     </div>
//     <div>
//       <p className="text-sm text-gray-500">{label}</p>
//       <p className="font-medium text-gray-800">{value || "N/A"}</p>
//     </div>
//   </div>
// );

// export default CustomerDetail;




import React, { useState } from "react";
import {
  FaEnvelope,
  FaIdCard,
  FaCalendarAlt,
  FaFlag,
  FaLocationArrow,
  FaExclamationTriangle,
  FaPassport,
  FaGlobe,
  FaClock,
  FaCheckCircle,
  FaEye,
  FaFileAlt,
  FaShieldAlt,
  FaUserCheck
} from "react-icons/fa";
import { MdClose, MdVerified, MdSecurity, MdOutlineArrowForward } from "react-icons/md";
import { useParams, useNavigate } from "react-router-dom";
import { useGetKycDataQuery } from "../features/api/kycApiSlice";

const CustomerDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, error, isLoading } = useGetKycDataQuery(id);
  const [selectedImage, setSelectedImage] = useState(null);
  const [activeTab, setActiveTab] = useState("personal");

  const openImageModal = (imageUrl) => setSelectedImage(imageUrl);
  const closeImageModal = () => setSelectedImage(null);

  const handleResubmit = () => {
    navigate("/steps/nationality", { state: { resubmitting: true } });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 relative">
            <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-t-blue-600 animate-spin"></div>
          </div>
          <p className="mt-6 text-base font-medium text-gray-700">Loading verification details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-white">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="h-1.5 bg-gradient-to-r from-red-500 to-red-600"></div>
          <div className="px-8 py-10 text-center">
            <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <FaExclamationTriangle className="text-3xl" />
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-3">Verification Error</h2>
            <p className="text-gray-600 mb-8">We're unable to load your verification details at this time. Please try again later.</p>
            <button 
              onClick={() => window.location.reload()}
              className="px-8 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-all duration-300 transform hover:translate-y-[-2px]"
            >
              Retry
            </button>
          </div>
        </div>
      </div>
    );
  }

  const kyc = data?.kyc;

  // Format dates nicely
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getStatusDetails = (status) => {
    switch(status) {
      case "Verified":
        return {
          icon: <FaCheckCircle className="text-xl" />,
          color: "bg-green-500",
          textColor: "text-green-700",
          bgColor: "bg-green-50",
          borderColor: "border-green-100",
          lightColor: "bg-green-100",
          gradient: "from-green-50 to-green-100"
        };
      case "Rejected":
        return {
          icon: <FaExclamationTriangle className="text-xl" />,
          color: "bg-red-500",
          textColor: "text-red-700",
          bgColor: "bg-red-50",
          borderColor: "border-red-100",
          lightColor: "bg-red-100",
          gradient: "from-red-50 to-red-100"
        };
      default:
        return {
          icon: <FaClock className="text-xl" />,
          color: "bg-yellow-400",
          textColor: "text-yellow-700",
          bgColor: "bg-yellow-50",
          borderColor: "border-yellow-100",
          lightColor: "bg-yellow-100",
          gradient: "from-yellow-50 to-yellow-100"
        };
    }
  };

  const statusDetails = getStatusDetails(kyc.kycStatus);

  return (
    <div className="min-h-screen bg-white py-8 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto">
        {/* Premium Header with Logo and Status */}
        <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-center">
          <div className="flex items-center mb-4 sm:mb-0">
            <div className="w-12 h-12 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg mr-4">
              <FaShieldAlt className="text-white text-2xl" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Customer Verification</h1>
              <p className="text-gray-500 text-sm">ID: {kyc.id.substring(0, 16)}...</p>
            </div>
          </div>
          <div>
            <span className={`inline-flex items-center px-4 py-2 rounded-full ${statusDetails.bgColor} ${statusDetails.textColor} shadow-sm`}>
              {statusDetails.icon}
              <span className="ml-2 font-semibold">{kyc.kycStatus}</span>
            </span>
          </div>
        </div>

        {/* Customer Profile Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gradient-to-r from-blue-500 to-indigo-600 px-8 py-6 relative">
            <div className="flex justify-between items-center relative z-10">
              <h2 className="text-xl font-bold text-white">Customer Profile</h2>
              <div className="flex items-center text-blue-100 text-sm">
                <FaUserCheck className="mr-2" />
                <span>Last Updated: {formatDate(kyc.updatedAt)}</span>
              </div>
            </div>
            <div className="absolute inset-0 bg-pattern opacity-10"></div>
          </div>
          
          <div className="p-8">
            <div className="flex flex-col lg:flex-row gap-8">
              {/* Customer Image and Basic Info */}
              <div className="lg:w-1/3">
                <div className="flex flex-col items-center sm:items-start mb-6">
                  <div className="relative mb-4 group">
                    <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400 to-indigo-500 animate-pulse blur-xl opacity-30 group-hover:opacity-40 transition-opacity duration-300"></div>
                    <img
                      src={kyc.selfieImage ? encodeURI(kyc.selfieImage) : "https://via.placeholder.com/150"}
                      alt="Selfie"
                      crossOrigin="anonymous"
                      onClick={() => kyc.selfieImage && openImageModal(kyc.selfieImage)}
                      className="w-40 h-40 object-cover rounded-xl shadow-lg border-2 border-white relative z-10"
                    />
                    {kyc.selfieImage && (
                      <button 
                        onClick={() => kyc.selfieImage && openImageModal(kyc.selfieImage)}
                        className="absolute bottom-2 right-2 w-9 h-9 bg-white rounded-lg shadow-lg flex items-center justify-center border border-gray-100 z-20"
                      >
                        <FaEye className="text-blue-600" />
                      </button>
                    )}
                  </div>
                  <h2 className="text-2xl font-bold text-gray-800">{kyc.name}</h2>
                  <p className="flex items-center text-gray-600 mt-1">
                    <FaEnvelope className="mr-2 text-blue-500" /> {kyc.email || "N/A"}
                  </p>
                </div>
                
                {/* Verification Status Card */}
                <div className={`rounded-xl border ${statusDetails.borderColor} overflow-hidden`}>
                  <div className={`px-6 py-4 bg-gradient-to-r ${statusDetails.gradient}`}>
                    <div className="flex items-center">
                      <div className={`w-10 h-10 rounded-full ${statusDetails.color} text-white flex items-center justify-center mr-4`}>
                        {statusDetails.icon}
                      </div>
                      <h3 className={`font-semibold ${statusDetails.textColor}`}>
                        {kyc.kycStatus === "Verified" ? "Verification Successful" : 
                         kyc.kycStatus === "Rejected" ? "Verification Failed" : 
                         "Verification In Progress"}
                      </h3>
                    </div>
                  </div>
                  <div className="p-4 bg-white">
                    <p className="text-gray-700">
                      {kyc.kycStatus === "Verified" ? 
                        "Your identity has been successfully verified. You have full access to all platform features." : 
                        kyc.kycStatus === "Rejected" ? 
                        "Your verification was not successful. Please review your information and resubmit." : 
                        "Your verification is currently under review by our compliance team."}
                    </p>
                    {kyc.kycStatus === "Rejected" && (
                      <button
                        onClick={handleResubmit}
                        className="mt-4 px-5 py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all duration-300 w-full flex items-center justify-center"
                      >
                        <span>Resubmit Documents</span>
                        <MdOutlineArrowForward className="ml-2" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Customer Details */}
              <div className="lg:w-2/3">
                {/* Premium Tabs */}
                <div className="mb-6">
                  <div className="flex space-x-1 bg-gray-100 p-1 rounded-xl">
                    <button
                      onClick={() => setActiveTab("personal")}
                      className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === "personal"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Personal Information
                    </button>
                    <button
                      onClick={() => setActiveTab("document")}
                      className={`flex-1 py-3 px-4 text-sm font-medium rounded-lg transition-all duration-200 ${
                        activeTab === "document"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600 hover:text-gray-800"
                      }`}
                    >
                      Document Details
                    </button>
                  </div>
                </div>
                
                {/* Tab Content with Premium Styling */}
                <div className="bg-white rounded-xl p-6">
                  {/* Personal Information Tab */}
                  {activeTab === "personal" && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-6">
                        <InfoGroup title="Personal Details">
                          <PremiumInfoItem 
                            icon={<FaCalendarAlt className="text-blue-500" />}
                            label="Date of Birth"
                            value={formatDate(kyc.dob)}
                          />
                          <PremiumInfoItem 
                            icon={<FaFlag className="text-blue-500" />}
                            label="Nationality"
                            value={kyc.nationality}
                          />
                          <PremiumInfoItem 
                            icon={<FaGlobe className="text-blue-500" />}
                            label="Country of Residence"
                            value={kyc.countryOfResidence}
                          />
                        </InfoGroup>
                      </div>
                      
                      <div className="space-y-6">
                        <InfoGroup title="Address Information">
                          <PremiumInfoItem 
                            icon={<FaLocationArrow className="text-blue-500" />}
                            label="Address Line 1"
                            value={kyc.addressLine1}
                          />
                          {kyc.addressLine2 && kyc.addressLine2 !== "N/A" && (
                            <PremiumInfoItem 
                              icon={<FaLocationArrow className="text-blue-500" />}
                              label="Address Line 2"
                              value={kyc.addressLine2}
                            />
                          )}
                          <PremiumInfoItem 
                            icon={<FaLocationArrow className="text-blue-500" />}
                            label="City"
                            value={kyc.city}
                          />
                          <PremiumInfoItem 
                            icon={<FaLocationArrow className="text-blue-500" />}
                            label="State / Zip"
                            value={`${kyc.state} ${kyc.zipCode}`}
                          />
                        </InfoGroup>
                      </div>
                    </div>
                  )}
                  
                  {/* Document Information Tab */}
                  {activeTab === "document" && (
                    <div>
                      <div className="mb-8">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Document Images</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          <div>
                            <p className="text-sm font-medium text-gray-700 mb-2">Primary Document ({kyc.documentType})</p>
                            <div className="relative group">
                              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/30 to-indigo-500/30 animate-pulse blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                              <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                                <img
                                  src={kyc.documentImage || "https://via.placeholder.com/400x200"}
                                  alt="Document"
                                  crossOrigin="anonymous"
                                  onClick={() => kyc.documentImage && openImageModal(kyc.documentImage)}
                                  className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                />
                                {kyc.documentImage && (
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => kyc.documentImage && openImageModal(kyc.documentImage)}
                                      className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 flex items-center text-blue-600 font-medium"
                                    >
                                      <FaEye className="mr-2" /> View Document
                                    </button>
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>
                          
                          {kyc.documentBackImage && (
                            <div>
                              <p className="text-sm font-medium text-gray-700 mb-2">Document Reverse Side</p>
                              <div className="relative group">
                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-blue-400/30 to-indigo-500/30 animate-pulse blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-300"></div>
                                <div className="relative rounded-xl overflow-hidden border border-gray-200 shadow-lg">
                                  <img
                                    src={kyc.documentBackImage}
                                    alt="Document Back"
                                    crossOrigin="anonymous"
                                    onClick={() => openImageModal(kyc.documentBackImage)}
                                    className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-105"
                                  />
                                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button 
                                      onClick={() => openImageModal(kyc.documentBackImage)}
                                      className="bg-white/90 backdrop-blur-sm rounded-lg shadow-lg px-4 py-2 flex items-center text-blue-600 font-medium"
                                    >
                                      <FaEye className="mr-2" /> View Document
                                    </button>
                                  </div>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <InfoGroup title="Document Information">
                          <PremiumInfoItem 
                            icon={<FaFileAlt className="text-blue-500" />}
                            label="Document Type"
                            value={kyc.documentType}
                          />
                          <PremiumInfoItem 
                            icon={<FaIdCard className="text-blue-500" />}
                            label="ID Number"
                            value={kyc.idNumber}
                          />
                          <PremiumInfoItem 
                            icon={<FaFlag className="text-blue-500" />}
                            label="Issuing Country"
                            value={kyc.idIssuingCountry}
                          />
                        </InfoGroup>
                        
                        <InfoGroup title="Validity Dates">
                          <PremiumInfoItem 
                            icon={<FaCalendarAlt className="text-blue-500" />}
                            label="Issue Date"
                            value={formatDate(kyc.idIssueDate)}
                          />
                          <PremiumInfoItem 
                            icon={<FaCalendarAlt className="text-blue-500" />}
                            label="Expiry Date"
                            value={formatDate(kyc.idExpiryDate)}
                          />
                        </InfoGroup>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Verification Timeline Card */}
        <div className="bg-white rounded-xl shadow-xl overflow-hidden mb-8 border border-gray-100">
          <div className="bg-gradient-to-r from-gray-800 to-gray-900 px-8 py-6">
            <h2 className="text-xl font-bold text-white">Verification Timeline</h2>
          </div>
          
          <div className="p-8">
            <div className="flex">
              {/* Verification Timeline */}
              <div className="relative ml-4">
                <div className="absolute top-0 left-0 h-full w-px bg-blue-100"></div>
                
                <TimelineItem 
                  date={formatDate(kyc.createdAt)}
                  title="Verification Started"
                  description="Customer verification request submitted"
                  status="Completed"
                  color="bg-blue-500"
                />
                
                <TimelineItem 
                  date={formatDate(kyc.createdAt)}
                  title="Document Uploaded"
                  description={`${kyc.documentType} document provided for verification`}
                  status="Completed"
                  color="bg-blue-500"
                />
                
                <TimelineItem 
                  date={formatDate(kyc.updatedAt)}
                  title="Verification Review"
                  description={`Verification status: ${kyc.kycStatus}`}
                  status={kyc.kycStatus === "Pending" ? "In Progress" : "Completed"}
                  color={kyc.kycStatus === "Verified" ? "bg-green-500" : 
                         kyc.kycStatus === "Rejected" ? "bg-red-500" : "bg-yellow-400"}
                  isLast={true}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Premium Image Modal */}
      {selectedImage && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-opacity duration-300">
          <div className="relative max-w-5xl w-full bg-white rounded-2xl shadow-2xl overflow-hidden">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-blue-500 to-indigo-600"></div>
            <div className="p-2 flex justify-between items-center border-b">
              <h3 className="text-lg font-semibold text-gray-700 px-2">Document Viewer</h3>
              <button
                onClick={closeImageModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg hover:bg-gray-100"
              >
                <MdClose className="text-2xl text-gray-600" />
              </button>
            </div>
            <div className="p-6 flex justify-center bg-gray-50">
              <img
                src={selectedImage}
                crossOrigin="anonymous"
                alt="Full View"
                className="max-w-full max-h-[70vh] object-contain rounded-lg border border-gray-200"
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Premium styled info group
const InfoGroup = ({ title, children }) => (
  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
    <div className="bg-gray-50 px-4 py-3 border-b border-gray-100">
      <h3 className="font-semibold text-gray-800">{title}</h3>
    </div>
    <div className="p-4 space-y-4">
      {children}
    </div>
  </div>
);

// Premium styled info item
const PremiumInfoItem = ({ icon, label, value }) => (
  <div className="flex items-start group">
    <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-blue-50 rounded-lg mr-3 group-hover:bg-blue-100 transition-colors">
      {icon}
    </div>
    <div className="flex-1">
      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</p>
      <p className="font-medium text-gray-800 mt-1">{value || "N/A"}</p>
    </div>
  </div>
);

// Timeline item component
const TimelineItem = ({ date, title, description, status, color, isLast = false }) => (
  <div className={`relative pb-8 ${isLast ? '' : 'mb-6'}`}>
    <div className={`absolute left-0 mt-1.5 -ml-2 h-4 w-4 rounded-full border-2 border-white ${color}`}></div>
    <div className="ml-6">
      <span className="text-sm text-gray-500">{date}</span>
      <h4 className="font-medium text-gray-900 mt-1">{title}</h4>
      <p className="text-gray-600 mt-1">{description}</p>
      <div className="mt-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium
          ${status === "Completed" ? "bg-green-100 text-green-800" : 
           status === "In Progress" ? "bg-yellow-100 text-yellow-800" : 
           "bg-gray-100 text-gray-800"}`}
        >
          {status}
        </span>
      </div>
    </div>
  </div>
);

export default CustomerDetail;