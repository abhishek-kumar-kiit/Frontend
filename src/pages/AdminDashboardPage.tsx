// src/pages/admin/AdminDashboardPage.tsx

import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getDashboardData, type DashboardData } from '../services/adminService';

// A simple reusable card component for stats
const StatCard = ({ title, value }: { title: string, value: number }) => (
  <div className="bg-white p-6 rounded-lg shadow-md">
    <h3 className="text-lg font-semibold text-gray-600">{title}</h3>
    <p className="text-4xl font-bold text-blue-600 mt-2">{value}</p>
  </div>
);

const AdminDashboardPage = () => {
  const { token } = useAuth();
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      const fetchData = async () => {
        try {
          const data = await getDashboardData(token);
          setDashboardData(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchData();
    }
  }, [token]);

  if (isLoading) return <p>Loading dashboard...</p>;
  if (error) return <p className="text-red-500">Error: {error}</p>;
  if (!dashboardData) return <p>No data available.</p>;

  const { stats } = dashboardData;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Total Students" value={stats.totalStudents} />
        <StatCard title="Total Instructors" value={stats.totalInstructors} />
        <StatCard title="Total Courses" value={stats.totalCourses} />
        <StatCard title="Total Enrollments" value={stats.totalEnrollments} />
      </div>
    </div>
  );
};

export default AdminDashboardPage;