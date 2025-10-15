// src/pages/CoursesListPage.tsx

import { useState, useEffect } from "react";
import { getAllCourses } from "../services/courseService";
import { useAuth } from "../contexts/AuthContext";
import type { Course } from "../types";
import CourseCard from "../components/CourseCard";
import { Search, Filter } from "lucide-react";

const CoursesListPage = () => {
  const { token } = useAuth();
  const [allCourses, setAllCourses] = useState<Course[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  const COURSES_PER_PAGE = 8;

  useEffect(() => {
    const fetchAllCourses = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await getAllCourses(token);
        const activeCourses = response.data.filter((course) => course.isActive);
        setAllCourses(activeCourses);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAllCourses();
  }, [token]);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Filter courses based on search
    const filtered = searchTerm
      ? allCourses.filter((course) =>
          course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          course.category?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : allCourses;

    const total = Math.ceil(filtered.length / COURSES_PER_PAGE);
    setTotalPages(total);

    const startIndex = (currentPage - 1) * COURSES_PER_PAGE;
    const paginated = filtered.slice(startIndex, startIndex + COURSES_PER_PAGE);

    setCourses(paginated);
  }, [allCourses, currentPage, searchTerm]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  const handlePageClick = (page: number) => {
    setCurrentPage(page);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push('...');
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-700 font-semibold text-lg">Loading Courses</p>
            <div className="flex gap-1.5">
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
      <div className="flex justify-center items-center min-h-[70vh]">
        <div className="text-center bg-red-50 p-8 rounded-2xl border border-red-200">
          <p className="text-red-600 text-lg font-semibold">⚠️ Error Loading Courses</p>
          <p className="text-red-500 mt-2">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Page Header */}
        <div className="text-center mb-8 sm:mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-3">
            Explore Our{" "}
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              Courses
            </span>
          </h1>
          <p className="text-gray-600 mt-3 text-base sm:text-lg max-w-2xl mx-auto px-4">
            Learn new skills and boost your career with our expert-led programs
          </p>
        </div>

        {/* Search Bar */}
        <div className="max-w-2xl mx-auto mb-8 sm:mb-10">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search courses by title, category, or description..."
              value={searchTerm}
              onChange={handleSearch}
              className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-xl border-2 border-gray-200 focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all outline-none text-gray-700 shadow-sm"
            />
          </div>
        </div>

        {/* Course Grid */}
        {courses.length > 0 ? (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8 mb-12">
              {courses.map((course) => (
                <div key={course._id} className="w-full flex justify-center">
                  <CourseCard course={course} />
                </div>
              ))}
            </div>

            {/* Enhanced Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-4 sm:gap-6 mt-12 px-4">
                {/* Previous Button */}
                <button
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto px-6 py-3 bg-white text-gray-700 rounded-xl font-semibold shadow-md hover:shadow-lg hover:bg-gray-50 transition-all disabled:bg-gray-100 disabled:text-gray-400 disabled:cursor-not-allowed disabled:shadow-none border border-gray-200"
                >
                  ← Previous
                </button>

                {/* Page Numbers */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0">
                  {getPageNumbers().map((page, index) => (
                    page === '...' ? (
                      <span key={`ellipsis-${index}`} className="px-2 text-gray-400">...</span>
                    ) : (
                      <button
                        key={page}
                        onClick={() => handlePageClick(page as number)}
                        className={`min-w-[44px] h-11 px-4 rounded-lg font-semibold transition-all ${
                          currentPage === page
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-110'
                            : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                        }`}
                      >
                        {page}
                      </button>
                    )
                  ))}
                </div>

                {/* Next Button */}
                <button
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-semibold shadow-md hover:shadow-lg hover:scale-105 transition-all disabled:bg-gray-300 disabled:cursor-not-allowed disabled:shadow-none disabled:scale-100"
                >
                  Next →
                </button>
              </div>
            )}

            {/* Page Info */}
            <div className="text-center mt-6 text-gray-600 text-sm">
              Showing {((currentPage - 1) * COURSES_PER_PAGE) + 1} - {Math.min(currentPage * COURSES_PER_PAGE, searchTerm ? courses.length : allCourses.length)} of {searchTerm ? allCourses.filter(c => c.title.toLowerCase().includes(searchTerm.toLowerCase())).length : allCourses.length} courses
            </div>
          </>
        ) : (
          <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-gray-200 mt-8">
            <div className="text-6xl mb-4">📚</div>
            <p className="text-gray-600 text-lg font-semibold mb-2">
              {searchTerm ? 'No courses found matching your search' : 'No courses available at the moment'}
            </p>
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="mt-4 text-blue-600 hover:text-blue-700 font-semibold"
              >
                Clear search
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CoursesListPage;