import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getMyEnrollments, type Enrollment } from '../services/enrollmentService';
import { getMyCourses, getEnrolledStudents } from '../services/courseService';
import type { Course } from '../types';
import ProgressCard from '../components/ProgressCard';
import {
  BookOpen,
  PlusCircle,
  LayoutDashboard,
  Users,
  Activity,
  X,
  TrendingUp,
  Award,
} from 'lucide-react';

const DashboardPage = () => {
  const { user, token } = useAuth();

  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [myCourses, setMyCourses] = useState<Course[]>([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showStudentsModal, setShowStudentsModal] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [enrolledStudents, setEnrolledStudents] = useState<any[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  useEffect(() => {
    const loadData = async () => {
      if (!token || !user) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      try {
        if (user.role === 'Student') {
          const enrollmentData = await getMyEnrollments(token);
          setEnrollments(enrollmentData);
        }
        if (user.role === 'Instructor') {
          const courseData = await getMyCourses(token);
          
          const coursesWithCounts = await Promise.all(
            courseData.map(async (course) => {
              try {
                const students = await getEnrolledStudents(course._id, token);
                return { ...course, enrolledCount: students.length };
              } catch (error) {
                console.log(error);
                return { ...course, enrolledCount: course.enrolledCount || 0 };
              }
            })
          );
          
          setMyCourses(coursesWithCounts);
        }
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [user, token]);

  const handleViewStudents = async (course: Course) => {
    setSelectedCourse(course);
    setShowStudentsModal(true);
    setLoadingStudents(true);
    
    try {
      const students = await getEnrolledStudents(course._id, token!);
      setEnrolledStudents(students);
    } catch (err: any) {
      console.error('Error fetching students:', err);
      setEnrolledStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  };

  const closeModal = () => {
    setShowStudentsModal(false);
    setSelectedCourse(null);
    setEnrolledStudents([]);
  };

  const getCategoryGradient = (category?: string) => {
    switch (category) {
      case 'Web': return 'from-blue-400 to-blue-600';
      case 'Design': return 'from-purple-400 to-purple-600';
      case 'Data': return 'from-sky-400 to-sky-600';
      case 'Marketing': return 'from-emerald-400 to-emerald-600';
      default: return 'from-indigo-400 to-indigo-600';
    }
  };

  const renderStudentDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-700 font-medium text-base">Loading your courses</p>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 py-20">Error: {error}</p>;
    }
    return (
      <div className="space-y-8">
        {/* Student Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Enrolled Courses</h3>
                <p className="text-4xl font-extrabold mt-2">{enrollments.length}</p>
              </div>
              <BookOpen className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-500 to-pink-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">In Progress</h3>
                <p className="text-4xl font-extrabold mt-2">{enrollments.filter(e => e.progress < 100).length}</p>
              </div>
              <TrendingUp className="w-12 h-12 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Completed</h3>
                <p className="text-4xl font-extrabold mt-2">{enrollments.filter(e => e.progress === 100).length}</p>
              </div>
              <Award className="w-12 h-12 opacity-80" />
            </div>
          </div>
        </div>

        {/* My Courses Section */}
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">My Learning Journey</h2>
          {enrollments.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map((enrollment) => (
                <ProgressCard key={enrollment._id} enrollment={enrollment} />
              ))}
            </div>
          ) : (
            <div className="text-center bg-white p-12 rounded-2xl shadow-lg border border-gray-200">
              <div className="text-6xl mb-4">📚</div>
              <p className="text-gray-600 text-lg mb-6">You haven't enrolled in any courses yet.</p>
              <Link
                to="/courses"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
              >
                Explore Courses →
              </Link>
            </div>
          )}
        </div>
      </div>
    );
  };

  const renderInstructorDashboard = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center py-20">
          <div className="flex flex-col items-center gap-6">
            <div className="relative">
              <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
              <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
              <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
              </div>
            </div>
            <div className="flex flex-col items-center gap-2">
              <p className="text-gray-700 font-medium text-base">Loading dashboard</p>
              <div className="flex gap-1.5">
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                <div className="w-2 h-2 bg-blue-600 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
              </div>
            </div>
          </div>
        </div>
      );
    }
    if (error) {
      return <p className="text-center text-red-500 py-20">Error: {error}</p>;
    }
    return (
      <div className="space-y-10">
        {/* Analytics Section */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-500 to-indigo-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Total Courses</h3>
                <p className="text-5xl font-extrabold mt-3">{myCourses.length}</p>
              </div>
              <BookOpen className="w-14 h-14 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-emerald-500 to-teal-600 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Total Students</h3>
                <p className="text-5xl font-extrabold mt-3">
                  {myCourses.reduce((sum, c) => sum + (c.enrolledCount || 0), 0)}
                </p>
              </div>
              <Users className="w-14 h-14 opacity-80" />
            </div>
          </div>

          <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-6 rounded-2xl shadow-lg text-white transform hover:scale-105 transition-all">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-semibold opacity-90 uppercase tracking-wide">Active Courses</h3>
                <p className="text-5xl font-extrabold mt-3">{myCourses.filter(c => c.isActive).length}</p>
              </div>
              <Activity className="w-14 h-14 opacity-80" />
            </div>
          </div>
        </section>

        {/* Quick Actions */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <Link
            to="/instructor/courses/create"
            className="relative flex items-center justify-center py-5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 group-hover:scale-110 transition-transform duration-500"></div>
            <PlusCircle className="w-6 h-6 mr-3 relative z-10" />
            <span className="relative z-10 text-lg">Create New Course</span>
          </Link>

          <Link
            to="/instructor/my-courses"
            className="relative flex items-center justify-center py-5 rounded-xl font-semibold text-white shadow-lg hover:shadow-xl transition-all group overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-indigo-600 group-hover:scale-110 transition-transform duration-500"></div>
            <LayoutDashboard className="w-6 h-6 mr-3 relative z-10" />
            <span className="relative z-10 text-lg">Manage Courses</span>
          </Link>

          <button
            disabled
            className="relative flex items-center justify-center py-5 rounded-xl font-semibold text-white shadow-md cursor-not-allowed opacity-75"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-gray-400 to-gray-500"></div>
            <Activity className="w-6 h-6 mr-3 relative z-10" />
            <span className="relative z-10 text-lg">Analytics (Soon)</span>
          </button>
        </section>

        {/* Recently Created Courses */}
        <section className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-8">
            Your Courses
          </h2>

          {myCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {myCourses.slice(0, 6).map((course) => (
                <div
                  key={course._id}
                  className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden border border-gray-100 flex flex-col group"
                >
                  <div className="relative overflow-hidden">
                    {course.imageUrl ? (
                      <img
                        src={course.imageUrl}
                        alt={course.title}
                        className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className={`w-full h-48 bg-gradient-to-br ${getCategoryGradient(course.category)} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
                        <BookOpen className="w-20 h-20 text-white opacity-90" strokeWidth={1.5} />
                      </div>
                    )}
                    <span className={`absolute top-3 left-3 text-xs font-semibold text-white py-1.5 px-3 rounded-full shadow-lg backdrop-blur-sm ${
                      course.category === "Web" ? "bg-blue-500/90" :
                      course.category === "Design" ? "bg-purple-500/90" :
                      course.category === "Data" ? "bg-sky-500/90" :
                      course.category === "Marketing" ? "bg-emerald-500/90" :
                      "bg-indigo-500/90"
                    }`}>
                      {course.category || 'General'}
                    </span>
                  </div>

                  <div className="p-5 flex flex-col flex-grow">
                    <h3 className="text-lg font-bold text-gray-800 line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
                      {course.description || 'No description available.'}
                    </p>

                    <div className="mb-4 text-sm font-semibold text-gray-700 bg-gray-100 py-2 px-3 rounded-lg inline-flex items-center gap-2 self-start">
                      <Users className="w-4 h-4 text-blue-600" />
                      {course.enrolledCount || 0} Students
                    </div>

                    <div className="flex gap-2 mt-auto">
                      <Link
                        to={`/instructor/courses/${course._id}/manage`}
                        className="flex-1 bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition text-center shadow-md"
                      >
                        Manage
                      </Link>
                      <button
                        onClick={() => handleViewStudents(course)}
                        className="flex-1 bg-gradient-to-r from-emerald-600 to-teal-600 text-white text-sm font-semibold py-2.5 px-4 rounded-lg hover:opacity-90 transition flex items-center justify-center gap-2 shadow-md"
                      >
                        <Users className="w-4 h-4" />
                        View
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 text-gray-600">
              <div className="text-6xl mb-4">🎓</div>
              <p className="text-lg mb-6">You haven't created any courses yet.</p>
              <Link
                to="/instructor/courses/create"
                className="inline-block bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold py-3 px-8 rounded-xl hover:opacity-90 transform hover:scale-105 transition-all shadow-lg"
              >
                Create Your First Course
              </Link>
            </div>
          )}
        </section>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-8 sm:mb-12">
          Welcome back,{" "}
          <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
            {user?.name}
          </span>{" "}
          <span className="inline-block animate-wave">👋</span>
        </h1>
        {user?.role === 'Student' ? renderStudentDashboard() : renderInstructorDashboard()}
      </div>

      {/* Enrolled Students Modal */}
      {showStudentsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white rounded-3xl shadow-2xl max-w-5xl w-full max-h-[90vh] overflow-hidden animate-slideUp">
            <div className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-6 sm:p-8 flex justify-between items-center">
              <div>
                <h2 className="text-2xl sm:text-3xl font-bold text-white">
                  Enrolled Students
                </h2>
                <p className="text-blue-100 mt-1 text-sm sm:text-base">{selectedCourse?.title}</p>
              </div>
              <button
                onClick={closeModal}
                className="text-white hover:bg-white/20 rounded-full p-2 transition-all hover:rotate-90 duration-300"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="p-4 sm:p-8 overflow-y-auto max-h-[calc(90vh-140px)]">
              {loadingStudents ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="relative">
                    <div className="w-16 h-16 border-4 border-gray-200 rounded-full"></div>
                    <div className="absolute top-0 left-0 w-16 h-16 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
                  </div>
                  <p className="mt-4 text-gray-600 font-medium">Loading students...</p>
                </div>
              ) : enrolledStudents.length > 0 ? (
                <div className="overflow-x-auto rounded-xl border border-gray-200 shadow-sm">
                  <table className="w-full text-left">
                    <thead className="bg-gradient-to-r from-blue-50 to-indigo-50">
                      <tr>
                        <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Name</th>
                        <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wider hidden sm:table-cell">Email</th>
                        <th className="p-4 text-sm font-bold text-gray-700 uppercase tracking-wider">Enrolled On</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {enrolledStudents.map((enrollment, idx) => (
                        <tr
                          key={enrollment._id || idx}
                          className="hover:bg-blue-50 transition-colors"
                        >
                          <td className="p-4 text-gray-800 font-medium">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                                {(enrollment.name || enrollment.studentId?.name || enrollment.student?.name || 'U')[0].toUpperCase()}
                              </div>
                              <span>{enrollment.name || enrollment.studentId?.name || enrollment.student?.name || 'Unknown'}</span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-600 hidden sm:table-cell">
                            {enrollment.email || enrollment.studentId?.email || enrollment.student?.email || 'N/A'}
                          </td>
                          <td className="p-4 text-gray-500 text-sm">
                            {enrollment.enrolledAt || enrollment.createdAt 
                              ? new Date(enrollment.enrolledAt || enrollment.createdAt).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric'
                                })
                              : 'N/A'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="text-6xl mb-4">👥</div>
                  <p className="text-gray-500 text-lg font-medium">
                    No students are currently enrolled in this course.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes wave {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(20deg); }
          75% { transform: rotate(-15deg); }
        }
        .animate-wave {
          animation: wave 2s ease-in-out infinite;
          display: inline-block;
          transform-origin: 70% 70%;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out;
        }
        @keyframes slideUp {
          from {
            transform: translateY(50px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        .animate-slideUp {
          animation: slideUp 0.4s ease-out;
        }
      `}</style>
    </div>
  );
};

export default DashboardPage;