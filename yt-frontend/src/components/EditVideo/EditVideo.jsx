import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { SpButton, ProgressBar, VideoForm } from "../index.js";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { useEditVideo } from "../../hooks/video.hook.js";
import { setShowEditVideo } from "../../features/uiSlice";
import { setVideoForEdit } from "../../features/videoSlice.js";
import toast from "react-hot-toast";

function EditVideo() {
  const dispatch = useDispatch();
  const video = useSelector((state) => state.video.videoForEdit);
  const user = useSelector((state) => state.auth.user);
  const [resetStatus, setResetStatus] = useState(false);

  const { mutateAsync: editVideo, isPending } = useEditVideo();

  const onEdit = async (data) => {
    console.log("onEdit called", data);
    const res = await editVideo({ videoId: video?._id, data });
    console.log("Edit result", res);
    if (res) {
      dispatch(setShowEditVideo(false));
      dispatch(setVideoForEdit(null));
    }
    return res;
  };

  const handleReset = () => {
    if (isPending) {
      toast("Video is still uploading, please wait.", {
        icon: "⌛",
      });
      return;
    }
    setResetStatus((prev) => !prev);
  };

  const handleClose = () => {
    if (isPending) {
      toast("Video is still uploading, please wait.", {
        icon: "⌛",
      });
      return;
    }
    dispatch(setShowEditVideo(false));
  };

  return (
    <div
      className="
        mt-16 ml-0 overflow-x-hidden sm:ml-8 absolute inset-0 z-10 bg-black/50 px-4 w-full pb-[80px] pt-4 sm:px-14 sm:py-8
      "
    >
      <div className="h-full overflow-auto bg-white dark:bg-[#121212] border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg transition-all duration-300 transform scale-100 hover:scale-105">
        <div className="flex items-center justify-between border-b border-gray-300 dark:border-gray-700 p-4">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
            {isPending && <span>Uploading your Video...</span>}
            {!isPending && "Edit Video ✏️"}
          </h2>
          <div className="flex gap-4 items-center justify-center">
            <SpButton
              onClick={handleReset}
              className="text-sm font-semibold bg-orange-600 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-400 text-white rounded-md px-6 py-3 transition-all duration-300"
            >
              Reset
            </SpButton>
            <button onClick={handleClose}>
              <IoIosCloseCircleOutline className="w-10 h-10 text-gray-900 dark:text-white hover:text-gray-600 dark:hover:text-gray-400 transition-all duration-300" />
            </button>
          </div>
        </div>
        {isPending && <ProgressBar />}
        <VideoForm
          isEditing={true}
          initialVideo={video}
          onSubmit={onEdit}
          user={user}
          isPending={isPending}
          resetStatus={resetStatus}
        />
      </div>
    </div>
  );
}

export default EditVideo;
