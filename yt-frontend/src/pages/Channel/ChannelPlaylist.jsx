import React from "react";
import { usePlaylistsByUser } from "../../hooks/playlist.hook";
import { useSelector } from "react-redux";
import { ProgressBar, PlaylistCard } from "../../components";
import { Link } from "react-router-dom";
import { FaFolderPlus } from "react-icons/fa";

function ChannelPlaylist() {
  const channelId = useSelector((state) => state.channel.channel?._id);

  const {
    data: channelPlaylists,
    isFetching,
    isFetched,
  } = usePlaylistsByUser(channelId);

  if (isFetching) {
    return (
      <div className="bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
        <ProgressBar />
      </div>
    );
  }

  if (isFetched && channelPlaylists?.length === 0) {
    return (
      <div className="flex justify-center p-8 bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg">
        <div className="w-full max-w-sm text-center">
          <div className="mb-6 flex justify-center">
            <span className="inline-flex rounded-full bg-amber-200 dark:bg-amber-900 p-4">
              <FaFolderPlus className="w-8 h-8 text-amber-600 dark:text-amber-400" />
            </span>
          </div>
          <h5 className="text-xl font-semibold mb-3 text-gray-900 dark:text-white">
            No Playlists Created
          </h5>
          <p className="text-gray-600 dark:text-gray-400">
            There are no playlists available on this channel yet.
            Start organizing your content by creating your first playlist!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-amber-50 dark:bg-gray-800 rounded-lg shadow-lg p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {channelPlaylists?.map((playlist) => (
          <Link
            key={playlist._id}
            to={`/playlist/${playlist?._id}`}
            className="transform transition-transform duration-200 hover:-translate-y-1"
          >
            <div className="h-full bg-white dark:bg-gray-700 rounded-lg shadow-md overflow-hidden">
              <PlaylistCard playlist={playlist} />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default ChannelPlaylist;