import {
  Facebook,
  Twitter,
  Linkedin,
  Instagram,
  Youtube,
  Mail,
  Phone,
} from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-700 border-t border-gray-100 mt-auto">
      {/* ===== Top Section ===== */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
        
        {/* ==== Logo Section ==== */}
        <div className="flex flex-col">
          <div className="flex items-center space-x-2 mb-4">
            <div className="h-10 w-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">L</span>
            </div>
            <span className="text-lg font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-600">
              Lernify
            </span>
          </div>
          <p className="text-sm text-gray-600 leading-relaxed">
            Empower your learning journey with expert-led courses designed to help you master new skills and achieve your goals.
          </p>
        </div>

        {/* ==== Quick Links ==== */}
        <div>
          <h3 className="text-base font-semibold mb-4 text-gray-900">
            Quick Links
          </h3>
          <ul className="space-y-2.5 text-sm">
            <li>
              <a href="/" className="text-gray-600 hover:text-blue-600 transition-colors">
                Home
              </a>
            </li>
            <li>
              <a href="/courses" className="text-gray-600 hover:text-blue-600 transition-colors">
                Courses
              </a>
            </li>
            <li>
              <a href="/about" className="text-gray-600 hover:text-blue-600 transition-colors">
                About Us
              </a>
            </li>
            <li>
              <a href="/contact" className="text-gray-600 hover:text-blue-600 transition-colors">
                Contact
              </a>
            </li>
          </ul>
        </div>

        {/* ==== Contact Section ==== */}
        <div>
          <h3 className="text-base font-semibold mb-4 text-gray-900">
            Get in Touch
          </h3>
          <div className="space-y-3 text-sm">
            <a
              href="mailto:support@lernify.com"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Mail className="w-4 h-4" />
              support@lernify.com
            </a>
            <a
              href="tel:+919876543210"
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
            >
              <Phone className="w-4 h-4" />
              +91 9876543210
            </a>
          </div>
        </div>

        {/* ==== Newsletter ==== */}
        <div>
          <h3 className="text-base font-semibold mb-4 text-gray-900">
            Stay Updated
          </h3>
          <p className="text-sm text-gray-600 mb-4">
            Subscribe to get the latest courses and updates.
          </p>
          <form className="space-y-2">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full px-4 py-2.5 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent text-sm"
            />
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white py-2.5 px-4 rounded-lg font-medium hover:opacity-90 transition-opacity text-sm"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* ===== Social Section ===== */}
      <div className="border-t border-gray-100 px-6 py-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-6">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} <span className="font-semibold text-gray-900">Lernify</span>. All rights reserved.
          </p>

          {/* Social Icons */}
          <div className="flex gap-4 text-gray-600">
            <a
              href="https://www.facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-600 transition-colors"
            >
              <Facebook className="w-5 h-5" />
            </a>
            <a
              href="https://www.twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-sky-50 hover:text-sky-500 transition-colors"
            >
              <Twitter className="w-5 h-5" />
            </a>
            <a
              href="https://www.linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-blue-50 hover:text-blue-700 transition-colors"
            >
              <Linkedin className="w-5 h-5" />
            </a>
            <a
              href="https://www.instagram.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-pink-50 hover:text-pink-500 transition-colors"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://www.youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="p-2 rounded-lg hover:bg-red-50 hover:text-red-600 transition-colors"
            >
              <Youtube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;