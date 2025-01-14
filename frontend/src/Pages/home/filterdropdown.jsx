import React, { useState } from "react";
import { ChevronDown } from "lucide-react";

export function FilterDropdown({ onClose, onApply }) {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedLocation, setSelectedLocation] = useState("");

  const handleApplyFilters = () => {
    console.log("Filters Applied:", { selectedRole, selectedLocation });
    if (typeof onApply === "function") {
      onApply({ selectedRole, selectedLocation }); // Pass filters to parent
    }
    onClose(); // Close the dropdown
  };

  return (
    <div className="absolute right-0 mt-8 w-80 bg-[#ffffff8a] backdrop-blur-[6px] border border-gray-200 rounded-lg shadow-lg z-50">
      <div className="flex justify-between items-center p-4 bg-[#3e79a7] text-white rounded-t-lg">
        <h2 className="font-bold text-lg">Filter Options</h2>
        <button
          onClick={onClose}
          className="px-[10px] py-[4px] rounded-full hover:bg-[#919191a5] transition-all"
        >
          ✕
        </button>
      </div>
      <div className="p-4 space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Select Department
          </label>
          <div className="relative">
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Branch</option>
              <option value="IT">IT</option>
              <option value="CSE">CSE</option>
              <option value="ECE">ECE</option>
              <option value="AE">AE</option>
              <option value="EE">EE</option>
              <option value="BT">BT</option>
              <option value="ME">ME</option>
              <option value="CE">CE</option>
              <option value="AI & ML">AI & ML</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Location
          </label>
          <div className="relative">
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select Location</option>
              <option value="Remote">Remote</option>
              <option value="On-Site">On-Site</option>
              <option value="Hybrid">Hybrid</option>
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
          >
            Cancel
          </button>
          <button
            onClick={handleApplyFilters}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

export default FilterDropdown;
