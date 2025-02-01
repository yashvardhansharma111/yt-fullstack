import React, { useState } from "react";
import { Input, SpButton } from "../components/index.js";
import Logo from "@/Logo.jsx";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { MdOutlineCloudUpload } from "react-icons/md";
import { Link, useNavigate } from "react-router-dom";
import { useLogin, useRegisterUser } from "../hooks/auth.hook.js";
import { useDispatch } from "react-redux";
import { setUser } from "../features/authSlice.js";

function Signup() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const schema = z.object({
    email: z.string().email(),
    username: z
      .string()
      .min(4)
      .refine((value) => !value.includes(" "), { message: "No spaces allowed" })
      .refine((value) => value === value.toLowerCase(), { message: "Must be lowercase" }),
    fullName: z.string().min(4),
    password: z.string().min(6),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(schema) });

  const { mutateAsync: registerUser } = useRegisterUser();
  const { mutateAsync: loginUser } = useLogin();

  const [profilePic, setProfilePic] = useState(null);
  const [coverPic, setCoverPic] = useState(null);
  const [selectedProfile, setSelectedProfile] = useState("");
  const [selectedCover, setSelectedCover] = useState("");

  const createAccount = async (data) => {
    data.avatar = profilePic;
    data.coverImage = coverPic;
    const registeredUser = await registerUser(data);
    if (registeredUser) {
      const loggedInUser = await loginUser({
        usernameOrEmail: data.email,
        password: data.password,
      });
      if (loggedInUser) {
        dispatch(setUser(loggedInUser));
        navigate("/");
      }
    }
  };

  return (
    <div className="h-screen overflow-y-auto bg-white dark:bg-[#121212] flex justify-center items-center text-gray-800 dark:text-white">
      <div className="mx-auto my-8 flex w-full max-w-sm flex-col px-4">
        <Logo className="w-full text-center text-2xl font-semibold uppercase" inline={true} />

        <div className="w-full flex flex-col items-center justify-center mb-6">
          <h1 className="text-2xl">Signup</h1>
          <span>
            Already have an account?{" "}
            <Link to="/login" className="text-orange-500 inline">Login</Link>
          </span>
        </div>

        <form onSubmit={handleSubmit(createAccount)} className="flex flex-col">
          {/* Cover Image Section */}
          <div
            className="w-full mb-4 rounded-lg bg-gray-300 dark:bg-gray-700 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${selectedCover})` }}
          >
            {/* Profile Image Section */}
            <div
              className="mx-auto mt-6 flex cursor-pointer justify-center w-[141px] h-[141px] bg-orange-300/20 rounded-full bg-cover bg-center bg-no-repeat border-2 border-orange-700 dark:border-orange-400"
              style={{ backgroundImage: `url(${selectedProfile})` }}
            >
              <label htmlFor="profileImg" className="cursor-pointer">
                <div className="bg-white/90 dark:bg-gray-800 flex justify-center items-center rounded-full w-7 h-7 text-center ml-28 mt-[106px]">
                  <MdOutlineCloudUpload />
                </div>
                <input
                  type="file"
                  style={{ display: "none" }}
                  id="profileImg"
                  accept="image/png, image/jpg, image/jpeg, image/gif"
                  {...register("profileImg")}
                  onChange={(e) => {
                    setSelectedProfile(URL.createObjectURL(e.target.files[0]));
                    setProfilePic(e.target.files[0]);
                  }}
                />
              </label>
            </div>

            {/* Cover Image Upload */}
            <div className="flex justify-end">
              <input
                type="file"
                id="coverphoto"
                accept="image/png, image/jpg, image/jpeg, image/gif"
                {...register("coverphoto")}
                onChange={(e) => {
                  setSelectedCover(URL.createObjectURL(e.target.files[0]));
                  setCoverPic(e.target.files[0]);
                }}
                style={{ display: "none" }}
              />
              <div className="bg-white/90 dark:bg-gray-800 text-orange-700 dark:text-orange-400 flex items-center gap-1 rounded-tl-md px-2 text-center font-semibold">
                <label htmlFor="coverphoto" className="inline-flex items-center gap-1 cursor-pointer">
                  Cover <MdOutlineCloudUpload />
                </label>
              </div>
            </div>
          </div>

          {/* Form Fields */}
          <Input
            label="Full Name*"
            type="text"
            placeholder="John Wick"
            id="fullName"
            {...register("fullName", { required: true })}
            error={errors?.fullName?.message}
          />
          <Input
            label="Username*"
            type="text"
            placeholder="johnwick7"
            id="username"
            {...register("username", { required: true })}
            error={errors?.username?.message}
          />
          <Input
            label="Email*"
            type="email"
            placeholder="johnwick@example.com"
            id="email"
            {...register("email", { required: true })}
            error={errors?.email?.message}
          />
          <Input
            label="Password*"
            type="password"
            placeholder="********"
            id="password"
            {...register("password", { required: true })}
            error={errors?.password?.message}
            className="mb-4"
          />

          {/* Submit Button */}
          <SpButton type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Creating an Account..." : "Sign Up"}
          </SpButton>
        </form>
      </div>
    </div>
  );
}

export default Signup;
