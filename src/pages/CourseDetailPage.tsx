// src/pages/CourseDetailPage.tsx

import React, { useState, useEffect } from "react";
import { useParams, Link, useLocation } from "react-router-dom";
import {
  getCourseById,
  getLessonsByCourseId,
} from "../services/courseService";
import {
  enrollInCourse,
  markLessonAsComplete,
} from "../services/enrollmentService";
import { useAuth } from "../contexts/AuthContext";
import type { Course, Lesson } from "../types";
import {
  CheckCircleIcon,
  PlayCircleIcon,
  LockClosedIcon,
} from "@heroicons/react/24/solid";
import ReactMarkdown from "react-markdown";
import DOMPurify from "dompurify";

const CourseDetailPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const location = useLocation();
  const passedEnrollmentStatus = location.state?.isEnrolled || false;

  const { user, isAuthenticated, token } = useAuth();

  const [course, setCourse] = useState<Course | null>(null);
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEnrolling, setIsEnrolling] = useState(false);
  const [enrollmentError, setEnrollmentError] = useState<string | null>(null);
  const [isMarking, setIsMarking] = useState(false);
  const [showFullDescription, setShowFullDescription] = useState(false);

  useEffect(() => {
    if (!courseId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const courseData = await getCourseById(courseId, token);

        if (location.state?.isEnrolled) {
          courseData.enrollment = passedEnrollmentStatus;
        }

        const lessonsData = await getLessonsByCourseId(courseId, token);
        setCourse(courseData);
        setLessons(lessonsData);
        if (lessonsData.length > 0) setSelectedLesson(lessonsData[0]);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId, token, passedEnrollmentStatus, location.state]);

  const handleEnroll = async () => {
    if (!token || !courseId) return;
    setIsEnrolling(true);
    setEnrollmentError(null);
    try {
      await enrollInCourse(courseId, token);
      setCourse((prev) =>
        prev ? { ...prev, enrollment: true } : null
      );
    } catch (err: any) {
      setEnrollmentError(err.message);
    } finally {
      setIsEnrolling(false);
    }
  };

  const handleMarkComplete = async () => {
    if (!token || !selectedLesson) return;
    setIsMarking(true);
    try {
      await markLessonAsComplete(selectedLesson._id, token);
      setLessons((prev) =>
        prev.map((lesson) =>
          lesson._id === selectedLesson._id
            ? { ...lesson, isCompleted: true }
            : lesson
        )
      );
      setSelectedLesson((prev) =>
        prev ? { ...prev, isCompleted: true } : null
      );
    } catch (err: any) {
      alert(err.message);
    } finally {
      setIsMarking(false);
    }
  };

  // Helper function to check if URL is YouTube or Vimeo
  const getEmbedUrl = (url: string, videoType?: string) => {
    if (videoType === 'link') {
      // YouTube
      const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/);
      if (youtubeMatch) {
        return `https://www.youtube.com/embed/${youtubeMatch[1]}`;
      }
      
      // Vimeo
      const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
      if (vimeoMatch) {
        return `https://player.vimeo.com/video/${vimeoMatch[1]}`;
      }
    }
    
    return url;
  };

  const renderVideoPlayer = (lesson: Lesson) => {
    const embedUrl = getEmbedUrl(lesson.videoUrl, lesson.videoType);
    const isEmbedded = embedUrl !== lesson.videoUrl;

    if (isEmbedded) {
      return (
        <iframe
          key={lesson._id}
          src={embedUrl}
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          title={lesson.title}
        />
      );
    } else {
      return (
        <video
          key={lesson._id}
          className="w-full h-full"
          controls
          autoPlay
          src={lesson.videoUrl}
        >
          Your browser does not support the video tag.
        </video>
      );
    }
  };

  if (isLoading)
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-700 font-medium text-base">Loading Course</p>
            <div className="flex gap-1">
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      </div>
    );
  if (error)
    return <p className="text-center text-red-500 py-10">Error: {error}</p>;
  if (!course)
    return <p className="text-center py-10 text-gray-600">Course not found.</p>;

  // User role checks
  const isInstructorOwner =
    user?.role === "Instructor" && user?._id === course.instructor._id;
  const isEnrolledStudent = user?.role === "Student" && course.enrollment;
  const isStudent = user?.role === "Student";
  
  // Video access: Owner instructors and enrolled students can watch
  const canWatchVideo = isInstructorOwner || isEnrolledStudent;

  if (!course.isActive && !isInstructorOwner) {
    return (
      <div className="text-center py-16">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">
          Course Unavailable
        </h1>
        <p className="text-lg text-gray-600">
          This course is no longer active and cannot be accessed.
        </p>
        <Link
          to="/courses"
          className="mt-6 inline-block bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:opacity-90 transition"
        >
          ← Back to All Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-4xl font-extrabold text-gray-800 mb-2">
          {course.title}
        </h1>
        <p className="text-gray-600">{course.description}</p>
        <div className="mt-3 flex items-center gap-2 text-sm text-gray-500">
          <span className="font-medium">Instructor:</span>
          <span className="text-gray-700">{course.instructor.name}</span>
          {isInstructorOwner && (
            <span className="ml-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-semibold">
              Your Course
            </span>
          )}
        </div>
      </div>

      <style>{`
        .prose-html h1,
        .prose-html h2,
        .prose-html h3,
        .prose-html h4,
        .prose-html h5,
        .prose-html h6 {
          margin-top: 1rem;
          margin-bottom: 0.75rem;
          font-weight: 600;
        }
        .prose-html p {
          margin-bottom: 0.75rem;
          line-height: 1.6;
        }
        .prose-html ul,
        .prose-html ol {
          margin-bottom: 0.75rem;
          padding-left: 1.5rem;
        }
        .prose-html li {
          margin-bottom: 0.25rem;
        }
        .prose-html a {
          color: #2563eb;
          text-decoration: underline;
        }
        .prose-html a:hover {
          color: #1d4ed8;
        }
        .prose-html code {
          background-color: #f3f4f6;
          padding: 0.25rem 0.5rem;
          border-radius: 0.25rem;
          font-family: monospace;
          font-size: 0.875rem;
        }
        .prose-html pre {
          background-color: #f3f4f6;
          padding: 1rem;
          border-radius: 0.5rem;
          overflow-x: auto;
          margin-bottom: 0.75rem;
        }
        .prose-html blockquote {
          border-left: 4px solid #d1d5db;
          padding-left: 1rem;
          font-style: italic;
          margin: 0.75rem 0;
        }
        .prose-html strong {
          font-weight: 700;
        }
        .prose-html em {
          font-style: italic;
        }
      `}</style>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Video Section */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
            {selectedLesson ? (
              <>
                <div className="aspect-video bg-black relative">
                  {canWatchVideo ? (
                    renderVideoPlayer(selectedLesson)
                  ) : (
                    <>
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-full object-cover opacity-40"
                      />
                      <div className="absolute inset-0 flex flex-col justify-center items-center text-center p-4 bg-black/60">
                        <LockClosedIcon className="w-16 h-16 text-white mb-4" />
                        <h3 className="text-2xl font-bold text-white mb-2">
                          Content Locked
                        </h3>
                        <p className="text-gray-200 text-base max-w-md">
                          {isAuthenticated
                            ? "Enroll in this course to watch lessons."
                            : "Please log in and enroll to access this content."}
                        </p>
                      </div>
                    </>
                  )}
                </div>

                {/* Lesson Details */}
                <div className="p-6">
                  <h2 className="text-2xl font-bold mb-2 text-gray-800">
                    {selectedLesson.title}
                  </h2>
                  
                  {/* Description with View More */}
                  <div className={`text-gray-700 mb-4 transition-all duration-300 ${
                    showFullDescription ? 'max-h-none' : 'max-h-[200px] overflow-hidden relative'
                  }`}>
                    <div className={`prose prose-sm max-w-none prose-html ${
                      !showFullDescription ? 'mask-gradient' : ''
                    }`}>
                      {selectedLesson.content.includes('<') && selectedLesson.content.includes('>') ? (
                        <div
                          className="space-y-2"
                          dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(selectedLesson.content, {
                              ALLOWED_TAGS: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'br', 'strong', 'em', 'b', 'i', 'u', 'ul', 'ol', 'li', 'a', 'blockquote', 'code', 'pre', 'span', 'div', 'img', 'table', 'thead', 'tbody', 'tr', 'th', 'td'],
                              ALLOWED_ATTR: ['href', 'src', 'alt', 'title', 'class', 'id']
                            } as any)
                          }}
                        />
                      ) : (
                        <ReactMarkdown
                          components={{
                            h1: ({...props}) => <h1 className="text-2xl font-bold mt-4 mb-2" {...props} />,
                            h2: ({...props}) => <h2 className="text-xl font-bold mt-3 mb-2" {...props} />,
                            h3: ({...props}) => <h3 className="text-lg font-bold mt-2 mb-1" {...props} />,
                            p: ({...props}) => <p className="mb-2" {...props} />,
                            ul: ({...props}) => <ul className="list-disc list-inside mb-2" {...props} />,
                            ol: ({...props}) => <ol className="list-decimal list-inside mb-2" {...props} />,
                            li: ({...props}) => <li className="ml-2" {...props} />,
                            strong: ({...props}) => <strong className="font-bold" {...props} />,
                            em: ({...props}) => <em className="italic" {...props} />,
                            code: ({...props}) => <code className="bg-gray-100 px-2 py-1 rounded text-sm font-mono" {...props} />,
                            pre: ({...props}) => <pre className="bg-gray-100 p-3 rounded mb-2 overflow-auto" {...props} />,
                            blockquote: ({...props}) => <blockquote className="border-l-4 border-gray-300 pl-4 italic my-2" {...props} />,
                            a: ({...props}) => <a className="text-blue-600 underline hover:text-blue-800" {...props} />,
                          }}
                        >
                          {selectedLesson.content}
                        </ReactMarkdown>
                      )}
                    </div>
                    {!showFullDescription && (
                      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white to-transparent pointer-events-none"></div>
                    )}
                  </div>

                  {/* View More Button */}
                  {selectedLesson.content && selectedLesson.content.length > 300 && (
                    <button
                      type="button"
                      onClick={() => setShowFullDescription(!showFullDescription)}
                      className="mb-4 text-blue-600 hover:text-blue-800 font-medium text-sm flex items-center gap-1 transition"
                    >
                      {showFullDescription ? (
                        <>
                          View Less
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        </>
                      ) : (
                        <>
                          View More
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </>
                      )}
                    </button>
                  )}

                  {/* Mark Complete Button - Only for enrolled students */}
                  {isEnrolledStudent && (
                    <button
                      onClick={handleMarkComplete}
                      disabled={selectedLesson.isCompleted || isMarking}
                      className={`w-full py-3 rounded-lg font-semibold transition-all duration-200 ${
                        selectedLesson.isCompleted
                          ? "bg-green-100 text-green-700"
                          : "bg-gradient-to-r from-blue-500 to-indigo-600 text-white hover:opacity-90"
                      }`}
                    >
                      {isMarking
                        ? "Marking..."
                        : selectedLesson.isCompleted
                        ? "✓ Completed"
                        : "Mark as Complete"}
                    </button>
                  )}
                </div>
              </>
            ) : (
              <p className="p-6 text-center text-gray-500">
                This course has no lessons yet.
              </p>
            )}
          </div>
        </div>

        {/* Sidebar Section */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl shadow-md p-5 space-y-4">
            {/* Action Buttons - Based on User Role */}
            {(() => {
              // Owner Instructor - Show manage button
              if (isInstructorOwner) {
                return (
                  <Link
                    to={`/instructor/courses/${course._id}/students`}
                    className="block w-full text-center bg-gradient-to-r from-purple-500 to-pink-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                  >
                    View Enrolled Students
                  </Link>
                );
              }

              // Not authenticated - Show login button
              if (!isAuthenticated) {
                return (
                  <Link
                    to="/login"
                    className="block w-full text-center bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition"
                  >
                    Login to Enroll
                  </Link>
                );
              }

              // Enrolled Student - Show enrolled status
              if (course.enrollment) {
                return (
                  <div className="p-3 bg-green-100 text-green-700 text-center rounded-md font-semibold flex items-center justify-center gap-2">
                    <CheckCircleIcon className="h-5 w-5" />
                    You are enrolled
                  </div>
                );
              }

              // Student (not enrolled) - Show enroll button
              if (isStudent) {
                return (
                  <>
                    <button
                      onClick={handleEnroll}
                      disabled={isEnrolling}
                      className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-3 rounded-lg hover:opacity-90 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {isEnrolling ? "Enrolling..." : "Enroll Now"}
                    </button>
                    {enrollmentError && (
                      <p className="text-red-500 text-sm">{enrollmentError}</p>
                    )}
                  </>
                );
              }

              return null;
            })()}

            {/* Lessons List */}
            <h3 className="text-xl font-bold border-b pb-2 text-gray-800 pt-2">
              Course Lessons
            </h3>
            <div className="max-h-[600px] overflow-y-auto pr-1 space-y-2">
              {lessons.length > 0 ? (
                lessons.map((lesson) => (
                  <button
                    key={lesson._id}
                    onClick={() => setSelectedLesson(lesson)}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition ${
                      selectedLesson?._id === lesson._id
                        ? "bg-blue-100 border-l-4 border-blue-500"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center flex-1 min-w-0">
                      <PlayCircleIcon className="h-5 w-5 text-gray-400 mr-3 flex-shrink-0" />
                      <span className="text-gray-700 font-medium text-left truncate">
                        {lesson.title}
                      </span>
                    </div>
                    {isEnrolledStudent &&
                      (lesson.isCompleted ? (
                        <CheckCircleIcon
                          className="h-5 w-5 text-green-500 flex-shrink-0 ml-2"
                          title="Completed"
                        />
                      ) : (
                        <div
                          className="h-5 w-5 border-2 border-gray-300 rounded-full flex-shrink-0 ml-2"
                          title="Not Completed"
                        ></div>
                      ))}
                  </button>
                ))
              ) : (
                <p className="text-gray-500 text-center py-4">No lessons available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailPage;