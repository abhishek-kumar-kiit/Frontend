 // src/pages/EditCoursePage.tsx

import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { getCourseById, updateCourse } from "../services/courseService";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import type { Course } from "../types";

const EditCoursePage = () => {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  const { token } = useAuth();

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    category: "",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!courseId || !token) return;

    const fetchCourseData = async () => {
      setIsFetching(true);
      try {
        const data: Course = await getCourseById(courseId, token);
        setCourseDetails({
          title: data.title,
          description: data.description,
          category: data.category,
        });
        setExistingImageUrl(data.imageUrl);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setIsFetching(false);
      }
    };
    fetchCourseData();
  }, [courseId, token]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setCourseDetails((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !courseId) return;

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", courseDetails.title);
    formData.append("description", courseDetails.description);
    formData.append("category", courseDetails.category);
    if (imageFile) formData.append("image", imageFile);

    try {
      await updateCourse(courseId, formData, token);
      navigate("/instructor/my-courses");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="min-h-screen bg-gray-50 flex justify-center items-center">
        <div className="flex flex-col items-center gap-6">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-gray-200 rounded-full"></div>
            <div className="absolute top-0 left-0 w-20 h-20 border-4 border-blue-600 rounded-full border-t-transparent border-r-transparent animate-spin"></div>
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-3 h-3 bg-blue-600 rounded-full animate-pulse"></div>
            </div>
          </div>
          <div className="flex flex-col items-center gap-2">
            <p className="text-gray-700 font-medium text-base">Loading course details</p>
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

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Edit{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Course
          </span>
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          <FormInput
            label="Course Title"
            id="title"
            name="title"
            type="text"
            required
            value={courseDetails.title}
            onChange={handleChange}
          />

          {/* Description */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Description
            </label>
            <textarea
              id="description"
              name="description"
              rows={4}
              required
              value={courseDetails.description}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
              placeholder="Update course description..."
            />
          </div>

          <FormInput
            label="Category"
            id="category"
            name="category"
            type="text"
            required
            value={courseDetails.category}
            onChange={handleChange}
          />

          {/* Existing Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-700 mb-2"
            >
              Update Course Image <span className="text-gray-400">(optional)</span>
            </label>

            {existingImageUrl && (
              <div className="mb-3">
                <img
                  src={existingImageUrl}
                  alt="Current course"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-200 shadow-sm"
                />
              </div>
            )}

            <input
              id="image"
              name="image"
              type="file"
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500 cursor-pointer
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-blue-100 file:to-indigo-100
                file:text-blue-700 hover:file:opacity-80"
            />
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
            >
              {isLoading ? "Saving Changes..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditCoursePage;