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
import { FiUpload } from "react-icons/fi"; // Upload icon
import { MdOutlineLogin } from "react-icons/md"; // Login icon
import { FaMoon, FaSun } from "react-icons/fa"; // Dark mode icons

function Header() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const authStatus = useSelector((state) => state.auth.authStatus);
  const userData = useSelector((state) => state.auth.user);
  const { mutateAsync: logout } = useLogout();

  const [sideBar, setSideBar] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => localStorage.getItem("theme") === "dark");

  // Toggle dark mode
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
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#121212] dark:text-white text-black transition-colors border-b-4 bg-clip-padding border-gradient">
      <div className="mx-auto flex max-w-7xl items-center py-2 px-4">
        {/* Logo */}
        <Link to="/" className="flex items-center w-2/12">
          <Logo className="shrink-0 sm:w-[8rem]" mobile={true} />
        </Link>

        {/* Search Bar */}
        <Search />

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setSideBar((prev) => !prev)}
          className="ml-4 sm:hidden cursor-pointer group flex w-6 flex-wrap gap-y-1.5"
        >
          <span className="block h-[2px] w-full bg-current"></span>
          <span className="block h-[2px] w-2/3 bg-current"></span>
          <span className="block h-[2px] w-full bg-current"></span>
        </button>

        {/* Icons Section */}
        <div className="ml-auto flex items-center space-x-4">
          <button onClick={toggleDarkMode}>
            {isDarkMode ? <FaSun className="w-6 h-6" /> : <FaMoon className="w-6 h-6" />}
          </button>

          {authStatus ? (
            <>
              <button onClick={handleUploadVideo} className="hidden sm:flex">
                <FiUpload className="w-6 h-6" />
              </button>

              <Link to={`/channel/${userData?.username}/videos`} className="hidden sm:flex">
                <img
                  src={userData.avatar?.url}
                  alt={userData.username}
                  className="h-8 w-8 rounded-full object-cover"
                />
              </Link>

              <button onClick={handleLogout} className="text-sm px-4 py-2 bg-gray-700 text-white rounded-md hover:bg-gray-600">
                Logout
              </button>
            </>
          ) : (
            <Link to="/login">
              <MdOutlineLogin className="w-6 h-6" />
            </Link>
          )}
        </div>

        {/* Mobile Sidebar */}
        <div
          className={`fixed inset-y-0 right-0 w-full max-w-xs bg-white dark:bg-[#121212] border-l transition-transform duration-300 ${
            sideBar ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button onClick={() => setSideBar(false)} className="p-4">
            <IoIosCloseCircleOutline className="w-9 h-9" />
          </button>

          <ul className="my-4 flex flex-col px-4">
            {mobileSidebarItems.map((item, index) => (
              <li key={index}>
                <Link to={item.path} className="flex items-center gap-x-4 py-2 text-left dark:text-white hover:bg-gray-200 dark:hover:bg-gray-800">
                  {item.icon}
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </header>
  );
}

export default Header;
