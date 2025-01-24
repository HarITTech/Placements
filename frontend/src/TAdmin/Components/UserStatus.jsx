import { useState } from "react";

const UserStatus = ({ userStatus }) => {

  const [blacklistSessions, setBlacklistSessions] = useState(0);
  const [preventJobs, setPreventJobs] = useState(0);
  const [isBlacklisted, setIsBlacklisted] = useState(false);
  const [isPrevented, setIsPrevented] = useState(false);

  // const { currentStatus } = user.profile;

  if (!userStatus) {
    return null;
  }
  
  const handleBlacklistChange = (e) => {
    setIsBlacklisted(e.target.checked);
    if (!e.target.checked) setBlacklistSessions(0);
  };

  const handleSessionsChange = (e) => {
    setBlacklistSessions(e.target.value);
  };

  const handlePreventChange = (e) => {
    setIsPrevented(e.target.checked);
    if (!e.target.checked) setPreventJobs(0);
  };

  const handlePreventJobsChange = (e) => {
    setPreventJobs(e.target.value);
  };

  const saveOptions = () => {
    alert(
      `Blacklist Sessions: ${blacklistSessions}, Prevent Jobs: ${preventJobs}`
    );
  };

  return (
    <div className="p-5 bg-[#ffffff38] backdrop-blur-[3px] shadow-md rounded-[20px] w-full my-10">
      <h2 className="text-[20px] font-semibold text-gray-700 mb-3">Current Status:</h2>
      <div className="flex justify-between mb-5">
        <div className="flex-1 mx-2">
          <p className="text-[14] text-[#16163b] flex items-center mb-1">
            <strong>Company Name:</strong>
            <h6 className="text-[14] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-[rgba(141,168,178,0.46)] text-[#16163b] rounded">
            {userStatus.companyName || "NA"}
            </h6>
          </p>
          <p className="text-[14] text-[#16163b] flex items-center mb-1">
            <strong>Position:</strong>
            <h6 className="text-[14] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-[rgba(141,168,178,0.46)] text-[#16163b] rounded]">
            {userStatus.position || "NA"}
            </h6>
          </p>
          <p className="text-[14] text-[#16163b] flex items-center mb-1">
            <strong>Duration:</strong>
            <h6 className="text-[14] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-[rgba(141,168,178,0.46)] text-[#16163b] rounded">
            {userStatus.duration || "NA"}
            </h6>
          </p>
        </div>
        <div className="flex-1 mx-2">
          <p className="text-[14] text-[#16163b] flex items-center mb-1">
            <strong>Job/Internship:</strong>
            <h6 className="text-[14] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-[rgba(141,168,178,0.46)] text-[#16163b] rounded">
            {userStatus.jobType || "NA"}
            </h6>
          </p>
          <p className="text-[14] text-[#16163b] flex items-center mb-1">
            <strong>Location:</strong>
            <h6 className="text-[14] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-[rgba(141,168,178,0.46)] text-[#16163b] rounded">
            {userStatus.location || "NA"}
            </h6>
          </p>
          <p className="text-[14] text-[#16163b] flex items-center mb-1">
            <strong>Starting/Joining date:</strong>
            <h6 className="text-[14] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-[rgba(141,168,178,0.46)] text-[#16163b] rounded">
            {/* {userStatus.startDate || "NA"} */}
            {userStatus.startDate
                    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(userStatus.startDate))
                    : "NA"}
            </h6>
          </p>
          <p className="text-[14px] text-[#16163b] flex items-center mb-1">
            <strong>Ending date:</strong>
            <h6 className="text-[14px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-[rgba(141,168,178,0.46)] text-[#16163b] rounded">
            {/* {userStatus.endDate || "NA"} */}
            {userStatus.endDate
                    ? new Intl.DateTimeFormat('en-US', { dateStyle: 'long' }).format(new Date(userStatus.endDate))
                    : "NA"}
            </h6>
          </p>
        </div>
      </div>
      
      <div className="border-t border-[rgba(33,86,105,0.758)] pt-6 mt-6 relative">
        <label className="flex items-center cursor-pointer relative">
            <input
            type="checkbox"
            checked={isBlacklisted}
            onChange={handleBlacklistChange}
            className="hidden peer"
            />
            <span className="w-[20px] h-[20px] bg-transparent border-2 border-[#6b8596] rounded-[6px] mr-2 relative transition-all duration-300 ease-in-out peer-checked:bg-[#002146] peer-checked:border-[#002146] peer-checked:after:content-[''] peer-checked:after:w-[13px] peer-checked:after:h-[6px] peer-checked:after:border-white peer-checked:after:border-[2px] peer-checked:after:border-b-0 peer-checked:after:border-l-0 peer-checked:after:absolute peer-checked:after:top-[3px] peer-checked:after:left-[1px] peer-checked:after:rotate-[135deg]"></span>
            Blacklist Student for
            <input
            type="text"
            value={blacklistSessions}
            onChange={handleSessionsChange}
            disabled={!isBlacklisted}
            className="w-10 px-2 py-0.5 border-b-2 border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-[rgb(141,168,178)] shadow-md rounded-lg text-[#16163b] font-semibold text-center mx-2 focus:outline-none focus:border-[#16163b] focus:border-b-2 focus:bg-transparent disabled:bg-transparent disabled:cursor-not-allowed"
            />
            no. of sessions
        </label>
        <label className="flex items-center cursor-pointer relative mt-4">
            <input
            type="checkbox"
            checked={isPrevented}
            onChange={handlePreventChange}
            className="hidden peer"
            />
            {/* <span className="w-[20px] h-[20px] bg-transparent border-2 border-[#6b8596] rounded-[6px] mr-2 relative transition-all duration-300 ease-in-out peer-checked:bg-[#002146] peer-checked:border-[#002146] peer-checked:after:content-[''] peer-checked:after:w-[6px] peer-checked:after:h-[13px] peer-checked:after:border-white peer-checked:after:border-[2px] peer-checked:after:border-b-0 peer-checked:after:border-l-0 peer-checked:after:absolute peer-checked:after:top-[-1px] peer-checked:after:left-[5px] peer-checked:after:rotate-90"></span> */}
            <span className="w-[20px] h-[20px] bg-transparent border-2 border-[#6b8596] rounded-[6px] mr-2 relative transition-all duration-300 ease-in-out peer-checked:bg-[#002146] peer-checked:border-[#002146] peer-checked:after:content-[''] peer-checked:after:w-[13px] peer-checked:after:h-[6px] peer-checked:after:border-white peer-checked:after:border-[2px] peer-checked:after:border-b-0 peer-checked:after:border-l-0 peer-checked:after:absolute peer-checked:after:top-[2px] peer-checked:after:left-[1px] peer-checked:after:rotate-[135deg]"></span>

            Prevent this student from applying next
            <input
            type="text"
            value={preventJobs}
            onChange={handlePreventJobsChange}
            disabled={!isPrevented}
            className=" w-10 px-2 py-0.5 border-b-2 border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-[rgb(141,168,178)] shadow-md rounded-lg text-[#16163b] font-semibold text-center mx-2 focus:outline-none focus:border-[#16163b] focus:border-b-2 focus:bg-transparent disabled:bg-transparent disabled:cursor-not-allowed"
            />
            Job/Internship Opportunity
        </label>
        <button
            onClick={saveOptions}
            className="absolute bottom-2 right-7 mt-5 mb-2 px-5 py-1 bg-[#4884b3] text-[#dadada] font-medium text-lg rounded-lg hover:bg-[#3e6888] transition-colors"
        >
            Save Options
        </button>
        </div>

    </div>
  );
};

export default UserStatus;
