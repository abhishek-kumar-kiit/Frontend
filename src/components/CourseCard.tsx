 // src/components/CourseCard.tsx
import React, { useState } from "react";
import { Link } from "react-router-dom";
import type { Course } from "../types";

interface CourseCardProps {
  course: Course;
}

const CourseCard: React.FC<CourseCardProps> = ({ course }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <>
      <div className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden max-w-sm mx-auto border border-gray-100 flex flex-col h-full">
        
        {/* Image */}
        <div className="relative">
          <img
            src={course.imageUrl || "https://via.placeholder.com/400x200"}
            alt={course.title}
            className="w-full h-48 object-cover"
          />
          <span
            className={`absolute top-2 left-2 text-xs font-semibold text-white py-1 px-2 rounded-full shadow-md
              ${course.category === "Web"
                ? "bg-blue-500"
                : course.category === "Design"
                ? "bg-purple-500"
                : course.category === "Data"
                ? "bg-sky-500"
                : course.category === "Marketing"
                ? "bg-emerald-500"
                : "bg-indigo-500"
              }`}
          >
            {course.category || "General"}
          </span>
        </div>

        {/* Content */}
        <div className="p-3 flex flex-col flex-grow">
          <h3 className="text-sm font-semibold text-gray-900 mb-1 truncate">
            {course.title}
          </h3>
          <p className="text-gray-500 text-xs mb-1 truncate">
            By <span className="font-medium text-gray-700">{course.instructor.name}</span>
          </p>

          {/* Description Preview */}
          <div className="text-gray-600 text-xs mb-2 flex-grow">
            <p className="line-clamp-2 overflow-hidden">{course.description}</p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="text-indigo-600 hover:text-indigo-700 font-medium text-xs mt-1"
            >
              View More
            </button>
          </div>

          {/* Fixed Bottom Button */}
          <Link
            to={`/courses/${course._id}`}
            state={{ isEnrolled: course.enrollment }}
            className={`block text-center w-full text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-300 mt-auto ${
              course.enrollment
                ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                : "bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            }`}
          >
            {course.enrollment ? "Go to Course" : "View Details"}
          </Link>
        </div>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full relative">
            <h3 className="text-lg font-semibold mb-3">{course.title}</h3>
            <p className="text-gray-700 text-sm mb-4">{course.description}</p>
            <p className="text-gray-500 text-xs mb-4">
              By <span className="font-medium text-gray-700">{course.instructor.name}</span>
            </p>
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 text-lg font-bold"
            >
              &times;
            </button>
            <Link
              to={`/courses/${course._id}`}
              state={{ isEnrolled: course.enrollment }}
              className="block text-center w-full text-white font-semibold py-2.5 px-4 rounded-lg shadow-md transition-all duration-300 mt-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
            >
              {course.enrollment ? "Go to Course" : "View Details"}
            </Link>
          </div>
        </div>
      )}
    </>
  );
};

export default CourseCard;
