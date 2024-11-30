import React from "react";

function Footer({ isDarkMode }) {
  const currentYear = new Date().getFullYear();
  return (
    <footer
      className={`py-6 px-4 ${
        isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Section: Copyright */}
        <div className="text-sm">
          <p>
            &copy; {currentYear} YourCompany. All rights reserved.
          </p>
        </div>

        {/* Center Section: Navigation Links */}
        <div className="mt-4 md:mt-0">
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
            <li>
              <a
                href="#privacy"
                className={`hover:text-orange-600 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Privacy Policy
              </a>
            </li>
            <li>
              <a
                href="#terms"
                className={`hover:text-orange-600 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Terms of Service
              </a>
            </li>
            <li>
              <a
                href="#contact"
                className={`hover:text-orange-600 ${
                  isDarkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Contact Us
              </a>
            </li>
          </ul>
        </div>

        {/* Right Section: Social Media Icons */}
        <div className="mt-4 md:mt-0">
          <ul className="flex space-x-4">
            <li>
              <a
                href="#facebook"
                className="hover:text-orange-600"
                aria-label="Facebook"
              >
                <i className="fab fa-facebook"></i>
              </a>
            </li>
            <li>
              <a
                href="#twitter"
                className="hover:text-orange-600"
                aria-label="Twitter"
              >
                <i className="fab fa-twitter"></i>
              </a>
            </li>
            <li>
              <a
                href="#instagram"
                className="hover:text-orange-600"
                aria-label="Instagram"
              >
                <i className="fab fa-instagram"></i>
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        Designed with ❤️ Yashvardhan Sharma.
      </div>
    </footer>
  );
}

export default Footer;
