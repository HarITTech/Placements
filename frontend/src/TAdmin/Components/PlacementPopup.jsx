import React, { useState, useEffect } from "react";
import { FaRankingStar, FaUserCheck } from "react-icons/fa6";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdDeleteForever } from "react-icons/md";
import { IoImagesOutline } from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { IoChevronBackOutline } from "react-icons/io5";
import { FaAnglesRight } from "react-icons/fa6";
import { PiStudentBold } from "react-icons/pi";
import { MdOutlineFeedback } from "react-icons/md";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import {
  addPlacement,
  getPlacementsForJob,
  updateLogo,
} from "../../redux/jobSlice";
import toast from "react-hot-toast";
import DOMPurify from "dompurify";

const PlacementPopup = ({ onClose, job }) => {
  const dispatch = useDispatch();
  
  const [placements, setPlacements] = useState({ }); // New state for placements
  const [fetchPlacements, setFetchPlacements] = useState(false); // New state to track if placements are fetched

  useEffect(() => {
    if (fetchPlacements) {
      const fetchPlacementsData = async () => {
        try {
          const resultAction = dispatch(getPlacementsForJob(job._id));
          if (getPlacementsForJob.fulfilled.match(resultAction)) {
            setPlacements(resultAction.payload.placements); // Ensure this matches the backend response
          } else {
            toast.error("Failed to fetch placements.");
          }
        } catch (error) {
          toast.error("Error fetching placements.");
        }
      };
      fetchPlacementsData();
    }
  }, [dispatch, job._id, fetchPlacements]);

  const handleFetchPlacements = (event) => {
    event.stopPropagation();
    event.preventDefault();
    setFetchPlacements(true);
  };

  return (
    <div className="fixed p-6 inset-0 bg-[#a6c0cf80] backdrop-blur-[9px] flex justify-center z-50">
      <div className="bg-gradient-to-br from-[#ffffff30] via-[#a6c0cfa5] to-[#00214644]  backdrop-blur-[4px] shadow-lg rounded-3xl w-[90%] h-full relative overflow-y-auto scrollbar-hide">
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

          <button
            className="bg-[#A6C0CF] shadow-lg px-4 py-1 rounded-xl font-bold text-[rgb(22,22,59)] hover:bg-[#80a7be] border-[1px] border-[#517488]"
            onClick={handleFetchPlacements}
          >
            Get Placements
          </button>

          {placements.length > 0 ? (
            placements.map((placement) => (
              <div
                key={placement.studentId}
                className="mb-4 p-4 border rounded -lg shadow-md"
              >
                <h3 className="text-lg font-semibold">
                  Student ID: {placement.studentId}
                </h3>
                <p>Email: {placement.email}</p>
                <p>First Name: {placement.firstName}</p>
                <p>Last Name: {placement.lastName}</p>
                <p>Package: ₹{placement.package}</p>
                <p>
                  Placed On: {new Date(placement.placedOn).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p>No placements found for this job.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PlacementPopup;