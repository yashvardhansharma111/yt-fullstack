import React from "react";
import ProgressBar from "./ProgressBar";

function DeletePopup({ onCancel, onDeleteConfirm, isDeleting, type }) {
  return (
    <div
      className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-black border border-slate-800 rounded-lg p-5 text-white text-center w-96">
        {isDeleting ? (
          <>
            <ProgressBar />
            <p className="text-xl font-medium mb-2">Deleting your {type}...</p>
          </>
        ) : (
          <>
            <h1 className="text-2xl font-bold mb-4">Delete {type}</h1>
            <p className="text-xl font-medium mb-4">
              Are you sure you want to delete this {type}? Once it's deleted, you
              will not be able to recover it.
            </p>
            <div className="flex gap-4">
              <button
                className="bg-red-600 hover:bg-red-700 w-full py-2 px-4 font-bold text-lg rounded transition duration-300"
                onClick={onDeleteConfirm}
              >
                Delete
              </button>
              <button
                className="bg-gray-600 hover:bg-gray-700 w-full py-2 px-4 font-bold text-lg rounded transition duration-300"
                onClick={onCancel}
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default DeletePopup;
