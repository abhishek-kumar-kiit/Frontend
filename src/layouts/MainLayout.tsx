// src/layouts/MainLayout.tsx

import { Outlet } from "react-router-dom";
import Navbar from "../components/Header";
import Footer from "../components/Footer";

const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* Navbar */}
      <Navbar />

      {/* Main Content - Add top padding to account for fixed navbar */}
      <main className="flex-grow container mx-auto px-6 py-8 mt-16">
        <Outlet />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;