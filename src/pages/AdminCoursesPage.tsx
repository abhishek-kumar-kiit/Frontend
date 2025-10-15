// src/pages/admin/AdminCoursesPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getCourses, toggleCourseStatus, type CourseFilters } from '../services/adminService';
import type { PaginatedAdminCoursesResponse } from '../types/index';
import { debounce } from 'lodash';

const AdminCoursesPage = () => {
  const { token } = useAuth();
  const [coursesResponse, setCoursesResponse] = useState<PaginatedAdminCoursesResponse | null>(null);
  const [filters, setFilters] = useState<CourseFilters>({ page: 1, limit: 10, category: '', isActive: '', search: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCourses = useCallback(async (currentFilters: CourseFilters) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getCourses(token, currentFilters);
      setCoursesResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const debouncedFetch = useCallback(debounce((newFilters) => fetchCourses(newFilters), 500), [fetchCourses]);

  useEffect(() => {
    debouncedFetch(filters);
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, page: 1, [e.target.name]: e.target.value }));
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (coursesResponse && newPage > coursesResponse.pagination.totalPages)) {
      return;
    }
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleToggleStatus = async (courseId: string) => {
    if (!token || !window.confirm("Are you sure you want to change this course's status?")) return;
    try {
      const updatedCourse = await toggleCourseStatus(courseId, token);
      setCoursesResponse(prev => {
        if (!prev) return null;
        return {
          ...prev,
          data: prev.data.map(course => 
            course._id === courseId ? { ...course, isActive: updatedCourse.isActive } : course
          ),
        };
      });
    } catch (err: any) {
      alert(err.message);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Course Management</h1>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md">
        <input type="text" name="search" placeholder="Search by title..." onChange={handleFilterChange} className="p-2 border rounded" />
        <input type="text" name="category" placeholder="Filter by category..." onChange={handleFilterChange} className="p-2 border rounded" />
        <select name="isActive" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Any Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      
      {isLoading && <p>Loading courses...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && coursesResponse && (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="p-4">Title</th>
                <th className="p-4">Instructor</th>
                <th className="p-4">Enrollments</th>
                <th className="p-4">Status</th>
                <th className="p-4">Created</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {coursesResponse.data.map(course => (
                <tr key={course._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{course.title}</td>
                  <td className="p-4">{course.instructor?.name || 'Instructor Not Found'}</td>
                  <td className="p-4 font-semibold text-center">{course.enrollmentCount}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${course.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {course.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">{new Date(course.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 whitespace-nowrap">
                    <button onClick={() => handleToggleStatus(course._id)} className="text-blue-500 hover:underline">
                      {course.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && coursesResponse?.pagination && coursesResponse.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <button 
            onClick={() => handlePageChange(coursesResponse.pagination.currentPage - 1)} 
            disabled={!coursesResponse.pagination.hasPreviousPage} 
            className="px-4 py-2 border rounded-md mx-1 disabled:opacity-50"
          >
            &larr; Previous
          </button>
          <span className="px-4">
            Page {coursesResponse.pagination.currentPage} of {coursesResponse.pagination.totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(coursesResponse.pagination.currentPage + 1)} 
            disabled={!coursesResponse.pagination.hasNextPage} 
            className="px-4 py-2 border rounded-md mx-1 disabled:opacity-50"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminCoursesPage;