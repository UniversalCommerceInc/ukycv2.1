import React, { useState, useEffect } from 'react';
import { CircularProgress } from '@mui/material';

const LoadingProgressButton = ({
  isLoading,
  loadingText = "Processing",
  buttonText,
  onClick,
  disabled,
  className,
  maxTimeSeconds = 30,
  icon = null,
  ...props
}) => {
  const [progress, setProgress] = useState(0);
  const [timeoutId, setTimeoutId] = useState(null);

  // Setup progress tracking when loading starts
  useEffect(() => {
    if (isLoading) {
      // Reset progress
      setProgress(0);
      
      // Create interval to update progress
      const interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (maxTimeSeconds * 10));
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 100); // Update every 100ms
      
      // Store interval ID for cleanup
      setTimeoutId(interval);
    } else if (timeoutId) {
      // Clean up when loading stops
      clearInterval(timeoutId);
      setTimeoutId(null);
      setProgress(0);
    }
    
    // Cleanup on unmount
    return () => {
      if (timeoutId) {
        clearInterval(timeoutId);
      }
    };
  }, [isLoading, maxTimeSeconds]);

  return (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      className={className}
      {...props}
    >
      {isLoading ? (
        <div className="flex items-center">
          <div className="relative mr-2">
            <CircularProgress 
              size={16} 
              color="inherit" 
              className="opacity-50" 
            />
            <div className="absolute top-0 left-0 flex items-center justify-center w-full h-full">
              <span className="text-xs">{Math.round(progress)}%</span>
            </div>
          </div>
          {loadingText}
        </div>
      ) : (
        <div className="flex items-center">
          {buttonText}
          {icon && <span className="ml-1.5">{icon}</span>}
        </div>
      )}
    </button>
  );
};

export default LoadingProgressButton;