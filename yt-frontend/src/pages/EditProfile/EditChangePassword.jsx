import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import toast from "react-hot-toast";
import { useChangePassword } from "../../hooks/auth.hook";

const schema = z.object({
  oldPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  newPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
  confirmPassword: z.string().min(6, { message: "Password must be at least 6 characters" }),
});

function EditChangePassword() {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: "onChange",
  });

  const { mutateAsync: changePassword, isPending } = useChangePassword();

  const onSubmit = async (data) => {
    const { oldPassword, newPassword, confirmPassword } = data;

    if (newPassword !== confirmPassword) {
      toast.error("New password and confirm password do not match");
      return;
    }

    const res = await changePassword({ oldPassword, newPassword });
    if (res) reset();
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-4 py-4 text-gray-900 dark:text-white">
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="font-semibold text-orange-600 dark:text-orange-400">Password</h5>
        <p className="text-gray-500 dark:text-gray-400">
          Please enter your current password to change your password.
        </p>
      </div>
      <div className="w-full sm:w-1/2 lg:w-2/3">
        <form
          className="rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex flex-wrap gap-y-4 p-4">
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="old-pwd">
                Current password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="old-pwd"
                placeholder="Current password"
                {...register("oldPassword")}
              />
            </div>
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="new-pwd">
                New password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="new-pwd"
                placeholder="New password"
                {...register("newPassword")}
              />
              {errors.newPassword && (
                <p className="mt-0.5 text-sm text-red-500">
                  {errors.newPassword.message}
                </p>
              )}
            </div>
            <div className="w-full">
              <label className="mb-1 inline-block" htmlFor="cnfrm-pwd">
                Confirm password
              </label>
              <input
                type="password"
                className="w-full rounded-lg border bg-transparent px-2 py-1.5"
                id="cnfrm-pwd"
                placeholder="Confirm password"
                {...register("confirmPassword")}
              />
            </div>
          </div>
          <hr className="border-gray-300 dark:border-gray-700" />
          <div className="flex items-center justify-end gap-4 p-4">
            <button
              type="button"
              onClick={() => reset()}
              className="rounded-lg border border-gray-300 dark:border-gray-700 px-3 py-1.5 text-gray-800 dark:text-gray-200 hover:bg-orange-50 dark:hover:bg-gray-700"
            >
              Reset
            </button>
            <button
              className="bg-orange-600 text-white px-3 py-1.5 rounded-lg hover:bg-orange-500 transition"
            >
              Update Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditChangePassword;
