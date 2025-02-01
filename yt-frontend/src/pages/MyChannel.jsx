import React, { useEffect } from "react";
import { useUserChannelInfo } from "../hooks/user.hook";
import { Outlet, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { MdModeEditOutline } from "react-icons/md";
import { setChannel } from "../features/channelSlice";
import { SpButton } from "../components";
import SubscribeButton from "../components/Buttons/SubscribeButton";
import { MyChannelLoading } from "../components/index.js";
import { NavLink, Link } from "react-router-dom";
import defaultCover from "../assets/default-cover-photo.jpg";

function MyChannel() {
  const { username } = useParams();
  const dispatch = useDispatch();
  const ownerUsername = useSelector((state) => state.auth.user?.username);
  const { data: channelInfo, isFetching } = useUserChannelInfo(username);
  const isOwner = ownerUsername === username;

  useEffect(() => {
    if (channelInfo) {
      dispatch(setChannel(channelInfo));
    }
  }, [channelInfo, dispatch]);

  const channelItems = [
    { name: "Videos", path: "videos" },
    { name: "Playlist", path: "playlist" },
    { name: "Tweets", path: "tweets" },
    { name: "Subscribers", path: "subscribers" },
    { name: "About", path: "about" },
  ];

  if (isFetching) return <MyChannelLoading />;

  return (
    <section className="w-full pb-[70px] sm:ml-[70px] sm:pb-0 lg:ml-0">
      <div className="relative min-h-[150px] w-full pt-[16.28%]">
        <div
          className="absolute inset-0 overflow-hidden"
          style={{
            backgroundImage: `url(${channelInfo?.coverImage?.url || defaultCover})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}
        ></div>
      </div>
      <div className="px-4 pb-4 bg-white dark:bg-gray-900">
        <div className="flex flex-wrap gap-4 pb-4 pt-6">
          <span className="relative -mt-12 inline-block h-28 w-28 shrink-0 overflow-hidden rounded-full border-2 border-gray-400 dark:border-gray-600">
            <img
              src={channelInfo?.avatar?.url}
              alt="channelAvatar"
              className="h-full w-full object-cover"
            />
          </span>
          <div className="mr-auto inline-block -mt-5">
            <h1 className="font-bold text-2xl text-gray-900 dark:text-white">
              {channelInfo?.fullName}
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              @{channelInfo?.username}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {channelInfo?.subscribersCount} Subscribers · {channelInfo?.subscribedToCount} Subscribed
            </p>
            <p className="text-gray-900 dark:text-gray-200">
              {channelInfo?.description || `This channel doesn't have a description yet.`}
            </p>
          </div>
          <div className="inline-block">
            <div className="inline-flex min-w-[145px] justify-end">
              {!isOwner && (
                <SubscribeButton
                  isOwner={isOwner}
                  isSubscribed={channelInfo?.isSubscribed}
                  channelId={channelInfo?._id}
                />
              )}
              {isOwner && (
                <Link to="/edit-profile/personal-info">
                  <SpButton className="flex items-center gap-3 text-white bg-orange-600 hover:bg-orange-500 px-4 py-2 rounded-lg transition">
                    <MdModeEditOutline /> Edit
                  </SpButton>
                </Link>
              )}
            </div>
          </div>
        </div>
        <ul className="no-scrollbar sticky top-[66px] z-[2] flex flex-row justify-between text-wrap overflow-auto border-b-2 border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 py-2 sm:top-[82px]">
          {channelItems.map((item, index) => (
            <li key={index} className="w-full">
              <NavLink
                to={`/channel/${username}/${item.path}`}
                className={({ isActive }) =>
                  isActive
                    ? "text-lg w-full flex justify-center items-center border-b-2 border-orange-600 bg-gray-100 dark:bg-gray-800 px-3 py-1.5 text-orange-600 dark:text-orange-400"
                    : "text-lg w-full flex justify-center items-center border-b-2 border-transparent px-3 py-1.5 text-gray-600 dark:text-gray-400"
                }
              >
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
        <Outlet />
      </div>
    </section>
  );
}

export default MyChannel;
