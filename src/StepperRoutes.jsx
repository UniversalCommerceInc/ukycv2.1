import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, useParams } from "react-router-dom";
import VerticalStepper from "./components/VerticalStepper";
import PersonalInfoForm from "./pages/PersonalInfoForm";
import AadhaarVerificationForm from "./pages/AadhaarVerificationForm";
import NationalityForm from "./pages/NationalityForm";
import AddressForm from "./pages/AddressForm";
import DocumentUpload from "./pages/DocumentUpload";
import LiveSelfieCapture from "./pages/LiveSelfieCapture";

const StepperRoutes = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams(); // Extract dynamic segment from the route

  // Steps array with static and dynamic paths
  const steps = [
    { path: "personal-info", label: "Personal Info" },
    { path: "aadhaar-verification", label: "Aadhaar Verification" },
    { path: "nationality", label: "Nationality" },
    { path: "address", label: "Address" },
    { path: "document-upload", label: "Document Upload", dynamic: true },
    { path: "live-selfie", label: "Live Selfie", dynamic: true },
  ];

  // Calculate the active step
  const activeStep = steps.findIndex((step) => {
    if (step.dynamic) {
      // Match dynamic paths like `/document-upload/:id`
      return location.pathname.includes(step.path);
    }
    return location.pathname.endsWith(step.path);
  });

  const [aadhaarData, setAadhaarData] = useState(null); // Store Aadhaar verification data
  const [nationalityData, setNationalityData] = useState(null); // Store nationality data
  const [kycId, setKycId] = useState(id || null); // Initialize KYC ID with the URL param if available
  const [docImg, setDocImg] = useState(null); // Store document image from DocumentUpload

  // Debug log on component mount and when activeStep changes
  useEffect(() => {
    console.log("StepperRoutes mounted/updated - Current activeStep:", activeStep);
    console.log("Current pathname:", location.pathname);
    console.log("Nationality data:", nationalityData);
  }, [activeStep, location.pathname, nationalityData]);

  const handleNext = (newData) => {
    console.log("handleNext called with data:", newData);
    console.log("Current activeStep:", activeStep);

    if (activeStep === 0) {
      // After Personal Info, navigate to Aadhaar verification
      console.log("Navigating to Aadhaar verification");
      navigate(`/steps/aadhaar-verification`);
    } else if (activeStep === 1) {
      // After Aadhaar Verification, store data and navigate to Nationality
      console.log("Storing Aadhaar data and navigating to Nationality");
      setAadhaarData(newData);
      navigate(`/steps/nationality`);
    } else if (activeStep === 2) {
      // After Nationality, store data and navigate to Address
      console.log("Storing Nationality data and navigating to Address");
      setNationalityData(newData);
      // Add state to indicate we're coming from nationality 
      navigate(`/steps/address`, { state: { fromNationality: true } });
    } else if (activeStep === 3) {
      // After Address, save KYC ID and navigate to Document Upload
      console.log("Storing KYC ID and navigating to Document Upload");
      setKycId(newData);
      navigate(`/steps/document-upload/${newData}`); // Navigate to document-upload with KYC ID
    } else if (activeStep === 4) {
      // After Document Upload, save document image and navigate to Live Selfie
      console.log("Storing document image and navigating to Live Selfie");
      setDocImg(newData);
      navigate(`/steps/live-selfie/${kycId}`); // Navigate to live-selfie with KYC ID
    } else if (activeStep < steps.length - 1) {
      // Navigate to the next step in the static path
      const nextPath = `/steps/${steps[activeStep + 1].path}`;
      console.log("Navigating to next step:", nextPath);
      navigate(nextPath);
    }
  };

  const handleBack = () => {
    console.log("handleBack called - Current activeStep:", activeStep);
    
    if (activeStep > 0) {
      const previousStep = activeStep - 1;
      const previousStepInfo = steps[previousStep];
      
      if (previousStepInfo.dynamic) {
        // For dynamic routes, construct the path with the KYC ID
        const dynamicPath = `/steps/${previousStepInfo.path}/${kycId}`;
        console.log("Navigating back to dynamic path:", dynamicPath);
        navigate(dynamicPath);
      } else {
        const staticPath = `/steps/${previousStepInfo.path}`;
        console.log("Navigating back to static path:", staticPath);
        
        // Add state to track navigation direction
        if (previousStepInfo.path === "nationality") {
          navigate(staticPath, { state: { fromAddress: true } });
        } else {
          navigate(staticPath);
        }
      }
    }
  };

  // Get the current form's props based on activeStep
  const getFormProps = (index) => {
    const baseProps = {
      onNext: handleNext,
      onBack: handleBack,
      key: steps[index]?.path || index
    };
    
    // Add specific props for each step
    switch (index) {
      case 3: // Address form
        return { ...baseProps, nationalityData };
      case 4: // Document Upload
        return { ...baseProps, id: kycId };
      case 5: // Live Selfie
        return { ...baseProps, id: kycId, docImages: docImg };
      default:
        return baseProps;
    }
  };

  return (
    <VerticalStepper 
      activeStep={activeStep} 
      onNext={handleNext} 
      onBack={handleBack}
    >
      {[
        <PersonalInfoForm {...getFormProps(0)} />,
        <AadhaarVerificationForm {...getFormProps(1)} />,
        <NationalityForm {...getFormProps(2)} />,
        <AddressForm {...getFormProps(3)} />,
        <DocumentUpload {...getFormProps(4)} />,
        <LiveSelfieCapture {...getFormProps(5)} />,
      ]}
    </VerticalStepper>
  );
};

export default StepperRoutes;