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
    .regex(/^[a-z0-9_]+$/, { message: "Username must be lowercase and contain only letters, numbers, or underscores" }),
  description: z.string().max(275, { message: "Description must be less than 275 characters" }),
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

    if (username === initialData.username && description === initialData.description) {
      return;
    }

    await updateChannelInfo(data);
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-6 py-6 text-gray-900 dark:text-gray-100">
      {isPending && <ProgressBar />}
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="text-xl font-semibold text-orange-600 dark:text-orange-400">Channel Info</h5>
        <p className="text-gray-600 dark:text-gray-400">Update your channel details below.</p>
      </div>
      <div className="w-full sm:w-1/2 lg:w-2/3">
        <form
          className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-6 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div>
            <label className="mb-2 block font-medium" htmlFor="username">
              Username
            </label>
            <div className="flex rounded-lg border border-gray-400 dark:border-gray-600">
              <p className="flex shrink-0 items-center border-r border-gray-300 dark:border-gray-600 px-3 align-middle bg-gray-100 dark:bg-gray-800">
                shadowplay.vercel.app/
              </p>
              <input
                type="text"
                className="w-full bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-orange-500"
                id="username"
                placeholder="@username"
                {...register("username")}
              />
            </div>
            {errors.username && <p className="mt-1 text-sm text-red-500">{errors.username.message}</p>}
          </div>
          <div>
            <label className="mb-2 block font-medium" htmlFor="desc">
              Description
            </label>
            <textarea
              className="w-full rounded-lg border border-gray-400 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-orange-500"
              rows="4"
              id="desc"
              placeholder="Channel Description"
              {...register("description")}
            ></textarea>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">{descriptionCharsLeft} characters left</p>
            {errors.description && <p className="mt-1 text-sm text-red-500">{errors.description.message}</p>}
          </div>
          <hr className="border-gray-300 dark:border-gray-700 my-4" />
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-lg border border-gray-400 dark:border-gray-600 px-4 py-2 text-gray-900 dark:text-gray-100 hover:bg-gray-100 dark:hover:bg-gray-700 transition"
            >
              Reset
            </button>
            <button
              type="submit"
              className="rounded-lg bg-orange-600 px-4 py-2 text-white hover:bg-orange-500 transition"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditChannelInfo;
