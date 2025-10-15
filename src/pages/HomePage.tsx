 import React from "react";
import { Link } from "react-router-dom";

const HomePage: React.FC = () => {
  return (
    <div className="bg-[#F9FAFB] min-h-screen flex flex-col">
      {/* ===== Hero Section ===== */}
      <section className="relative flex flex-col md:flex-row items-center justify-center md:justify-between px-8 md:px-20 h-screen overflow-hidden">
        {/* Background image only visible on mobile */}
        <img
          src="https://img.freepik.com/free-vector/online-education-illustration_1284-68476.jpg?w=1380"
          alt="Online Learning"
          className="absolute inset-0 w-full h-full object-cover opacity-10 md:hidden"
        />

        {/* --- Left Side Text --- */}
        <div className="relative z-10 flex-1 text-center md:text-left">
          <h1 className="text-3xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-snug">
            Empower Your Learning Journey <br /> with{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Learnify
            </span>
          </h1>
          <p className="text-gray-600 mb-8 text-base md:text-lg max-w-xl mx-auto md:mx-0">
            Discover expert-led online courses. Build your skills and achieve
            your learning goals with our interactive platform.
          </p>
          <Link
            to="/courses"
            className="inline-block bg-gradient-to-r from-blue-500 to-purple-600 text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition"
          >
            View Courses
          </Link>

          {/* Social Links */}
          <div className="flex justify-center md:justify-start space-x-5 mt-6 text-gray-600">
            <a
              href="https://www.instagram.com/utkallabs/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-pink-500 transition"
            >
              <i className="fab fa-instagram text-xl"></i>
            </a>
            <a
              href="https://www.facebook.com/utkallabsindia/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-600 transition"
            >
              <i className="fab fa-facebook text-xl"></i>
            </a>
            <a
              href="https://x.com/UtkalLabs"
              target="_blank"
              rel="noreferrer"
              className="hover:text-sky-500 transition"
            >
              <i className="fab fa-twitter text-xl"></i>
            </a>
            <a
              href="https://www.linkedin.com/company/utkal-labs/"
              target="_blank"
              rel="noreferrer"
              className="hover:text-blue-700 transition"
            >
              <i className="fab fa-linkedin text-xl"></i>
            </a>
          </div>
        </div>

        {/* --- Right Side Image (desktop view) --- */}
        <div className="flex-1 hidden md:flex justify-center">
          <img
            src="https://img.freepik.com/free-vector/online-education-illustration_1284-68476.jpg?w=1380"
            alt="Learning Illustration"
            className="w-full max-w-lg rounded-xl shadow-md"
          />
        </div>
      </section>
    </div>
  );
};

export default HomePage;
