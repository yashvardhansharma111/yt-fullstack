import React, { forwardRef } from "react";

export const TitleInput = forwardRef(({ title, setTitle, ...props }, ref) => {
  return (
    <div className="w-full">
      <label htmlFor="title" className="mb-1 inline-block text-gray-900 dark:text-gray-100">
        Title <sup>*</sup>
      </label>
      <input
        ref={ref} // Forwarding ref to the input element
        id="title"
        type="text"
        className="w-full border bg-transparent px-2 py-2 outline-none border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        {...props}
      />
    </div>
  );
});

export const DescriptionInput = forwardRef(({ description, setDescription, ...props }, ref) => {
  return (
    <div className="w-full">
      <label htmlFor="desc" className="mb-1 inline-block text-gray-900 dark:text-gray-100">
        Description <sup>*</sup>
      </label>
      <textarea
        ref={ref} // Forwarding ref to the textarea element
        id="desc"
        className="h-40 w-full resize-none border bg-transparent px-2 py-1 outline-none border-gray-300 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-100"
        {...props}
      ></textarea>
    </div>
  );
});
