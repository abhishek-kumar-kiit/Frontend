// src/pages/EnrolledStudentsPage.tsx
import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getEnrolledStudents } from "../services/courseService";
import { SpinnerIcon } from "../components/Spinner";
import { ArrowLeft, Users, Mail, Calendar } from "lucide-react";
import type { Student } from "../types";

const EnrolledStudentsPage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();

  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (courseId && token) {
      const fetchStudents = async () => {
        try {
          setIsLoading(true);
          const data = await getEnrolledStudents(courseId, token);
          setStudents(data);
        } catch (err: any) {
          setError(err.message);
        } finally {
          setIsLoading(false);
        }
      };
      fetchStudents();
    }
  }, [courseId, token]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-700 font-semibold text-lg">Loading students...</p>
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

  if (error)
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 flex items-center justify-center p-4">
        <div className="text-center bg-red-50 p-8 rounded-2xl border border-red-200 shadow-lg">
          <p className="text-red-600 text-lg font-semibold mb-2">⚠️ Error Loading Students</p>
          <p className="text-red-500">{error}</p>
        </div>
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 py-8 sm:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-gray-900 mb-2">
              Enrolled{" "}
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                Students
              </span>
            </h1>
            <p className="text-gray-600 flex items-center gap-2 mt-2">
              <Users className="w-5 h-5" />
              <span className="font-semibold">{students.length}</span> students enrolled
            </p>
          </div>
          <Link
            to={`/instructor/courses/${courseId}/manage`}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 transition px-6 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Course
          </Link>
        </div>

        {/* Students Section */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200">
          {students.length > 0 ? (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                    <tr>
                      <th className="p-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Student
                      </th>
                      <th className="p-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Email
                      </th>
                      <th className="p-5 text-left text-sm font-bold text-white uppercase tracking-wider">
                        Enrolled On
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {students.map((student, idx) => (
                      <tr
                        key={student._id}
                        className={`hover:bg-blue-50 transition-all ${
                          idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }`}
                      >
                        <td className="p-5">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                              {student.name[0].toUpperCase()}
                            </div>
                            <span className="text-gray-800 font-semibold text-lg">
                              {student.name}
                            </span>
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-gray-600">
                            <Mail className="w-4 h-4 text-blue-500" />
                            {student.email}
                          </div>
                        </td>
                        <td className="p-5">
                          <div className="flex items-center gap-2 text-gray-500">
                            <Calendar className="w-4 h-4 text-purple-500" />
                            {new Date(student.createdAt).toLocaleDateString('en-US', {
                              month: 'long',
                              day: 'numeric',
                              year: 'numeric'
                            })}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden divide-y divide-gray-200">
                {students.map((student, idx) => (
                  <div
                    key={student._id}
                    className={`p-6 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-14 h-14 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                        {student.name[0].toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-lg font-bold text-gray-800 mb-2">
                          {student.name}
                        </h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Mail className="w-4 h-4 text-blue-500 flex-shrink-0" />
                            <span className="truncate">{student.email}</span>
                          </div>
                          <div className="flex items-center gap-2 text-sm text-gray-500">
                            <Calendar className="w-4 h-4 text-purple-500 flex-shrink-0" />
                            <span>
                              {new Date(student.createdAt).toLocaleDateString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric'
                              })}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-20 px-4">
              <div className="text-6xl mb-4">👥</div>
              <p className="text-gray-500 text-lg font-semibold mb-2">
                No students enrolled yet
              </p>
              <p className="text-gray-400 text-sm">
                Students will appear here once they enroll in your course
              </p>
            </div>
          )}
        </div>

        {/* Summary Card */}
        {students.length > 0 && (
          <div className="mt-8 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold mb-2">Total Enrollment</h3>
                <p className="text-blue-100">Keep up the great work! 🎉</p>
              </div>
              <div className="text-5xl sm:text-6xl font-extrabold">
                {students.length}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnrolledStudentsPage;