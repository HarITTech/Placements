import React, { useState } from "react";
import { FaSearchengin } from "react-icons/fa6";
import { MdTune } from "react-icons/md";

const Header = ({ filterCriteria, onFilterChange, onSearch }) => {
  const [showFilter, setShowFilter] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const toggleFilter = () => setShowFilter(!showFilter);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    onFilterChange({ ...filterCriteria, [name]: value });
  };

  const handleSearchChange = (e) => {
    const term = e.target.value;
    setSearchTerm(term);
    onSearch(term); // Pass the search term to the parent component
  };

  const clearFilters = () => {
    const clearedFilters = {
      branch: "",
      cgpa: "",
      gender: "",
      semester: "",
      tenthPercent: "",
      twelfthPercent: "",
      subCollege: "",
      courses: "",
      studentType: "",
      year: "",
    };
    onFilterChange(clearedFilters);
    setShowFilter(false);
  };

  const applyFilter = () => {
    setShowFilter(false);
  };

  return (
    <>
      <header className="relative flex items-center justify-center p-2 gap-6">
        <div className="relative w-1/3 mt-2 min-w-[220px] max-w-[700px] flex items-center">
          <input
            type="text"
            placeholder="Search..."
            onChange={handleSearchChange}
            className="w-full px-4 py-2 border-2 border-[#215669C1] rounded-full bg-[rgba(255,255,255,0)] text-[rgb(22,22,59)] text-lg placeholder-[#215669C1] focus:outline-none focus:border-[rgb(22,22,59)]"
          />
          <FaSearchengin className="absolute right-2  text-[#215669C1] text-lg " />
        </div>
        <div className="relative flex items-center mt-2">
          <MdTune
            className="text-[#215669C1] text-2xl cursor-pointer hover:text-[rgb(22,22,59)]"
            onClick={toggleFilter}
          />
        </div>
      </header>
      {showFilter && (
        <div className="absolute top-[65px] left-1/2 mt-1 transform -translate-x-1/2 bg-[#ffffff8c] backdrop-blur-sm shadow-md border placeholder-[#215669C1] border-[#215669C1] rounded-md p-4 w-[450px] z-50">
          <div className="flex flex-col gap-4">
            <div className="flex items-center gap-4">
              <label className="font-semibold text-sm">Branch:</label>
              <select
                name="branch"
                value={filterCriteria.branch}
                onChange={handleInputChange}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] placeholder-[#215669C1] focus:outline-none focus:border-[rgb(22,22,59)]"
              >
                <option value="">Select Branch</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EE">EE</option>
                <option value="AE">AE</option>
                <option value="BT">BT</option>
                <option value="CE">CE</option>
                <option value="DS">DS</option>
              </select>
              <label className="font-semibold text-sm">CGPA:</label>
              <input
                type="number"
                name="cgpa"
                step="0.01"
                placeholder="Enter CGPA"
                min="0"
                max="10"
                value={filterCriteria.cgpa}
                onChange={handleInputChange}
                onInput={(e) => {
                  if (e.target.value > 10) e.target.value = 10;
                  if (e.target.value < 0) e.target.value = 0;
                }}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] placeholder-[#215669C1] focus:outline-none focus:border-[rgb(22,22,59)]"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="font-semibold text-sm">Sub College</label>
              <select
                name="subCollege"
                value={filterCriteria.subCollege}
                onChange={handleInputChange}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] focus:outline-none placeholder-[#215669C1] focus:border-[rgb(22,22,59)]"
              >
                <option value="">Select </option>
                <option value="Abha Gaikwad-Patil College of Engineering">
                  AGPCE
                </option>
                <option value="V.M Institute of Engineering and Technology">
                  VMIT
                </option>
                {/* Add more options as needed */}
              </select>

              <label className="font-semibold text-sm">Degree:</label>
              <select
                name="courses"
                value={filterCriteria.courses}
                onChange={handleInputChange}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] placeholder-[#215669C1] focus:outline-none focus:border-[rgb(22,22,59)]"
              >
                <option value="">Select Degree</option>
                <option value="BTech">BTech</option>
                <option value="MTech">MTech</option>
                {/* Add more options as needed */}
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="font-semibold text-sm">Year:</label>
              <select
                name="year"
                value={filterCriteria.year}
                onChange={handleInputChange}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] focus:outline-none placeholder-[#215669C1] focus:border-[rgb(22,22,59)]"
              >
                <option value="">Select Year</option>
                <option value="1st">1st Year</option>
                <option value="2nd">2nd Year</option>
                <option value="3rd">3rd Year</option>
                <option value="4th">4th Year</option>
              </select>
              <label className="font-semibold text-sm">studentType:</label>
              <select
                name="studentType"
                value={filterCriteria.studentType}
                onChange={handleInputChange}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] focus:outline-none placeholder-[#215669C1] focus:border-[rgb(22,22,59)]"
              >
                <option value="">Select </option>
                <option value="Regular">Regular</option>
                <option value="DSY">DSY</option>
              </select>
            </div>

            <div className="flex items-center gap-4">
              <label className="font-semibold text-sm">Semester:</label>
              <select
                name="semester"
                value={filterCriteria.semester}
                onChange={handleInputChange}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] focus:outline-none placeholder-[#215669C1] focus:border-[rgb(22,22,59)]"
              >
                <option value="">Select Semester</option>
                <option value="1st">1st semester</option>
                <option value="2nd">2nd semester</option>
                <option value="3rd">3rd semester</option>
                <option value="4th">4th semester</option>
                <option value="5th">5th semester</option>
                <option value="6th">6th semester</option>
                <option value="7th">7th semester</option>
                <option value="8th">8th semester</option>
              </select>
              <label className="font-semibold text-sm">10th %:</label>
              <input
                type="number"
                name="tenthPercent"
                step="0.01"
                placeholder="Enter %"
                min="0"
                max="100"
                value={filterCriteria.tenthPercent}
                onChange={handleInputChange}
                onInput={(e) => {
                  if (e.target.value > 100) e.target.value = 100;
                  if (e.target.value < 0) e.target.value = 0;
                }}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] focus:outline-none placeholder-[#215669C1] focus:border-[rgb(22,22,59)]"
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="font-semibold text-sm">Gender:</label>
              <select
                name="gender"
                value={filterCriteria.gender}
                onChange={handleInputChange}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] focus:outline-none placeholder-[#215669C1] focus:border-[rgb(22,22,59)]"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
              <label className="font-semibold text-sm">12th %:</label>
              <input
                type="number"
                name="twelfthPercent"
                step="0.01"
                placeholder="Enter %"
                min="0"
                max="100"
                value={filterCriteria.twelfthPercent}
                onChange={handleInputChange}
                onInput={(e) => {
                  if (e.target.value > 100) e.target.value = 100;
                  if (e.target.value < 0) e.target.value = 0;
                }}
                className="flex-1 py-1 px-2 border-b-2 border-[#215669C1] rounded-md bg-transparent text-[rgb(22,22,59)] placeholder-[#215669C1] focus:outline-none focus:border-[rgb(22,22,59)]"
              />
            </div>
          </div>
          <div className="flex justify-between mt-4">
            <button
              onClick={clearFilters}
              className="px-4 py-1 bg-[#7e7e7e] text-gray-300 font-bold rounded-md hover:bg-[#5c5c5c]"
            >
              Clear
            </button>
            <button
              onClick={applyFilter}
              className="px-4 py-1 bg-[#618cac] text-gray-200 font-bold rounded-md hover:bg-[#3e6784]"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;

// import React, { useState } from "react";
// import { FaSearchengin } from "react-icons/fa6";
// import { MdTune } from "react-icons/md";
// import "./Header.css";

// const Header = () => {
//   const [showFilter, setShowFilter] = useState(false);

//   const toggleFilter = () => {
//     setShowFilter(!showFilter);
//   };

//   const applyFilter = () => {
//     // Logic to apply the filter
//     console.log("Filter applied!");
//     setShowFilter(false);
//   };

//   return (
//     <>
//       <header>
//         <div className="search-bar">
//           <input type="text" placeholder="Search..." />
//           <FaSearchengin className="search-icon" />
//         </div>
//         <div className="tool" onClick={toggleFilter}>
//           <MdTune className="filter-icon" />
//         </div>
//       </header>

//       {showFilter && (
//         <div className="filter-popup">
//           <div className="filter-row">
//             <label>Branch:</label>
//             <select>
//               <option value="CSE">CSE</option>
//               <option value="IT">IT</option>
//               <option value="ECE">ECE</option>
//               <option value="EE">EE</option>
//               <option value="AE">AE</option>
//               <option value="BT">BT</option>
//               <option value="CE">CE</option>
//               <option value="DS">DS</option>
//               {/* <option value=""></option> */}
//             </select>
//             <label>CGPA:</label>
//             <input
//               type="number"
//               step="0.01"
//               placeholder="Enter CGPA"
//               min="0"
//               max="10"
//               onInput={(e) => {
//                 if (e.target.value > 10) e.target.value = 10; // Prevent numbers over 100
//                 if (e.target.value < 0) e.target.value = 0;     // Prevent numbers below 0
//               }}
//             />
//           </div>
//           <div className="filter-row">
//             <label>Semester:</label>
//             <select>
//               <option value="1">1<sup>st</sup> Sem</option>
//               <option value="2">2<sup>nd</sup> Sem</option>
//               <option value="3">3<sup>rd</sup> Sem</option>
//               <option value="4">4<sup>th</sup> Sem</option>
//               <option value="5">5<sup>th</sup> Sem</option>
//               <option value="6">6<sup>th</sup> Sem</option>
//               <option value="7">7<sup>th</sup> Sem</option>
//               <option value="8">8<sup>th</sup> Sem</option>
//             </select>
//             {/* <label>10<sup>th</sup> %:</label>
//             <input type="text" placeholder="Enter %" /> */}
//             <label>10<sup>th</sup> %:</label>
//             <input
//               type="number"
//               step="0.01"
//               placeholder="Enter %"
//               min="0"
//               max="100"
//               onInput={(e) => {
//                 if (e.target.value > 100) e.target.value = 100; // Prevent numbers over 100
//                 if (e.target.value < 0) e.target.value = 0;     // Prevent numbers below 0
//               }}
//             />
//           </div>
//           <div className="filter-row">
//           <label>Year:</label>
//             <select>
//               <option value="1">1<sup>st</sup> Year</option>
//               <option value="2">2<sup>nd</sup> Year</option>
//               <option value="3">3<sup>rd</sup> Year</option>
//               <option value="4">4<sup>th</sup> Year</option>
//             </select>
//             {/* <label>12<sup>th</sup> %:</label>
//             <input type="text" placeholder="Enter %" /> */}
//             <label>12<sup>th</sup> %:</label>
//             <input
//               type="number"
//               step="0.01"
//               placeholder="Enter %"
//               min="0"
//               max="100"
//               onInput={(e) => {
//                 if (e.target.value > 100) e.target.value = 100; // Prevent numbers over 100
//                 if (e.target.value < 0) e.target.value = 0;     // Prevent numbers below 0
//               }}
//             />

//           </div>
//           <div className="filter-actions">
//             <button onClick={applyFilter}>Apply</button>
//             <button onClick={toggleFilter}>Close</button>
//           </div>
//         </div>
//       )}
//     </>
//   );
// };

// export default Header;
