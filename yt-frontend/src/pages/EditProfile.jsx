import React from "react";
import { useSelector } from "react-redux";
import { NavLink, Link, Outlet } from "react-router-dom";
import defaultCoverImg from "../assets/default-cover-photo.jpg";
import { AvatarInput, CoverImageInput } from "../components";

function EditProfile() {
  const channelInfo = useSelector((state) => state.auth.user);
  const editProfileItems = [
    { name: "Personal Info", path: "personal-info" },
    { name: "Channel Info", path: "channel-info" },
    { name: "Change Password", path: "change-password" },
  ];

  return (
    <section className="w-full bg-white pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0 dark:bg-black">
      {/* Cover Image Section */}
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div className="absolute inset-0 overflow-hidden">
          <CoverImageInput
            coverImage={channelInfo?.coverImage?.url || defaultCoverImg}
          />
        </div>
      </div>

      <div className="px-4 pb-4">
        {/* Profile Info */}
        <div className="flex flex-wrap gap-4 pb-4 pt-6 items-center">
          <span className="relative -mt-16 inline-block h-32 w-32 shrink-0 rounded-full border-4 border-white dark:border-gray-800 shadow-lg">
            <AvatarInput avatar={channelInfo?.avatar?.url} />
          </span>
          <div className="mr-auto">
            <h1 className="font-semibold text-2xl text-gray-900 dark:text-white">
              {channelInfo?.fullName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{channelInfo?.username}
            </p>
          </div>
          <div>
            <Link
              to={`/channel/${channelInfo?.username}`}
              className="px-6 py-2 text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 rounded-lg shadow-md transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              View Channel
            </Link>
          </div>
        </div>

        {/* Navigation Tabs */}
        <ul className="no-scrollbar sticky top-[66px] z-10 flex gap-x-2 overflow-auto border-b border-gray-300 bg-white dark:bg-gray-900 dark:border-gray-700 py-2 sm:top-[82px]">
          {editProfileItems.map((item, index) => (
            <li key={index} className="flex-1 text-center">
              <NavLink
                to={`/edit-profile/${item.path}`}
                className={({ isActive }) =>
                  `block w-full px-4 py-2 text-sm font-medium transition-all duration-300 ease-in-out rounded-md ${
                    isActive
                      ? "text-orange-600 border-b-2 border-orange-600 bg-gray-100 dark:bg-gray-800 dark:text-orange-500"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-white dark:hover:bg-gray-800"
                  }`
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Outlet for Nested Routes */}
        <Outlet />
      </div>
    </section>
  );
}

export default EditProfile;
