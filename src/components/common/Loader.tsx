import React from "react";

const Loader: React.FC = () => {
  return (
    <div
      className="w-full h-full flex justify-center items-center"
      role="status"
      aria-label="Učitavanje"
    >
      <div
        className="animate-spin bg-conic-180 from-transparent from-20% via-red-500 to-transparent rounded-full p-2.5 "
        aria-hidden="true"
      >
        <div className="bg-white rounded-full p-10"></div>
      </div>
    </div>
  );
};

export default Loader;
