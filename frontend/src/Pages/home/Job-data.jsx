import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getEligibleJobs } from "../../redux/jobSlice"; // Adjust the path as necessary
import { Link } from "react-router-dom"; // Import Link
import { ChevronDown, SlidersHorizontal, Search, BellRing } from "lucide-react";
import Loading from "../../component/Loading";
import FilterDropdown from "./filterdropdown";
import DOMPurify from "dompurify";

export function JobData() {
  const dispatch = useDispatch();
  const { jobs, loading, error } = useSelector((state) => state.jobs);

  const [isNotificationOpen, setIsNotificationOpen] = useState(false);

  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({
    selectedRole: "",
    selectedLocation: "",
  });

  const toggleNotifications = () => {
    setIsNotificationOpen(!isNotificationOpen);
  };

  const toggleFilterDropdown = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleApplyFilters = (appliedFilters) => {
    setFilters(appliedFilters);
  };

  // Fetch eligible jobs on component mount
  useEffect(() => {
    dispatch(getEligibleJobs());
  }, [dispatch]);

  const filteredJobs = jobs.filter((job) => {
    return (
      (filters.selectedRole === "" ||
        job.eligibilityCriteria.branches.includes(filters.selectedRole)) &&
      (filters.selectedLocation === "" ||
        (filters.selectedLocation.toLowerCase() === "on-site" &&
          job.location.toLowerCase() !== "remote") ||
        job.location.toLowerCase() === filters.selectedLocation.toLowerCase())
    );
  });

  return (
    <main className="flex-1 p-6 bg-transparent">
      {/* Search Filter Bar */}
      <div className="bg-gradient-to-b bg-transparent pb-4 pt-2 flex items-center justify-center">
        <div className="w-full max-w-2xl bg-[#EDE5E5] backdrop-blur-md rounded-full px-4 py-2 flex items-center gap-2 shadow-lg">
          <div className="flex items-center gap-2 flex-1">
            <Search className="w-5 h-5 text-gray-400" />
            <div className="flex items-center gap-1 border-r pr-2">
              <span className="text-gray-700">Role</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
            <div className="flex items-center gap-1">
              <span className="text-gray-700">Location</span>
              <ChevronDown className="w-4 h-4 text-gray-400" />
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button className="px-6 py-2 bg-white rounded-full text-gray-700 font-medium shadow-sm hover:shadow transition-shadow">
              Search
            </button>
          </div>
        </div>
        <div className="relative">
          <button
            onClick={toggleFilterDropdown}
            className="p-2 hover:bg-gray-100 rounded-full"
          >
            <SlidersHorizontal className="w-5 h-5 text-gray-700" />
          </button>
          {isFilterOpen && (
            <FilterDropdown
              onClose={() => setIsFilterOpen(false)}
              onApply={handleApplyFilters} // Pass the onApply prop
            />
          )}
        </div>

      </div>

      {/* Job Cards */}
      {loading ? (
        <div className="text-center text-gray-600">
          <Loading />
        </div>
      ) : error ? (
        <div className="text-center text-red-600">Error: {error.message}</div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {filteredJobs
            .filter((job) => job.type === "job")
            .map((job) => (
              <div
                key={job._id}
                className="relative p-4 bg-[#D9D9D9] shadow-sm rounded-lg flex flex-col"
              >
                <div className="mb-4 flex items-start gap-4">
                  {/* Company Logo */}
                  <img
                    src={`${job.logo}` || "default-logo.png"} // Update with your dynamic logo path
                    alt={`${job.company} logo`}
                    className="h-16 w-16 rounded-lg object-fill"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold">{job.title}</h3>
                    <p className="text-sm text-gray-600">
                      in {job.company} •{" "}
                      {new Date(job.createdAt).toLocaleString()}
                    </p>
                  </div>
                </div>
                {/* Job Description */}
                <div
                  className="text-gray-600"
                  dangerouslySetInnerHTML={{
                    __html: DOMPurify.sanitize(job.description),
                  }}
                ></div>
                {/* Tags and Location */}
                <div className="mb-4 flex flex-wrap gap-2 mt-2">
                  {job.eligibilityCriteria.branches.length > 0 && (
                    <span className="inline-block border border-purple-600 rounded-full bg-slate-200 px-2 py-1 text-sm font-medium">
                      {job.eligibilityCriteria.branches.join(", ")}
                    </span>
                  )}
                  <span className="inline-block border border-purple-600 rounded-full bg-slate-200 px-2 py-1 text-sm font-medium">
                    {job.location}
                  </span>
                </div>
                {/* Eligibility Criteria */}
                <div className="mb-4 flex flex-wrap gap-2">
                  <span className="bg-slate-200 px-3 py-1 text-sm border-2 border-gray-400">
                    CGPA: {job.eligibilityCriteria.cgpa || "NA"}
                  </span>
                  <span className="bg-slate-200 px-3 py-1 text-sm border-2 border-gray-400">
                    JEE Score: {job.eligibilityCriteria.jeeScore || "NA"}
                  </span>
                  <span className="bg-slate-200 px-3 py-1 text-sm border-2 border-gray-400">
                    MHT CET Score: {job.eligibilityCriteria.mhtCetScore || "NA"}
                  </span>
                  <span className="bg-slate-200 px-3 py-1 text-sm border-2 border-gray-400">
                    10th %: {job.eligibilityCriteria.tenthPercentage || "NA"}
                  </span>
                  <span className="bg-slate-200 px-3 py-1 text-sm border-2 border-gray-400">
                    12th %: {job.eligibilityCriteria.twelfthPercentage || "NA"}
                  </span>
                  <span className="bg-slate-200 px-3 py-1 text-sm border-2 border-gray-400">
                    Semester Clear:{" "}
                    {job.eligibilityCriteria.semesterClear ? "Yes" : "No"}
                  </span>
                </div>
                {/* Call to Action */}
                <div className="flex items-center justify-between mt-auto">
                  <p className="text-sm text-gray-600">
                    Total Applications: {job.totalApplications}
                  </p>
                  <Link
                    to={`/job/${job._id}`}
                    className="inline-block mt-4 px-4 py-2 border border-blue-600 text-blue-600 rounded-lg text-sm font-medium hover:bg-blue-600 hover:text-white transition-all duration-300"
                  >
                    Read More
                  </Link>
                </div>
              </div>
            ))}
        </div>
      )}
    </main>
  );
}

const notifications = [
  {
    avatar: "https://tools-api.webcrumbs.org/image-placeholder/40/40/avatars/1",
    name: "Emiway Bantai",
    action:
      "uploaded: EMIWAY BANTAI - SAFAR | ( PROD BY BACKYARD ) | OFFICIAL MUSIC VIDEO",
    time: "17 hours ago",
    thumbnail:
      "https://tools-api.webcrumbs.org/image-placeholder/100/60/products/1",
  },
  {
    avatar: "https://tools-api.webcrumbs.org/image-placeholder/40/40/shapes/1",
    name: "College Wallah",
    action: "uploaded: Can You Learn Multiple Programming Languages?",
    time: "1 day ago",
    thumbnail:
      "https://tools-api.webcrumbs.org/image-placeholder/100/60/office/2",
  },
  {
    avatar: "https://tools-api.webcrumbs.org/image-placeholder/40/40/doodles/3",
    name: "Aryan Mittal",
    action: "uploaded: Never forget this in Online Assessments (OA)",
    time: "2 days ago",
    thumbnail:
      "https://tools-api.webcrumbs.org/image-placeholder/100/60/nature/3",
  },
  {
    avatar: "https://tools-api.webcrumbs.org/image-placeholder/40/40/shapes/4",
    name: "College Wallah",
    action: "uploaded: How Much Programming You Need To Learn?",
    time: "3 days ago",
    thumbnail:
      "https://tools-api.webcrumbs.org/image-placeholder/100/60/abstract/4",
  },
  {
    avatar: "https://tools-api.webcrumbs.org/image-placeholder/40/40/doodles/5",
    name: "Emiway Bantai",
    action:
      "uploaded: EMIWAY BANTAI - MAAF KARO | ( PROD BY MEMAX ) | OFFICIAL MUSIC VIDEO",
    time: "4 days ago",
    thumbnail:
      "https://tools-api.webcrumbs.org/image-placeholder/100/60/office/5",
  },
];
