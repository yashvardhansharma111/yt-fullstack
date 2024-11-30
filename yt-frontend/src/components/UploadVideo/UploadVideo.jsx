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
      <div className="h-full overflow-auto border dark:border-gray-700 bg-white dark:bg-gray-900">
        <div className="flex items-center justify-between border-b dark:border-gray-700 p-4">
          <h2 className="text-xl font-semibold dark:text-white">
            {isPending ? "Uploading your Video..." : "Upload Video"}
          </h2>
          <div className="flex gap-4 items-center justify-center">
            <SpButton onClick={handleReset}> Reset </SpButton>
            <button onClick={handleClose}>
              <IoIosCloseCircleOutline className="w-8 h-8 dark:text-white" />
            </button>
          </div>
        </div>
        {isPending && <ProgressBar />}{" "}
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
