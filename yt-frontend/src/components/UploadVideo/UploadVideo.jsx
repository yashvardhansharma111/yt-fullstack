import React, { useState } from "react";
import { SpButton, ProgressBar, VideoForm } from "../index.js";
import { useDispatch, useSelector } from "react-redux";
import { useUploadVideo } from "../../hooks/video.hook.js";
import { IoIosCloseCircleOutline } from "react-icons/io";
import { setShowUploadVideo } from "../../features/uiSlice.js";
import toast from "react-hot-toast";

function UploadVideo() {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.auth.user);
  const [resetStatus, setResetStatus] = useState(false);
  const { mutateAsync: uploadVideo, isPending } = useUploadVideo();

  const onSave = async (data) => {
    const res = await uploadVideo(data);
    if (res) {
      dispatch(setShowUploadVideo(false));
    }
    return res;
  };

  const handleClose = () => {
    if (isPending) {
      toast("Video is still uploading please wait", {
        icon: "⌛",
      });
      return;
    }

    dispatch(setShowUploadVideo(false));
  };

  const handleReset = () => {
    if (isPending) {
      toast("Video is still uploading please wait", {
        icon: "⌛",
      });
      return;
    }
    setResetStatus((prev) => !prev);
  };

  return (
    <div className="mt-16 ml-0 overflow-x-hidden sm:ml-8 absolute inset-0 z-10 bg-black/50 px-4 w-full pb-[80px] pt-4 sm:px-14 sm:py-8">
      <div className="h-full overflow-auto border dark:border-gray-700 bg-white dark:bg-gray-900 rounded-lg shadow-lg transition-all duration-300 transform scale-100 hover:scale-105">
        <div className="flex items-center justify-between border-b dark:border-gray-700 p-4">
          <h2 className="text-xl font-semibold  text-gray-800 dark:text-white">
            {isPending ? "Uploading your Video..." : "Upload Video 📹"}
          </h2>
          <div className="flex gap-4 items-center justify-center">
            <SpButton
              onClick={handleReset}
              className="bg-orange-600 hover:bg-orange-500 dark:bg-orange-500 dark:hover:bg-orange-400 text-white rounded-md px-6 py-3 transition-all duration-300 text-lg font-semibold"
            >
              Reset
            </SpButton>
            <button onClick={handleClose}>
              <IoIosCloseCircleOutline className="w-10 h-10 dark:text-white text-gray-800 hover:text-gray-600 transition-all duration-300" />
            </button>
          </div>
        </div>

        {isPending && <ProgressBar />}
        
        <VideoForm
          onSubmit={onSave}
          user={user}
          resetStatus={resetStatus}
          isPending={isPending}
        />
      </div>
    </div>
  );
}

export default UploadVideo;
