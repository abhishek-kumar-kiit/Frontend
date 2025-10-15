// src/pages/ManageCoursePage.tsx

import { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import {
  getCourseById,
  getLessonsByCourseId,
} from "../services/courseService";
import {
  createLesson,
  updateLesson,
  deleteLesson,
} from "../services/lessonService";
import type { Course, Lesson } from "../types";
import Modal from "../components/Modal";
import LessonForm from "../components/LessonForm";
import { Plus, Eye, Trash2, Edit2, AlertCircle, Book } from "lucide-react";

const ManageCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<Lesson | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !token) return;
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [courseData, lessonsData] = await Promise.all([
          getCourseById(courseId, token),
          getLessonsByCourseId(courseId, token),
        ]);
        setCourse(courseData);
        setLessons(lessonsData);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId, token]);

  const openAddModal = () => {
    setEditingLesson(null);
    setIsModalOpen(true);
  };

  const openEditModal = (lesson: Lesson) => {
    setEditingLesson(lesson);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingLesson(null);
  };

  const handleFormSubmit = async (formData: FormData) => {
    if (!token || !courseId) return;
    setIsSubmitting(true);
    try {
      if (editingLesson) {
        const updatedLesson = await updateLesson(
          editingLesson._id,
          formData,
          token
        );
        setLessons((prev) =>
          prev.map((l) => (l._id === updatedLesson._id ? updatedLesson : l))
        );
      } else {
        const newLesson = await createLesson(courseId, formData, token);
        setLessons((prev) => [...prev, newLesson]);
      }
      closeModal();
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteLesson = async (lessonId: string) => {
    if (!token) return;
    try {
      await deleteLesson(lessonId, token);
      setLessons((prev) => prev.filter((l) => l._id !== lessonId));
      setDeleteConfirm(null);
    } catch (err: any) {
      alert(err.message);
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50 pt-20">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-500 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
          </div>
          <div className="flex flex-col items-center gap-3">
            <p className="text-gray-700 font-semibold text-base">Loading course content...</p>
            <div className="flex gap-1.5">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center pt-20">
        <div className="bg-white rounded-xl shadow-sm border border-red-100 p-6 max-w-md">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-5 h-5 text-red-500" />
            <h3 className="font-semibold text-gray-900">Error Loading Course</h3>
          </div>
          <p className="text-gray-600 text-sm">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 pt-28">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-600 mb-2">Manage Course</p>
              <h1 className="text-4xl font-bold text-gray-900">
                {course?.title}
              </h1>
              {course?.description && (
                <p className="text-gray-600 text-sm mt-3 max-w-2xl">
                  {course.description}
                </p>
              )}
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto">
              <Link
                to={`/courses/${course?._id}`}
                
                rel="noopener noreferrer"
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 font-medium py-2.5 px-4 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Eye className="w-4 h-4" />
                Preview
              </Link>
              <button
                onClick={openAddModal}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2.5 px-4 rounded-lg hover:opacity-90 transition-opacity shadow-sm"
              >
                <Plus className="w-4 h-4" />
                Add Lesson
              </button>
            </div>
          </div>
        </div>

        {/* Lessons Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100">
          <div className="px-6 py-5 border-b border-gray-100 flex items-center gap-3">
            <Book className="w-5 h-5 text-blue-500" />
            <h2 className="text-lg font-semibold text-gray-900">
              Lessons ({lessons.length})
            </h2>
          </div>

          {lessons.length > 0 ? (
            <div className="p-6">
              <div className="space-y-3">
                {lessons
                  .sort((a, b) => a.order - b.order)
                  .map((lesson, index) => (
                    <div
                      key={lesson._id}
                      className="group flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100/50 border border-gray-200 rounded-lg hover:shadow-md hover:border-gray-300 transition-all"
                    >
                      <div className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 text-white rounded-lg flex items-center justify-center font-semibold text-sm">
                          {lesson.order}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="font-semibold text-gray-900 truncate">
                            {lesson.title}
                          </p>
                          {lesson.description && (
                            <p className="text-sm text-gray-600 truncate">
                              {lesson.description}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 ml-4 flex-shrink-0">
                        <button
                          onClick={() => openEditModal(lesson)}
                          className="p-2 text-gray-600 hover:bg-blue-50 hover:text-blue-600 rounded-lg transition-colors"
                          title="Edit lesson"
                        >
                          <Edit2 className="w-4 h-4" />
                        </button>
                        <div className="relative">
                          {deleteConfirm === lesson._id ? (
                            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-3 whitespace-nowrap z-10">
                              <p className="text-sm text-gray-700 mb-2 font-medium">
                                Delete lesson?
                              </p>
                              <div className="flex gap-2">
                                <button
                                  onClick={() => setDeleteConfirm(null)}
                                  className="px-3 py-1 text-xs bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
                                >
                                  Cancel
                                </button>
                                <button
                                  onClick={() =>
                                    handleDeleteLesson(lesson._id)
                                  }
                                  className="px-3 py-1 text-xs bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                                >
                                  Delete
                                </button>
                              </div>
                            </div>
                          ) : (
                            <button
                              onClick={() => setDeleteConfirm(lesson._id)}
                              className="p-2 text-gray-600 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                              title="Delete lesson"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          ) : (
            <div className="px-6 py-12 text-center">
              <Book className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-600 text-base mb-4">
                No lessons yet. Create your first lesson to get started.
              </p>
              <button
                onClick={openAddModal}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-medium py-2.5 px-5 rounded-lg hover:opacity-90 transition-opacity"
              >
                <Plus className="w-4 h-4" />
                Add First Lesson
              </button>
            </div>
          )}
        </div>

        {/* Modal */}
        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={editingLesson ? "Edit Lesson" : "Add New Lesson"}
        >
          <LessonForm
            onSubmit={handleFormSubmit}
            onCancel={closeModal}
            isLoading={isSubmitting}
            initialData={editingLesson}
          />
        </Modal>
      </div>
    </div>
  );
};

export default ManageCoursePage;