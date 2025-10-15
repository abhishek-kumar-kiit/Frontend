// src/pages/admin/AdminUsersPage.tsx

import React, { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getUsers, toggleUserStatus, type UserFilters } from '../services/adminService';
import type { PaginatedUsersResponse } from '../types/index';
import { debounce } from 'lodash';

const AdminUsersPage = () => {
  const { token } = useAuth();
  const [usersResponse, setUsersResponse] = useState<PaginatedUsersResponse | null>(null);
  const [filters, setFilters] = useState<UserFilters>({ page: 1, limit: 10, role: '', isActive: '', search: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async (currentFilters: UserFilters) => {
    if (!token) return;
    setIsLoading(true);
    setError(null);
    try {
      const data = await getUsers(token, currentFilters);
      setUsersResponse(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  }, [token]);

  const debouncedFetch = useCallback(debounce((newFilters) => fetchUsers(newFilters), 500), [fetchUsers]);

  useEffect(() => {
    debouncedFetch(filters);
    return () => debouncedFetch.cancel();
  }, [filters, debouncedFetch]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFilters(prev => ({ ...prev, page: 1, [e.target.name]: e.target.value }));
  };
  
  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || (usersResponse && newPage > usersResponse.pagination.totalPages)) {
        return;
    }
    setFilters(prev => ({ ...prev, page: newPage }));
  };

  const handleToggleStatus = async (userId: string) => {
    if (!token || !window.confirm("Are you sure you want to change this user's status?")) return;
    try {
      const updatedUser = await toggleUserStatus(userId, token);
      setUsersResponse(prev => {
          if (!prev) return null;
          return {
              ...prev,
              data: prev.data.map(user => user._id === userId ? { ...user, isActive: updatedUser.isActive } : user),
          };
      });
    } catch (err: any) {
      alert(err.message);
    }
  };
  
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">User Management</h1>

      {/* Filter Controls */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 bg-white p-4 rounded-lg shadow-md">
        <input type="text" name="search" placeholder="Search by name or email..." onChange={handleFilterChange} className="p-2 border rounded" />
        <select name="role" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">All Roles</option>
          <option value="Student">Student</option>
          <option value="Instructor">Instructor</option>
        </select>
        <select name="isActive" onChange={handleFilterChange} className="p-2 border rounded">
          <option value="">Any Status</option>
          <option value="true">Active</option>
          <option value="false">Inactive</option>
        </select>
      </div>
      
      {isLoading && <p>Loading users...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!isLoading && usersResponse && (
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-gray-50">
              <tr className="border-b">
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Joined</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersResponse.data.map(user => (
                <tr key={user._id} className="border-b hover:bg-gray-50">
                  <td className="p-4 font-medium">{user.name}</td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role}</td>
                  <td className="p-4">
                    <span className={`px-2 py-1 text-xs font-semibold rounded-full ${user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {user.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="p-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="p-4 whitespace-nowrap">
                    <button onClick={() => handleToggleStatus(user._id)} className="text-blue-500 hover:underline">
                      {user.isActive ? 'Deactivate' : 'Activate'}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Pagination Controls */}
      {!isLoading && usersResponse?.pagination && usersResponse.pagination.totalPages > 1 && (
        <div className="flex justify-center items-center mt-6">
          <button 
            onClick={() => handlePageChange(usersResponse.pagination.currentPage - 1)} 
            disabled={!usersResponse.pagination.hasPreviousPage} 
            className="px-4 py-2 border rounded-md mx-1 disabled:opacity-50"
          >
            &larr; Previous
          </button>
          <span className="px-4">
            Page {usersResponse.pagination.currentPage} of {usersResponse.pagination.totalPages}
          </span>
          <button 
            onClick={() => handlePageChange(usersResponse.pagination.currentPage + 1)} 
            disabled={!usersResponse.pagination.hasNextPage} 
            className="px-4 py-2 border rounded-md mx-1 disabled:opacity-50"
          >
            Next &rarr;
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminUsersPage;