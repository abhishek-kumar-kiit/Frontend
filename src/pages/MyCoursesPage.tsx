 // src/pages/MyCoursesPage.tsx

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getMyCourses, toggleCourseStatus } from "../services/courseService";
import type { Course } from "../types";
import InstructorCourseCard from "../components/InstructorCourseCard";

// Spinner Component
const Spinner: React.FC<{ size?: "sm" | "md" | "lg"; color?: string }> = ({ 
  size = "md", 
  color = "text-purple-600" 
}) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <svg
      className={`animate-spin ${sizeClasses[size]} ${color}`}
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
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );
};

const MyCoursesPage = () => {
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchCourses = async () => {
        try {
          setIsLoading(true);
          const data = await getMyCourses(token);
          setCourses(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchCourses();
    }
  }, [token]);

  const handleDeactivate = async (courseId: string) => {
    if (
      !token ||
      !window.confirm(
        "Are you sure you want to deactivate this course? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      const updatedCourse = await toggleCourseStatus(courseId, token);
      setCourses((currentCourses) =>
        currentCourses.map((course) =>
          course._id === courseId ? updatedCourse : course
        )
      );
    } catch (err: any) {
      alert(err.message);
    }
  };

 if (isLoading)
  return (
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
          <p className="text-gray-700 font-medium text-base">Loading Courses</p>
          <div className="flex gap-1">
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>
      </div>
    </div>
  );

  if (error)
    return (
      <p className="text-center text-red-500 py-20 text-lg">Error: {error}</p>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-10 gap-4">
          <h1 className="text-3xl md:text-4xl font-extrabold text-gray-800">
            My{" "}
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Courses
            </span>
          </h1>
          <Link
            to="/instructor/courses/create"
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-2 px-5 rounded-lg shadow-md hover:opacity-90 transition"
          >
            + Create New Course
          </Link>
        </div>

        {/* Courses Grid */}
        {courses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {courses.map((course) => (
              <InstructorCourseCard
                key={course._id}
                course={course}
                onDeactivate={handleDeactivate}
              />
            ))}
          </div>
        ) : (
          <div className="text-center bg-white p-12 rounded-2xl shadow-md border border-gray-100 mt-8">
            <p className="text-gray-600 text-lg">
              You haven't created any courses yet.
            </p>
            <Link
              to="/instructor/courses/create"
              className="mt-5 inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition"
            >
              Create Your First Course →
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyCoursesPage;