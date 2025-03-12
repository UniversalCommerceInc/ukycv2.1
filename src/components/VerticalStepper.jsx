import React, { useState, useEffect, useRef } from "react";
import {
  Stepper,
  Step,
  StepLabel,
  StepConnector,
  Box,
  Typography,
  Tooltip,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { motion, AnimatePresence } from "framer-motion";
import PersonIcon from "@mui/icons-material/Person";
import PublicIcon from "@mui/icons-material/Public";
import HomeIcon from "@mui/icons-material/Home";
import DescriptionIcon from "@mui/icons-material/Description";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

// Animated mobile progress indicator
const MobileProgressIndicator = ({ currentStep, totalSteps, label }) => {
  const progressPercentage = ((currentStep) / (totalSteps - 1)) * 100;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full px-6 py-5 bg-white border-b border-gray-100 shadow-sm z-50"
    >
      <div className="flex justify-between items-center mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center justify-center h-8 w-8 rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 text-xs font-bold text-white shadow-md">
            {currentStep + 1}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-gray-900">{label}</h3>
            <p className="text-xs text-gray-500">Step {currentStep + 1} of {totalSteps}</p>
          </div>
        </div>
        <div className="flex items-center text-xs font-medium">
          <span className="text-blue-600">{Math.round(progressPercentage)}%</span>
        </div>
      </div>
      
      <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <motion.div 
          className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"
          initial={{ width: `${((currentStep) / (totalSteps - 1)) * 100}%` }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </motion.div>
  );
};

//connector with gradient and animation
const PremiumConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderLeftWidth: 0,
    position: "relative",
    margin: "0",
    minHeight: 40,
    "&:after": {
      content: '""',
      position: "absolute",
      left: '24px', /* Centers the line with the step icon */
      top: 0,
      bottom: 0,
      width: 3,
      backgroundImage: "linear-gradient(to bottom, #e5e7eb 0%, #e5e7eb 100%)",
      borderRadius: 4,
    },
  },
  "& .Mui-active .MuiStepConnector-line": {
    "&:after": {
      backgroundImage: "linear-gradient(to bottom, #3b82f6 0%, #4f46e5 100%)",
      boxShadow: "0 0 10px rgba(59, 130, 246, 0.5)",
      animation: "pulse 2s infinite",
    },
  },
  "& .Mui-completed .MuiStepConnector-line": {
    "&:after": {
      backgroundImage: "linear-gradient(to bottom, #3b82f6 0%, #4f46e5 100%)",
    },
  },
  "@keyframes pulse": {
    "0%": {
      opacity: 0.8,
      boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)",
    },
    "50%": {
      opacity: 1,
      boxShadow: "0 0 15px rgba(59, 130, 246, 0.6)",
    },
    "100%": {
      opacity: 0.8,
      boxShadow: "0 0 5px rgba(59, 130, 246, 0.3)",
    },
  },
}));

// Horizontal connector for mobile
const MobileConnector = styled(StepConnector)(({ theme }) => ({
  "& .MuiStepConnector-line": {
    borderTopWidth: 0,
    position: "relative",
    margin: "0 8px",
    minWidth: 20,
    "&:after": {
      content: '""',
      position: "absolute",
      left: 0,
      right: 0,
      top: "50%",
      height: 2,
      transform: "translateY(-50%)",
      backgroundImage: "linear-gradient(to right, #e5e7eb 0%, #e5e7eb 100%)",
      borderRadius: 4,
    },
  },
  "& .Mui-active .MuiStepConnector-line": {
    "&:after": {
      backgroundImage: "linear-gradient(to right, #3b82f6 0%, #4f46e5 100%)",
      boxShadow: "0 0 8px rgba(59, 130, 246, 0.5)",
    },
  },
  "& .Mui-completed .MuiStepConnector-line": {
    "&:after": {
      backgroundImage: "linear-gradient(to right, #3b82f6 0%, #4f46e5 100%)",
    },
  },
}));

// step icon
const PremiumStepIconRoot = styled("div")(({ theme, ownerState }) => ({
  position: "relative",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1,
  color: ownerState.completed
    ? "#ffffff"
    : ownerState.active
    ? "#ffffff"
    : theme.palette.grey[600],
  backgroundColor: ownerState.completed
    ? "#3b82f6"
    : ownerState.active
    ? "#ffffff"
    : "#ffffff",
  width: 50,
  height: 50,
  borderRadius: "50%",
  border: ownerState.active
    ? "none"
    : ownerState.completed
    ? "none"
    : `2px solid ${theme.palette.grey[300]}`,
  boxShadow: ownerState.active
    ? "0 10px 25px -5px rgba(59, 130, 246, 0.4), 0 8px 10px -6px rgba(59, 130, 246, 0.2)"
    : ownerState.completed
    ? "0 4px 10px rgba(59, 130, 246, 0.2)"
    : "0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -1px rgba(0, 0, 0, 0.03)",
  transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
  "& svg": {
    fontSize: 24,
    transition: "all 0.3s ease",
  },
  "&:before": ownerState.active
    ? {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
        zIndex: -1,
      }
    : ownerState.completed
    ? {
        content: '""',
        position: "absolute",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        borderRadius: "50%",
        background: "linear-gradient(135deg, #3b82f6 0%, #4f46e5 100%)",
        zIndex: -1,
      }
    : {},
}));

// Animated check mark for completed steps
const AnimatedCheckMark = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1, opacity: 1 }}
    transition={{
      type: "spring",
      stiffness: 260,
      damping: 20,
      delay: 0.1,
    }}
  >
    <CheckCircleIcon />
  </motion.div>
);

// step icon component
function PremiumStepIcon(props) {
  const { active, completed, icon } = props;
  
  return (
    <PremiumStepIconRoot ownerState={{ completed, active }}>
      {completed ? (
        <AnimatedCheckMark />
      ) : (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%'
          }}
        >
          {icon}
        </div>
      )}
    </PremiumStepIconRoot>
  );
}

// Custom step label styling
const StepLabelText = ({ label, description, active }) => (
  <div className="ml-3">
    <motion.div
      initial={{ x: -5, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4 }}
      className={`text-sm font-semibold transition-all duration-300 ${
        active ? "text-blue-600" : "text-gray-700"
      }`}
    >
      {label}
    </motion.div>
    <motion.div
      initial={{ x: -5, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.1 }}
      className="text-xs text-gray-500 mt-0.5"
    >
      {description}
    </motion.div>
  </div>
);

// Enhanced step data
const steps = [
  { 
    label: "Personal Info", 
    icon: <PersonIcon />, 
    description: "Your basic details"
  },
  { 
    label: "Aadhaar Verification", 
    icon: <VerifiedUserIcon />, 
    description: "Verify your identity"
  },
  { 
    label: "Nationality", 
    icon: <PublicIcon />, 
    description: "Country of origin"
  },
  { 
    label: "Address", 
    icon: <HomeIcon />, 
    description: "Where you live"
  },
  { 
    label: "Document / Image Upload", 
    icon: <DescriptionIcon />, 
    description: "Additional verification"
  },
  { 
    label: "Selfie", 
    icon: <CameraAltIcon />, 
    description: "Photo verification"
  },
];

// Advanced animation variants
const pageVariants = {
  initial: { 
    opacity: 0, 
    y: 20,
    scale: 0.98
  },
  in: { 
    opacity: 1, 
    y: 0,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1]
    }
  },
  out: { 
    opacity: 0, 
    y: -20,
    scale: 0.98,
    transition: {
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1]
    }
  },
};

function VerticalStepper({ children, activeStep, onNext, onBack, idType }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const isTablet = useMediaQuery(theme.breakpoints.down("md"));
  const safeActiveStep = Math.min(Math.max(activeStep, 0), steps.length - 1);
  
  // Refs for scroll restoration on step change
  const contentRef = useRef(null);
  
  // Handle scroll position on mobile when changing steps
  useEffect(() => {
    if (isMobile && contentRef.current) {
      window.scrollTo({
        top: contentRef.current.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  }, [safeActiveStep, isMobile]);
  
  // Active step info
  const activeStepInfo = steps[safeActiveStep];
  
  // Manage header shadow on scroll (for mobile)
  const [headerShadow, setHeaderShadow] = useState(false);
  
  useEffect(() => {
    if (isMobile) {
      const handleScroll = () => {
        if (window.scrollY > 10) {
          setHeaderShadow(true);
        } else {
          setHeaderShadow(false);
        }
      };
      
      window.addEventListener("scroll", handleScroll);
      return () => {
        window.removeEventListener("scroll", handleScroll);
      };
    }
  }, [isMobile]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-sky-50 flex flex-col justify-center items-center p-0 sm:p-6 lg:p-10">
      {/* Main Container */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className={`w-full ${isMobile ? "h-full min-h-screen" : "max-w-5xl"} bg-white ${
          isMobile ? "rounded-none shadow-none" : "rounded-2xl shadow-2xl"
        } overflow-hidden flex ${
          isTablet ? "flex-col" : "flex-row"
        } items-stretch relative`}
        style={{
          boxShadow: !isMobile ? "0 25px 50px -12px rgba(0, 0, 0, 0.15)" : "none",
        }}
      >
        {/* Mobile Progress Indicator */}
        {isMobile && (
          <div className={`sticky top-0 z-10 transition-shadow duration-300 ${
            headerShadow ? "shadow-md" : ""
          }`}>
            <MobileProgressIndicator 
              currentStep={safeActiveStep} 
              totalSteps={steps.length}
              label={activeStepInfo.label}
            />
          </div>
        )}
        
        {/* Stepper Section - Desktop & Tablet */}
        {!isMobile && (
          <Box
            className={`${
              isTablet ? "w-full pt-8 pb-4 px-10" : "w-2/5 py-12 px-10"
            } bg-gradient-to-b from-white to-blue-50 border-r border-gray-100 flex flex-col`}
          >
            {/* Header with logo and title */}
            <div className="mb-10">
              <div className="flex items-center mb-6">
                <div className="p-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl mr-4 shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.5 }}
                  >
                    <Typography variant="h5" className="font-bold text-gray-900 text-xl">
                      Universal KYC
                    </Typography>
                    <Typography variant="body2" className="text-gray-500 mt-1 text-sm">
                      Complete your KYC
                    </Typography>
                  </motion.div>
                </div>
              </div>
              
              {/* Desktop progress indicator */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-xs font-medium text-gray-700">Overall Progress</span>
                  <span className="text-xs font-semibold text-blue-600">
                    {Math.round(((safeActiveStep + 1) / steps.length) * 100)}%
                  </span>
                </div>
                <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${((safeActiveStep + 1) / steps.length) * 100}%` }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/*vertical stepper */}
            <div className="flex-1">
              <Stepper
                activeStep={safeActiveStep}
                orientation={isTablet ? "horizontal" : "vertical"}
                connector={!isTablet ? <PremiumConnector /> : <MobileConnector />}
                className="w-full"
                sx={{
                  '& .MuiStepConnector-root': {
                    left: '25px' // Ensures proper alignment of vertical connector
                  }
                }}
              >
                {steps.map((step, index) => (
                  <Step key={step.label} className={isTablet ? "px-2" : ""}>
                    <StepLabel
                      StepIconComponent={(props) => (
                        <Tooltip
                          title={!isTablet ? "" : step.description}
                          arrow
                          placement={isTablet ? "bottom" : "right"}
                        >
                          <span>
                            <PremiumStepIcon
                              {...props}
                              icon={step.icon}
                              completed={safeActiveStep > index}
                              active={safeActiveStep === index}
                            />
                          </span>
                        </Tooltip>
                      )}
                    >
                      {!isTablet && (
                        <StepLabelText 
                          label={step.label}
                          description={step.description}
                          active={safeActiveStep === index}
                        />
                      )}
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>
            </div>
            
            {/* Help card */}
            {!isTablet && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
                className="mt-auto pt-8"
              >
                <div className="bg-white rounded-xl p-5 shadow-lg border border-gray-100">
                  <div className="flex items-center">
                    <div className="mr-4 flex-shrink-0 bg-blue-100 p-2 rounded-lg">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium text-gray-900">Need Help?</h3>
                      <p className="mt-1 text-xs text-gray-500">
                        Contact our support team for assistance with your account setup
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </Box>
        )}

        {/* Content Section */}
        <Box
          ref={contentRef}
          className={`${
            isTablet ? "w-full" : "w-3/5"
          } flex flex-col flex-1 bg-white overflow-hidden`}
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={safeActiveStep}
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              className="flex-1 flex flex-col h-full"
            >
              {children[safeActiveStep] ? (
                React.cloneElement(children[safeActiveStep], {
                  onNext,
                  onBack,
                  idType,
                })
              ) : (
                <div className="flex items-center justify-center h-full p-8">
                  <div className="text-center">
                    <div className="mx-auto h-16 w-16 mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <Typography variant="h6" className="text-gray-700 font-medium">
                      Component Not Found
                    </Typography>
                    <Typography variant="body2" className="mt-2 text-gray-500 max-w-xs mx-auto">
                      The component for this step is missing. Please check your configuration.
                    </Typography>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
          
          {/* Mobile-only navigation buttons */}
          {/* {isMobile && safeActiveStep !== 0 && children[safeActiveStep] && (
            <div className="sticky bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg z-10">
              <div className="flex justify-between">
                <button
                  onClick={onBack}
                  className="inline-flex items-center justify-center py-3 px-5 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <ArrowBackIcon fontSize="small" className="mr-1.5" />
                  Back
                </button>
                <button
                  onClick={onNext}
                  className="inline-flex items-center justify-center py-3 px-5 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-lg shadow-md hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  Continue
                  <ArrowForwardIcon fontSize="small" className="ml-1.5" />
                </button>
              </div>
            </div>
          )} */}
          
          {/* Tablet-only step indicator at bottom */}
          {isTablet && !isMobile && (
            <div className="mt-auto px-10 py-6 border-t border-gray-100">
              <div className="flex justify-between items-center">
                <Typography variant="body2" className="text-gray-500">
                  Step {safeActiveStep + 1} of {steps.length}
                </Typography>
                <Typography variant="body2" className="font-medium text-blue-600">
                  {steps[safeActiveStep].label}
                </Typography>
              </div>
            </div>
          )}
        </Box>
      </motion.div>
    </div>
  );
}

export default VerticalStepper;