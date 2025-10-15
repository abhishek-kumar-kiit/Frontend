// src/components/Spinner.tsx

import React from "react";

interface SpinnerProps {
  text?: string;
}

// Main fancy spinner (matches CoursesListPage design)
export const PageSpinner: React.FC<SpinnerProps> = ({ text = "Loading..." }) => (
  <div className="flex justify-center items-center min-h-[60vh]">
    <div className="flex flex-col items-center gap-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
        <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
        </div>
      </div>
      <div className="flex flex-col items-center gap-2">
        <p className="text-gray-700 font-medium text-base">{text}</p>
        <div className="flex gap-1">
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "0ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "150ms" }}
          ></div>
          <div
            className="w-2 h-2 bg-blue-600 rounded-full animate-bounce"
            style={{ animationDelay: "300ms" }}
          ></div>
        </div>
      </div>
    </div>
  </div>
);

// Inline spinner for buttons
export const SpinnerIcon: React.FC<{ className?: string }> = ({
  className = "w-5 h-5",
}) => (
  <svg
    className={`animate-spin ${className}`}
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
    />
    <path
      className="opacity-75"
      fill="currentColor"
      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
    />
  </svg>
);

export default PageSpinner;