import React from "react";

const SummaryCard = ({ icon, text, number, color }) => {
  return (
    <div className="rounded-xl flex bg-[#242b35] border border-gray-700/50 shadow-lg hover:shadow-xl transition-shadow duration-300">
      <div
        className={`text-3xl flex items-center justify-center ${color} text-white px-4 border-r-2 border-gray-700 rounded-l-xl`}
      >
        {icon}
      </div>
      <div className="pl-4 py-3 flex flex-col justify-center">
        <p className="text-base font-medium text-gray-400">{text}</p>
        <p className="text-2xl font-bold text-gray-100">{number}</p>
      </div>
    </div>
  );
};

export default SummaryCard;
