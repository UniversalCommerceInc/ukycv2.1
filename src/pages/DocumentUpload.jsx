// import React, { useState, useRef, useEffect } from "react";
// import Webcam from "react-webcam";
// import Cropper from "react-cropper";
// import "cropperjs/dist/cropper.css";
// import {
//   Box,
//   Typography,
//   Paper,
//   Button,
//   IconButton,
//   useMediaQuery,
//   CircularProgress,
//   Avatar,
//   Fade,
//   Grow,
// } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
// import CancelIcon from "@mui/icons-material/Cancel";
// import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
// import { ChevronRight, BackupOutlined, CameraAltOutlined } from "@mui/icons-material";
// import Lottie from "react-lottie-player";
// import * as faceapi from "face-api.js";
// import toast from "react-hot-toast";

// // Example Lottie animations
// import ocrIDFront from "../assets/ocr_id_front.json";
// import ocrPassportFront from "../assets/ocr_passport.json";
// import { useMeQuery } from "../features/api/usersApiSlice";

// const MINIMUM_SCANNING_TIME = 2000; // 2 seconds

// const scanningOverlayStyle = {
//   position: "absolute",
//   top: 0,
//   left: 0,
//   width: "100%",
//   height: "100%",
//   zIndex: 9999,
//   display: "flex",
//   flexDirection: "column",
//   alignItems: "center",
//   justifyContent: "center",
//   background: "linear-gradient(135deg, rgba(0,0,0,0.85), rgba(30,58,138,0.90))",
//   backdropFilter: "blur(8px)",
//   borderRadius: "1.25rem",
// };

// const PassportLottie = () => (
//   <Lottie
//     loop
//     animationData={ocrPassportFront}
//     play
//     style={{ width: "280px", height: "280px", background: "transparent" }}
//   />
// );

// const IDFrontLottie = () => (
//   <Lottie
//     loop
//     animationData={ocrIDFront}
//     play
//     style={{ width: "280px", height: "280px", background: "transparent" }}
//   />
// );

// const DocumentUpload = ({ onNext }) => {
//   const [imageSrc, setImageSrc] = useState(null); // raw image from webcam/file
//   const [showCropper, setShowCropper] = useState(false);
//   const [croppedImage, setCroppedImage] = useState(null); // final cropped output
//   const [isCaptureMode, setIsCaptureMode] = useState(false);
//   const [isImageConfirmed, setIsImageConfirmed] = useState(false);
//   const [isScanning, setIsScanning] = useState(false);
//   const [detectedCropBox, setDetectedCropBox] = useState(null);
//   const [idType, setIdType] = useState(null);
//   const [scanningProgress, setScanningProgress] = useState(0);
//   const { data: me } = useMeQuery();
  
//   useEffect(() => {
//     if (me) {
//       setIdType(me.kycs[me.kycs.length - 1].idType.toLowerCase());
//     }
//   }, [me]);
  
//   const [facingMode, setFacingMode] = useState("environment");
//   const webcamRef = useRef(null);
//   const cropperRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const isSmallScreen = useMediaQuery("(max-width:600px)");

//   // Load face detection model
//   useEffect(() => {
//     async function loadModels() {
//       try {
//         await faceapi.nets.tinyFaceDetector.loadFromUri("/models");
//       } catch (error) {
//         console.error("Error loading face detection models:", error);
//       }
//     }
//     loadModels();
//   }, []);

//   // Simulate scanning progress
//   useEffect(() => {
//     if (isScanning) {
//       const interval = setInterval(() => {
//         setScanningProgress((prev) => {
//           if (prev >= 100) {
//             clearInterval(interval);
//             return 100;
//           }
//           return prev + 10;
//         });
//       }, MINIMUM_SCANNING_TIME / 10);
      
//       return () => {
//         clearInterval(interval);
//         setScanningProgress(0);
//       };
//     }
//   }, [isScanning]);

//   const getInstructionText = () => {
//     if (idType === "passport")
//       return "Position your passport info page within the frame, ensuring all details are clearly visible.";
//     if (idType === "aadhaar-card")
//       return "Place your Aadhaar card on a flat surface with good lighting to ensure all details are captured.";
//     if (idType === "pan")
//       return "Position your PAN card within the frame, making sure all text is clearly readable.";
//     if (idType === "dl")
//       return "Capture the front side of your Driving License with all information clearly visible.";
//     if (idType === "voter-id")
//       return "Ensure your Voter ID is positioned flat with all details clearly visible in the frame.";
//     return "Position your document within the frame ensuring all details are clearly visible and free from glare.";
//   };

//   const getDocumentName = () => {
//     if (idType === "passport") return "Passport";
//     if (idType === "aadhaar-card") return "Aadhaar Card";
//     if (idType === "pan") return "PAN Card";
//     if (idType === "dl") return "Driving License";
//     if (idType === "voter-id") return "Voter ID";
//     return "Document";
//   };

//   const renderAnimation = () => {
//     if (idType === "passport") return <PassportLottie />;
//     return <IDFrontLottie />;
//   };

//   const detectCropBox = (srcImage) =>
//     new Promise((resolve, reject) => {
//       if (!window.cv) {
//         reject(new Error("OpenCV not loaded. Ensure 'cv' is available on window."));
//         return;
//       }
//       const img = new Image();
//       img.src = srcImage;
//       img.onload = () => {
//         const canvas = document.createElement("canvas");
//         canvas.width = img.width;
//         canvas.height = img.height;
//         const ctx = canvas.getContext("2d");
//         ctx.drawImage(img, 0, 0);
//         try {
//           const cv = window.cv;
//           let src = cv.imread(canvas);
//           let gray = new cv.Mat();
//           cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
//           let blurred = new cv.Mat();
//           cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
//           let edged = new cv.Mat();
//           cv.Canny(blurred, edged, 75, 200);
//           let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
//           cv.dilate(edged, edged, kernel);
//           cv.erode(edged, edged, kernel);
//           kernel.delete();
//           let contours = new cv.MatVector();
//           let hierarchy = new cv.Mat();
//           cv.findContours(edged, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
//           let maxQuadArea = 0;
//           let quadContour = null;
//           for (let i = 0; i < contours.size(); i++) {
//             let cnt = contours.get(i);
//             let peri = cv.arcLength(cnt, true);
//             let approx = new cv.Mat();
//             cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
//             if (approx.rows === 4) {
//               let area = cv.contourArea(approx);
//               if (area > maxQuadArea) {
//                 maxQuadArea = area;
//                 if (quadContour) quadContour.delete();
//                 quadContour = approx.clone();
//               }
//             }
//             approx.delete();
//           }
//           let rect;
//           if (quadContour) {
//             rect = cv.boundingRect(quadContour);
//             quadContour.delete();
//           } else {
//             let maxArea = 0;
//             let maxContour = null;
//             for (let i = 0; i < contours.size(); i++) {
//               let cnt = contours.get(i);
//               let area = cv.contourArea(cnt);
//               if (area > maxArea) {
//                 maxArea = area;
//                 maxContour = cnt;
//               }
//             }
//             if (maxContour) {
//               rect = cv.boundingRect(maxContour);
//             } else {
//               rect = { x: 0, y: 0, width: canvas.width, height: canvas.height };
//             }
//           }
//           src.delete();
//           gray.delete();
//           blurred.delete();
//           edged.delete();
//           contours.delete();
//           hierarchy.delete();
//           resolve(rect);
//         } catch (error) {
//           reject(error);
//         }
//       };
//       img.onerror = (err) => reject(err);
//     });

//   useEffect(() => {
//     if (imageSrc) {
//       detectCropBox(imageSrc)
//         .then((rect) => setDetectedCropBox(rect))
//         .catch((err) => {
//           console.error("Crop box detection failed:", err);
//           setDetectedCropBox(null);
//         });
//     }
//   }, [imageSrc]);

//   const handleCapture = () => {
//     const capturedImage = webcamRef.current?.getScreenshot();
//     if (capturedImage) {
//       setImageSrc(capturedImage);
//       setIsCaptureMode(false);
//       setShowCropper(true);
//     }
//   };

//   const handleUpload = (e) => {
//     const file = e.target.files[0];
//     if (!file) return;
//     const reader = new FileReader();
//     reader.onload = () => {
//       setImageSrc(reader.result);
//       setShowCropper(true);
//     };
//     reader.readAsDataURL(file);
//   };

//   const triggerFileInput = () => {
//     fileInputRef.current?.click();
//   };

//   const toggleCamera = () => {
//     setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
//   };

//   const handleCropComplete = async () => {
//     if (!cropperRef.current) return;
//     const cropper = cropperRef.current.cropper;
//     const croppedCanvas = cropper.getCroppedCanvas({ width: 800, height: 800 });
//     const croppedDataUrl = croppedCanvas.toDataURL("image/jpeg", 1.0);

//     setIsScanning(true);
//     const startTime = Date.now();

//     const image = new Image();
//     image.src = croppedDataUrl;
//     try {
//       await new Promise((res, rej) => {
//         image.onload = res;
//         image.onerror = rej;
//       });
//     } catch (err) {
//       toast.error("Error loading cropped image. Please try again.");
//       setIsScanning(false);
//       return;
//     }

//     // For passport or aadhaar-card, require face detection:
//     if (idType === "passport" || idType === "aadhaar-card") {
//       const detection = await faceapi.detectSingleFace(
//         image,
//         new faceapi.TinyFaceDetectorOptions()
//       );
//       const elapsed = Date.now() - startTime;
//       if (elapsed < MINIMUM_SCANNING_TIME) {
//         await new Promise((r) => setTimeout(r, MINIMUM_SCANNING_TIME - elapsed));
//       }
//       if (!detection) {
//         toast.error("No face detected in the document. Please retake or recapture.");
//         setIsScanning(false);
//         return;
//       }
//     }

//     setIsScanning(false);
//     setShowCropper(false);
//     setCroppedImage(croppedDataUrl);
//   };

//   const handleRetake = () => {
//     setImageSrc(null);
//     setCroppedImage(null);
//     setShowCropper(false);
//     setIsCaptureMode(false);
//     setIsImageConfirmed(false);
//     setDetectedCropBox(null);
//   };

//   const handleConfirmImage = () => {
//     setIsImageConfirmed(true);
//   };

//   return (
//     <div
//       className="min-h-screen flex items-center justify-center p-4 sm:p-6"
//       style={{
//         background: "linear-gradient(135deg, #0F2027 0%, #203A43 50%, #2C5364 100%)",
//         backgroundSize: "400% 400%",
//         animation: "gradient 15s ease infinite",
//       }}
//     >
//       <Grow in={true} timeout={700}>
//         <Paper
//           className="w-full max-w-xl relative overflow-hidden"
//           elevation={12}
//           style={{
//             borderRadius: "1.5rem",
//             backgroundColor: "rgba(255, 255, 255, 0.95)",
//             backdropFilter: "blur(12px)",
//             boxShadow: "0 20px 60px rgba(0, 0, 0, 0.15), 0 0 40px rgba(10, 37, 64, 0.2) inset",
//             padding: isSmallScreen ? "1.5rem" : "2rem",
//           }}
//         >
//           {isScanning && (
//             <Fade in={isScanning}>
//               <Box sx={scanningOverlayStyle}>
//                 <CircularProgress 
//                   variant="determinate" 
//                   value={scanningProgress} 
//                   size={80} 
//                   thickness={4} 
//                   sx={{ 
//                     color: "#4F46E5",
//                     "& .MuiCircularProgress-circle": {
//                       strokeLinecap: "round",
//                     }
//                   }} 
//                 />
//                 <Typography
//                   variant="h6"
//                   sx={{
//                     color: "#fff",
//                     mt: 3,
//                     fontWeight: "bold",
//                     textShadow: "0 2px 10px rgba(0,0,0,0.5)",
//                     letterSpacing: "0.5px",
//                   }}
//                 >
//                   Analyzing {getDocumentName()}...
//                 </Typography>
//                 <Typography
//                   variant="subtitle1"
//                   sx={{
//                     color: "#fff",
//                     opacity: 0.85,
//                     mt: 1,
//                     fontStyle: "italic",
//                     textShadow: "0 2px 8px rgba(0,0,0,0.3)",
//                   }}
//                 >
//                   Please hold still
//                 </Typography>
//               </Box>
//             </Fade>
//           )}

//           <Box sx={{ 
//             display: "flex", 
//             flexDirection: "column", 
//             alignItems: "center", 
//             position: "relative",
//             zIndex: 1,
//           }}>
//             {/* Header */}
//             <Avatar
//               sx={{
//                 bgcolor: "#4F46E5",
//                 width: 56,
//                 height: 56,
//                 mb: 2,
//                 boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
//               }}
//             >
//               <CameraAltOutlined />
//             </Avatar>
            
//             <Typography
//               variant="h5"
//               align="center"
//               sx={{
//                 mb: 2,
//                 fontWeight: 700,
//                 background: "linear-gradient(to right, #1E3A8A, #4F46E5)",
//                 backgroundClip: "text",
//                 textFillColor: "transparent",
//                 WebkitBackgroundClip: "text",
//                 WebkitTextFillColor: "transparent",
//                 letterSpacing: "0.5px",
//               }}
//             >
//               {getDocumentName()} Verification
//             </Typography>

//             {!imageSrc && !isCaptureMode && (
//               <Fade in={!imageSrc && !isCaptureMode} timeout={800}>
//                 <Box>
//                   <Box sx={{ 
//                     textAlign: "center", 
//                     mb: 3, 
//                     p: 2, 
//                     borderRadius: "1rem",
//                     backgroundColor: "rgba(79, 70, 229, 0.08)", 
//                     border: "1px solid rgba(79, 70, 229, 0.2)"
//                   }}>
//                     <Typography 
//                       variant="body1" 
//                       sx={{ 
//                         color: "#4B5563", 
//                         fontSize: 16, 
//                         fontWeight: 500,
//                         lineHeight: 1.5
//                       }}>
//                       {getInstructionText()}
//                     </Typography>
//                   </Box>
//                   <Box className="flex justify-center mb-4">{renderAnimation()}</Box>
//                 </Box>
//               </Fade>
//             )}

//             {/* Document selection buttons */}
//             {!imageSrc && !showCropper && !isImageConfirmed && !isCaptureMode && (
//               <Fade in={!imageSrc && !showCropper && !isImageConfirmed && !isCaptureMode} timeout={800}>
//                 <Box sx={{ 
//                   display: "flex", 
//                   justifyContent: "center", 
//                   gap: 2, 
//                   mt: 2,
//                   width: "100%",
//                 }}>
//                   <input
//                     ref={fileInputRef}
//                     type="file"
//                     accept="image/*"
//                     hidden
//                     onChange={handleUpload}
//                   />
                  
//                   {isSmallScreen ? (
//                     <Button
//                       variant="contained"
//                       fullWidth
//                       color="primary"
//                       component="label"
//                       startIcon={<CameraAltOutlined />}
//                       sx={{
//                         borderRadius: "0.75rem",
//                         textTransform: "none",
//                         py: 1.5,
//                         fontWeight: 600,
//                         boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
//                         background: "linear-gradient(to right, #4F46E5, #7C3AED)",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           background: "linear-gradient(to right, #4338CA, #6D28D9)",
//                           boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)",
//                           transform: "translateY(-2px)",
//                         }
//                       }}
//                     >
//                       Capture {getDocumentName()}
//                       <input
//                         type="file"
//                         accept="image/*"
//                         capture="environment"
//                         hidden
//                         onChange={handleUpload}
//                       />
//                     </Button>
//                   ) : (
//                     <>
//                       <Button
//                         variant="outlined"
//                         color="primary"
//                         startIcon={<BackupOutlined />}
//                         onClick={triggerFileInput}
//                         sx={{
//                           borderRadius: "0.75rem",
//                           textTransform: "none",
//                           py: 1.5,
//                           px: 3,
//                           fontWeight: 600,
//                           borderWidth: 2,
//                           borderColor: "#4F46E5",
//                           color: "#4F46E5",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             borderColor: "#4338CA",
//                             backgroundColor: "rgba(79, 70, 229, 0.05)",
//                             transform: "translateY(-2px)",
//                           }
//                         }}
//                       >
//                         Upload
//                       </Button>
//                       <Button
//                         variant="contained"
//                         color="primary"
//                         startIcon={<CameraAltOutlined />}
//                         sx={{
//                           borderRadius: "0.75rem",
//                           textTransform: "none",
//                           py: 1.5,
//                           px: 3,
//                           fontWeight: 600,
//                           boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
//                           background: "linear-gradient(to right, #4F46E5, #7C3AED)",
//                           transition: "all 0.3s ease",
//                           "&:hover": {
//                             background: "linear-gradient(to right, #4338CA, #6D28D9)",
//                             boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)",
//                             transform: "translateY(-2px)",
//                           }
//                         }}
//                         onClick={() => setIsCaptureMode(true)}
//                       >
//                         Take Photo
//                       </Button>
//                     </>
//                   )}
//                 </Box>
//               </Fade>
//             )}

//             {/* Webcam mode */}
//             {!isSmallScreen && isCaptureMode && !imageSrc && !isScanning && (
//               <Fade in={!isSmallScreen && isCaptureMode && !imageSrc && !isScanning} timeout={500}>
//                 <div className="relative w-full mx-auto" style={{ maxWidth: "640px" }}>
//                   <Paper 
//                     elevation={6} 
//                     sx={{ 
//                       borderRadius: "1rem", 
//                       overflow: "hidden",
//                       border: "4px solid #4F46E5",
//                     }}
//                   >
//                     <Webcam
//                       ref={webcamRef}
//                       audio={false}
//                       screenshotFormat="image/jpeg"
//                       className="w-full"
//                       videoConstraints={{ facingMode }}
//                     />
//                   </Paper>
                  
//                   <Box sx={{ 
//                     display: "flex", 
//                     justifyContent: "center", 
//                     gap: 2, 
//                     mt: 3 
//                   }}>
//                     <IconButton
//                       color="success"
//                       onClick={handleCapture}
//                       sx={{
//                         width: 56,
//                         height: 56,
//                         backgroundColor: "rgba(16,185,129,0.15)",
//                         boxShadow: "0 4px 10px rgba(16,185,129,0.3)",
//                         transition: "all 0.2s ease",
//                         "&:hover": { 
//                           backgroundColor: "rgba(16,185,129,0.25)",
//                           transform: "scale(1.05)"
//                         }
//                       }}
//                     >
//                       <CheckCircleIcon sx={{ fontSize: 30, color: "#10B981" }} />
//                     </IconButton>
//                     <IconButton
//                       color="error"
//                       onClick={() => setIsCaptureMode(false)}
//                       sx={{
//                         width: 56,
//                         height: 56,
//                         backgroundColor: "rgba(239,68,68,0.15)",
//                         boxShadow: "0 4px 10px rgba(239,68,68,0.3)",
//                         transition: "all 0.2s ease",
//                         "&:hover": { 
//                           backgroundColor: "rgba(239,68,68,0.25)",
//                           transform: "scale(1.05)"
//                         }
//                       }}
//                     >
//                       <CancelIcon sx={{ fontSize: 30, color: "#EF4444" }} />
//                     </IconButton>
//                     <IconButton
//                       onClick={toggleCamera}
//                       sx={{
//                         width: 56,
//                         height: 56,
//                         backgroundColor: "rgba(59,130,246,0.15)",
//                         boxShadow: "0 4px 10px rgba(59,130,246,0.3)",
//                         transition: "all 0.2s ease",
//                         "&:hover": { 
//                           backgroundColor: "rgba(59,130,246,0.25)",
//                           transform: "scale(1.05)"
//                         }
//                       }}
//                     >
//                       <FlipCameraIosIcon sx={{ fontSize: 30, color: "#3B82F6" }} />
//                     </IconButton>
//                   </Box>
//                 </div>
//               </Fade>
//             )}

//             {/* Cropper */}
//             {showCropper && imageSrc && !isScanning && (
//               <Fade in={showCropper && imageSrc && !isScanning} timeout={500}>
//                 <Box sx={{ width: "100%" }}>
//                   <Typography 
//                     variant="subtitle1" 
//                     align="center" 
//                     sx={{ 
//                       mb: 2, 
//                       fontWeight: 600,
//                       color: "#4F46E5"
//                     }}
//                   >
//                     Adjust document position
//                   </Typography>
                  
//                   <Paper 
//                     elevation={8} 
//                     sx={{ 
//                       borderRadius: "1rem", 
//                       overflow: "hidden", 
//                       border: "3px solid #4F46E5",
//                     }}
//                   >
//                     <Cropper
//                       src={imageSrc}
//                       style={{ height: "360px", width: "100%" }}
//                       autoCropArea={1}
//                       guides={true}
//                       ref={cropperRef}
//                       viewMode={2}
//                       dragMode="move"
//                       background={false}
//                       ready={() => {
//                         if (detectedCropBox && cropperRef.current) {
//                           const cropper = cropperRef.current.cropper;
//                           const imageData = cropper.getImageData();
//                           const scale = imageData.width / imageData.naturalWidth;
//                           cropper.setCropBoxData({
//                             left: detectedCropBox.x * scale,
//                             top: detectedCropBox.y * scale,
//                             width: detectedCropBox.width * scale,
//                             height: detectedCropBox.height * scale,
//                           });
//                         }
//                       }}
//                     />
//                   </Paper>
                  
//                   <Box sx={{ 
//                     display: "flex", 
//                     justifyContent: "center", 
//                     gap: 2, 
//                     mt: 3 
//                   }}>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={handleCropComplete}
//                       sx={{ 
//                         textTransform: "none", 
//                         borderRadius: "0.75rem",
//                         py: 1.2,
//                         fontWeight: 600,
//                         boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
//                         background: "linear-gradient(to right, #4F46E5, #7C3AED)",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           background: "linear-gradient(to right, #4338CA, #6D28D9)",
//                           boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)",
//                           transform: "translateY(-2px)",
//                         }
//                       }}
//                     >
//                       Confirm & Process
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={handleRetake}
//                       sx={{ 
//                         textTransform: "none", 
//                         borderRadius: "0.75rem",
//                         py: 1.2,
//                         fontWeight: 600,
//                         borderWidth: 2,
//                         borderColor: "#EF4444",
//                         color: "#EF4444",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           borderColor: "#DC2626",
//                           backgroundColor: "rgba(239, 68, 68, 0.05)",
//                           transform: "translateY(-2px)",
//                         }
//                       }}
//                     >
//                       Try Again
//                     </Button>
//                   </Box>
//                 </Box>
//               </Fade>
//             )}

//             {/* Preview & Confirm */}
//             {croppedImage && !isImageConfirmed && (
//               <Fade in={croppedImage && !isImageConfirmed} timeout={800}>
//                 <Box sx={{ 
//                   display: "flex", 
//                   flexDirection: "column", 
//                   alignItems: "center", 
//                   mt: 3,
//                   width: "100%"
//                 }}>
//                   <Typography 
//                     variant="h6" 
//                     sx={{ 
//                       mb: 3, 
//                       fontWeight: 600,
//                       color: "#4F46E5"
//                     }}
//                   >
//                     Confirm {getDocumentName()}
//                   </Typography>
                  
//                   <Paper
//                     elevation={12}
//                     sx={{ 
//                       p: 1, 
//                       borderRadius: "1rem", 
//                       backgroundColor: "#fff",
//                       maxWidth: "280px",
//                       border: "3px solid #4F46E5",
//                       boxShadow: "0 10px 25px rgba(79, 70, 229, 0.2)"
//                     }}
//                   >
//                     <img
//                       src={croppedImage}
//                       alt="Cropped Preview"
//                       style={{ 
//                         borderRadius: "0.5rem", 
//                         width: "100%",
//                         height: "auto" 
//                       }}
//                     />
//                   </Paper>
                  
//                   <Typography 
//                     variant="body2" 
//                     color="textSecondary" 
//                     sx={{ mt: 2, mb: 3, textAlign: "center" }}
//                   >
//                     Please confirm that all information is clearly visible and readable
//                   </Typography>
                  
//                   <Box sx={{ display: "flex", gap: 3, mt: 1 }}>
//                     <Button
//                       variant="contained"
//                       color="success"
//                       onClick={handleConfirmImage}
//                       startIcon={<CheckCircleIcon />}
//                       sx={{
//                         borderRadius: "0.75rem",
//                         textTransform: "none",
//                         py: 1.2,
//                         px: 3,
//                         fontWeight: 600,
//                         backgroundColor: "#10B981",
//                         boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
//                         "&:hover": {
//                           backgroundColor: "#059669",
//                           boxShadow: "0 6px 20px rgba(16, 185, 129, 0.5)",
//                         }
//                       }}
//                     >
//                       Confirm
//                     </Button>
//                     <Button
//                       variant="outlined"
//                       color="error"
//                       onClick={handleRetake}
//                       startIcon={<CancelIcon />}
//                       sx={{
//                         borderRadius: "0.75rem",
//                         textTransform: "none",
//                         py: 1.2,
//                         px: 3,
//                         fontWeight: 600,
//                         borderWidth: 2,
//                         borderColor: "#EF4444",
//                         color: "#EF4444",
//                         "&:hover": {
//                           borderColor: "#DC2626",
//                           backgroundColor: "rgba(239, 68, 68, 0.05)",
//                         }
//                       }}
//                     >
//                       Retake
//                     </Button>
//                   </Box>
//                 </Box>
//               </Fade>
//             )}

//             {/* Submit */}
//             {isImageConfirmed && (
//               <Fade in={isImageConfirmed} timeout={800}>
//                 <Box sx={{ 
//                   display: "flex", 
//                   flexDirection: "column",
//                   alignItems: "center",
//                   width: "100%", 
//                   mt: 3
//                 }}>
//                   <Paper
//                     elevation={8}
//                     sx={{ 
//                       p: 4,
//                       borderRadius: "1rem", 
//                       backgroundColor: "rgba(79, 70, 229, 0.08)",
//                       border: "1px solid rgba(79, 70, 229, 0.2)",
//                       mb: 4,
//                       width: "100%",
//                       textAlign: "center"
//                     }}
//                   >
//                     <CheckCircleIcon sx={{ 
//                       fontSize: 56, 
//                       color: "#10B981",
//                       mb: 2
//                     }} />
//                     <Typography 
//                       variant="h6" 
//                       sx={{ 
//                         fontWeight: 600,
//                         color: "#111827",
//                         mb: 1
//                       }}
//                     >
//                       Document Verified
//                     </Typography>
//                     <Typography 
//                       variant="body1" 
//                       sx={{ 
//                         color: "#4B5563",
//                         mb: 3
//                       }}
//                     >
//                       Your {getDocumentName()} has been successfully processed and is ready for submission
//                     </Typography>
//                     <Button
//                       variant="contained"
//                       color="primary"
//                       onClick={() => onNext(croppedImage)}
//                       endIcon={<ChevronRight />}
//                       sx={{
//                         borderRadius: "0.75rem",
//                         textTransform: "none",
//                         py: 1.5,
//                         px: 5,
//                         fontWeight: 600,
//                         boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
//                         background: "linear-gradient(to right, #4F46E5, #7C3AED)",
//                         transition: "all 0.3s ease",
//                         "&:hover": {
//                           background: "linear-gradient(to right, #4338CA, #6D28D9)",
//                           boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)",
//                           transform: "translateY(-2px)",
//                         }
//                       }}
//                     >
//                       Continue
//                     </Button>
//                   </Paper>
//                 </Box>
//               </Fade>
//             )}
//           </Box>
          
//           {/* Decorative elements */}
//           <div 
//             style={{
//               position: "absolute",
//               top: -30,
//               right: -30,
//               width: "150px",
//               height: "150px",
//               borderRadius: "50%",
//               background: "linear-gradient(135deg, rgba(79, 70, 229, 0.2), rgba(124, 58, 237, 0.2))",
//               zIndex: 0,
//               filter: "blur(30px)"
//             }}
//           />
//           <div 
//             style={{
//               position: "absolute",
//               bottom: -40,
//               left: -40,
//               width: "180px",
//               height: "180px",
//               borderRadius: "50%",
//               background: "linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(59, 130, 246, 0.15))",
//               zIndex: 0,
//               filter: "blur(40px)"
//             }}
//           />
//         </Paper>
//       </Grow>
      
//       {/* Global styles for animation */}
//       <style jsx global>{`
//         @keyframes gradient {
//           0% { background-position: 0% 50%; }
//           50% { background-position: 100% 50%; }
//           100% { background-position: 0% 50%; }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default DocumentUpload;



import React, { useState, useRef, useEffect } from "react";
import Webcam from "react-webcam";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";
import {
  Box,
  Typography,
  Paper,
  Button,
  IconButton,
  useMediaQuery,
  CircularProgress,
  Avatar,
  Fade,
  Grow,
  Stepper,
  Step,
  StepLabel
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import FlipCameraIosIcon from "@mui/icons-material/FlipCameraIos";
import { 
  ChevronRight, 
  BackupOutlined, 
  CameraAltOutlined,
  AccountBalanceWalletOutlined,
  Person
} from "@mui/icons-material";
import Lottie from "react-lottie-player";
import * as faceapi from "face-api.js";
import toast from "react-hot-toast";

// Example Lottie animations
import ocrIDFront from "../assets/ocr_id_front.json";
import ocrPassportFront from "../assets/ocr_passport.json";
import { useMeQuery } from "../features/api/usersApiSlice";

const MINIMUM_SCANNING_TIME = 2000; // 2 seconds

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

const PassportLottie = () => (
  <Lottie
    loop
    animationData={ocrPassportFront}
    play
    style={{ width: "280px", height: "280px", background: "transparent" }}
  />
);

const IDFrontLottie = () => (
  <Lottie
    loop
    animationData={ocrIDFront}
    play
    style={{ width: "280px", height: "280px", background: "transparent" }}
  />
);

const DocumentUpload = ({ onNext }) => {
  // State for the multi-step process
  const [activeStep, setActiveStep] = useState(0);
  const [completedSteps, setCompletedSteps] = useState([]);
  const [capturedImages, setCapturedImages] = useState({
    idCard: null,
    aadhaarCard: null,
    passportPhoto: null
  });
  
  // Common states for all document types
  const [imageSrc, setImageSrc] = useState(null);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState(null);
  const [isCaptureMode, setIsCaptureMode] = useState(false);
  const [isImageConfirmed, setIsImageConfirmed] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [detectedCropBox, setDetectedCropBox] = useState(null);
  const [idType, setIdType] = useState(null);
  const [scanningProgress, setScanningProgress] = useState(0);
  const [currentDocType, setCurrentDocType] = useState("idCard");
  const { data: me } = useMeQuery();
  
  useEffect(() => {
    if (me) {
      setIdType(me.kycs?.[me.kycs.length - 1]?.idType?.toLowerCase() || "passport");
    }
  }, [me]);
  
  const [facingMode, setFacingMode] = useState("environment");
  const webcamRef = useRef(null);
  const cropperRef = useRef(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  const isSmallScreen = useMediaQuery("(max-width:600px)");

  // Steps for the document upload process
  const steps = [
    {
      id: "idCard",
      label: "ID Verification",
      description: "Upload or take a photo of your primary ID"
    },
    {
      id: "aadhaarCard",
      label: "Aadhaar Card",
      description: "Upload or take a photo of your Aadhaar card"
    },
    {
      id: "passportPhoto",
      label: "Passport Photo",
      description: "Upload or take a passport-size photo of yourself"
    }
  ];

  // Load face detection model
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

  // Set current document type based on active step
  useEffect(() => {
    setCurrentDocType(steps[activeStep].id);
  }, [activeStep]);

  const moveToNextStep = () => {
    // Store the current document's image
    setCapturedImages(prev => ({
      ...prev,
      [currentDocType]: croppedImage
    }));
    
    // Add current step to completed steps
    setCompletedSteps(prev => [...prev, currentDocType]);
    
    // If we're on the last step, submit all images
    if (activeStep === steps.length - 1) {
      const allImages = {
        ...capturedImages,
        [currentDocType]: croppedImage
      };
      console.log("All images captured:", allImages);
      onNext(allImages);

    } else {
      // Reset states for the next document
      setActiveStep(prev => prev + 1);
      setImageSrc(null);
      setCroppedImage(null);
      setShowCropper(false);
      setIsCaptureMode(false);
      setIsImageConfirmed(false);
      setDetectedCropBox(null);
    }
  };

  const getInstructionText = () => {
    if (currentDocType === "passportPhoto") {
      return "Take a clear passport-size photo with a neutral expression and plain background.";
    }
    
    if (currentDocType === "aadhaarCard") {
      return "Place your Aadhaar card on a flat surface with good lighting to ensure all details are captured.";
    }
    
    if (idType === "passport") {
      return "Position your passport info page within the frame, ensuring all details are clearly visible.";
    }
    if (idType === "aadhaar-card") {
      return "Place your Aadhaar card on a flat surface with good lighting to ensure all details are captured.";
    }
    if (idType === "pan-card") {
      return "Position your PAN card within the frame, making sure all text is clearly readable.";
    }
    if (idType === "dl") {
      return "Capture the front side of your Driving License with all information clearly visible.";
    }
    if (idType === "voter-id") {
      return "Ensure your Voter ID is positioned flat with all details clearly visible in the frame.";
    }
    return "Position your document within the frame ensuring all details are clearly visible and free from glare.";
  };

  const getDocumentName = () => {
    if (currentDocType === "passportPhoto") {
      return "Passport Photo";
    }
    if (currentDocType === "aadhaarCard") {
      return "Aadhaar Card";
    }
    
    if (idType === "passport") return "Passport";
    if (idType === "aadhaar-card") return "Aadhaar Card";
    if (idType === "pan") return "PAN Card";
    if (idType === "dl") return "Driving License";
    if (idType === "voter-id") return "Voter ID";
    return "Document";
  };

  const getDocumentIcon = () => {
    if (currentDocType === "passportPhoto") {
      return <Person />;
    }
    if (currentDocType === "aadhaarCard") {
      return <AccountBalanceWalletOutlined />;
    }
    
    return <CameraAltOutlined />;
  };

  const renderAnimation = () => {
    if (currentDocType === "passportPhoto") {
      return null; // No animation for passport photo
    }
    
    if (currentDocType === "aadhaarCard" || idType === "aadhaar-card") {
      return <IDFrontLottie />;
    }
    
    if (idType === "passport") {
      return <PassportLottie />;
    }
    
    return <IDFrontLottie />;
  };

  const detectCropBox = (srcImage) =>
    new Promise((resolve, reject) => {
      if (!window.cv) {
        reject(new Error("OpenCV not loaded. Ensure 'cv' is available on window."));
        return;
      }
      const img = new Image();
      img.src = srcImage;
      img.onload = () => {
        const canvas = document.createElement("canvas");
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(img, 0, 0);
        try {
          const cv = window.cv;
          let src = cv.imread(canvas);
          let gray = new cv.Mat();
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);
          let blurred = new cv.Mat();
          cv.GaussianBlur(gray, blurred, new cv.Size(5, 5), 0, 0, cv.BORDER_DEFAULT);
          let edged = new cv.Mat();
          cv.Canny(blurred, edged, 75, 200);
          let kernel = cv.getStructuringElement(cv.MORPH_RECT, new cv.Size(5, 5));
          cv.dilate(edged, edged, kernel);
          cv.erode(edged, edged, kernel);
          kernel.delete();
          let contours = new cv.MatVector();
          let hierarchy = new cv.Mat();
          cv.findContours(edged, contours, hierarchy, cv.RETR_LIST, cv.CHAIN_APPROX_SIMPLE);
          let maxQuadArea = 0;
          let quadContour = null;
          for (let i = 0; i < contours.size(); i++) {
            let cnt = contours.get(i);
            let peri = cv.arcLength(cnt, true);
            let approx = new cv.Mat();
            cv.approxPolyDP(cnt, approx, 0.02 * peri, true);
            if (approx.rows === 4) {
              let area = cv.contourArea(approx);
              if (area > maxQuadArea) {
                maxQuadArea = area;
                if (quadContour) quadContour.delete();
                quadContour = approx.clone();
              }
            }
            approx.delete();
          }
          let rect;
          if (quadContour) {
            rect = cv.boundingRect(quadContour);
            quadContour.delete();
          } else {
            let maxArea = 0;
            let maxContour = null;
            for (let i = 0; i < contours.size(); i++) {
              let cnt = contours.get(i);
              let area = cv.contourArea(cnt);
              if (area > maxArea) {
                maxArea = area;
                maxContour = cnt;
              }
            }
            if (maxContour) {
              rect = cv.boundingRect(maxContour);
            } else {
              rect = { x: 0, y: 0, width: canvas.width, height: canvas.height };
            }
          }
          src.delete();
          gray.delete();
          blurred.delete();
          edged.delete();
          contours.delete();
          hierarchy.delete();
          resolve(rect);
        } catch (error) {
          reject(error);
        }
      };
      img.onerror = (err) => reject(err);
    });

  useEffect(() => {
    if (imageSrc && currentDocType !== "passportPhoto") {
      detectCropBox(imageSrc)
        .then((rect) => setDetectedCropBox(rect))
        .catch((err) => {
          console.error("Crop box detection failed:", err);
          setDetectedCropBox(null);
        });
    }
  }, [imageSrc, currentDocType]);

  const handleCapture = () => {
    const capturedImage = webcamRef.current?.getScreenshot();
    if (capturedImage) {
      setImageSrc(capturedImage);
      setIsCaptureMode(false);
      setShowCropper(true);
    }
  };

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      setImageSrc(reader.result);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const triggerCameraInput = () => {
    cameraInputRef.current?.click();
  };

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const handleCropComplete = async () => {
    if (!cropperRef.current) return;
    const cropper = cropperRef.current.cropper;
    const croppedCanvas = cropper.getCroppedCanvas({ width: 800, height: 800 });
    const croppedDataUrl = croppedCanvas.toDataURL("image/jpeg", 1.0);

    setIsScanning(true);
    const startTime = Date.now();

    const image = new Image();
    image.src = croppedDataUrl;
    try {
      await new Promise((res, rej) => {
        image.onload = res;
        image.onerror = rej;
      });
    } catch (err) {
      toast.error("Error loading cropped image. Please try again.");
      setIsScanning(false);
      return;
    }

    // For passport photo and ID cards with faces, require face detection
    if (currentDocType === "passportPhoto" || idType === "passport" || idType === "aadhaar-card") {
      const detection = await faceapi.detectSingleFace(
        image,
        new faceapi.TinyFaceDetectorOptions()
      );
      const elapsed = Date.now() - startTime;
      if (elapsed < MINIMUM_SCANNING_TIME) {
        await new Promise((r) => setTimeout(r, MINIMUM_SCANNING_TIME - elapsed));
      }
      if (!detection) {
        toast.error("No face detected in the image. Please retake or recapture.");
        setIsScanning(false);
        return;
      }
    }

    setIsScanning(false);
    setShowCropper(false);
    setCroppedImage(croppedDataUrl);
  };

  const handleRetake = () => {
    setImageSrc(null);
    setCroppedImage(null);
    setShowCropper(false);
    setIsCaptureMode(false);
    setIsImageConfirmed(false);
    setDetectedCropBox(null);
  };

  const handleConfirmImage = () => {
    setIsImageConfirmed(true);
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 sm:p-6"
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
                  Analyzing {getDocumentName()}...
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

          <Box sx={{ 
            display: "flex", 
            flexDirection: "column", 
            alignItems: "center", 
            position: "relative",
            zIndex: 1,
          }}>
            {/* Stepper */}
            <Box sx={{ width: '100%', mb: 3 }}>
              <Stepper activeStep={activeStep} alternativeLabel>
                {steps.map((step) => (
                  <Step key={step.id} completed={completedSteps.includes(step.id)}>
                    <StepLabel>{step.label}</StepLabel>
                  </Step>
                ))}
              </Stepper>
            </Box>
            
            {/* Header */}
            <Avatar
              sx={{
                bgcolor: "#4F46E5",
                width: 56,
                height: 56,
                mb: 2,
                boxShadow: "0 4px 12px rgba(79, 70, 229, 0.4)",
              }}
            >
              {getDocumentIcon()}
            </Avatar>
            
            <Typography
              variant="h5"
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
              {getDocumentName()} Upload
            </Typography>

            {!imageSrc && !isCaptureMode && (
              <Fade in={!imageSrc && !isCaptureMode} timeout={800}>
                <Box>
                  <Box sx={{ 
                    textAlign: "center", 
                    mb: 3, 
                    p: 2, 
                    borderRadius: "1rem",
                    backgroundColor: "rgba(79, 70, 229, 0.08)", 
                    border: "1px solid rgba(79, 70, 229, 0.2)"
                  }}>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: "#4B5563", 
                        fontSize: 16, 
                        fontWeight: 500,
                        lineHeight: 1.5
                      }}
                    >
                      {getInstructionText()}
                    </Typography>
                  </Box>
                  {renderAnimation() && (
                    <Box className="flex justify-center mb-4">{renderAnimation()}</Box>
                  )}
                </Box>
              </Fade>
            )}

            {/* Document selection buttons */}
            {!imageSrc && !showCropper && !isImageConfirmed && !isCaptureMode && (
              <Fade in={!imageSrc && !showCropper && !isImageConfirmed && !isCaptureMode} timeout={800}>
                <Box sx={{ 
                  display: "flex", 
                  justifyContent: "center", 
                  gap: 2, 
                  mt: 2,
                  width: "100%",
                  flexDirection: isSmallScreen ? "column" : "row"
                }}>
                  {/* Hidden inputs for file and camera */}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleUpload}
                  />
                  <input
                    ref={cameraInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    hidden
                    onChange={handleUpload}
                  />
                  
                  {isSmallScreen ? (
                    <>
                      <Button
                        variant="outlined"
                        fullWidth
                        color="primary"
                        startIcon={<BackupOutlined />}
                        onClick={triggerFileInput}
                        sx={{
                          borderRadius: "0.75rem",
                          textTransform: "none",
                          py: 1.5,
                          fontWeight: 600,
                          borderWidth: 2,
                          borderColor: "#4F46E5",
                          color: "#4F46E5",
                          mb: 2,
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: "#4338CA",
                            backgroundColor: "rgba(79, 70, 229, 0.05)",
                            transform: "translateY(-2px)",
                          }
                        }}
                      >
                        Upload from Gallery
                      </Button>
                      <Button
                        variant="contained"
                        fullWidth
                        color="primary"
                        startIcon={<CameraAltOutlined />}
                        onClick={triggerCameraInput}
                        sx={{
                          borderRadius: "0.75rem",
                          textTransform: "none",
                          py: 1.5,
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
                        Take Photo
                      </Button>
                    </>
                  ) : (
                    <>
                      <Button
                        variant="outlined"
                        color="primary"
                        startIcon={<BackupOutlined />}
                        onClick={triggerFileInput}
                        sx={{
                          borderRadius: "0.75rem",
                          textTransform: "none",
                          py: 1.5,
                          px: 3,
                          fontWeight: 600,
                          borderWidth: 2,
                          borderColor: "#4F46E5",
                          color: "#4F46E5",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            borderColor: "#4338CA",
                            backgroundColor: "rgba(79, 70, 229, 0.05)",
                            transform: "translateY(-2px)",
                          }
                        }}
                      >
                        Upload
                      </Button>
                      <Button
                        variant="contained"
                        color="primary"
                        startIcon={<CameraAltOutlined />}
                        sx={{
                          borderRadius: "0.75rem",
                          textTransform: "none",
                          py: 1.5,
                          px: 3,
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
                        onClick={() => setIsCaptureMode(true)}
                      >
                        Take Photo
                      </Button>
                    </>
                  )}
                </Box>
              </Fade>
            )}

            {/* Webcam mode */}
            {!isSmallScreen && isCaptureMode && !imageSrc && !isScanning && (
              <Fade in={!isSmallScreen && isCaptureMode && !imageSrc && !isScanning} timeout={500}>
                <div className="relative w-full mx-auto" style={{ maxWidth: "640px" }}>
                  <Paper 
                    elevation={6} 
                    sx={{ 
                      borderRadius: "1rem", 
                      overflow: "hidden",
                      border: "4px solid #4F46E5",
                    }}
                  >
                    <Webcam
                      ref={webcamRef}
                      audio={false}
                      screenshotFormat="image/jpeg"
                      className="w-full"
                      videoConstraints={{ facingMode }}
                    />
                  </Paper>
                  
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    gap: 2, 
                    mt: 3 
                  }}>
                    <IconButton
                      color="success"
                      onClick={handleCapture}
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: "rgba(16,185,129,0.15)",
                        boxShadow: "0 4px 10px rgba(16,185,129,0.3)",
                        transition: "all 0.2s ease",
                        "&:hover": { 
                          backgroundColor: "rgba(16,185,129,0.25)",
                          transform: "scale(1.05)"
                        }
                      }}
                    >
                      <CheckCircleIcon sx={{ fontSize: 30, color: "#10B981" }} />
                    </IconButton>
                    <IconButton
                      color="error"
                      onClick={() => setIsCaptureMode(false)}
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: "rgba(239,68,68,0.15)",
                        boxShadow: "0 4px 10px rgba(239,68,68,0.3)",
                        transition: "all 0.2s ease",
                        "&:hover": { 
                          backgroundColor: "rgba(239,68,68,0.25)",
                          transform: "scale(1.05)"
                        }
                      }}
                    >
                      <CancelIcon sx={{ fontSize: 30, color: "#EF4444" }} />
                    </IconButton>
                    <IconButton
                      onClick={toggleCamera}
                      sx={{
                        width: 56,
                        height: 56,
                        backgroundColor: "rgba(59,130,246,0.15)",
                        boxShadow: "0 4px 10px rgba(59,130,246,0.3)",
                        transition: "all 0.2s ease",
                        "&:hover": { 
                          backgroundColor: "rgba(59,130,246,0.25)",
                          transform: "scale(1.05)"
                        }
                      }}
                    >
                      <FlipCameraIosIcon sx={{ fontSize: 30, color: "#3B82F6" }} />
                    </IconButton>
                  </Box>
                </div>
              </Fade>
            )}

            {/* Cropper */}
            {showCropper && imageSrc && !isScanning && (
              <Fade in={showCropper && imageSrc && !isScanning} timeout={500}>
                <Box sx={{ width: "100%" }}>
                  <Typography 
                    variant="subtitle1" 
                    align="center" 
                    sx={{ 
                      mb: 2, 
                      fontWeight: 600,
                      color: "#4F46E5"
                    }}
                  >
                    Adjust {currentDocType === "passportPhoto" ? "photo" : "document"} position
                  </Typography>
                  
                  <Paper 
                    elevation={8} 
                    sx={{ 
                      borderRadius: "1rem", 
                      overflow: "hidden", 
                      border: "3px solid #4F46E5",
                    }}
                  >
                    <Cropper
                      src={imageSrc}
                      style={{ height: "360px", width: "100%" }}
                      autoCropArea={1}
                      guides={true}
                      ref={cropperRef}
                      viewMode={2}
                      dragMode="move"
                      background={false}
                      ready={() => {
                        if (detectedCropBox && cropperRef.current && currentDocType !== "passportPhoto") {
                          const cropper = cropperRef.current.cropper;
                          const imageData = cropper.getImageData();
                          const scale = imageData.width / imageData.naturalWidth;
                          cropper.setCropBoxData({
                            left: detectedCropBox.x * scale,
                            top: detectedCropBox.y * scale,
                            width: detectedCropBox.width * scale,
                            height: detectedCropBox.height * scale,
                          });
                        }
                      }}
                    />
                  </Paper>
                  
                  <Box sx={{ 
                    display: "flex", 
                    justifyContent: "center", 
                    gap: 2, 
                    mt: 3,
                    flexDirection: isSmallScreen ? "column" : "row", 
                  }}>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={handleCropComplete}
                      fullWidth={isSmallScreen}
                      sx={{ 
                        textTransform: "none", 
                        borderRadius: "0.75rem",
                        py: 1.2,
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
                      Confirm & Process
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleRetake}
                      fullWidth={isSmallScreen}
                      sx={{
                        textTransform: "none",
                        borderRadius: "0.75rem",
                        py: 1.2,
                        fontWeight: 600,
                        borderWidth: 2,
                        borderColor: "#EF4444",
                        color: "#EF4444",
                        transition: "all 0.3s ease",
                        "&:hover": {
                          borderColor: "#DC2626",
                          backgroundColor: "rgba(239, 68, 68, 0.05)",
                          transform: "translateY(-2px)",
                        }
                      }}
                    >
                      Retake
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Preview & Confirm */}
            {croppedImage && !isImageConfirmed && (
              <Fade in={croppedImage && !isImageConfirmed} timeout={800}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column", 
                  alignItems: "center", 
                  mt: 3,
                  width: "100%"
                }}>
                  <Typography 
                    variant="h6" 
                    sx={{ 
                      mb: 3, 
                      fontWeight: 600,
                      color: "#4F46E5"
                    }}
                  >
                    Confirm {getDocumentName()}
                  </Typography>
                  
                  <Paper
                    elevation={12}
                    sx={{ 
                      p: 1, 
                      borderRadius: "1rem", 
                      backgroundColor: "#fff",
                      maxWidth: "280px",
                      border: "3px solid #4F46E5",
                      boxShadow: "0 10px 25px rgba(79, 70, 229, 0.2)"
                    }}
                  >
                    <img
                      src={croppedImage}
                      alt="Cropped Preview"
                      style={{ 
                        borderRadius: "0.5rem", 
                        width: "100%",
                        height: "auto" 
                      }}
                    />
                  </Paper>
                  
                  <Typography 
                    variant="body2" 
                    color="textSecondary" 
                    sx={{ mt: 2, mb: 3, textAlign: "center" }}
                  >
                    Please confirm that all information is clearly visible and readable
                  </Typography>
                  
                  <Box sx={{ 
                    display: "flex", 
                    gap: 3, 
                    mt: 1,
                    flexDirection: isSmallScreen ? "column" : "row",
                    width: isSmallScreen ? "100%" : "auto"
                  }}>
                    <Button
                      variant="contained"
                      color="success"
                      onClick={handleConfirmImage}
                      startIcon={<CheckCircleIcon />}
                      fullWidth={isSmallScreen}
                      sx={{
                        borderRadius: "0.75rem",
                        textTransform: "none",
                        py: 1.2,
                        px: 3,
                        fontWeight: 600,
                        backgroundColor: "#10B981",
                        boxShadow: "0 4px 14px rgba(16, 185, 129, 0.4)",
                        "&:hover": {
                          backgroundColor: "#059669",
                          boxShadow: "0 6px 20px rgba(16, 185, 129, 0.5)",
                        }
                      }}
                    >
                      Confirm
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleRetake}
                      startIcon={<CancelIcon />}
                      fullWidth={isSmallScreen}
                      sx={{
                        borderRadius: "0.75rem",
                        textTransform: "none",
                        py: 1.2,
                        px: 3,
                        fontWeight: 600,
                        borderWidth: 2,
                        borderColor: "#EF4444",
                        color: "#EF4444",
                        "&:hover": {
                          borderColor: "#DC2626",
                          backgroundColor: "rgba(239, 68, 68, 0.05)",
                        }
                      }}
                    >
                      Retake
                    </Button>
                  </Box>
                </Box>
              </Fade>
            )}

            {/* Submit */}
            {isImageConfirmed && (
              <Fade in={isImageConfirmed} timeout={800}>
                <Box sx={{ 
                  display: "flex", 
                  flexDirection: "column",
                  alignItems: "center",
                  width: "100%", 
                  mt: 3
                }}>
                  <Paper
                    elevation={8}
                    sx={{ 
                      p: 4,
                      borderRadius: "1rem", 
                      backgroundColor: "rgba(79, 70, 229, 0.08)",
                      border: "1px solid rgba(79, 70, 229, 0.2)",
                      mb: 4,
                      width: "100%",
                      textAlign: "center"
                    }}
                  >
                    <CheckCircleIcon sx={{ 
                      fontSize: 56, 
                      color: "#10B981",
                      mb: 2
                    }} />
                    <Typography 
                      variant="h6" 
                      sx={{ 
                        fontWeight: 600,
                        color: "#111827",
                        mb: 1
                      }}
                    >
                      {getDocumentName()} Collected
                    </Typography>
                    <Typography 
                      variant="body1" 
                      sx={{ 
                        color: "#4B5563",
                        mb: 3
                      }}
                    >
                      {activeStep < steps.length - 1 
                        ? `Your ${getDocumentName()} has been successfully processed. Please continue to the next step.` 
                        : `All documents have been successfully collected and are ready for submission.`}
                    </Typography>
                    {/* <Button
                      variant="contained"
                      color="primary"
                      onClick={moveToNextStep}
                      endIcon={<ChevronRight />}
                      fullWidth={isSmallScreen}
                      sx={{
                        borderRadius: "0.75rem",
                        textTransform: "none",
                        py: 1.5,
                        px: 5,
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
                      {activeStep < steps.length - 1 ? "Continue to Next Step" : "Submit All Documents"}
                    </Button> */}
                    <Button
  variant="contained"
  color="primary"
  onClick={moveToNextStep}
  endIcon={<ChevronRight />}
  fullWidth={isSmallScreen}
  sx={{
    borderRadius: "0.75rem",
    textTransform: "none",
    py: { xs: 1.25, sm: 1.5 },   // Responsive padding vertical
    px: { xs: 3, sm: 5 },        // Responsive padding horizontal
    fontSize: { xs: '0.875rem', sm: '1rem' }, // Responsive font size
    fontWeight: 600,
    boxShadow: "0 4px 14px rgba(79, 70, 229, 0.4)",
    background: "linear-gradient(to right, #4F46E5, #7C3AED)",
    transition: "all 0.3s ease",
    maxWidth: { xs: '100%', sm: 'auto' }, // Ensure it respects container on mobile
    minWidth: { xs: 'unset', sm: '180px' }, // Set minimum width on larger screens
    wordBreak: 'keep-all',       // Prevent awkward text wrapping
    whiteSpace: { xs: 'normal', sm: 'nowrap' }, // Allow wrapping on mobile only if needed
    "&:hover": {
      background: "linear-gradient(to right, #4338CA, #6D28D9)",
      boxShadow: "0 6px 20px rgba(79, 70, 229, 0.5)",
      transform: "translateY(-2px)",
    }
  }}
>
  {activeStep < steps.length - 1 ? (
    isSmallScreen ? "Continue" : "Continue to Next Step"
  ) : (
    isSmallScreen ? "Submit" : "Submit All Documents"
  )}
</Button>
                  </Paper>
                </Box>
              </Fade>
            )}
          </Box>
          
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

export default DocumentUpload;