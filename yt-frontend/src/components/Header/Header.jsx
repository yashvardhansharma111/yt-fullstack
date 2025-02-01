import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useLogout } from "../../hooks/auth.hook";
import { setUser } from "../../features/authSlice";
import { setShowUploadVideo } from "../../features/uiSlice";

import Logo from "../../Logo";
import Search from "./SearchBar";
import { BiLike } from "react-icons/bi";
import { GoDeviceCameraVideo } from "react-icons/go";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { CiSettings } from "react-icons/ci";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { FiUpload } from "react-icons/fi";
import { MdOutlineLogin } from "react-icons/md";
import { FaMoon, FaSun } from "react-icons/fa";
import { HiMenu } from "react-icons/hi";

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const userData = useSelector((state) => state.auth.user);
  const { mutateAsync: logout } = useLogout();

  const [sideBar, setSideBar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleLogout = async () => {
    const sessionStatus = await logout();
    if (sessionStatus) {
      dispatch(setUser(null));
    }
  };

  const handleUploadVideo = () => {
    navigate("/my-studio");
    dispatch(setShowUploadVideo(true));
  };

  const mobileSidebarItems = [
    { name: "Liked Videos", path: "/liked-videos", icon: <BiLike /> },
    { name: "My Channel", path: `/channel/${userData?.username}/videos`, icon: <GoDeviceCameraVideo /> },
    { name: "Support", path: "/support", icon: <RxQuestionMarkCircled /> },
    { name: "Settings", path: "/edit-profile/personal-info", icon: <CiSettings /> },
  ];

  useEffect(() => {
    setSideBar(false); 
  }, [location.pathname]);

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#121212] dark:text-white text-black transition-colors shadow-md border-b">
      <div className="mx-auto flex max-w-7xl items-center py-3 px-4">
        
        {/* Logo */}
        <Link to="/" className="flex items-center w-full sm:w-2/12 justify-center sm:justify-start">
          <Logo className="shrink-0 sm:w-[8rem] w-32" mobile={true} />
        </Link>

        {/* Search Bar */}
        <Search />

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSideBar(true)}
          className="ml-4 sm:hidden cursor-pointer flex items-center p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <HiMenu className="w-7 h-7" />
        </button>

        {/* Icons Section */}
        <div className="ml-auto flex items-center space-x-4">
          {/* Dark Mode Toggle */}
          <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
            {isDarkMode ? <FaSun className="w-6 h-6" /> : <FaMoon className="w-6 h-6" />}
          </button>

          {authStatus ? (
            <>
              {/* Upload Button */}
              <button onClick={handleUploadVideo} className="hidden sm:flex p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
                <FiUpload className="w-6 h-6" />
              </button>

              {/* Profile Picture */}
              <Link to={`/channel/${userData?.username}/videos`} className="hidden sm:flex">
                <img
                  src={userData.avatar?.url}
                  alt={userData.username}
                  className="h-9 w-9 rounded-full object-cover border border-gray-300 dark:border-gray-700"
                />
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-red-500 rounded-full hover:bg-red-600 transition-all"
              >
                Logout
              </button>
            </>
          ) : (
            <Link to="/login" className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
              <MdOutlineLogin className="w-6 h-6" />
            </Link>
          )}
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-0 bg-black bg-opacity-50 transition-opacity ${sideBar ? "opacity-100 visible" : "opacity-0 invisible"}`}
          onClick={() => setSideBar(false)}
        ></div>

        <div
          className={`fixed inset-y-0 right-0 w-64 bg-white dark:bg-[#121212] border-l shadow-lg transition-transform transform ${sideBar ? "translate-x-0" : "translate-x-full"}`}
        >
          {/* Close Button */}
          <button onClick={() => setSideBar(false)} className="p-4 flex justify-end">
            <IoIosCloseCircleOutline className="w-9 h-9 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white" />
          </button>

          {/* Sidebar Links */}
          <ul className="my-4 flex flex-col px-4 space-y-2">
            {mobileSidebarItems.map((item, index) => (
              <li key={index}>
                <Link
                  to={item.path}
                  className="flex items-center gap-x-4 py-2 px-3 rounded-md dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800 transition-all"
                >
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}

            {/* Logout Button */}
            {authStatus && (
              <li>
                <button
                  onClick={handleLogout}
                  className="w-full text-left flex items-center gap-x-4 py-2 px-3 rounded-md text-red-500 hover:bg-red-100 dark:hover:bg-red-800 transition-all"
                >
                  <MdOutlineLogin className="w-5 h-5" />
                  Logout
                </button>
              </li>
            )}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
