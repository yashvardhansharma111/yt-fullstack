import React, { useState, useRef, useEffect } from "react";
import ExistingPlaylist from "./ExistingPlaylist";
import PlaylistForm from "./PlaylistForm";
import { useSelector } from "react-redux";
import LoginPopup from "../LoginPopup";
import { useAddVideoToPlaylist, useCreatePlaylist } from "../../hooks/playlist.hook";
import toast from "react-hot-toast";

function PlaylistDropdown({ videoId }) {
  const userId = useSelector((state) => state.auth.user?._id);
  const authStatus = useSelector((state) => state.auth.authStatus);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCreatePlaylist, setShowCreatePlaylist] = useState(false); // To toggle the PlaylistForm
  const [showLoginPopup, setShowLoginPopup] = useState(false);

  const handleDropdown = (e) => {
    e.stopPropagation();
    if (!authStatus) {
      setShowLoginPopup(true);
    } else {
      setShowDropdown(!showDropdown);
    }
  };

  const { mutateAsync: createPlaylist } = useCreatePlaylist(userId);
  const { mutateAsync: addVideoToPlaylist } = useAddVideoToPlaylist(userId);

  const onSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value;

    if (!name) toast.error("Name is required");

    const res = await createPlaylist({ name });
    if (res) {
      setShowDropdown(false);
      addVideoToPlaylist({ videoId, playlistId: res._id });
    }
  };

  // Define handleCreatePlaylist to toggle the PlaylistForm
  const handleCreatePlaylist = () => {
    setShowCreatePlaylist((prev) => !prev); // Toggles the form
  };

  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropdown]);

  if (showLoginPopup)
    return (
      <LoginPopup
        onClose={() => setShowLoginPopup(false)}
        loginTo={"Save Video to Playlist"}
      />
    );

  return (
    <>
      <div className="relative block" ref={dropdownRef}>
        <button
          onClick={(e) => handleDropdown(e)}
          className="flex items-center gap-x-2 rounded-lg bg-white dark:bg-gray-800 dark:text-gray-300 text-black px-4 py-1.5"
        >
          <span className="inline-block w-5">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 10.5v6m3-3H9m4.06-7.19l-2.12-2.12a1.5 1.5 0 00-1.061-.44H4.5A2.25 2.25 0 002.25 6v12a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9a2.25 2.25 0 00-2.25-2.25h-5.379a1.5 1.5 0 01-1.06-.44z"
              ></path>
            </svg>
          </span>
          Save
        </button>

        {showDropdown && (
          <div className="absolute right-0 top-full z-10 w-64 overflow-hidden rounded-lg bg-white dark:bg-gray-800 p-4 shadow shadow-slate-50/30">
            <h3 className="mb-4 text-center text-lg font-semibold dark:text-gray-100">
              Save to playlist
            </h3>
            <ExistingPlaylist videoId={videoId} />
            <form onSubmit={(e) => onSubmit(e)} className="flex flex-col">
              <label
                htmlFor="playlist-name"
                className="mb-1 inline-block cursor-pointer dark:text-gray-300"
              >
                Name
              </label>
              <input
                type="text"
                name="name"
                id="playlist-name"
                placeholder="Enter playlist name"
                required
                className="w-full rounded-lg border border-transparent bg-white dark:bg-gray-700 px-3 py-2 text-black dark:text-gray-100 outline-none focus:border-orange-500"
              />
              <button
                type="submit"
                className="mx-auto mt-4 rounded-lg bg-orange-500 dark:bg-orange-600 px-4 py-2 text-white"
              >
                Create new playlist
              </button>
            </form>
          </div>
        )}
      </div>

      {showCreatePlaylist && <PlaylistForm onClose={handleCreatePlaylist} />} 
    </>
  );
}

export default PlaylistDropdown;
