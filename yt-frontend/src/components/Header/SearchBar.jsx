import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { IoSearchSharp } from "react-icons/io5";

function Search() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = (data) => {
    navigate(`/search/${data?.query}`);
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex items-center w-full max-w-2xl rounded-full bg-[#f0f0f0] dark:bg-gray-700 px-4 py-2 transition-all duration-300"
    >
      <IoSearchSharp className="text-black dark:text-white w-5 h-5" />
      <input
        className="ml-2 w-full bg-transparent border-none outline-none text-black dark:text-white placeholder-gray-600 dark:placeholder-gray-400"
        placeholder="Search videos..."
        {...register("query", { required: true })}
      />
      <button type="submit" className="hidden" />
    </form>
  );
}

export default Search;
