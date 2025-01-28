import { FaUsers } from "react-icons/fa";
import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { PiStudentFill } from "react-icons/pi";
import { FaUserMinus } from "react-icons/fa";
import { AiFillSchedule } from "react-icons/ai";
import { jwtDecode } from "jwt-decode";
import CountUp from "react-countup";
import { getAllJobs } from "../../redux/jobSlice";

const Content = () => {
  const dispatch = useDispatch();
  const { collegeUsers } = useSelector((state) => state.user);
  const [loading, setLoading] = useState(false);
  const [totalStudents, setTotalStudents] = useState(0);
  const [totalJobs, setTotalJobs] = useState(0);



  useEffect(() => {
    if (collegeUsers.length > 0) {
      setTotalStudents(collegeUsers.length);
    }
  }, [collegeUsers]);
  

  

  return (
    <div className="flex flex-col items-center mt-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 w-[90%]">
        <div className="flex items-center justify-start bg-gradient-to-b from-[#709ABA] to-[#213e60] rounded-md p-4 gap-3 h-[100px] shadow-md transition-transform duration-200 hover:scale-95">
          <FaUsers className="text-4xl text-gray-300 border border-gray-300 rounded-md p-1" />
          <div className="text-gray-300 flex flex-col">
            <h2 className="text-[18px] font-semibold m-0">Total Student's</h2>
            <h3 className="text-[24px] font-bold m-0">
              <CountUp start={0} end={totalStudents} duration={2} />
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-start bg-gradient-to-b from-[#709ABA] to-[#213e60] rounded-md p-4 gap-3 h-[100px] shadow-md transition-transform duration-200 hover:scale-95">
          <PiStudentFill className="text-4xl text-gray-300 border border-gray-300 rounded-md p-1" />
          <div className="text-gray-300 flex flex-col">
            <h2 className="text-[18px] font-semibold m-0">Placed Student's</h2>
            <h3 className="text-[24px] font-bold m-0">
              <CountUp
                start={0}
                end={
                  collegeUsers.filter((user) =>
                    user.profile.appliedJobsHistory.some((job) => job.placement)
                  ).length
                }
                duration={2}
              />
            </h3>
          </div>
        </div>
        <div className="flex items-center justify-start bg-gradient-to-b from-[#709ABA] to-[#213e60] rounded-md p-4 gap-3 h-[100px] shadow-md transition-transform duration-200 hover:scale-95">
          <FaUserMinus className="text-4xl text-gray-300 border border-gray-300 rounded-md p-1" />
          <div className="text-gray-300 flex flex-col">
            <h2 className="text-[18px] font-semibold m-0">
              Total Posts
            </h2>
            <h3 className="text-[24px] font-bold m-0">0</h3>
          </div>
        </div>
        <div className="flex items-center justify-start bg-gradient-to-b from-[#709ABA] to-[#213e60] rounded-md p-4 gap-3 h-[100px] shadow-md transition-transform duration-200 hover:scale-95">
          <AiFillSchedule className="text-4xl text-gray-300 border border-gray-300 rounded-md p-1" />
          <div className="text-gray-300 flex flex-col">
            <h2 className="text-[18px] font-semibold m-0">
              Interview's Schedule
            </h2>
            <h3 className="text-[24px] font-bold m-0">0</h3>
          </div>
        </div>
      </div>
      <div className="h-[1.5px] w-[92%] bg-[#215669C1] rounded-lg mt-5 mb-4"></div>
    </div>
  );
};

export default Content;
