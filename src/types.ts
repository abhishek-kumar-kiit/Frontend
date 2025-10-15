// src/types/types.ts

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'Student' | 'Instructor' | 'Admin'; 
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Instructor {
  _id: string;
  name: string;
  email: string;
}

export interface Student {
  _id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface Course {
  _id: string;
  title: string;
  description: string;
  category: string;
  imageUrl: string;
  instructor: Instructor;
  isActive: boolean;
  enrollment: boolean;
  progress?: number;
  thumbnail?: string;
  image?: string;
  enrolledCount?: number; // Added for instructor dashboard
}

export interface PaginatedCoursesResponse {
  data: Course[];
  pagination: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
}

export interface Lesson {
  _id: string;
  title: string;
  content: string;
  order: number;
  videoUrl: string;
  videoType?: 'upload' | 'link';
  isCompleted?: boolean;
  description?: string;
}