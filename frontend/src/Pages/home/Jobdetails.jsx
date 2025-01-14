import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { applyForJob, getEligibleJobs } from "../../redux/jobSlice";
import { FaCheck } from "react-icons/fa6";
import { X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import TermsAndConditionsPopup from "../../component/TermsAndConditionsPopup";
import toast from "react-hot-toast";
import Loading from "../../component/Loading";


const JobDetails = () => {
  const { jobId } = useParams();
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);
  const [showPopup, setShowPopup] = useState(false);
  const navigate = useNavigate(); // Initialize useNavigate


  useEffect(() => {
    dispatch(getEligibleJobs());
  }, [dispatch]);

  const jobDetails = jobs.find((job) => job._id === jobId);

  const handleApply = () => {
    setShowPopup(true);
  };

  const handleConfirmApply = () => {
    dispatch(applyForJob(jobId))
      .unwrap()
      .then(() => {
        setShowPopup(false);
        toast.success("Application submitted successfully!");
        navigate("/job"); // Navigate to "/job" after successful application
      })
      .catch((error) => {
        alert(`Failed to apply: ${error.message}`);
      });
  };

  if (loading) {
    return <p><Loading/></p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
  }

  if (!jobDetails) {
    return <p>No job details found.</p>;
  }

  const {
    title,
    description,
    company,
    location,
    type,
    jobDate,
    eligibilityCriteria,
    totalApplications,
    createdAt,
  } = jobDetails;

  return (
    <AnimatePresence>
      {jobDetails && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50"
            onClick={() => window.history.back()}
          />
          <motion.div
            initial={{ opacity: 0, x: "100%" }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: "100%" }}
            transition={{ type: "spring", damping: 20 }}
            className="fixed right-0 top-0 z-50 h-full w-full max-w-2xl bg-white p-6 shadow-lg rounded-lg"
          >
            <div className="relative h-full">
              <button
                onClick={() => window.history.back()}
                className="absolute right-4 top-4 p-2 text-gray-600 hover:text-gray-800"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="flex flex-col gap-6">
                {/* Header Section */}
                <div className="flex items-center gap-10 p-2">
                  <div className="h-32 w-32 bg-gray-100  rounded-full flex items-center object-cover justify-center">
                    <img
                      src={jobDetails.logo || "/placeholder-logo.png"}
                      alt="Company logo"
                      className="h-24 w-24 object-fill"
                    />
                  </div>
                  <div>
                    <h1 className="text-lg text-gray-600 font-bold">
                      {company}
                    </h1>
                    <p className="text-2xl font-bold text-gray-700">{title}</p>
                    <div className="flex pt-2 space-x-6">
                      <p className="text-gray-500 font-normal  ">
                        {location}
                      </p>
                      <p className="text-green-600 font-semibold">
                        {new Date(jobDate).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </p>
                      <div className="flex space-x-1 pl-4">
                        <p className="text-gray-600 font-semibold">
                          {totalApplications}
                        </p>
                        <span className=" text-gray-500">applicants</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Details Section */}
                <div className="space-y-8 px-8">
                  <div className=" flex text-nowrap gap-6">
                    <div className="flex items-center justify-center space-x-1 bg-sky-200/50 rounded-sm w-28  py-1  ">
                      <FaCheck className="text-xl" />
                      <p className="text-gray-600 font-semibold">{type}</p>
                    </div>
                    <div className="flex items-center justify-center space-x-1 bg-sky-200/50 rounded-sm w-28  py-1 ">
                      <FaCheck className="text-xl" />
                      <p className="text-gray-600 font-semibold">
                        {eligibilityCriteria.branches.join(", ") || "All"}{" "}
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-1 bg-sky-200/50 rounded-sm w-28  py-1 ">
                      <FaCheck className="text-xl" />
                      <p className="text-gray-600 font-semibold">
                        {" "}
                        {eligibilityCriteria.gender || "Both"}
                      </p>
                    </div>
                    <div className="flex items-center justify-center space-x-1 bg-sky-200/50 rounded-sm w-28  py-1 ">
                      <FaCheck className="text-xl" />
                      <p className="text-gray-600 font-semibold">
                        {eligibilityCriteria.session || "2024-2025"}
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-6 ">
                    <button onClick={handleApply} className="px-6 py-2 bg-blue-500 text-white font-bold rounded-3xl transform transition-all duration-300 hover:bg-blue-600  focus:ring-2 focus:ring-blue-400 focus:outline-none ">
                      Apply Now
                    </button>
                    <button className="px-6 py-2  text-blue-600 rounded-3xl  hover:text-blue-800 font-semibold  border-[2px] border-blue-600 hover:border-blue-800 hover:bg-blue-50 focus:ring-1 focus:ring-blue-600 focus:outline-none ">
                      Contact
                    </button>
                  </div>
                </div>

                {/* Eligibility Criteria */}
                <div className="space-y-4 pt-3  rounded-sm  px-5">
                  <div className="bg-stone-200/50  px-6 py-1">
                    <h3 className="font-semibold text-gray-800 pb-3">
                      Eligibility Criteria:
                    </h3>

                    <div className="grid grid-cols-3  gap-4 pb-6">
                      <div className="flex space-x-1">
                        <p className="text-gray-600 font-semibold">
                          {eligibilityCriteria.cgpa || "NA"}
                        </p>
                        <h4 className="font-normal text-gray-700">Min CGPA</h4>
                      </div>

                      <div className="flex space-x-1">
                        <p className="text-gray-600 font-semibold">
                          {eligibilityCriteria.jeeScore || "NA"}
                        </p>
                        <h4 className="font-normal text-gray-700">Min JEE</h4>
                      </div>

                      <div className="flex space-x-1">
                        <p className="text-gray-600 font-semibold">
                          {eligibilityCriteria.mhtCetScore || "NA"}
                        </p>
                        <h4 className="font-normal text-gray-700">
                          Min MHT-CET
                        </h4>
                      </div>

                      <div className="flex space-x-1">
                        <p className="text-gray-600 font-semibold">
                          {eligibilityCriteria.tenthPercentage || "NA"}%
                        </p>
                        <h4 className="font-normal text-gray-700">Min 10th </h4>
                      </div>

                      <div className="flex space-x-1">
                        <p className="text-gray-600 font-semibold">
                          {eligibilityCriteria.twelfthPercentage || "NA"}%
                        </p>
                        <h4 className="font-normal text-gray-700">Min 12th </h4>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold pt-5 text-lg text-gray-800">
                      About the Job
                    </h3>
                    <p className="text-gray-600"> (description)
            </p>
                  </div>
                  <div className="flex space-x-1 justify-items-end pt-5">
                    <h3 className="font-semibold text-gray-800">Posted On:</h3>
                    <p className="text-gray-600">
                      {new Date(createdAt).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                {/* Footer Section */}
              </div>
            </div>
            <AnimatePresence>
        {showPopup && (
          <TermsAndConditionsPopup
            onClose={() => setShowPopup(false)}
            onApply={handleConfirmApply}
          />
        )}
      </AnimatePresence>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default JobDetails;
