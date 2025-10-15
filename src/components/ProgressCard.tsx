 // src/components/ProgressCard.tsx

import React from "react";
import { Link } from "react-router-dom";
import type { Enrollment } from "../services/enrollmentService";

interface ProgressCardProps {
  enrollment: Enrollment;
}

const ProgressCard: React.FC<ProgressCardProps> = ({ enrollment }) => {
  const { course, progress } = enrollment;
  const isInactive = !course.isActive;

  return (
    <div
      className={`relative bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
        isInactive ? "opacity-60 grayscale" : ""
      }`}
    >
      {/* Course Image */}
      <div className="relative">
        <img
          src={course.imageUrl || "https://via.placeholder.com/400x200"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />

        {/* Status Badge */}
        {isInactive && (
          <span className="absolute top-3 right-3 bg-gradient-to-r from-red-500 to-rose-600 text-white text-xs font-semibold px-3 py-1 rounded-full shadow-md">
            Inactive
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="p-5 space-y-4">
        <h3 className="text-lg font-semibold text-gray-800 line-clamp-2">
          {course.title}
        </h3>

        {/* Progress Section */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">Progress</span>
            <span className="text-sm font-semibold text-blue-600">
              {progress}%
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
            <div
              className={`h-2.5 rounded-full transition-all duration-500 ${
                progress === 100
                  ? "bg-gradient-to-r from-green-500 to-emerald-600"
                  : "bg-gradient-to-r from-blue-500 to-indigo-600"
              }`}
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Action Button */}
        <Link
          to={isInactive ? "#" : `/courses/${course._id}`}
          state={{ isEnrolled: true }}
          onClick={(e) => {
            if (isInactive) e.preventDefault();
          }}
          className={`block text-center font-semibold py-2.5 rounded-lg transition-all duration-200 ${
            isInactive
              ? "bg-gray-300 text-gray-600 cursor-not-allowed"
              : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90 shadow-md hover:shadow-lg"
          }`}
        >
          {isInactive ? "Course is Inactive" : "Continue Learning"}
        </Link>
      </div>
    </div>
  );
};

export default ProgressCard;
