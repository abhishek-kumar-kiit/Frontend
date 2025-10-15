 // src/pages/CreateCoursePage.tsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { createCourse } from "../services/courseService";
import FormInput from "../components/FormInput";
import Button from "../components/Button";
import { SpinnerIcon } from "../components/Spinner";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

const CreateCoursePage = () => {
  const navigate = useNavigate();
  const { token } = useAuth();

  const [courseDetails, setCourseDetails] = useState({
    title: "",
    description: "",
    category: "",
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle course field changes
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setCourseDetails((prev) => ({ ...prev, [name]: value }));
  };

  // Handle image file
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) setImageFile(e.target.files[0]);
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token || !imageFile) {
      setError("Please fill all fields and select an image.");
      return;
    }

    setIsLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("title", courseDetails.title);
    formData.append("description", courseDetails.description);
    formData.append("category", courseDetails.category);
    formData.append("image", imageFile);

    try {
      await createCourse(formData, token);
      navigate("/instructor/my-courses");
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-6 flex items-center justify-center">
      <div className="w-full max-w-3xl bg-white shadow-lg rounded-2xl p-8">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-8">
          Create a{" "}
          <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            New Course
          </span>
        </h1>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
              {error}
            </div>
          )}

          {/* Course Title */}
          <FormInput
            label="Course Title"
            id="title"
            name="title"
            type="text"
            required
            value={courseDetails.title}
            onChange={handleChange}
          />

          {/* Course Description with Markdown */}
          <div>
            <label
              htmlFor="description"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Description (Markdown)
            </label>
            <textarea
              id="description"
              name="description"
              rows={6}
              required
              value={courseDetails.description}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none sm:text-sm"
              placeholder="Write your course description in Markdown..."
            />
            {/* Live preview */}
            {courseDetails.description && (
              <div className="mt-2 p-3 border rounded bg-gray-50 text-gray-800">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {courseDetails.description}
                </ReactMarkdown>
              </div>
            )}
          </div>

          {/* Category */}
          <FormInput
            label="Category"
            id="category"
            name="category"
            type="text"
            required
            value={courseDetails.category}
            onChange={handleChange}
          />

          {/* Course Image */}
          <div>
            <label
              htmlFor="image"
              className="block text-sm font-semibold text-gray-700 mb-1"
            >
              Course Image
            </label>
            <input
              id="image"
              name="image"
              type="file"
              required
              accept="image/png, image/jpeg, image/jpg"
              onChange={handleFileChange}
              className="block w-full text-sm text-gray-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-gradient-to-r file:from-blue-100 file:to-indigo-100
                file:text-blue-700 hover:file:opacity-80 cursor-pointer"
            />
          </div>

          {/* Submit Button */}
          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <SpinnerIcon className="w-5 h-5" />
                  Creating Course...
                </span>
              ) : (
                "Create Course"
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateCoursePage;
