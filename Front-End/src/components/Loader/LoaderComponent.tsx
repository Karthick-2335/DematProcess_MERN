import React from "react";

const LoaderComponent = () => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-br from-white-900 via-white-800 to-white/90 z-50">
      {/* Outer Spinner */}
      <div className="relative w-16 h-16">
        <div className="absolute inset-0 rounded-full border-4 border-t-transparent border-indigo-500 animate-spin"></div>
        <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-cyan-400 animate-spin-slow"></div>
      </div>

      {/* Text */}
      <p className="mt-6 text-primary text-lg font-semibold tracking-wide animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default LoaderComponent;
