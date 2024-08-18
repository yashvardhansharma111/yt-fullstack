import React from "react";

 function Logo({ className, inline = false, mobile = false }) {
  return (
    <div
      className={`font-extrabold text-xl flex items-center justify-center w-full ${className} text-purple-500`}
    >
      <img
        src="/yash_tube.png"
        alt="logo"
        className="w-20 h-10 inline-block mr-2"
      />

      <div
        className={`flex ${inline ? "flex-row" : " flex-col"} ${mobile && "hidden md:block" 
            }`}
      >
      </div>
    </div>
  );
}

export default Logo