// import React, { useState } from "react";
// import logo from "../assets/logo.png"; // Ensure the path to the logo is correct
// import { useDispatch } from "react-redux";
// import { clearKycId } from "../features/auth/kycSlice";
// import { logout } from "../features/auth/authSlice";
// import { useNavigate, useLocation } from "react-router-dom";

// function Navbar() {
//   const [showSignOffDialog, setShowSignOffDialog] = useState(false);
//   const dispatch = useDispatch();
//   const navigate = useNavigate();
//   const location = useLocation();

//   const handleLogout = () => {
//     setShowSignOffDialog(true);
//     setTimeout(() => {
//       // dispatch(clearKycId());
//       dispatch(logout());
//       navigate("/signin");
//       setTimeout(() => {
//         window.location.reload(); // Refresh the page after a short delay
//       }, 10);
//     }, 2000); // Simulate a 2-second delay
    
//   };

//   // Hide logout when on the `/steps/personal-info` route
//   const isPersonalInfoRoute = location.pathname === "/steps/personal-info";

//   return (
//     <nav className="bg-gradient-to-r from-blue-900 to-blue-600 p-4 flex items-center justify-between shadow-md rounded-lg">
//       <div className="flex items-center">
//         <img
//           src={logo}
//           alt="Universal KYC Logo"
//           className="h-12 w-12 mr-3"
//         />
//         <h1 className="text-white text-2xl md:text-3xl font-bold tracking-wide">
//           Universal KYC
//         </h1>
//       </div>
//       {!isPersonalInfoRoute && (
//         <div className="flex items-center space-x-6">
//           <button
//             onClick={handleLogout}
//             className="flex items-center text-white text-sm md:text-lg hover:text-yellow-300 transition duration-300 ease-in-out"
//             aria-label="Logout"
//           >
//             <svg
//               xmlns="http://www.w3.org/2000/svg"
//               className="h-6 w-6 mr-2"
//               fill="none"
//               viewBox="0 0 24 24"
//               stroke="currentColor"
//               strokeWidth="2"
//             >
//               <path
//                 strokeLinecap="round"
//                 strokeLinejoin="round"
//                 d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
//               />
//             </svg>
//             Logout
//           </button>
//         </div>
//       )}

//       {/* Animated Dialog */}
//       {showSignOffDialog && (
//         <div className="absolute inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
//           <div className="bg-white rounded-lg shadow-lg p-6 text-center">
//             <h2 className="text-xl font-semibold text-gray-800">
//               Signing Off...
//             </h2>
//             <p className="text-gray-500 mt-2">
//               Please wait while we log you out.
//             </p>
//             <div className="mt-4">
//               <svg
//                 className="animate-spin h-8 w-8 text-blue-600 mx-auto"
//                 xmlns="http://www.w3.org/2000/svg"
//                 fill="none"
//                 viewBox="0 0 24 24"
//               >
//                 <circle
//                   className="opacity-25"
//                   cx="12"
//                   cy="12"
//                   r="10"
//                   stroke="currentColor"
//                   strokeWidth="4"
//                 ></circle>
//                 <path
//                   className="opacity-75"
//                   fill="currentColor"
//                   d="M4 12a8 8 0 018-8v8H4z"
//                 ></path>
//               </svg>
//             </div>
//           </div>
//         </div>
//       )}
//     </nav>
//   );
// }

// export default Navbar;










import React, { useState, useEffect } from "react";
import logo from "../assets/logo.png";
import { useDispatch } from "react-redux";
import { clearKycId } from "../features/auth/kycSlice";
import { logout } from "../features/auth/authSlice";
import { useNavigate, useLocation } from "react-router-dom";

function Navbar() {
  const [showSignOffDialog, setShowSignOffDialog] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [time, setTime] = useState(new Date());
  const [navHeight, setNavHeight] = useState(0);
  const navRef = React.useRef(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  // Handle scroll effect for transparent to solid navbar
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  
  // Handle window resize for responsive adjustments
  const [isMobile, setIsMobile] = useState(window.innerWidth < 640);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
      // Update navbar height when resizing
      if (navRef.current) {
        setNavHeight(navRef.current.offsetHeight);
      }
    };
    
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Update time
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Measure navbar height after render and when window is resized
  useEffect(() => {
    if (navRef.current) {
      setNavHeight(navRef.current.offsetHeight);
    }

    // Create ResizeObserver to detect navbar height changes
    const resizeObserver = new ResizeObserver(entries => {
      for (let entry of entries) {
        setNavHeight(entry.target.offsetHeight);
      }
    });

    if (navRef.current) {
      resizeObserver.observe(navRef.current);
    }

    return () => {
      if (navRef.current) {
        resizeObserver.unobserve(navRef.current);
      }
    };
  }, []);

  const handleLogout = () => {
    setShowSignOffDialog(true);
    setTimeout(() => {
      dispatch(logout());
      navigate("/signin");
      setTimeout(() => {
        window.location.reload();
      }, 10);
    }, 2000);
  };

  // Hide logout when on the `/steps/personal-info` route
  const isPersonalInfoRoute = location.pathname === "/steps/personal-info";

  return (
    <>
      {/* This is a spacer div that pushes content below the navbar */}
      <div style={{ height: `${navHeight}px` }} className="w-full" aria-hidden="true"></div>
      
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-40 transition-all duration-300 ${
          scrolled
            ? "bg-gradient-to-r from-blue-900 to-indigo-800 shadow-lg"
            : "bg-gradient-to-r from-blue-900/90 to-indigo-800/90 backdrop-blur-md"
        } px-3 sm:px-4 py-3 rounded-b-lg`}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <div className="relative group">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full blur opacity-70 group-hover:opacity-100 transition duration-300 hidden sm:block"></div>
              <div className="relative bg-gradient-to-r from-blue-900 to-indigo-800 rounded-full p-1">
                <img
                  src={logo}
                  alt="Universal KYC Logo"
                  className="h-8 w-8 sm:h-10 sm:w-10 md:h-12 md:w-12 transition-transform duration-300 group-hover:scale-110"
                />
              </div>
            </div>
            <div className="ml-2 sm:ml-4">
              <h1 className="text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-wide">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-100 to-indigo-200">
                  Universal KYC
                </span>
              </h1>
              <p className="text-blue-200 text-xs tracking-wide hidden sm:block">Secure Identity Verification</p>
            </div>
          </div>

          <div className="flex items-center space-x-2 sm:space-x-4 md:space-x-6">
            {/* Current time display */}
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-blue-100 text-sm font-medium">
                {time.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
              <span className="text-blue-300 text-xs">
                {time.toLocaleDateString([], { month: 'short', day: 'numeric' })}
              </span>
            </div>

            {!isPersonalInfoRoute && (
              <button
                onClick={handleLogout}
                className="group relative overflow-hidden rounded-lg px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 transition-all duration-300"
              >
                <span className="absolute inset-0 bg-gradient-to-r from-red-500 to-amber-500 opacity-70 group-hover:opacity-100 transition-all duration-300"></span>
                <span className="relative flex items-center text-white text-sm sm:text-base font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4 sm:h-5 sm:w-5 mr-1 sm:mr-2 transition-transform duration-300 group-hover:rotate-12"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                    />
                  </svg>
                  <span className="xs:inline">Sign Out</span>
                </span>
              </button>
            )}
          </div>
        </div>

        {/* Animated Sign Off Dialog */}
        {showSignOffDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm flex items-center justify-center z-50 animate-fadeIn">
            <div className="bg-gradient-to-br from-gray-900 to-blue-900 rounded-xl shadow-2xl p-4 sm:p-6 md:p-8 text-center max-w-md mx-4 animate-scaleIn">
              <h2 className="text-lg sm:text-xl font-semibold text-white">
                Signing Off...
              </h2>
              <p className="text-blue-200 mt-2 text-sm sm:text-base">
                Thank you for using Universal KYC
              </p>
              <div className="mt-6 relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full animate-pulse"></div>
                <svg
                  className="animate-spin h-10 w-10 text-white mx-auto relative"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-100"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              </div>
              <p className="text-xs text-blue-300 mt-6">
                Your session is being securely terminated
              </p>
            </div>
          </div>
        )}

        {/* Add keyframe animations to the global styles */}
        <style jsx global>{`
          @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
          }
          @keyframes scaleIn {
            from { transform: scale(0.95); opacity: 0; }
            to { transform: scale(1); opacity: 1; }
          }
          .animate-fadeIn {
            animation: fadeIn 0.3s ease-out forwards;
          }
          .animate-scaleIn {
            animation: scaleIn 0.4s ease-out forwards;
          }
        `}</style>
      </nav>
    </>
  );
}

export default Navbar;