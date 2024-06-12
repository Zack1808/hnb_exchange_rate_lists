import React from "react";

const Loader: React.FC = () => {
  return (
    <div className="w-full flex justify-center items-center">
      <div className="animate-rotation bg-gradient-to-r from-red-500 to-transparent rounded-full p-2 border">
        <div className="bg-white rounded-full p-10"></div>
      </div>
    </div>
  );
};

export default Loader;
