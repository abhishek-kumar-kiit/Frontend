// src/components/InstructorCourseCard.tsx

import React from "react";
import { Link } from "react-router-dom";
import type { Course } from "../types";

interface InstructorCourseCardProps {
  course: Course;
  onDeactivate: (courseId: string) => void;
}

const InstructorCourseCard: React.FC<InstructorCourseCardProps> = ({
  course,
  onDeactivate,
}) => {
  const disabledLinkStyle = "pointer-events-none grayscale opacity-50";

  return (
    <div
      className={`relative bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden flex flex-col transition-all hover:shadow-xl hover:-translate-y-1 duration-200 w-full max-w-md ${
        !course.isActive ? "opacity-60" : ""
      }`}
    >
      {/* Course Image */}
      <div className="relative">
        <img
          src={course.imageUrl || "https://via.placeholder.com/400x200"}
          alt={course.title}
          className="w-full h-48 object-cover"
        />
        <span
          className={`absolute top-3 right-3 text-xs font-bold py-1.5 px-4 uppercase rounded-full text-white shadow-md ${
            course.isActive
              ? "bg-green-500"
              : "bg-red-500"
          }`}
        >
          {course.isActive ? "Active" : "Inactive"}
        </span>
      </div>

      {/* Course Content */}
      <div className="flex flex-col flex-1 p-6">
        <h3 className="text-xl font-semibold text-gray-800 line-clamp-2 mb-5">
          {course.title}
        </h3>

        {/* Buttons Section */}
        <div className="flex flex-col gap-2.5 mt-auto">
          {/* First Row */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Edit Button */}
            <Link
              to={`/instructor/courses/${course._id}/edit`}
              className={`inline-flex items-center justify-center bg-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-blue-600 transition-all ${
                !course.isActive && disabledLinkStyle
              }`}
            >
              Edit
            </Link>

            {/* Manage Lessons */}
            <Link
              to={`/instructor/courses/${course._id}/manage`}
              className={`inline-flex items-center justify-center bg-green-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-green-600 transition-all ${
                !course.isActive && disabledLinkStyle
              }`}
            >
              Manage
            </Link>
          </div>

          {/* Second Row */}
          <div className="grid grid-cols-2 gap-2.5">
            {/* Preview Button */}
            <Link
              to={`/courses/${course._id}`}
              className={`inline-flex items-center justify-center bg-yellow-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-yellow-600 transition-all ${
                !course.isActive && disabledLinkStyle
              }`}
            >
              Preview
            </Link>

            {/* Deactivate Button */}
            {course.isActive ? (
              <button
                onClick={() => onDeactivate(course._id)}
                className="inline-flex items-center justify-center bg-red-500 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-red-600 transition-all"
              >
                Deactivate
              </button>
            ) : (
              <div className="inline-flex items-center justify-center bg-gray-300 text-gray-500 font-semibold py-3 px-4 rounded-lg cursor-not-allowed shadow-md">
                Deactivated
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorCourseCard; 