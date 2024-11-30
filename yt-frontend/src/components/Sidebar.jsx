import React from "react";
import { AiOutlineHome } from "react-icons/ai";
import { BiLike } from "react-icons/bi";
import { LuHistory } from "react-icons/lu";
import { GoDeviceCameraVideo } from "react-icons/go";
import { BsCollectionPlay } from "react-icons/bs";
import { LiaUserCheckSolid } from "react-icons/lia";
import { Link } from "react-router-dom";
import { IconContext } from "react-icons";
import { CiSettings } from "react-icons/ci";
import { RxQuestionMarkCircled } from "react-icons/rx";
import { useSelector } from "react-redux";
import { FaRegCommentDots } from "react-icons/fa";

function Sidebar({ isDarkMode }) {
  const fullSize = useSelector((state) => state.ui.sideBarFullSize);
  const username = useSelector((state) => state.auth.user?.username);
  const sidebarItems = [
    {
      name: "Home",
      path: "/",
      icon: <AiOutlineHome />,
      onMobile: true,
    },
    {
      name: "Liked Videos",
      path: "/liked-videos",
      icon: <BiLike />,
      onMobile: false,
    },
    {
      name: "History",
      path: "/history",
      icon: <LuHistory />,
      onMobile: true,
    },
    {
      name: "My Channel",
      path: `/channel/${username}/videos`,
      icon: <GoDeviceCameraVideo />,
      onMobile: false,
    },
    {
      name: "My Studio",
      path: "/my-studio",
      icon: <BsCollectionPlay />,
      onMobile: true,
    },
    {
      name: "Subscriptions",
      path: "/subscriptions",
      icon: <LiaUserCheckSolid />,
      onMobile: true,
    },
    {
      name: "Tweets",
      path: "/tweets",
      icon: <FaRegCommentDots />,
      onMobile: true,
    },
  ];

  return (
    <aside
      className={`z-40 group absolute inset-x-0 bottom-0 w-full shrink-0 border-t ${
        isDarkMode ? "border-white bg-[#121212]" : "border-gray-300 bg-white"
      } px-2 py-2 sm:absolute sm:inset-y-0 sm:max-w-[70px] sm:border-r sm:border-t-0 sm:py-6 sm:hover:max-w-[250px] ${
        fullSize ? "lg:sticky lg:max-w-[250px]" : ""
      }`}
    >
      <IconContext.Provider value={{ className: "w-6 h-6" }}>
        <ul className="flex justify-around gap-y-2 sm:sticky sm:top-[106px] sm:min-h-[calc(100vh-130px)] sm:flex-col">
          {sidebarItems.map((item, index) => (
            <li
              key={index}
              className={`${item.onMobile ? "" : "hidden"} sm:block`}
            >
              <Link
                to={item.path}
                className={`flex flex-col items-center justify-center ${
                  isDarkMode
                    ? "border-white py-1 text-white focus:text-[#ae7aff]" // Dark mode text and focus
                    : "border-gray-300 py-1 text-black focus:text-orange-500" // Light mode text and focus
                } sm:w-full sm:flex-row sm:border sm:p-1.5 ${
                  isDarkMode
                    ? "sm:hover:bg-[#e07600] sm:focus:bg-[#e07600]" // Darker Orange in Dark Mode
                    : "sm:hover:bg-[#e69500] sm:focus:bg-[#e69500]" // Darker Orange in Light Mode
                } sm:hover:text-black sm:focus:border-${
                  isDarkMode ? "[#ae7aff]" : "orange-500"
                } sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4`}
              >
                <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                  {item.icon}
                </span>
                <span
                  className={`block sm:hidden sm:group-hover:inline ${
                    fullSize ? "lg:inline" : ""
                  }`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}

          <li className="hidden sm:block mt-auto">
            <Link
              to="/support"
              className={`flex flex-col items-center justify-center ${
                isDarkMode
                  ? "border-white py-1 text-white focus:text-[#ae7aff]"
                  : "border-gray-300 py-1 text-black focus:text-orange-500"
              } sm:w-full sm:flex-row sm:border sm:p-1.5 ${
                isDarkMode
                  ? "sm:hover:bg-[#e07600] sm:focus:bg-[#e07600]" // Darker Orange in Dark Mode
                  : "sm:hover:bg-[#e69500] sm:focus:bg-[#e69500]" // Darker Orange in Light Mode
              } sm:hover:text-black sm:focus:border-${
                isDarkMode ? "[#ae7aff]" : "orange-500"
              } sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4`}
            >
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <RxQuestionMarkCircled />
              </span>
              <span
                className={`block sm:hidden sm:group-hover:inline ${
                  fullSize ? "lg:inline" : ""
                }`}
              >
                Support
              </span>
            </Link>
          </li>

          <li className="hidden sm:block">
            <Link
              to="/edit-profile/personal-info"
              className={`flex flex-col items-center justify-center ${
                isDarkMode
                  ? "border-white py-1 text-white focus:text-[#ae7aff]"
                  : "border-gray-300 py-1 text-black focus:text-orange-500"
              } sm:w-full sm:flex-row sm:border sm:p-1.5 ${
                isDarkMode
                  ? "sm:hover:bg-[#e07600] sm:focus:bg-[#e07600]" // Darker Orange in Dark Mode
                  : "sm:hover:bg-[#e69500] sm:focus:bg-[#e69500]" // Darker Orange in Light Mode
              } sm:hover:text-black sm:focus:border-${
                isDarkMode ? "[#ae7aff]" : "orange-500"
              } sm:focus:text-black sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4`}
            >
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <CiSettings />
              </span>
              <span
                className={`block sm:hidden sm:group-hover:inline ${
                  fullSize ? "lg:inline" : ""
                }`}
              >
                Settings
              </span>
            </Link>
          </li>
        </ul>
      </IconContext.Provider>
    </aside>
  );
}

export default Sidebar;
