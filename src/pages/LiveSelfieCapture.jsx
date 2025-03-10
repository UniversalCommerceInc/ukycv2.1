import React, { useRef, useState, useEffect, useCallback } from "react";
import { 
  Typography, 
  Button, 
  CircularProgress, 
  Box, 
  Paper, 
  Avatar, 
  Fade,
  Grow,
  IconButton,
  useMediaQuery,
  useTheme
} from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import { useUploadKycMutation } from "../features/api/assetUploadApiSlice";
import { setKycId } from "../features/auth/kycSlice";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import * as faceapi from "face-api.js";
import { 
  CameraAlt as CameraIcon,
  Refresh as RefreshIcon,
  CheckCircle as CheckCircleIcon,
  Face as FaceIcon,
  PhotoLibrary as GalleryIcon
} from "@mui/icons-material";

const MINIMUM_SCANNING_TIME = 2000; // 2 seconds

// Premium scanning overlay with dynamic blur and gradient
const scanningOverlayStyle = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  zIndex: 9999,
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  justifyContent: "center",
  background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(30,58,138,0.90))",
  backdropFilter: "blur(8px)",
  borderRadius: "1.25rem",
};

const LiveSelfieCapture = ({ onNext, onBack, docImages }) => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const [capturedFile, setCapturedFile] = useState(null);
  const [capturedSelfieURL, setCapturedSelfieURL] = useState(null);
  const [submissionInProgress, setSubmissionInProgress] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [scanningProgress, setScanningProgress] = useState(0);

  const [uploadKyc, { isLoading }] = useUploadKycMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const kycId = useSelector((state) => state.kyc.kycId);

  // console.log("Document images received:", docImages);
  
  // Load tinyFaceDetector model on mount
  useEffect(() => {
    async function loadModels() {
      try {
        await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
      } catch (error) {
        console.error("Error loading face detection models:", error);
      }
    }
    loadModels();
  }, []);

  // Simulate scanning progress
  useEffect(() => {
    if (isScanning) {
      const interval = setInterval(() => {
        setScanningProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, MINIMUM_SCANNING_TIME / 10);
      
      return () => {
        clearInterval(interval);
        setScanningProgress(0);
      };
    }
  }, [isScanning]);

  // Trigger the file input for gallery selection
  const handleChooseFromGallery = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  }, []);

  // Trigger the camera input
  const handleTakePhoto = useCallback(() => {
    if (cameraInputRef.current) {
      cameraInputRef.current.click();
    }
  }, []);

  // When a file is selected, run face detection and if successful, save it
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      const startTime = Date.now();
      setIsScanning(true);

      // Create an object URL for the selected file
      const imageURL = URL.createObjectURL(file);
      const image = new Image();
      image.src = imageURL;

      try {
        await new Promise((resolve, reject) => {
          image.onload = resolve;
          image.onerror = reject;
        });
      } catch (err) {
        toast.error("Error loading image. Please try again.", {
          style: { background: "#fee2e2", color: "#b91c1c" },
          icon: "❌",
          duration: 4000,
        });
        setIsScanning(false);
        return;
      }

      // Run face detection on the loaded image
      const detection = await faceapi.detectSingleFace(
        image,
        new faceapi.TinyFaceDetectorOptions()
      );

      // Enforce a minimum scanning time
      const elapsedTime = Date.now() - startTime;
      if (elapsedTime < MINIMUM_SCANNING_TIME) {
        await new Promise((resolve) =>
          setTimeout(resolve, MINIMUM_SCANNING_TIME - elapsedTime)
        );
      }

      if (!detection) {
        toast.error(
          "No face detected. Please retake your selfie with a clear view of your face.",
          {
            style: { background: "#fee2e2", color: "#b91c1c" },
            icon: "❌",
            duration: 4000,
          }
        );
        setIsScanning(false);
        return;
      }

      // Face detected! Save the file and its preview URL
      setCapturedFile(file);
      setCapturedSelfieURL(imageURL);
      setIsScanning(false);
      
      // Show success toast
      toast.success("Face detected successfully!", {
        style: { background: "#ecfdf5", color: "#065f46" },
        icon: "✅",
        duration: 3000,
      });
    }
  };

  // Upload the captured selfie along with all document images
  const handleSubmit = async () => {
    if (!capturedFile) {
      toast.error("No selfie captured.", {
        style: { background: "#fee2e2", color: "#b91c1c" },
        icon: "❌",
        duration: 4000,
      });
      return;
    }
    
    setSubmissionInProgress(true);
    
    try {
      // Create FormData object for uploading files
      const formData = new FormData();
      
      // Add all the document images to formData
      // Convert base64 images to blobs if needed
      
      const fetchBlob = async (dataUrl) => {
        if (!dataUrl) return null;
        try {
          const response = await fetch(dataUrl);
          return await response.blob();
        } catch (error) {
          console.error("Error converting to blob:", error);
          return null;
        }
      };
      
      // Handle document images (ID, Aadhaar, etc.)
      if (docImages) {
        if (docImages.idCard) {
          const idBlob = await fetchBlob(docImages.idCard);
          if (idBlob) formData.append("document", idBlob, "document.jpg");
        }
        
        if (docImages.aadhaarCard) {
          const aadhaarBlob = await fetchBlob(docImages.aadhaarCard);
          if (aadhaarBlob) formData.append("aadhaarImage", aadhaarBlob, "aadhaar.jpg");
        }
        
        if (docImages.passportPhoto) {
          const passportPhotoBlob = await fetchBlob(docImages.passportPhoto);
          if (passportPhotoBlob) formData.append("pptPhoto", passportPhotoBlob, "passport_photo.jpg");
        }
      }
      
      // Append the selfie
      formData.append("selfie", capturedFile, "selfie.jpg");
      
      console.log("Uploading form data...");
      const response = await uploadKyc({ id: kycId, file: formData }).unwrap();
      console.log("Upload successful:", response);

      const { id } = response.kyc;
      dispatch(setKycId(id));
      
      // Navigate with state to prevent redirect loop
      navigate(`/kyc/success/${id}`, { 
        state: { documentsUploaded: true }
      });
    } catch (apiError) {
      console.error("Error during upload:", apiError);
      toast.error(
        apiError?.data?.details?.message ||
          "Something went wrong. Please try again.",
        {
          style: { background: "#fee2e2", color: "#b91c1c" },
          icon: "❌",
          duration: 4000,
        }
      );
    } finally {
      setSubmissionInProgress(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
      // style={{
      //   background: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
      //   backgroundSize: "400% 400%",
      //   animation: "gradient 15s ease infinite",
      // }}
    >
      <Grow in={true} timeout={700}>
        <Paper
          className="w-full max-w-xl relative overflow-hidden"
          elevation={12}
          style={{
            borderRadius: "1.5rem",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            backdropFilter: "blur(12px)",
            boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 40px rgba(10, 37, 64, 0.2) inset",
            padding: isSmallScreen ? "1.5rem" : "2rem",
          }}
        >
          {isScanning && (
            <Fade in={isScanning}>
              <Box sx={scanningOverlayStyle}>
                <CircularProgress 
                  variant="determinate" 
                  value={scanningProgress} 
                  size={80} 
                  thickness={4} 
                  sx={{ 
                    color: "#4F46E5",
                    "& .MuiCircularProgress-circle": {
                      strokeLinecap: "round",
                    }
                  }} 
                />
                <Typography
                  variant="h6"
                  sx={{
                    color: "#fff",
                    mt: 3,
                    fontWeight: "bold",
                    textShadow: "0 2px 10px rgba(0,0,0,0.5)",
                    letterSpacing: "0.5px",
                  }}
                >
                  Scanning Your Face
                </Typography>
                <Typography
                  variant="subtitle1"
                  sx={{
                    color: "#fff",
                    opacity: 0.85,
                    mt: 1,
                    fontStyle: "italic",
                    textShadow: "0 2px 8px rgba(0,0,0,0.3)",
                  }}
                >
                  Please hold still
                </Typography>
              </Box>
            </Fade>
          )}

          {submissionInProgress ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: "400px",
              }}
            >
              <CircularProgress 
                size={80} 
                thickness={4} 
                sx={{ 
                  color: "#4F46E5",
                  "& .MuiCircularProgress-circle": {
                    strokeLinecap: "round",
                  }
                }} 
              />
              <Typography 
                variant="h5" 
                sx={{ 
                  mt: 4, 
                  fontWeight: "bold", 
                  color: "#1E3A8A",
                  background: "linear-gradient(to right, #1E3A8A, #4F46E5)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                Submitting Your KYC Data
              </Typography>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  mt: 1, 
                  color: "#4B5563", 
                  textAlign: "center",
                  maxWidth: "80%"
                }}
              >
                Your verification is being processed. Please don't close this window.
              </Typography>
            </Box>
          ) : (
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              position: "relative",
              zIndex: 1,
            }}>
              {/* Header */}
              <Avatar
                sx={{
                  bgcolor: "#4F46E5",
                  width: 64,
                  height: 64,
                  mb: 2,
                  boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
                }}
              >
                <FaceIcon sx={{ fontSize: 36 }} />
              </Avatar>
              
              <Typography
                variant={isSmallScreen ? "h5" : "h4"}
                align="center"
                sx={{
                  mb: 2,
                  fontWeight: 700,
                  background: "linear-gradient(to right, #1E3A8A, #4F46E5)",
                  backgroundClip: "text",
                  textFillColor: "transparent",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  letterSpacing: "0.5px",
                }}
              >
                Live Selfie Capture
              </Typography>

              <Typography 
                variant="body1" 
                sx={{ 
                  textAlign: "center", 
                  mb: 4, 
                  color: "#4B5563", 
                  maxWidth: "90%",
                  fontSize: 16
                }}
              >
                Please take a clear selfie of your face to complete identity verification.
              </Typography>

              {capturedSelfieURL ? (
                <Fade in={Boolean(capturedSelfieURL)} timeout={800}>
                  <Paper
                    elevation={8}
                    sx={{ 
                      p: 1, 
                      borderRadius: "1rem", 
                      mb: 4,
                      width: "100%",
                      overflow: "hidden",
                      backgroundColor: "#f3f4f6",
                      border: "3px solid #4F46E5",
                      position: "relative",
                    }}
                  >
                    <div 
                      className="relative w-full h-64 sm:h-80 rounded-lg overflow-hidden flex items-center justify-center"
                      style={{ background: "#000" }}
                    >
                      <img
                        src={capturedSelfieURL}
                        alt="Captured Selfie"
                        style={{ 
                          transform: "scaleX(-1)",
                          width: "100%",
                          height: "100%", 
                          objectFit: "cover" 
                        }}
                      />
                      <div className="absolute top-3 right-3">
                        <IconButton
                          sx={{
                            backgroundColor: "rgba(16, 185, 129, 0.15)",
                            "&:hover": { backgroundColor: "rgba(16, 185, 129, 0.25)" },
                          }}
                        >
                          <CheckCircleIcon sx={{ color: "#10B981" }} />
                        </IconButton>
                      </div>
                    </div>
                  </Paper>
                </Fade>
              ) : (
                <Fade in={!capturedSelfieURL} timeout={800}>
                  <Paper
                    elevation={6}
                    sx={{ 
                      p: 0, 
                      borderRadius: "1rem", 
                      mb: 4,
                      width: "100%",
                      overflow: "hidden",
                      background: "linear-gradient(135deg, #111827, #1E3A8A)",
                      border: "3px dashed rgba(79, 70, 229, 0.4)",
                    }}
                  >
                    <div className={`w-full ${isSmallScreen ? 'h-64' : 'h-80'} rounded-lg flex flex-col items-center justify-center p-6 text-center`}>
                      <CameraIcon sx={{ fontSize: 60, color: "#fff", opacity: 0.8, mb: 2 }} />
                      <Typography 
                        variant="h6" 
                        sx={{ 
                          color: "#fff", 
                          fontWeight: 600,
                          mb: 1
                        }}
                      >
                        No selfie captured yet
                      </Typography>
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: "#cbd5e1", 
                          mb: 4,
                          maxWidth: "80%"
                        }}
                      >
                        {isSmallScreen 
                          ? "Tap the button below to take a selfie" 
                          : "Tap the button below to take a clear selfie with your face centered in the frame"}
                      </Typography>
                    </div>
                  </Paper>
                </Fade>
              )}

              <Box sx={{ 
                display: "flex", 
                justifyContent: "center", 
                gap: isSmallScreen ? 2 : 3, 
                width: "100%",
                flexDirection: { xs: "column", sm: "row" }
              }}>
                {capturedSelfieURL ? (
                  <>
                    <Button
                      variant="outlined"
                      onClick={handleTakePhoto}
                      startIcon={<RefreshIcon />}
                      disabled={submissionInProgress}
                      fullWidth
                      sx={{ 
                        borderRadius: "0.75rem",
                        textTransform: "none",
                        py: 1.2,
                        px: 3,
                        mb: isSmallScreen ? 2 : 0,
                        fontWeight: 600,
                        borderWidth: 2,
                        borderColor: "#4F46E5",
                        color: "#4F46E5",
                        "&:hover": {
                          borderColor: "#4338CA",
                          backgroundColor: "rgba(79, 70, 229, 0.05)",
                        }
                      }}
                    >
                      Retake Selfie
                    </Button>
                    <Button
                      variant="contained"
                      onClick={handleSubmit}
                      disabled={isLoading}
                      startIcon={<CheckCircleIcon />}
                      fullWidth
                      sx={{ 
                        borderRadius: "0.75rem",
                        textTransform: "none",
                        py: 1.2,
                        px: 4,
                        fontWeight: 600,
                        boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                        background: "linear-gradient(to right, #4F46E5, #7C3AED)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "linear-gradient(to right, #4338CA, #6D28D9)",
                          boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)",
                          transform: "translateY(-2px)",
                        }
                      }}
                    >
                      {isLoading ? "Uploading..." : "Submit KYC"}
                    </Button>
                  </>
                ) : (
                  <>
                    {/* Only show the gallery button on desktop */}
                    {!isSmallScreen && (
                      <Button
                        variant="outlined"
                        onClick={handleChooseFromGallery}
                        startIcon={<GalleryIcon />}
                        fullWidth
                        sx={{ 
                          borderRadius: "0.75rem",
                          textTransform: "none",
                          py: 1.2,
                          px: 3,
                          fontWeight: 600,
                          borderWidth: 2,
                          borderColor: "#4F46E5",
                          color: "#4F46E5",
                          "&:hover": {
                            borderColor: "#4338CA",
                            backgroundColor: "rgba(79, 70, 229, 0.05)",
                          }
                        }}
                      >
                        Upload from Gallery
                      </Button>
                    )}
                    <Button
                      variant="contained"
                      onClick={handleTakePhoto}
                      startIcon={<CameraIcon />}
                      fullWidth
                      sx={{ 
                        borderRadius: "0.75rem",
                        textTransform: "none",
                        py: 1.2,
                        px: 4,
                        fontWeight: 600,
                        boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
                        background: "linear-gradient(to right, #4F46E5, #7C3AED)",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          background: "linear-gradient(to right, #4338CA, #6D28D9)",
                          boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)",
                          transform: "translateY(-2px)",
                        }
                      }}
                    >
                      Take Selfie
                    </Button>
                  </>
                )}
              </Box>

              {/* Hidden file inputs */}
              <input
                type="file"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
              <input
                type="file"
                accept="image/*"
                capture="user"
                ref={cameraInputRef}
                onChange={handleFileChange}
                style={{ display: "none" }}
              />
            </Box>
          )}
          
          {/* Decorative elements */}
          <div 
            style={{
              position: "absolute",
              top: -30,
              right: -30,
              width: "150px",
              height: "150px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2))",
              zIndex: 0,
              filter: "blur(30px)"
            }}
          />
          <div 
            style={{
              position: "absolute",
              bottom: -40,
              left: -40,
              width: "180px",
              height: "180px",
              borderRadius: "50%",
              background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))",
              zIndex: 0,
              filter: "blur(40px)"
            }}
          />
        </Paper>
      </Grow>
      
      {/* Global styles for animation */}
      <style jsx global>{`
        @keyframes gradient {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>
    </div>
  );
};

export default LiveSelfieCapture;