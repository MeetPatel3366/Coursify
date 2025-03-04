import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();
  return (
    <div className="h-screen w-full flex flex-col justify-center items-center bg-[#1A2238]">
      <h1 className="text-9xl font-extrabold text-white tracking-widest">
        404
      </h1>
      <div className="bg-black text-white px-2  rounded rotate-12 absolute">
        Page not found
      </div>
      <button className="mt-5">
        <a className="relative inline-block text-sm font-medium text-[#FF613D] border-2 border-[#FF613D] group active:text-yellow-500 focus:outline-none focus:ring">
          <span
            onClick={() => navigate(-1)}
            className="relative block px-8 py-3 bg-[#1A2238] border-current">
            Go Back
          </span>
        </a>
      </button>
    </div>
  );
};

export default NotFound;
