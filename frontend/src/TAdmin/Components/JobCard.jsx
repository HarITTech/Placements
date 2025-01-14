
import React, { useState } from "react";
// import { MdModeEdit } from "react-icons/md";
import { FaRankingStar, FaUserCheck } from "react-icons/fa6";
import { HiOutlineBuildingOffice2 } from "react-icons/hi2";
import { MdDeleteForever } from "react-icons/md";
import { useDispatch } from "react-redux";
import { IoImagesOutline } from "react-icons/io5";
import { deleteJob, updateLogo } from "../../redux/jobSlice"; 
import DOMPurify from "dompurify";
import toast from "react-hot-toast";
import Popup from "./AppliedPopup";
import { MdModeEdit } from "react-icons/md";
import PlacementPopup from "./PlacementPopup";


const JobCard = ({ job }) => {
  const dispatch = useDispatch();
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isPopupOpen, setPopupOpen] = useState(false);
  const [isPlacementPopupOpen, setIsPlacementPopupOpen] = useState(false); // New state for PlacementPopup

  const handleDelete = async () => {
    try {
      const resultAction = await dispatch(deleteJob(job._id));
      if (deleteJob.fulfilled.match(resultAction)) {
        toast.success("Job deleted successfully!");
        window.location.reload();
      } else {
        toast.error("Failed to delete the job!");
      }
    } catch (error) {
      toast.error("Something went wrong!");
    }
    setIsConfirmOpen(false); // Close the confirmation popup
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("jobId", job._id);
    formData.append("logo", file);

    setIsUploading(true);
    setUploadProgress(10); // Initial progress simulation

    // Simulate gradual progress for a better UX
    const interval = setInterval(() => {
      setUploadProgress((prev) => Math.min(prev + 20, 90)); // Incrementally update to 90%
    }, 500);

    try {
      const resultAction = await dispatch(updateLogo(formData));
      if (updateLogo.fulfilled.match(resultAction)) {
        clearInterval(interval);
        setUploadProgress(100); // Upload complete
        toast.success("Logo updated successfully!");
        window.location.reload();
        setTimeout(() => setUploadProgress(0), 1000); // Reset progress bar
      } else {
        clearInterval(interval);
        setUploadProgress(0); // Reset on failure
        toast.error("Failed to update logo.");
      }
    } catch (error) {
      clearInterval(interval);
      setUploadProgress(0); // Reset on error
      toast.error("Error updating logo.");
    } finally {
      setIsUploading(false);
    }
  };

  const { title, description, company, location, type, logo, totalApplications } = job;
  
  const handleEditClick = () => {
    document.body.classList.add("no-scroll");
    setPopupOpen(true);
  };

  const closePopup = () => {
    document.body.classList.remove("no-scroll");
    setPopupOpen(false);
  };

  return (
    <div className="flex flex-wrap gap-5 justify-center p-5 mx-10 mt-5">
      <div className="w-[90%] min-w-[600px] h-[270px] bg-[#cdd9e156] backdrop-blur-[3px] shadow-md rounded-2xl overflow-hidden p-5 flex flex-col transition-all hover:bg-[#cdd9e1ab] hover:shadow-lg hover:cursor-pointer">
        <div className="flex items-center px-4 mb-3 border-b-[1px] border-[#3c768a] pb-2 relative">
          <div className="relative group">
            {logo ? (
              <img
                src={logo}
                alt={`${company} logo`}
                className="w-[80px] h-[80px] rounded-md object-fill mr-2"
              />
            ) : (
              <div className="w-[80px] h-[80px] rounded-md mr-2 flex items-center justify-center bg-gray-200">
                <HiOutlineBuildingOffice2 className="w-6 h-6 text-gray-500" />
              </div>
            )}

            <input
              type="file"
              accept="image/*"
              id={`upload-logo-${job._id}`}
              className="hidden"
              onChange={handleLogoUpload}
            />
            <label
              htmlFor={`upload-logo-${job._id}`}
              className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer rounded-md"
            >
              {isUploading ? (
                <div className="animate-spin w-6 h-6 border-4 border-white border-t-transparent rounded-full"></div>
              ) : (
                <div className="flex flex-col justify-center items-center gap-2">
                  <IoImagesOutline className="font-bold text-2xl" />
                  <span className="text-lg font-semibold">Upload</span>
                </div>
              )}
            </label>
          </div>

          <div className="flex-1 ml-3">
            <h2 className="text-[18px] font-medium text-[#16163b]">
              {company}
            </h2>
            <h4 className="text-[20px] font-bold text-[#16163b] my-[2px]">
              {title}
            </h4>
            <p className="text-[15px] text-[#16163b]">Location: {location}</p>
          </div>
          
          <div className="absolute top-[35px] right-[0px] flex items-center gap-2">
          <button
              className="flex items-center gap-1 px-2 py-0.5 pr-3 bg-[#A6C0CF] shadow-md text-[#16163b] border border-[#517488] rounded-xl text-[15px] font-medium hover:bg-[#80a7be]"
              onClick={handleEditClick}
            >
              <MdModeEdit /> Rounds
            </button>
            <button
              className="flex items-center gap-1 px-2 py-0.5 pr-3 bg-[#dd4d4d] shadow-md text-white border border-[#a52929] rounded-xl text-[15px] font-medium hover:bg-[#a52929]"
              onClick={() => setIsConfirmOpen(true)}
            >
              <MdDeleteForever /> Delete
            </button>
            <button
              className="flex items-center gap-1 px-2 py-0.5 pr-3 bg-[#A6C0CF] shadow-md text-[#16163b] border border-[#517488] rounded-xl text-[15px] font-medium hover:bg-[#80a7be]"
              onClick={() => setIsPlacementPopupOpen(true)}
            >
              <MdModeEdit /> Placements
            </button>
          </div>
        </div>

        {isConfirmOpen && (
          <div className="fixed top-0 left-0 w-full h-full bg-[#ffffff35] backdrop-blur-[6px] flex items-center justify-center z-50">
            <div className=" rounded-[20px] border-[1px] border-[#9d9d9dbe] bg-[#ffffff52] backdrop-blur-[2px] shadow-xl px-5 pt-4 pb-6  w-[90%] max-w-[400px]">
              <h2 className="text-[20px] font-bold text-[rgb(22,22,59)]">
                Confirm Delete
              </h2>
              <p className="text-[rgb(22,22,59)] mt-1 mb-4 mx-3 font-semibold">
                Are you sure you want to delete this job?
              </p>
              <div className="flex justify-end gap-4">
                <button
                  className="bg-[#A6C0CF] shadow-lg px-4 py-1 rounded-xl font-bold text[rgb(22,22,59)] hover:bg-[#80a7be] border-[1px] border-[#517488]"
                  onClick={() => setIsConfirmOpen(false)}
                >
                  Cancel
                </button>
                <button
                  className="bg-[#3e79a7] shadow-lg text-white font-bold px-4 py-1 rounded-xl hover:bg-[#21537a] "
                  onClick={handleDelete}
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="px-4">
          <p className="text-[15px] text-[#16163b] mb-1">
            Employment Type: {type}
          </p>
          <h3 className="text-[17px] text-[#16163b] mb-[1px]">About:</h3>
          {/* Use dangerouslySetInnerHTML to render the HTML content */}
          <div
            className="text-[15px] text-[#16163b]"
            dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(description),
            }}
          ></div>
        </div>
      </div>
      {isPopupOpen && <Popup onClose={closePopup} job={job}/>}
      {isPlacementPopupOpen && (
          <PlacementPopup onClose={() => setIsPlacementPopupOpen(false)} job={job} />
        )}
    </div>
  );
};

export default JobCard;
