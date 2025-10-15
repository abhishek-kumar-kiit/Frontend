// src/services/lessonService.ts

import apiService from './apiService';
import type { Lesson } from '../types';

// CREATE: Add a new lesson to a course
export const createLesson = async (courseId: string, lessonData: FormData, token: string): Promise<Lesson> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiService.post(`/lessons/course/${courseId}`, lessonData, config);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to create lesson.');
  }
};

// UPDATE: Modify an existing lesson
export const updateLesson = async (lessonId: string, lessonData: FormData, token: string): Promise<Lesson> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiService.put(`/lessons/${lessonId}`, lessonData, config);
    return response.data.data;
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update lesson.');
  }
};

// DELETE: Remove a lesson
export const deleteLesson = async (lessonId: string, token: string): Promise<any> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    await apiService.delete(`/lessons/${lessonId}`, config);
    return { success: true, message: 'Lesson deleted successfully' };
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to delete lesson.');
  }
};