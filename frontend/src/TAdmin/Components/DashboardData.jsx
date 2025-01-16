import React, { useEffect } from "react";
import { SiConstruct3 } from "react-icons/si";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserById, listUsersOfCollege } from "../../redux/userSlice";
import { getAllJobs } from "../../redux/jobSlice";
import constu from '../../assets/constru.gif';
import Loading from "../../component/Loading";

const DashboardData = () => {
  const dispatch = useDispatch();
  const { user, status, error, collegeUsers } = useSelector(
    (state) => state.user
  );
  const { jobs, loading } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getAllJobs());
  }, [dispatch]);

  useEffect(() => {
    if (user?._id) {
      dispatch(fetchUserById(user._id));
      dispatch(listUsersOfCollege(user.college._id));
    }
  }, [dispatch, user?._id]);

  if (status === "loading" || !user || !user.college) {
    return <div><Loading/></div>;
  }

  if (loading) {
    return <div><Loading/></div>;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="mx-5 p-5">
      <div className="flex items-start gap-6">
        <div>
          <div className="bg-[#ffffff80] backdrop-blur-sm mb-6 p-5 rounded-[20px] w-[320px] shadow-lg flex flex-col items-center text-center">
            <img
              src="https://img.freepik.com/premium-photo/3d-entrepreneur-icon-business-leader-innovation-illustration-logo_762678-101891.jpg"
              alt="Upload Illustration"
              className="w-36 h-36 object-cover rounded-xl mb-5 mt-3"
            />
            <ul className="list-none m-0 text-[rgb(22,22,59)]">
              <li className="text-2xl font-black mb-2 text-[rgb(22,22,59)]">
                <strong>T&P Head</strong>
              </li>
              <li className="mb-3">
                <h6 className="text-md font-bold px-3 text-[rgb(22,22,59)]">
                  {user?.email || "tnpadmin@college.com"}
                </h6>
                <h6 className="text-xl font-bold px-3 text-[rgb(48,48,128)]">
                  {user?.college.name || "tnpadmin@abha.com"}
                </h6>
                <h6 className="text-lg font-medium px-3 text-[rgb(22,22,59)]">
                  {user?.college.address || "Nanded"}
                </h6>
              </li>
              <li className="text-base flex items-center">
                <strong>Subscription Type :</strong>
                <h6 className="text-base font-semibold text-gray-700 uppercase ml-2 px-3">
                  {user?.college?.subscription.planType}
                </h6>
              </li>
              <li className="text-base flex items-center">
                <strong>Start Date : </strong>
                <h6 className="text-base ml-2 px-3">
                  {new Date(
                    user?.college?.subscription.startDate
                  ).toLocaleDateString() || "NA"}
                </h6>
              </li>
              <li className="text-base flex items-center">
                <strong>End Date :</strong>
                <h6 className="text-base text-red-800 ml-2 px-3">
                  {new Date(
                    user?.college?.subscription.endDate
                  ).toLocaleDateString() || "NA"}
                </h6>
              </li>
              <li className="text-base flex items-center">
                <strong>Status :</strong>
                <h6 className=" font-bold text-green-600 uppercase ml-2 px-3">
                  {user?.college?.subscription.status || "NA"}
                </h6>
              </li>
            </ul>
            <button className="mt-5 bg-[#A6C0CF] text-[rgb(22,22,59)] font-bold border border-[#84a7bb] rounded-lg px-3 py-1 shadow-md hover:bg-[#84a7bb]">
              Contact HarIT Tech
            </button>
          </div>
          <div className="bg-[#ffffff80] backdrop-blur-sm mb-6 p-2 w-[320px] rounded-[20px] shadow-lg">
            <h3 className="text-lg font-bold mb-3">Recently Added Student's</h3>
            <div>
              {[...collegeUsers] // Create a copy of the array
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt in descending order
                .slice(0, 3) // Take the top 3 students
                .map((student) => (
                  <div
                    key={student._id}
                    className="flex w-[100%] items-center mb-4 py-[6px] px-[10px] bg-[#ffffff37] backdrop-blur-sm shadow-md rounded-[20px] hover:bg-[#ffffffb9] cursor-pointer"
                  >
                    <img
                      src={
                        student.profilePic ||
                        "https://cdn3.pixelcut.app/7/20/uncrop_hero_bdf08a8ca6.jpg"
                      }
                      alt="avatar"
                      className="w-[40px] h-[40px] object-cover rounded-2xl mr-4"
                    />
                    <div className="flex-1">
                      <div className="font-bold text-[16px] text-[#333 ">
                        {student.email}
                      </div>
                      <div className="font-semibold text-[14px] text-[#383838]">
                        Created on:{" "}
                        {new Date(student.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>

        <div>
          <div className="bg-[#fffffffb] mb-6 backdrop-blur-sm p-5 min-w-[430px] rounded-[20px] shadow-lg">
            <h3 className="text-lg font-bold mb-3 text-[#333]">
              Student Analytics
            </h3>
            <div className="w-[100%] justify-items-center my-3">
            <video
                className="rounded-lg h-[200px] w-auto"
                src="https://cdnl.iconscout.com/lottie/premium/thumb/website-maintenance-animation-download-in-lottie-json-gif-static-svg-file-formats--under-logo-construction-testing-pack-design-development-animations-6516022.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>

          <div className="bg-[#ffffff80] mb-6 backdrop-blur-sm p-5 min-w-[430px] rounded-[20px] shadow-lg">
            <h3 className="text-lg font-bold mb-3">Recent's Post</h3>
            <div className="w-[100%] justify-items-center my-3 ">
              {[...jobs]
                .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
                .slice(0, 3)
                .map((job) => (
                  <div
                    key={job._id}
                    className="flex w-[100%] items-center mb-4 p-3 bg-[#ffffff37] backdrop-blur-sm shadow-md rounded-[20px] hover:bg-[#ffffffb9] cursor-pointer"
                  >
                    <img
                      src={job.logo}
                      alt="avatar"
                      className="w-[52px] h-[52px] object-cover rounded-2xl mr-4"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between mb-1">
                        <span className="font-bold text-[16px] text-[#333]">
                          {job.title}
                        </span>
                        <span className="text-[13px] text-[#717171]">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="font-semibold text-[15px] text-[#383838]">
                        {job.company}
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>

          <div className="bg-[#ffffff] mb-6 backdrop-blur-sm p-5 min-w-[430px] rounded-[20px] shadow-lg">
            <h3 className="text-lg font-bold mb-3">Recently Placed Students</h3>
            <div className="w-[100%] justify-items-center my-3 ">
              <video
                className="rounded-lg h-[200px] w-auto"
                src="https://cdnl.iconscout.com/lottie/premium/thumb/website-maintenance-animation-download-in-lottie-json-gif-static-svg-file-formats--under-logo-construction-testing-pack-design-development-animations-6516022.mp4"
                autoPlay
                loop
                muted
                playsInline
              />
            </div>
          </div>
        </div>

        <div>
          <div className="bg-[#ffffff80] mb-6 text-gray-700 backdrop-blur-sm p-5 w-[310px] rounded-[20px] shadow-lg">
            <h3 className="text-xl font-bold mb-3">
              What's new on TNP Portal ?
            </h3>
            <ul className=" ml-3 font-medium text-lg text-gray-600">
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Send's Placement Drive to Each Students
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Manage Students Data
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Manage Placement Drive Data
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Job Management Portal
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Feedback and Contact Features
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Email through Notifications
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Enroll to Upcoming Events
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Export option for Resume
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Rounds Updates on Student Portal
              </li>
              <li className="mb-2 pb-2">Direct Access Student Details</li>
            </ul>
          </div>
          <div className="bg-[#ffffff80] mb-6 text-gray-700 backdrop-blur-sm p-5 w-[310px] rounded-[20px] shadow-lg">
            <h3 className="text-xl font-bold mb-3">Upcoming Feature's</h3>
            <ul className=" ml-3  font-medium text-lg text-gray-600">
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Training Section for Student{" "}
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Highlights of Top Placements and Companies
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Student Eligibility Tracking Algorithm
              </li>

              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Off Campus Placement Opportunity
              </li>
              <li className="mb-2 border-b-[1px] border-[rgb(22,22,59)] pb-2">
                Online Interview
              </li>
              <li className="mb-2 pb-2">AI Resume Builder</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardData;
