// src/services/courseService.ts

import apiService from './apiService';
import type { PaginatedCoursesResponse, Course, Lesson, Student } from '../types'; // Import our new type

const COURSES_PER_PAGE = 20;


// Function to get all courses. It can optionally accept a token.
export const getAllCourses = async (
  token: string | null,
  page: number = 1,
  searchQuery: string = '' // <-- Add new parameter
): Promise<PaginatedCoursesResponse> => {
  try {
    const params: { [key: string]: any } = {
      page,
      limit: COURSES_PER_PAGE,
    };

    // Only add the search parameter to the request if it's not an empty string
    if (searchQuery) {
      params.search = searchQuery;
    }

    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      params, // Axios will convert this to ?page=1&limit=9&search=...
    };
    
    const response = await apiService.get('/courses', config);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch courses.');
    }
    throw new Error('An unexpected error occurred while fetching courses.');
  }
};

export const getCourseById = async (courseId: string, token: string | null): Promise<Course> => {
  try {
    const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};
    const response = await apiService.get(`/courses/${courseId}`, config);

    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch course details.');
    }
    throw new Error('An unexpected error occurred while fetching course details.');
  }
};

export const getLessonsByCourseId = async (courseId: string, token: string | null): Promise<Lesson[]> => {
  try {
  
    const params = {
      limit: 100,
    };

    const config = {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
      params, 
    };
    
    const response = await apiService.get(`/lessons/course/${courseId}`, config);
    return response.data.data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch lessons.');
    }
    throw new Error('An unexpected error occurred while fetching lessons.');
  }
};
export const getMyCourses = async (token: string): Promise<Course[]> => {
  try {
    const config = {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiService.get('/courses/my-courses', config);

    const courses = response.data?.data?.data || response.data?.data || [];
    return courses;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to fetch your courses.');
    }
    throw new Error('An unexpected error occurred while fetching your courses.');
  }
};

export const createCourse = async (courseData: FormData, token: string): Promise<Course> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiService.post('/courses', courseData, config);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to create the course.');
    }
    throw new Error('An unexpected error occurred while creating the course.');
  }
};

export const updateCourse = async (courseId: string, courseData: FormData, token: string): Promise<Course> => {
  try {
    const config = {
      headers: {
        'Content-Type': 'multipart/form-data',
        Authorization: `Bearer ${token}`,
      },
    };
    const response = await apiService.put(`/courses/${courseId}`, courseData, config);
    return response.data.data;
  } catch (error: any) {
    if (error.response && error.response.data) {
      throw new Error(error.response.data.message || 'Failed to update the course.');
    }
    throw new Error('An unexpected error occurred while updating the course.');
  }
};

export const getEnrolledStudents = async (courseId: string, token: string): Promise<Student[]> => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await apiService.get(`/courses/${courseId}/students`, config);
    return response.data?.data?.data || response.data?.data || [];
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to fetch enrolled students.');
  }
};

export const toggleCourseStatus = async (courseId: string, token: string): Promise<Course> => {
  try {
    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };
    const response = await apiService.delete(`/courses/${courseId}`, config);
    return response.data.data; 
  } catch (error: any) {
    throw new Error(error.response?.data?.message || 'Failed to update course status.');
  }
};