"use client";

import React, { useEffect, useState } from "react";

function Loading() {
  // State for tracking progress
  const [progress, setProgress] = useState(0);

  // Simulate a loading progress
  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((oldProgress) => {
        if (oldProgress === 100) {
          clearInterval(interval);
          return 100;
        }
        return Math.min(oldProgress + 10, 100);
      });
    }, 30); // Increment every 500ms

    return () => clearInterval(interval); // Cleanup interval on unmount
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 text-gray-700">
      {/* Progress Bar Container */}
      <div className="w-3/4 max-w-lg bg-gray-300 rounded-full h-2 mb-6">
        <div
          className="bg-blue-500 h-full rounded-full"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* Spinner */}
      {progress < 100 && (
        <div className="w-16 h-16 border-8 border-t-transparent border-blue-500 border-solid rounded-full animate-spin mb-6"></div>
      )}

      {/* Loading Text */}
      <p className="mt-4 text-xl font-medium animate-pulse">
        Loading... {progress}%
      </p>
    </div>
  );
}

export default Loading;
