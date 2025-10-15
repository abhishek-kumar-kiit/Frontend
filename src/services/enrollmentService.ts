// src/services/enrollmentService.ts

import apiService from './apiService';
import type { Course } from '../types';

export interface Enrollment {
  _id: string;
  course: Course;
  progress: number;
  totalLessons: number;
  completedLessons: { _id: string }[]; 
}

export const enrollInCourse = async (courseId: string, token: string): Promise<any> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await apiService.post('/enrollments', { courseId }, config);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to enroll in the course.');
    }
    throw new Error('An unexpected error occurred during enrollment.');
  }
};

export const markLessonAsComplete = async (lessonId: string, token: string): Promise<any> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await apiService.post('/enrollments/mark-complete', { lessonId }, config);
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to mark lesson as complete.');
    }
    throw new Error('An unexpected error occurred.');
  }
};

export const getMyEnrollments = async (token: string): Promise<Enrollment[]> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiService.get('/enrollments/my-enrollments', config);

    const enrollments = response.data?.data?.data || response.data?.data || [];
    return enrollments;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch enrollments.');
    }
    throw new Error('An unexpected error occurred while fetching enrollments.');
  }
};