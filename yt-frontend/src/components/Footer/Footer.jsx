import React from "react";
import { FaFacebookF, FaTwitter, FaInstagram } from "react-icons/fa";

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-8 px-6 bg-gray-100 text-gray-800 dark:bg-black dark:text-white transition-colors duration-300">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center">
        {/* Left Section: Copyright */}
        <div className="text-sm text-center md:text-left">
          <p>&copy; {currentYear} YourCompany. All rights reserved.</p>
        </div>

        {/* Center Section: Navigation Links */}
        <nav className="mt-4 md:mt-0">
          <ul className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-6 text-sm">
            {["Privacy Policy", "Terms of Service", "Contact Us"].map(
              (text, index) => (
                <li key={index}>
                  <a
                    href={`#${text.toLowerCase().replace(/\s/g, "")}`}
                    className="hover:text-orange-500 transition-colors duration-200 dark:hover:text-gray-300"
                  >
                    {text}
                  </a>
                </li>
              )
            )}
          </ul>
        </nav>

        {/* Right Section: Social Media Icons */}
        <div className="mt-4 md:mt-0 flex space-x-4">
          {[FaFacebookF, FaTwitter, FaInstagram].map((Icon, index) => (
            <a
              key={index}
              href="#"
              className="p-2 rounded-full transition duration-300 hover:scale-110 bg-black text-white dark:bg-white dark:text-black"
            >
              <Icon size={16} />
            </a>
          ))}
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-6 text-center text-xs text-gray-500 dark:text-gray-400">
        Designed and developed by Yashvardhan Sharma🗿.
      </div>
    </footer>
  );
}

export default Footer;
