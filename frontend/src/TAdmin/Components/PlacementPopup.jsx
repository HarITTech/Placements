import React, { useEffect, useState } from "react";
import { IoClose } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";
import { fetchUserById } from "../../redux/userSlice"; // Import the thunk
import toast from "react-hot-toast";

const PlacementPopup = ({ onClose, job }) => {
  const dispatch = useDispatch();
  const [userDetails, setUserDetails] = useState({}); // State to hold user details

  // Fetch user details for each student in placements
  useEffect(() => {
    const fetchUserDetails = async () => {
      const userPromises = job.placements.map(async (placement) => {
        const resultAction = await dispatch(fetchUserById(placement.studentId));
        if (fetchUserById.fulfilled.match(resultAction)) {
          return resultAction.payload; // Return the user data
        } else {
          toast.error(`Failed to fetch user with ID: ${placement.studentId}`);
          return null; // Return null if fetching fails
        }
      });

      const users = await Promise.all(userPromises);
      const validUsers = users.filter(user => user !== null); // Filter out null values
      const userMap = validUsers.reduce((acc, user) => {
        acc[user._id] = user; // Map user ID to user object
        return acc;
      }, {});

      setUserDetails(userMap); // Set the user details in state
    };

    fetchUserDetails();
  }, [dispatch, job.placements]);

  return (
    <div className="fixed p-6 inset-0 bg-[#a6c0cf80] backdrop-blur-[9px] flex justify-center z-50">
      <div className="bg-gradient-to-br from-[#ffffff30] via-[#a6c0cfa5] to-[#00214644] backdrop-blur-[4px] shadow-lg rounded-3xl w-[90%] h-full relative overflow-y-auto scrollbar-hide">
        <div className="relative p-5">
          <button
            className="absolute top-4 left-4 text-[rgb(22,22,59)] pl-[2px] pr-[6px] py-1 rounded-full hover:bg-[#ffffff86]"
            onClick={onClose}
          >
            <IoChevronBackOutline className="text-[28px] font-black" />
          </button>
          <button
            className="absolute top-4 right-4 text-[rgb(22,22,59)] px-1 py-1 rounded-full hover:bg-[#ffffff86]"
            onClick={onClose}
          >
            <IoClose className="text-[28px] font-black" />
          </button>
        </div>
        <div className="relative p-8">
          <h2 className="text-2xl text-[rgb(22, 22,59)] font-bold mb-4">
            Placement Details
          </h2>

          {job.placements.length > 0 ? (
            <table className="min-w-full bg-white border rounded-lg shadow-md border-gray-300">
              <thead>
                <tr className="bg-gray-200">
                  <th className="py-2 px-4 border">Profile Pic</th>
                  <th className="py-2 px-4 border">First Name</th>
                  <th className="py-2 px-4 border">Last Name</th>
                  <th className="py-2 px-4 border">Email</th>
                  <th className="py-2 px-4 border">Branch</th>
                  <th className="py-2 px-4 border">Semester</th>
                  <th className="py-2 px-4 border">Package</th>
                  <th className="py-2 px-4 border">Placed On</th>
                </tr>
              </thead>
              <tbody>
                {job.placements.map((placement) => {
                  const user = userDetails[placement.studentId]; // Get user details by studentId
                  return (
                    <tr key={placement.studentId} className="hover:bg-gray-100">
                      <td className="py-2 px-4 border text-center">
                        {user ? (
                          <img
                            src={user.profile.profilePic || "default-profile-pic-url"} // Use a default image if none exists
                            alt={`${user.profile.firstName} ${user.profile.lastName}`}
                            className="w-10 h-10 rounded-full mx-auto"
                          />
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-gray-300 mx-auto"></div>
                        )}
                      </td>
                      <td className="py-2 px-4 border text-center">{user ? user.profile.firstName : "Loading..."}</td>
                      <td className="py-2 px-4 border text-center">{user ? user.profile.lastName : "Loading..."}</td>
                      <td className="py-2 px-4 border text-center">{user ? user.email : "Loading..."}</td>
                      <td className="py-2 px-4 border text-center">{user ? user.profile.branch : "Loading..."}</td>
                      <td className="py-2 px-4 border text-center">{user ? user.profile.semester : "Loading..."}</td>
                      <td className="py-2 px-4 border text-center text-green-600 font-bold">
                        ₹{placement.packageAmount}
                      </td>
                      <td className="py-2 px-4 border text-center text-blue-600 font-bold">
                        {new Date(placement.placedOn).toLocaleDateString()}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p>No placements found for this job.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementPopup;