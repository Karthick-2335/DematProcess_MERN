// WithLoader.tsx
import React from "react";
import Loader from "./LoaderComponent";

interface WithLoaderProps {
  loading: boolean;
  children: React.ReactNode;
}

const WithLoader: React.FC<WithLoaderProps> = ({ loading, children }) => {
  return (
    <div className="relative">
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10">
          <Loader />
        </div>
      )}
      {children}
    </div>
  );
};

export default WithLoader;
