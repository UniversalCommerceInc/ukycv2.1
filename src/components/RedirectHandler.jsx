// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useMeQuery } from "../features/api/usersApiSlice";

// const RedirectHandler = () => {
//   const token = useSelector((state) => state.auth.token);
//   const navigate = useNavigate();

//   const { data: userData, error, isLoading } = useMeQuery(undefined, {
//     skip: !token, // Skip if token is not available
//   });

//   useEffect(() => {
//     if (!isLoading && userData) {
//       const { kycs } = userData;

//       if (kycs?.length > 0) {
//         const { kycId, avlAssets } = kycs[0];

//         if (kycId && !avlAssets) {
//           toast(
//             "You already filled KYC entry earlier. Document upload is pending for KYC.",
//             {
//               icon: "⚠️",
//               style: { background: "#fef3c7", color: "#b45309" },
//               duration: 4000,
//             }
//           );
//           navigate(`/steps/document-upload/${kycId}`, { replace: true });
//         } else if (kycId && avlAssets) {
//           navigate(`/kyc/${kycId}`, { replace: true });
//         }
//       } else {
//         navigate(`/steps/nationality`, { replace: true });
//       }
//     }

//     if (error && !isLoading) {
//       console.error("Error fetching user data:", error);
//       navigate("/signin", { replace: true });
//     }
//   }, [userData, error, isLoading, navigate]);

//   return isLoading ? <div>Loading...</div> : null; // Optional loading state
// };

// export default RedirectHandler;

// import React, { useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useNavigate, Outlet, useLocation } from "react-router-dom";
// import toast from "react-hot-toast";
// import { useMeQuery } from "../features/api/usersApiSlice";

// const RedirectHandler = () => {
//   const token = useSelector((state) => state.auth.token);
//   const navigate = useNavigate();
//   const location = useLocation();
//   const { data: userData, error, isLoading } = useMeQuery(undefined, {
//     skip: !token, // Skip if token is not available
//   });

//   useEffect(() => {
//     if (!isLoading && userData) {
//       const { kycs } = userData;
//       // Get isAadhaarVerified regardless of how it's spelled in the API
//       const isAadhaarVerified = userData.isAadhaarVerified || userData.isAadharVerified;
//       const currentPath = location.pathname;

//       console.log("Current path:", currentPath);
//       console.log("Aadhaar verified:", isAadhaarVerified);
//       console.log("KYCs:", kycs);

//       // Define all paths in the verification flow
//       const flowPaths = {
//         personalInfo: "/steps/personal-info",
//         aadhaarVerification: "/steps/aadhaar-verification",
//         nationality: "/steps/nationality",
//         address: "/steps/address"
//       };

//       // Paths that don't require Aadhaar verification
//       const exemptFromAadhaarCheck = [
//         flowPaths.personalInfo,
//         flowPaths.aadhaarVerification
//       ];
      
//       // Check if current path is exempt from Aadhaar verification check
//       const isExemptPath = exemptFromAadhaarCheck.some(
//         path => currentPath === path || currentPath.startsWith(path)
//       );

//       // If user has KYCs, process those first
//       if (kycs?.length > 0) {
//         const lastKyc = kycs[kycs.length - 1];
//         const { kycId, avlAssets, status } = lastKyc;

//         // Handle resubmission case
//         if (status === "Rejected" && location.state?.resubmitting) {
//           navigate(flowPaths.nationality, { replace: true });
//           return;
//         }

//         // Handle document upload pending case
//         if (kycId && !avlAssets) {
//           const documentUploadPath = `/steps/document-upload/${kycId}`;
          
//           if (!currentPath.includes(documentUploadPath)) {
//             toast(
//               "You already filled KYC entry earlier. Document upload is pending for KYC.",
//               {
//                 icon: "⚠️",
//                 style: { background: "#fef3c7", color: "#b45309" },
//                 duration: 4000,
//               }
//             );
//             navigate(documentUploadPath, { replace: true });
//           }
//           return;
//         } 
        
//         // Handle completed KYC case
//         else if (kycId && avlAssets) {
//           const kycPath = `/kyc/${kycId}`;
//           if (currentPath !== kycPath) {
//             navigate(kycPath, { replace: true });
//           }
//           return;
//         }
//       }

//       // If no KYCs, handle the normal flow
      
//       // 1. Check Aadhaar verification if needed
//       if (!isAadhaarVerified && !isExemptPath) {
//         // Only show notification once
//         if (currentPath !== flowPaths.aadhaarVerification) {
//           toast("Please complete Aadhaar verification before proceeding", {
//             icon: "ℹ️",
//             style: { background: "#e0f2fe", color: "#0369a1" },
//             duration: 4000,
//           });
//         }
//         navigate(flowPaths.aadhaarVerification, { replace: true });
//         return;
//       }

//       // 2. If Aadhaar is verified but not in nationality or address, go to nationality
//       if (isAadhaarVerified && 
//           !kycs?.length && 
//           currentPath !== flowPaths.nationality && 
//           currentPath !== flowPaths.address && 
//           !currentPath.startsWith("/steps/document-upload/") &&
//           !currentPath.startsWith("/steps/live-selfie/")) {
        
//         // If user was in address but got redirected, don't force back to nationality
//         if (!location.state?.fromAddress) {
//           navigate(flowPaths.nationality, { replace: true, state: { fromAadhaar: true } });
//           return;
//         }
//       }
      
//       // If we reach here, let the normal flow continue
//     }

//     if (error && !isLoading) {
//       console.error("Error fetching user data:", error);
//       // Uncomment to redirect to signin on error
//       // navigate("/signin", { replace: true });
//     }
//   }, [userData, error, isLoading, navigate, location.pathname, location.state]);

//   // Show a more attractive loading indicator
//   if (isLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
//         <div className="text-center p-8">
//           <div className="inline-block relative w-16 h-16 mb-4">
//             <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200"></div>
//             <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-600 animate-spin"></div>
//           </div>
//           <p className="text-gray-700 font-medium">Loading your profile...</p>
//         </div>
//       </div>
//     );
//   }

//   return <Outlet />;
// };

// export default RedirectHandler;










import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate, Outlet, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import { useMeQuery } from "../features/api/usersApiSlice";

const RedirectHandler = () => {
  const token = useSelector((state) => state.auth.token);
  const navigate = useNavigate();
  const location = useLocation();
  const [isDocumentUploaded, setIsDocumentUploaded] = useState(false);
  
  const { 
    data: userData, 
    error, 
    isLoading, 
    refetch 
  } = useMeQuery(undefined, {
    skip: !token, // Skip if token is not available
  });

  // Check if the user is coming from document upload page
  useEffect(() => {
    if (location.state?.documentsUploaded) {
      setIsDocumentUploaded(true);
    }
  }, [location.state]);

  useEffect(() => {
    if (!isLoading && userData) {
      const { kycs } = userData;
      // Get isAadhaarVerified regardless of how it's spelled in the API
      const isAadhaarVerified = userData.isAadhaarVerified || userData.isAadharVerified;
      const currentPath = location.pathname;

      console.log("Current path:", currentPath);
      console.log("Aadhaar verified:", isAadhaarVerified);
      console.log("KYCs:", kycs);
      console.log("Document uploaded state:", isDocumentUploaded);

      // Define all paths in the verification flow
      const flowPaths = {
        personalInfo: "/steps/personal-info",
        aadhaarVerification: "/steps/aadhaar-verification",
        nationality: "/steps/nationality",
        address: "/steps/address",
        documentUpload: "/steps/document-upload",
        liveSelfie: "/steps/live-selfie"
      };

      // Paths that don't require Aadhaar verification
      const exemptFromAadhaarCheck = [
        flowPaths.personalInfo,
        flowPaths.aadhaarVerification
      ];
      
      // Check if current path is exempt from Aadhaar verification check
      const isExemptPath = exemptFromAadhaarCheck.some(
        path => currentPath === path || currentPath.startsWith(path)
      );

      // If user has KYCs, process those first
      if (kycs?.length > 0) {
        const lastKyc = kycs[kycs.length - 1];
        const { kycId, avlAssets, status } = lastKyc;

        // Handle resubmission case
        if (status === "Rejected" && location.state?.resubmitting) {
          navigate(flowPaths.nationality, { replace: true });
          return;
        }

        // Handle document upload pending case
        if (kycId && !avlAssets) {
          const documentUploadPath = `${flowPaths.documentUpload}/${kycId}`;
          
          // Special case: If we're already past document upload or have state indicating documents uploaded
          const isAfterDocumentUpload = currentPath.includes(flowPaths.liveSelfie) || 
                                       location.state?.documentsUploaded || 
                                       isDocumentUploaded;
                                       
          if (isAfterDocumentUpload) {
            // User has completed document upload, don't redirect back
            console.log("Allowing navigation past document upload");
            return;
          }
          
          if (!currentPath.includes(documentUploadPath)) {
            toast(
              "You already filled KYC entry earlier. Document upload is pending for KYC.",
              {
                icon: "⚠️",
                style: { background: "#fef3c7", color: "#b45309" },
                duration: 4000,
              }
            );
            navigate(documentUploadPath, { replace: true });
          }
          return;
        } 
        
        // Handle completed KYC case
        else if (kycId && avlAssets) {
          const kycPath = `/kyc/${kycId}`;
          if (currentPath !== kycPath) {
            navigate(kycPath, { replace: true });
          }
          return;
        }
      }

      // If no KYCs, handle the normal flow
      
      // 1. Check Aadhaar verification if needed
      if (!isAadhaarVerified && !isExemptPath) {
        // Only show notification once
        if (currentPath !== flowPaths.aadhaarVerification) {
          toast("Please complete Aadhaar verification before proceeding", {
            icon: "ℹ️",
            style: { background: "#e0f2fe", color: "#0369a1" },
            duration: 4000,
          });
        }
        navigate(flowPaths.aadhaarVerification, { replace: true });
        return;
      }

      // 2. If Aadhaar is verified but not in nationality or address, go to nationality
      if (isAadhaarVerified && 
          !kycs?.length && 
          currentPath !== flowPaths.nationality && 
          currentPath !== flowPaths.address && 
          !currentPath.startsWith(flowPaths.documentUpload) &&
          !currentPath.startsWith(flowPaths.liveSelfie)) {
        
        // If user was in address but got redirected, don't force back to nationality
        if (!location.state?.fromAddress) {
          navigate(flowPaths.nationality, { replace: true, state: { fromAadhaar: true } });
          return;
        }
      }
      
      // If we reach here, let the normal flow continue
    }

    if (error && !isLoading) {
      console.error("Error fetching user data:", error);
      // Uncomment to redirect to signin on error
      // navigate("/signin", { replace: true });
    }
  }, [userData, error, isLoading, navigate, location.pathname, location.state, isDocumentUploaded]);

  // If documents were uploaded, poll for updates
  useEffect(() => {
    let pollInterval;
    
    if (isDocumentUploaded && userData?.kycs?.length > 0) {
      const lastKyc = userData.kycs[userData.kycs.length - 1];
      const { kycId, avlAssets } = lastKyc;
      
      if (kycId && !avlAssets) {
        // Poll for updates every 8 seconds
        pollInterval = setInterval(() => {
          console.log("Polling for document status updates...");
          refetch();
        }, 8000);
      }
    }
    
    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [isDocumentUploaded, userData, refetch]);

  // Show a more attractive loading indicator
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="text-center p-8">
          <div className="inline-block relative w-16 h-16 mb-4">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-t-blue-600 animate-spin"></div>
          </div>
          <p className="text-gray-700 font-medium">Loading your profile...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default RedirectHandler;