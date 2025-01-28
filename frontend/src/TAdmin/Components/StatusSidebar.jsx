import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteUser, getProfileCompletionDetails } from "../../redux/userSlice";
import { AiOutlineClose } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaSortAmountDown } from "react-icons/fa"; // Import a sorting icon
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";

const StatusSidebar = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileCompletionDetails, status, error } = useSelector(
    (state) => state.user
  );
  const [isLoading, setIsLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");
  const selectRef = useRef(null); // Ref to the select element
  const hasFetched = useRef(true);
  const sidebarRef = useRef(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Memoize the debounced fetchData function
  const fetchData = useCallback(
    debounce(() => {
      if (isOpen && !hasFetched.current) {
        setIsLoading(true);
        hasFetched.current = true; // Set the flag immediately
        dispatch(getProfileCompletionDetails()).finally(() => {
          setIsLoading(false);
        });
      }
    }, 300000), // 300ms delay
    [isOpen, dispatch]
  );

  useEffect(() => {
    if (isOpen) {
      fetchData();
    }
  }, [isOpen, fetchData]);

  useEffect(() => {
    if (!isOpen) {
      hasFetched.current = false;
    }
  }, [isOpen]);

  // Close sidebar when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const handleUserClick = (userId) => {
    // console.log();
    
    navigate(`/tadmin/userprofile/${userId}`); // Step 3: Navigate to UserProfile with userId
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User  deleted successfully!");
        window.location.reload(); // Refresh the page after successful deletion
      } catch (error) {
        toast.error(error.message || "Failed to delete user");
      }
    }
  };

  // Determine color based on profile completion percentage
  const getCompletionColor = (percentage) => {
    if (percentage >= 80) return "text-green-700 bg-green-200";
    if (percentage >= 45) return "text-yellow-700 bg-yellow-200";
    return "text-red-700 bg-red-200";
  };

  // Filter and sort profile completion details
  const filteredAndSortedDetails = profileCompletionDetails
    .filter((detail) =>
      detail.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.profileCompletion - b.profileCompletion;
      } else {
        return b.profileCompletion - a.profileCompletion;
      }
    });

  const handleSortButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  return (
    <div
      className={`fixed top-0 z-50 left-[-20px] w-full h-full backdrop-blur-[6px] flex justify-center items-center ${
        isOpen ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div
        ref={sidebarRef}
        className={`fixed z-50 top-0 inset-y-0 right-[-20px] w-[400px] backdrop-blur-[6px] bg-[#ffffff95] shadow-lg transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex justify-between items-center p-4 border-b-[2px] rounded-[8px] shadow-md border-[rgba(33,86,105,0.758)]">
          <h2 className="text-xl font-bold">Profile Completion Status</h2>
          <div className="relative">
            <button
              onClick={handleSortButtonClick}
              className="p-2 bg-transparent rounded hover:bg-[#ffffffbf] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaSortAmountDown className="text-[rgba(22,22,59)]" />
            </button>
            {isDropdownOpen && (
              <div className="absolute right-3 justify-items-center items-center font-medium w-[130px] border-b-[1px] border-[rgba(33,86,105,0.758)] bg-[#ffffffc9] backdrop-blur-[6px] border rounded-[10px] rounded-se-none shadow-lg z-50">
                <button
                  onClick={() => handleSortOrderChange("asc")}
                  className="block w-full px-4 py-2 border-b-[1px] border-[rgba(33,86,105,0.758)] text-left hover:bg-[#c0c0c0c5] hover:text-[rgb(22,22,59)] rounded-ss-[10px]"
                >
                  Ascending
                </button>
                <button
                  onClick={() => handleSortOrderChange("desc")}
                  className="block w-full px-4 py-2 border-b-[1px] border-[rgba(33,86,105,0.758)] text-left hover:bg-[#c0c0c0c5] hover:text-[rgb(22,22,59)] rounded-[10px] rounded-se-none rounded-ss-none"
                >
                  Descending
                </button>
              </div>
            )}
          </div>

          <button
            onClick={onClose}
            className="p-2 hover:bg-[#ffffffbf] rounded-[50%]"
          >
            <AiOutlineClose className="text-xl text-[rgb(22,22,59)]" />
          </button>
        </div>
        <div className="p-5">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search by Name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full p-2 mt-1 mb-5 bg-[#ffffffac] border-[rgba(33,86,105,0.758)] placeholder:text-[rgb(33,86,105)] placeholder:font- border-[1px] rounded-[12px] focus:outline-none focus:border-[2px] focus:border-[rgb(22,22,59)]"
          />
          {/* Sort Dropdown */}

          <div className="overflow-y-auto h-[calc(100vh-64px)]">
            {isLoading ? (
              <div className="flex justify-center items-center h-full">
                <div className="loader"></div>
              </div>
            ) : (
              <div>
                {filteredAndSortedDetails.map((detail) => (
                  <div
                    key={detail.id} onClick={() => handleUserClick(detail.id)} 
                    className="flex justify-between items-center p-3 border-b border-[rgba(33,86,105,0.758)] hover:text-blue-600 cursor-pointer hover:bg-[#ffffff54] transition-colors duration-200"
                  >
                    <div className="flex-1 flex flex-col">
                      <span className="font-medium">{detail.name}</span>
                      <span className="text-xs text-gray-600 font-sans">{detail.email}</span>
                    </div>

                    <div className="flex items-center gap-6 mr-2">
                      <span
                        className={`px-3 py-1 rounded-full text-sm text-center font-semibold ${getCompletionColor(
                          detail.profileCompletion
                        )}`}
                      >
                        {detail.profileCompletion}%
                      </span>
                      <button
                        onClick={() => handleDelete(detail.id)}
                        className="text-red-500 hover:text-red-800 p-2 rounded-[50%] hover:bg-[#ffffff] transition-colors duration-200"
                      >
                        <RiDeleteBin6Line />
                      </button>
                    </div>
                  </div>
                ))}
                {error && <div className="text-red-500 mt-4">{error}</div>}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatusSidebar;
