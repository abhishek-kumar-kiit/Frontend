// src/types/index.ts

// Export all types from types.ts
export type { User, Instructor, Student, Course, PaginatedCoursesResponse, Lesson } from '../types';

// Export all admin-related types
export type { 
  AdminCourse, 
  PaginatedAdminCoursesResponse, 
  PaginatedUsersResponse, 
  DashboardStats, 
  RecentEnrollment, 
  DashboardData 
} from '../admin';