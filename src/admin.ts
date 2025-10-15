// src/types/admin.ts

import type {Course, User } from "./types";


export interface AdminCourse extends Course {
  createdAt: string | number | Date;
  enrollmentCount: number;
}

export interface PaginatedAdminCoursesResponse {
  data: AdminCourse[];
  pagination: {
    hasNextPage: any;
    hasPreviousPage: any;
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface PaginatedUsersResponse {
  data: User[];
  pagination: {
    hasPreviousPage: any;
    hasNextPage: any;
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface DashboardStats {
  totalStudents: number;
  totalInstructors: number;
  totalCourses: number;
  totalEnrollments: number;
}

export interface RecentEnrollment {
  _id: string;
  student: { _id: string; name: string; email: string };
  course: { _id: string; title: string };
  createdAt: string;
}

export interface DashboardData {
  stats: DashboardStats;
  recentUsers: User[];
  recentCourses: Course[];
  recentEnrollments: RecentEnrollment[];
}