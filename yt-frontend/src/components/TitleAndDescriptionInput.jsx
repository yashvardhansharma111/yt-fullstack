import React, { forwardRef } from "react";

export const TitleInput = forwardRef(({ title, setTitle, ...props }, ref) => {
  return (
    <div className="w-full">
      <label
        htmlFor="title"
        className="mb-1 inline-block text-gray-900 dark:text-gray-100 transition-colors duration-300"
      >
        Title <sup>*</sup>
      </label>
      <input
        ref={ref} // Forwarding ref to the input element
        id="title"
        type="text"
        className="w-full border border-gray-300 bg-transparent px-3 py-2 outline-none rounded-md text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 transition-colors duration-300"
        {...props}
      />
    </div>
  );
});

export const DescriptionInput = forwardRef(({ description, setDescription, ...props }, ref) => {
  return (
    <div className="w-full">
      <label
        htmlFor="desc"
        className="mb-1 inline-block text-gray-900 dark:text-gray-100 transition-colors duration-300"
      >
        Description <sup>*</sup>
      </label>
      <textarea
        ref={ref} // Forwarding ref to the textarea element
        id="desc"
        className="w-full h-40 resize-none border border-gray-300 bg-transparent px-3 py-2 outline-none rounded-md text-gray-900 dark:text-gray-100 dark:border-gray-700 dark:bg-gray-800 focus:ring-2 focus:ring-orange-600 dark:focus:ring-orange-500 transition-colors duration-300"
        {...props}
      ></textarea>
    </div>
  );
});
