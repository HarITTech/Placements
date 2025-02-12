import React, { useCallback, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { deleteUser, fetchUserById, getProfileCompletionDetails } from "../../redux/userSlice";
import { AiOutlineClose } from "react-icons/ai";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaSortAmountDown } from "react-icons/fa"; // Import a sorting icon
import debounce from "lodash.debounce";
import { useNavigate } from "react-router-dom";
import { VscSettings } from "react-icons/vsc";
import { FaFilePdf } from "react-icons/fa6";
import TablePDF from "../../component/TablePDF";
import DynamicTablePDF from "../../component/TablePDF";

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
  const [selectedUser , setSelectedUser ] = useState(null);
  const [selectedBranch, setSelectedBranch] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for PDF modal
  const [isPdfModalOpen, setIsPdfModalOpen] = useState(false);
  const [pdfUsers, setPdfUsers] = useState([]);

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

  const handleUserClick = async (userId) => {
    try {
      await dispatch(fetchUserById(userId)).unwrap(); // Fetch user data
      navigate(`/tadmin/userprofile/${userId}`); // Navigate to UserProfile with userId
    } catch (error) {
      toast.error(`Failed to fetch user: ${error}`, { position: "top-center" });
    }
  };

  const handleDelete = async (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      try {
        await dispatch(deleteUser(userId)).unwrap();
        toast.success("User  deleted successfully!");
        navigate(`/tadmin/users`);
        window.location.reload(); // Refresh the page after successful deletion
      } catch (error) {
        toast.error(`${error}`, { position: "top-center" });
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
    .filter(
      (detail) =>
        detail.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        detail.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter(
      (detail) => (selectedBranch ? detail.branch === selectedBranch : true) // Filter by selected branch
    )
    .sort((a, b) => {
      if (sortOrder === "asc") {
        return a.profileCompletion - b.profileCompletion;
      } else {
        return b.profileCompletion - a.profileCompletion;
      }
    });

  const handleBranchChange = (e) => {
    setSelectedBranch(e.target.value);
  };

  const handleSortButtonClick = () => {
    setIsDropdownOpen(!isDropdownOpen); // Toggle dropdown visibility
  };

  const handleSortOrderChange = (order) => {
    setSortOrder(order);
    setIsDropdownOpen(false); // Close dropdown after selection
  };

  const handleExport = () => {
    const formattedData = filteredAndSortedDetails.map((detail) => ({
      Name: detail.name,
      Email: detail.email,
      Branch: detail.branch,
      ProfileCompletion: `${detail.profileCompletion}%`,
      Message: "update your profile above 90%",
    }));

    setPdfUsers(formattedData);
    setIsPdfModalOpen(true); // Open the PDF modal
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
            <button
              onClick={handleExport}
              className="p-2 bg-transparent rounded hover:bg-[#ffffffbf] focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <FaFilePdf className="text-[rgba(22,22,59)]" />
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
          <div className="flex items-center space-x-2 mb-5">
            {" "}
            {/* Flex container for alignment */}
            <input
              type="text"
              placeholder="Search by Name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 p-2 bg-[#ffffffac] border-[rgba(33,86,105,0.758)] placeholder:text-[rgb(33,86,105)] placeholder:font- border-[1px] rounded-[12px] focus:outline-none focus:border-[2px] focus:border-[rgb(22,22,59)]"
            />
            {/* Branch Dropdown */}
            <select
              id="branch"
              value={selectedBranch}
              onChange={handleBranchChange}
              className="border-[1px] border-gray-500 bg-transparent rounded-lg p-2" // Adjust padding as needed
            >
              <option value="">Select Branch</option>
              <option value="CSE">CSE</option>
              <option value="IT">IT</option>
              <option value="Aero">Aero</option>
              <option value="Bio">Bio</option>
              <option value="Mech">Mech</option>
              <option value="EE">EE</option>
              <option value="ECE">ECE</option>
              <option value="CE">CE</option>
            </select>
          </div>

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
                    key={detail.id}
                    onClick={() => handleUserClick(detail.id)}
                    className="flex justify-between items-center p-3 border-b border-[rgba(33,86,105,0.758)] hover:text-blue-600 cursor-pointer hover:bg-[#ffffff54] transition-colors duration-200"
                  >
                    <div className="flex-1 flex flex-col">
                      <span className="font-medium">{detail.name}</span>
                      <span className="text-xs text-gray-600 font-sans">
                        {detail.email}
                      </span>
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
      {/* Render PDF Modal */}
      {isPdfModalOpen && (
        <DynamicTablePDF
          data={pdfUsers}
          logo="https://cdn.universitykart.com//Content/upload/admin/regycmyd.21e.jpeg"
          headers={["Name", "Email", "Branch", "ProfileCompletion", "Message", "Note"]}
          title="Profile Completion Status"
          subtitle="List of users with profile completion status."
          onClose={() => setIsPdfModalOpen(false)}
        />
      )}
    </div>
  );
};

export default StatusSidebar;
