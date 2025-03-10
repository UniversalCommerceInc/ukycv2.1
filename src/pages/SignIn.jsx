// import React from "react";
// import logo from "../assets/logo.png"; // Ensure the path is correct
// import bgImage from "../assets/bg.jpg"; // Ensure the path is correct

// function SignIn() {
//   return (
//     <div
//       className="flex min-h-screen items-center justify-center bg-no-repeat bg-cover bg-center"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div className="w-full max-w-md p-8 bg-white bg-opacity-95 rounded-2xl shadow-2xl">
//         <div className="flex justify-center mb-6">
//           <img src={logo} alt="Universal KYC Logo" className="h-20 w-20" />
//         </div>
//         <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
//           Sign In to Universal KYC
//         </h2>
//         <form className="space-y-6">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//           <div className="flex items-center justify-between">
//             <label className="flex items-center">
//               <input type="checkbox" className="form-checkbox" />
//               <span className="ml-2 text-sm text-gray-600">Remember me</span>
//             </label>
//             <a href="#" className="text-sm text-blue-600 hover:underline">
//               Forgot password?
//             </a>
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
//           >
//             Sign In
//           </button>
//           <p className="text-sm text-center text-gray-600">
//             Don't have an account?{" "}
//             <a href="#" className="text-blue-600 hover:underline">
//               Sign Up
//             </a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignIn;


// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useLoginMutation } from "../features/api/usersApiSlice";
// import { setCredentials } from "../features/auth/authSlice";
// import logo from "../assets/logo.png";
// import bgImage from "../assets/bg.jpg";
// import { useNavigate } from "react-router-dom";

// function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useDispatch();
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userData = await login({ login:email, password }).unwrap();
//       dispatch(setCredentials(userData));
//       setError(null);
//       // Navigate to the dashboard or another page if needed
//       console.log("Login successful!");
//     } catch (err) {
//       setError(err?.data?.message || "Something went wrong");
//     }
//   };
//   const handleLogin = () =>{
//     navigate("/consent")
//   }

//   return (
//     <div
//       className="flex min-h-screen items-center justify-center bg-no-repeat bg-cover bg-center"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div className="w-full max-w-md p-8 bg-white bg-opacity-95 rounded-2xl shadow-2xl">
//         <div className="flex justify-center mb-6">
//           <img src={logo} alt="Universal KYC Logo" className="h-20 w-20" />
//         </div>
//         <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
//           Sign In to Universal KYC
//         </h2>
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           {error && (
//             <p className="text-sm text-red-600 text-center">{error}</p>
//           )}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center">
//               <input type="checkbox" className="form-checkbox" />
//               <span className="ml-2 text-sm text-gray-600">Remember me</span>
//             </label>
//             <a href="#" className="text-sm text-blue-600 hover:underline">
//               Forgot password?
//             </a>
//           </div>
//           <button
//             type="submit"
//             className={`w-full py-3 text-white rounded-lg transition duration-300 ${
//               isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? "Signing In..." : "Sign In"}
//           </button>
//           <p className="text-sm text-center text-gray-600">
//             Don't have an account?{" "}
//             <a href="#" className="text-blue-600 hover:underline" onClick={handleLogin}>

//               Sign Up
//             </a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignIn;


import React, { useState, useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
import { useLoginMutation, useMeQuery } from "../features/api/usersApiSlice";
import { setCredentials } from "../features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { persistor } from "../store"; 
import toast from "react-hot-toast";
import logo from "../assets/logo.png";
import bgImage from "../assets/bg.jpg";
import { setKycId } from "../features/auth/kycSlice";

function SignIn() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [triggerMe, setTriggerMe] = useState(false);
  const [showLoader, setShowLoader] = useState(false); // State for showing the loader
  const [toastShown, setToastShown] = useState(false);
  const [login, { isLoading }] = useLoginMutation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const toastShownRef = useRef(false);
 

  const { data: userData, isFetching: isFetchingMe } = useMeQuery(undefined, {
    skip: !triggerMe, // Skip initially, trigger after login
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Log in the user
      const userData = await login({ login: email, password }).unwrap();
      dispatch(setCredentials(userData));
      await persistor.flush();
      setError(null);

      // Show loader and wait for 1 second before calling "me" API
      setShowLoader(true);
      setTimeout(() => {
        setTriggerMe(true);
        setShowLoader(false);
      }, 1000);
    } catch (err) {
      console.error("Login Error:", err);
      setError(err?.data?.message || "Something went wrong");
    }
  };

  const handleLogin = () => {
    navigate("/consent");
  };



  useEffect(() => {
    if (userData) {
   
      const { kycs } = userData;

      if (kycs && kycs.length > 0) {
        // const { kycId, avlAssets } = kycs[0];
        const { kycId, avlAssets } = kycs[kycs.length - 1];
dispatch(setKycId(kycId))
        if (kycId && !avlAssets && !toastShownRef.current) {
          toast.dismiss();
          toastShownRef.current = true;
          toast(
            `You already filled KYC entry earlier. Document upload is pending for KYC.`,
            {
              icon: "⚠️",
              style: {
                background: "#fef3c7",
                color: "#b45309",
              },
              duration: 4000,
            }
          );
          navigate(`/steps/document-upload/${kycId}`, { replace: true });
        } else if (kycId && avlAssets) {
          navigate(`/kyc/${kycId}`, { replace: true });
        }
      } else {
        navigate(`/steps/nationality`, { replace: true });
      }
    }
  }, [userData, navigate, dispatch]);

  return (
    <div
      className="flex min-h-screen items-center justify-center bg-no-repeat bg-cover bg-center"
      style={{ backgroundImage: `url(${bgImage})` }}
    >
      {showLoader && (
        <div className="absolute inset-0 flex items-center justify-center bg-opacity-50 bg-gray-900 z-50">
          <div className="flex flex-col items-center">
            <div className="loader border-t-4 border-blue-500 w-12 h-12 rounded-full animate-spin"></div>
            <p className="mt-4 text-white font-semibold">Processing...</p>
          </div>
        </div>
      )}
      <div className="w-full max-w-md p-8 bg-white bg-opacity-95 rounded-2xl shadow-2xl">
        <div className="flex justify-center mb-6">
          <img src={logo} alt="Universal KYC Logo" className="h-20 w-20" />
        </div>
        <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
          Sign In to Universal KYC
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          {error && (
            <p className="text-sm text-red-600 text-center">{error}</p>
          )}
          <div className="flex items-center justify-between">
            <label className="flex items-center">
              <input type="checkbox" className="form-checkbox" />
              <span className="ml-2 text-sm text-gray-600">Remember me</span>
            </label>
            <a href="#" className="text-sm text-blue-600 hover:underline">
              Forgot password?
            </a>
          </div>
          <button
            type="submit"
            className={`w-full py-3 text-white rounded-lg transition duration-300 ${
              isLoading || isFetchingMe || showLoader
                ? "bg-gray-400"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
            disabled={isLoading || isFetchingMe || showLoader}
          >
            {isLoading || isFetchingMe || showLoader
              ? "Processing..."
              : "Sign In"}
          </button>
          <p className="text-sm text-center text-gray-600">
            Don't have an account?{" "}
            <a
              href="#"
              className="text-blue-600 hover:underline"
              onClick={handleLogin}
            >
              Sign Up
            </a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignIn;



















// import React from "react";
// import logo from "../assets/logo.png"; // Ensure the path is correct
// import bgImage from "../assets/bg.jpg"; // Ensure the path is correct

// function SignIn() {
//   return (
//     <div
//       className="flex min-h-screen items-center justify-center bg-no-repeat bg-cover bg-center"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div className="w-full max-w-md p-8 bg-white bg-opacity-95 rounded-2xl shadow-2xl">
//         <div className="flex justify-center mb-6">
//           <img src={logo} alt="Universal KYC Logo" className="h-20 w-20" />
//         </div>
//         <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
//           Sign In to Universal KYC
//         </h2>
//         <form className="space-y-6">
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             required
//           />
//           <div className="flex items-center justify-between">
//             <label className="flex items-center">
//               <input type="checkbox" className="form-checkbox" />
//               <span className="ml-2 text-sm text-gray-600">Remember me</span>
//             </label>
//             <a href="#" className="text-sm text-blue-600 hover:underline">
//               Forgot password?
//             </a>
//           </div>
//           <button
//             type="submit"
//             className="w-full py-3 text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition duration-300"
//           >
//             Sign In
//           </button>
//           <p className="text-sm text-center text-gray-600">
//             Don't have an account?{" "}
//             <a href="#" className="text-blue-600 hover:underline">
//               Sign Up
//             </a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignIn;


// import React, { useState } from "react";
// import { useDispatch } from "react-redux";
// import { useLoginMutation } from "../features/api/usersApiSlice";
// import { setCredentials } from "../features/auth/authSlice";
// import logo from "../assets/logo.png";
// import bgImage from "../assets/bg.jpg";
// import { useNavigate } from "react-router-dom";

// function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useDispatch();
//   const [error, setError] = useState(null);
//   const navigate = useNavigate();

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       const userData = await login({ login:email, password }).unwrap();
//       dispatch(setCredentials(userData));
//       setError(null);
//       // Navigate to the dashboard or another page if needed
//       console.log("Login successful!");
//     } catch (err) {
//       setError(err?.data?.message || "Something went wrong");
//     }
//   };
//   const handleLogin = () =>{
//     navigate("/consent")
//   }

//   return (
//     <div
//       className="flex min-h-screen items-center justify-center bg-no-repeat bg-cover bg-center"
//       style={{ backgroundImage: `url(${bgImage})` }}
//     >
//       <div className="w-full max-w-md p-8 bg-white bg-opacity-95 rounded-2xl shadow-2xl">
//         <div className="flex justify-center mb-6">
//           <img src={logo} alt="Universal KYC Logo" className="h-20 w-20" />
//         </div>
//         <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
//           Sign In to Universal KYC
//         </h2>
//         <form className="space-y-6" onSubmit={handleSubmit}>
//           <input
//             type="email"
//             name="email"
//             placeholder="Email Address"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//           <input
//             type="password"
//             name="password"
//             placeholder="Password"
//             className="w-full px-4 py-3 border rounded-lg focus:ring-blue-500 focus:border-blue-500"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//           {error && (
//             <p className="text-sm text-red-600 text-center">{error}</p>
//           )}
//           <div className="flex items-center justify-between">
//             <label className="flex items-center">
//               <input type="checkbox" className="form-checkbox" />
//               <span className="ml-2 text-sm text-gray-600">Remember me</span>
//             </label>
//             <a href="#" className="text-sm text-blue-600 hover:underline">
//               Forgot password?
//             </a>
//           </div>
//           <button
//             type="submit"
//             className={`w-full py-3 text-white rounded-lg transition duration-300 ${
//               isLoading ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"
//             }`}
//             disabled={isLoading}
//           >
//             {isLoading ? "Signing In..." : "Sign In"}
//           </button>
//           <p className="text-sm text-center text-gray-600">
//             Don't have an account?{" "}
//             <a href="#" className="text-blue-600 hover:underline" onClick={handleLogin}>

//               Sign Up
//             </a>
//           </p>
//         </form>
//       </div>
//     </div>
//   );
// }

// export default SignIn;


// import React, { useState, useEffect, useRef } from "react";
// import { useDispatch } from "react-redux";
// import { useLoginMutation, useMeQuery } from "../features/api/usersApiSlice";
// import { setCredentials } from "../features/auth/authSlice";
// import { useNavigate } from "react-router-dom";
// import { persistor } from "../store"; 
// import toast from "react-hot-toast";
// import logo from "../assets/logo.png";
// import bgImage from "../assets/bg.jpg";
// import { setKycId } from "../features/auth/kycSlice";

// function SignIn() {
//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPassword, setShowPassword] = useState(false);
//   const [triggerMe, setTriggerMe] = useState(false);
//   const [showLoader, setShowLoader] = useState(false);
//   const [toastShown, setToastShown] = useState(false);
//   const [login, { isLoading }] = useLoginMutation();
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const [error, setError] = useState(null);
//   const toastShownRef = useRef(false);
//   const [rememberMe, setRememberMe] = useState(false);
//   const emailRef = useRef(null);
//   const passwordRef = useRef(null);

//   const { data: userData, isFetching: isFetchingMe } = useMeQuery(undefined, {
//     skip: !triggerMe,
//   });

//   const togglePasswordVisibility = () => {
//     setShowPassword(!showPassword);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setError(null);
      
//       // Show loading animation
//       setShowLoader(true);
      
//       // Log in the user
//       const userData = await login({ login: email, password }).unwrap();
//       dispatch(setCredentials(userData));
//       await persistor.flush();

//       // Delay to show loading animation
//       setTimeout(() => {
//         setTriggerMe(true);
//       }, 1200);
//     } catch (err) {
//       setShowLoader(false);
//       console.error("Login Error:", err);
//       setError(err?.data?.message || "Invalid credentials. Please try again.");
      
//       // Apply shake animation to form
//       const form = document.getElementById("login-form");
//       form.classList.add("animate-shake");
//       setTimeout(() => form.classList.remove("animate-shake"), 500);
//     }
//   };

//   const handleLogin = () => {
//     navigate("/consent");
//   };

//   useEffect(() => {
//     if (userData) {
//       const { kycs } = userData;

//       if (kycs && kycs.length > 0) {
//         const { kycId, avlAssets } = kycs[kycs.length - 1];
//         dispatch(setKycId(kycId));

//         if (kycId && !avlAssets && !toastShownRef.current) {
//           toast.dismiss();
//           toastShownRef.current = true;
//           toast(
//             `You already filled KYC entry earlier. Document upload is pending for KYC.`,
//             {
//               icon: "⚠️",
//               style: {
//                 background: "#fef3c7",
//                 color: "#b45309",
//               },
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
//   }, [userData, navigate, dispatch]);

//   // Focus animation handlers
//   const handleFocus = (ref) => {
//     ref.current.parentNode.classList.add("input-focused");
//   };
  
//   const handleBlur = (ref) => {
//     if (!ref.current.value) {
//       ref.current.parentNode.classList.remove("input-focused");
//     }
//   };

//   return (
//     <div className="flex min-h-screen">
//       {/* Left panel - decorative */}
//       <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-blue-800 to-indigo-900 p-12 flex-col justify-between">
//         <div className="flex items-center">
//           <img src={logo} alt="Universal KYC Logo" className="h-12 w-12 mr-4" />
//           <h1 className="text-white text-2xl font-bold tracking-wide">
//             Universal KYC
//           </h1>
//         </div>
        
//         <div className="space-y-8">
//           <h2 className="text-4xl font-bold text-white leading-tight">
//             Secure Identity Verification <br />for the Digital Age
//           </h2>
//           <p className="text-blue-100 text-lg max-w-md">
//             Our platform provides a seamless and secure way to validate your identity across multiple services with a single verification.
//           </p>
          
//           <div className="grid grid-cols-2 gap-4 mt-8">
//             <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
//               <div className="text-blue-300 text-2xl mb-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
//                 </svg>
//               </div>
//               <h3 className="text-white font-medium">Secure & Compliant</h3>
//               <p className="text-blue-100 text-sm mt-1">Built with bank-grade security and regulatory compliance.</p>
//             </div>
//             <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg">
//               <div className="text-blue-300 text-2xl mb-2">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
//                 </svg>
//               </div>
//               <h3 className="text-white font-medium">Time-Saving</h3>
//               <p className="text-blue-100 text-sm mt-1">Verify once, use anywhere. Save hours on repetitive KYC processes.</p>
//             </div>
//           </div>
//         </div>
        
//         <div className="text-blue-200 text-sm">
//           © {new Date().getFullYear()} Universal KYC. All rights reserved.
//         </div>
//       </div>
      
//       {/* Right panel - login form */}
//       <div 
//         className="w-full lg:w-1/2 flex items-center justify-center p-4 md:p-8 bg-cover bg-center relative"
//         style={{ backgroundImage: `url(${bgImage})` }}
//       >
//         {/* Overlay */}
//         <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-indigo-900/90 backdrop-blur-sm lg:hidden"></div>
        
//         {/* Loader overlay */}
//         {showLoader && (
//           <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm z-50 animate-fadeIn">
//             <div className="flex flex-col items-center">
//               <div className="relative w-24 h-24">
//                 <div className="w-24 h-24 rounded-full border-t-4 border-b-4 border-blue-500 animate-spin absolute"></div>
//                 <div className="w-24 h-24 rounded-full border-r-4 border-l-4 border-transparent border-r-indigo-600 animate-spin absolute" style={{animationDirection: 'reverse', animationDuration: '1.5s'}}></div>
//                 <div className="absolute inset-0 flex items-center justify-center">
//                   <img src={logo} alt="Logo" className="h-12 w-12 animate-pulse" />
//                 </div>
//               </div>
//               <p className="mt-6 text-white font-medium text-lg tracking-wide">Authenticating...</p>
//             </div>
//           </div>
//         )}
        
//         <div className="bg-white/10 backdrop-blur-md w-full max-w-md p-8 rounded-2xl shadow-2xl border border-white/10 relative z-10">
//           <div className="flex justify-center mb-8 lg:hidden">
//             <img src={logo} alt="Universal KYC Logo" className="h-16 w-16" />
//           </div>
          
//           <h2 className="text-2xl font-bold text-center text-white mb-8 lg:hidden">
//             Sign In to Universal KYC
//           </h2>
          
//           <h2 className="text-2xl font-bold text-blue-50 mb-1 hidden lg:block">Welcome Back</h2>
//           <p className="text-blue-200 mb-8 hidden lg:block">Sign in to continue to Universal KYC</p>
          
//           <form id="login-form" className="space-y-6" onSubmit={handleSubmit}>
//             <div className="relative input-container transition-all duration-300 border border-blue-300/30 rounded-lg focus-within:border-blue-400 focus-within:shadow-glow">
//               <div className="absolute left-4 top-3.5 text-blue-300">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
//                   <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
//                 </svg>
//               </div>
//               <input
//                 ref={emailRef}
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 className="w-full pl-12 pr-4 py-3.5 bg-transparent text-white placeholder-blue-300/70 focus:outline-none"
//                 value={email}
//                 onChange={(e) => setEmail(e.target.value)}
//                 onFocus={() => handleFocus(emailRef)}
//                 onBlur={() => handleBlur(emailRef)}
//                 required
//               />
//             </div>
            
//             <div className="relative input-container transition-all duration-300 border border-blue-300/30 rounded-lg focus-within:border-blue-400 focus-within:shadow-glow">
//               <div className="absolute left-4 top-3.5 text-blue-300">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                   <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
//                 </svg>
//               </div>
//               <input
//                 ref={passwordRef}
//                 type={showPassword ? "text" : "password"}
//                 name="password"
//                 placeholder="Password"
//                 className="w-full px-12 py-3.5 bg-transparent text-white placeholder-blue-300/70 focus:outline-none"
//                 value={password}
//                 onChange={(e) => setPassword(e.target.value)}
//                 onFocus={() => handleFocus(passwordRef)}
//                 onBlur={() => handleBlur(passwordRef)}
//                 required
//               />
//               <button 
//                 type="button"
//                 className="absolute right-4 top-3.5 text-blue-300 focus:outline-none hover:text-blue-100 transition-colors"
//                 onClick={togglePasswordVisibility}
//               >
//                 {showPassword ? (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd" />
//                     <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z" />
//                   </svg>
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
//                     <path d="M10 12a2 2 0 100-4 2 2 0 000 4z" />
//                     <path fillRule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clipRule="evenodd" />
//                   </svg>
//                 )}
//               </button>
//             </div>
            
//             {error && (
//               <div className="bg-red-500/20 border border-red-500/50 text-red-100 px-4 py-3 rounded-lg text-sm animate-fadeIn">
//                 <div className="flex items-center">
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
//                     <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
//                   </svg>
//                   {error}
//                 </div>
//               </div>
//             )}
            
//             <div className="flex items-center justify-between">
//               <label className="flex items-center">
//                 <input 
//                   type="checkbox" 
//                   className="form-checkbox h-4 w-4 text-blue-600 transition duration-150 ease-in-out" 
//                   checked={rememberMe}
//                   onChange={() => setRememberMe(!rememberMe)}
//                 />
//                 <span className="ml-2 text-sm text-blue-200">Remember me</span>
//               </label>
//               <a href="#" className="text-sm text-blue-300 hover:text-blue-100 transition-colors">
//                 Forgot password?
//               </a>
//             </div>
            
//             <button
//               type="submit"
//               className={`w-full py-3.5 rounded-lg transition duration-300 relative overflow-hidden group ${
//                 isLoading || isFetchingMe || showLoader
//                   ? "bg-gray-600 cursor-not-allowed"
//                   : "bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white"
//               }`}
//               disabled={isLoading || isFetchingMe || showLoader}
//             >
//               <span className="absolute w-0 h-0 transition-all duration-300 ease-out bg-white rounded-full group-hover:w-32 group-hover:h-32 opacity-10"></span>
//               <span className="relative flex justify-center items-center">
//                 {isLoading || isFetchingMe || showLoader ? (
//                   <>
//                     <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                       <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                       <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                     </svg>
//                     Processing...
//                   </>
//                 ) : (
//                   <>
//                     Sign In
//                     <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
//                       <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
//                     </svg>
//                   </>
//                 )}
//               </span>
//             </button>
            
//             <div className="relative my-6">
//               <div className="absolute inset-0 flex items-center">
//                 <div className="w-full border-t border-blue-300/30"></div>
//               </div>
//               <div className="relative flex justify-center text-sm">
//                 <span className="px-2 text-blue-200 bg-indigo-900/50 backdrop-blur-sm">Or continue with</span>
//               </div>
//             </div>
            
//             <div className="grid grid-cols-3 gap-3">
//               <button type="button" className="px-4 py-2 border border-blue-300/30 rounded-lg text-blue-100 hover:bg-white/5 transition-colors flex justify-center">
//                 <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
//                   <path d="M6.29 18.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0020 3.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.073 4.073 0 01.8 7.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 010 16.407a11.616 11.616 0 006.29 1.84" />
//                 </svg>
//               </button>
//               <button type="button" className="px-4 py-2 border border-blue-300/30 rounded-lg text-blue-100 hover:bg-white/5 transition-colors flex justify-center">
//                 <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
//               <button type="button" className="px-4 py-2 border border-blue-300/30 rounded-lg text-blue-100 hover:bg-white/5 transition-colors flex justify-center">
//                 <svg className="h-5 w-5" aria-hidden="true" fill="currentColor" viewBox="0 0 20 20">
//                   <path fillRule="evenodd" d="M10 0C4.477 0 0 4.484 0 10.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0110 4.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.203 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.942.359.31.678.921.678 1.856 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0020 10.017C20 4.484 15.522 0 10 0z" clipRule="evenodd" />
//                 </svg>
//               </button>
//             </div>
            
//             <p className="text-sm text-center text-blue-200">
//               Don't have an account?{" "}
//               <a
//                 href="#"
//                 className="text-blue-300 hover:text-blue-100 font-medium transition-colors"
//                 onClick={handleLogin}
//               >
//                 Create Account
//               </a>
//             </p>
//           </form>
//         </div>
//       </div>
      
//       {/* Global styles */}
//       <style jsx global>{`
//         @keyframes fadeIn {
//           from { opacity: 0; }
//           to { opacity: 1; }
//         }
        
//         @keyframes shake {
//           0%, 100% { transform: translateX(0); }
//           10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
//           20%, 40%, 60%, 80% { transform: translateX(5px); }
//         }
        
//         .animate-fadeIn {
//           animation: fadeIn 0.3s ease-out forwards;
//         }
        
//         .animate-shake {
//           animation: shake 0.5s ease-in-out;
//         }
        
//         .shadow-glow {
//           box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
//         }
        
//         .input-focused {
//           border-color: rgba(96, 165, 250, 0.7);
//           box-shadow: 0 0 15px rgba(59, 130, 246, 0.3);
//         }
//       `}</style>
//     </div>
//   );
// }

// export default SignIn;