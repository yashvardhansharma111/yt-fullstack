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

function Sidebar() {
  const fullSize = useSelector((state) => state.ui.sideBarFullSize);
  const username = useSelector((state) => state.auth.user?.username);
  const sidebarItems = [
    { name: "Home", path: "/", icon: <AiOutlineHome />, onMobile: true },
    { name: "Liked Videos", path: "/liked-videos", icon: <BiLike />, onMobile: false },
    { name: "History", path: "/history", icon: <LuHistory />, onMobile: true },
    { name: "My Channel", path: `/channel/${username}/videos`, icon: <GoDeviceCameraVideo />, onMobile: false },
    { name: "My Studio", path: "/my-studio", icon: <BsCollectionPlay />, onMobile: true },
    { name: "Subscriptions", path: "/subscriptions", icon: <LiaUserCheckSolid />, onMobile: true },
    { name: "Tweets", path: "/tweets", icon: <FaRegCommentDots />, onMobile: true },
  ];

  return (
    <aside
      className={`z-40 absolute inset-x-0 bottom-0 w-full border-t border-gray-300 dark:border-gray-700 bg-white dark:bg-[#121212] px-2 py-2 sm:absolute sm:inset-y-0 sm:max-w-[70px] sm:border-r sm:border-t-0 sm:py-6 sm:hover:max-w-[250px] transition-all duration-300 ${
        fullSize ? "lg:sticky lg:max-w-[250px]" : ""
      }`}
    >
      <IconContext.Provider value={{ className: "w-6 h-6" }}>
        <ul className="flex justify-around gap-y-2 sm:sticky sm:top-[106px] sm:min-h-[calc(100vh-130px)] sm:flex-col">
          {sidebarItems.map((item, index) => (
            <li key={index} className={`${item.onMobile ? "" : "hidden"} sm:block`}>
              <Link
                to={item.path}
                className="flex flex-col items-center justify-center text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 sm:w-full sm:flex-row sm:p-2 sm:hover:text-black dark:sm:hover:text-white sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 rounded-lg"
              >
                <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                  {item.icon}
                </span>
                <span
                  className={`text-sm sm:hidden sm:group-hover:inline ${fullSize ? "lg:inline" : ""}`}
                >
                  {item.name}
                </span>
              </Link>
            </li>
          ))}

          {/* Support Link */}
          <li className="hidden sm:block mt-auto">
            <Link
              to="/support"
              className="flex flex-col items-center justify-center text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 sm:w-full sm:flex-row sm:p-2 sm:hover:text-black dark:sm:hover:text-white sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 rounded-lg"
            >
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <RxQuestionMarkCircled />
              </span>
              <span
                className={`text-sm sm:hidden sm:group-hover:inline ${fullSize ? "lg:inline" : ""}`}
              >
                Support
              </span>
            </Link>
          </li>

          {/* Settings Link */}
          <li className="hidden sm:block">
            <Link
              to="/edit-profile/personal-info"
              className="flex flex-col items-center justify-center text-gray-900 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 sm:w-full sm:flex-row sm:p-2 sm:hover:text-black dark:sm:hover:text-white sm:group-hover:justify-start sm:group-hover:px-4 lg:justify-start lg:px-4 rounded-lg"
            >
              <span className="inline-block w-5 shrink-0 sm:group-hover:mr-4 lg:mr-4">
                <CiSettings />
              </span>
              <span
                className={`text-sm sm:hidden sm:group-hover:inline ${fullSize ? "lg:inline" : ""}`}
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
