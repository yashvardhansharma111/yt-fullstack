import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSelector } from "react-redux";
import { useUpdateAccountDetails } from "../../hooks/user.hook";
import { ProgressBar } from "../../components";

const schema = z.object({
  firstname: z
    .string()
    .nonempty({ message: "First name cannot be empty" })
    .regex(/^[A-Za-z]+$/, { message: "First name must contain only letters" }),
  lastname: z
    .string()
    .nonempty({ message: "Last name cannot be empty" })
    .regex(/^[A-Za-z]+$/, { message: "Last name must contain only letters" }),
  email: z.string().email(),
});

function EditPersonalInfo() {
  const user = useSelector((state) => state.auth.user);

  const firstName = user?.fullName.split(" ")[0] || "";
  const lastName = user?.fullName.split(" ")[1] || "";

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      firstname: firstName,
      lastname: lastName,
      email: user?.email,
    },
  });

  const { mutateAsync: updateAccount, isPending } = useUpdateAccountDetails();

  const onSubmit = async (data) => {
    const { firstname, lastname, email } = data;
    const fullName = `${firstname} ${lastname}`;

    const initialData = {
      firstname: firstName,
      lastname: lastName,
      email: user?.email,
    };

    if (fullName === `${initialData.firstname} ${initialData.lastname}` && email === initialData.email) {
      return;
    }

    await updateAccount({ fullName, email });
  };

  return (
    <div className="flex flex-wrap justify-center gap-y-6 py-6 text-gray-900 dark:text-gray-100">
      {isPending && <ProgressBar />}
      <div className="w-full sm:w-1/2 lg:w-1/3">
        <h5 className="text-xl font-semibold text-orange-600 dark:text-orange-400">Personal Info</h5>
        <p className="text-gray-600 dark:text-gray-400">Update your personal details below.</p>
      </div>
      <div className="w-full sm:w-1/2 lg:w-2/3">
        <form
          className="rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-lg p-6 space-y-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="mb-2 block font-medium" htmlFor="firstname">
                First Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-400 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-orange-500"
                id="firstname"
                placeholder="First Name"
                {...register("firstname")}
              />
              {errors.firstname && <p className="mt-1 text-sm text-red-500">{errors.firstname.message}</p>}
            </div>
            <div className="w-1/2">
              <label className="mb-2 block font-medium" htmlFor="lastname">
                Last Name
              </label>
              <input
                type="text"
                className="w-full rounded-lg border border-gray-400 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-orange-500"
                id="lastname"
                placeholder="Last Name"
                {...register("lastname")}
              />
              {errors.lastname && <p className="mt-1 text-sm text-red-500">{errors.lastname.message}</p>}
            </div>
          </div>
          <div>
            <label className="mb-2 block font-medium" htmlFor="email">
              Email Address
            </label>
            <input
              type="text"
              className="w-full rounded-lg border border-gray-400 dark:border-gray-600 bg-transparent px-3 py-2 text-gray-900 dark:text-gray-100 dark:bg-gray-800 focus:ring-2 focus:ring-orange-500"
              id="email"
              placeholder="Enter email address"
              {...register("email")}
            />
            {errors.email && <p className="mt-1 text-sm text-red-500">{errors.email.message}</p>}
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

export default EditPersonalInfo;
