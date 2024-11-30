import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useUpdateChannelInfo } from "../../hooks/user.hook";
import { ProgressBar } from "../../components";

const schema = z.object({
  username: z
    .string()
    .nonempty({ message: "Username cannot be empty" })
    .regex(/^\S*$/, { message: "Username cannot contain spaces" })
    .regex(/^[a-z]*$/, { message: "Username must be lowercase" }),
  description: z
    .string()
    .max(275, { message: "Description must be less than 275 characters" }),
});

function EditChannelInfo() {
  const channelInfo = useSelector((state) => state.auth.user);

  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      username: channelInfo?.username,
      description: channelInfo?.description || "",
    },
    mode: "onChange",
  });

  const description = watch("description");
  const maxChars = 275;
  const descriptionCharsLeft = maxChars - description.length;

  const { mutateAsync: updateChannelInfo, isPending } = useUpdateChannelInfo();

  const onSubmit = async (data) => {
    const { username, description } = data;

    const initialData = {
      username: channelInfo?.username,
      description: channelInfo?.description,
    };

    const hasDataChanged =
      username !== initialData.username ||
      description !== initialData.description;

    if (!hasDataChanged) {
      return;
    }

    await updateChannelInfo(data);
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-4 py-4">
      {isPending && <ProgressBar />}
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold text-gray-900 dark:text-gray-100">Channel Info</h5>
        <p className="text-gray-500 dark:text-gray-400">Update your Channel details here.</p>
      </div>
      <div className="w-full sm:w-1/2 lg:w-2/3">
        <form onSubmit={handleSubmit(onSubmit)} className="rounded-lg border border-gray-300 dark:border-gray-600">
          <div className="flex flex-wrap gap-y-4 p-4">
            <div className="w-full">
              <label className="mb-1 inline-block text-gray-900 dark:text-gray-100" htmlFor="username">
                Username
              </label>
              <div className="flex rounded-lg border border-gray-300 dark:border-gray-600">
                <p className="flex shrink-0 items-center border-r border-gray-300 dark:border-gray-600 px-3 align-middle">
                  shadowplay.vercel.app/
                </p>
                <input
                  type="text"
                  className="w-full bg-transparent px-2 py-1.5 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                  id="username"
                  placeholder="@username"
                  {...register("username")}
                />
              </div>
              {errors.username && (
                <p className="text-md text-red-500">{errors.username.message}</p>
              )}
            </div>
            <div className="w-full">
              <label className="mb-1 inline-block text-gray-900 dark:text-gray-100" htmlFor="desc">
                Description
              </label>
              <textarea
                className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-transparent px-2 py-1.5 text-gray-900 dark:text-gray-100 dark:bg-gray-800"
                rows="4"
                id="desc"
                placeholder="Channel Description"
                {...register("description")}
              ></textarea>
              <p className="mt-0.5 text-sm text-gray-500 dark:text-gray-400">
                {descriptionCharsLeft} characters left
              </p>
              {errors.description && (
                <p className="text-md text-red-500">{errors.description.message}</p>
              )}
            </div>
          </div>
          <hr className="border border-gray-300 dark:border-gray-600" />
          <div className="flex items-center justify-end gap-4 p-4">
            <button
              type="button"
              onClick={() => reset()}
              disabled={isPending}
              className="inline-block rounded-lg border border-gray-300 dark:border-gray-600 px-3 py-1.5 text-gray-900 dark:text-gray-100 hover:bg-gray-200 dark:hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="inline-block bg-[#F97316] px-3 py-1.5 text-black dark:text-white"
            >
              Save changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditChannelInfo;
