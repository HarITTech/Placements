import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { LayoutDashboard, Briefcase, Bell, LogOut, Menu } from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserById,
  logoutUser,
  resetState,
  getProfileCompletionDetails,
} from "../redux/userSlice";
import { jwtDecode } from "jwt-decode";
import Cookies from "js-cookie";
import { useEffect } from "react";
import debounce from "lodash.debounce";
import { VscFeedback } from "react-icons/vsc";
import { RiFeedbackLine } from "react-icons/ri";
import { FaRankingStar } from "react-icons/fa6";
import { BiLogOut } from "react-icons/bi";
import collage from '../assets/collage.png';
import { MdEventAvailable, MdWork } from "react-icons/md";

const Sidebar = () => {
  const { token, user, profileCompletionDetails } = useSelector(
    (state) => state.user
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility

  useEffect(() => {
    if (token && !user?.profile) {
      try {
        const decoded = jwtDecode(token);
        const userId = decoded.id;
        dispatch(fetchUserById(userId));
      } catch (error) {
        console.error("Error decoding token", error);
      }
    }
  }, [token, dispatch, user?.profile]);

  const debouncedFetchDetails = debounce(() => {
    dispatch(getProfileCompletionDetails());
  }, 50);

  useEffect(() => {
    if (token && profileCompletionDetails.length === 0) {
      debouncedFetchDetails();
    }

    return () => {
      debouncedFetchDetails.cancel();
    };
  }, [dispatch, profileCompletionDetails, debouncedFetchDetails, token]);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(resetState());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const profileCompletion = profileCompletionDetails?.profileCompletion || 0;

  return (
    <>
      {/* Small Screen Sidebar */}
      <div className="lg:hidden sticky top-0 left-0 z-50 w-16 h-screen bg-[#002146b7] backdrop-blur-sm text-[rgb(192,192,192)]">
        <div className="p-2">
        </div>
        <nav className="space-y-2 p-2">
          <NavLink
            to="/"
            className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 ${
              location.pathname === "/" ? "border-b-2 border-white" : ""
            }`}
          >
            <LayoutDashboard className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/internship"
            className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 ${
              location.pathname === "/internship"
                ? "border-b-2 border-white"
                : ""
            }`}
          >
            <Briefcase className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/job"
            className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 ${
              location.pathname === "/job" ? "border-b-2 border-white" : ""
            }`}
          >
            <MdWork  className="h-5 w-5" />
          </NavLink>
          <NavLink
            to="/event"
            className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/ 10 ${
              location.pathname === "/event" ? "border-b-2 border-white" : ""
            }`}
          >
            <MdEventAvailable  className="h-5 w-5" />
          </NavLink>
          {/* <NavLink
            to="/highlight"
            className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/ 10 ${
              location.pathname === "/highlight"
                ? "border-b-2 border-white"
                : ""
            }`}
          >
            <Bell className="h-5 w-5" />
          </NavLink> */}
          <NavLink
            to="/notify"
            className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 ${
              location.pathname === "/notify" ? "border-b-2 border-white" : ""
            }`}
          >
            <RiFeedbackLine className="h-5 w-5" />
          </NavLink>
        </nav>
        <div className="absolute bottom-0  w-full p-2">
          <button
            onClick={handleLogout}
            className="flex w-full items-center hover:bg-red-600 justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            <LogOut className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Full Sidebar for larger screens */}
      <div
        className={`hidden lg:flex sticky top-0 flex-col w-84 bg-transparent text-[rgb(192,192,192)] h-[140vh] ${
          isSidebarOpen ? "block" : "hidden"
        }`}
      >
        <div className="p-4 mt-3">
          <img
            src={collage}
            alt="College logo"
            width={300}
            height={80}
            className="mb-8 w-[340px]"
          />
          <div className="text-white p-2 rounded-lg flex items-center space-x-4">
            <img
              src={user?.profile?.profilePic || "/placeholder.svg"}
              alt="Profile picture of a student"
              className="w-28 h-28 rounded-full object-cover"
            />
            <div className="space-y-2">
              <p className="text-sm">
                <span className="font-bold">Branch :</span>{" "}
                {user?.profile?.branch}
              </p>
              <p className="text-sm">
                <span className="font-bold">Student ID :</span>{" "}
                {user?.profile?.collegeID}
              </p>
              <p className="text-sm">
                <span className="font-bold">Year / Sem :</span>{" "}
                {user?.profile?.year} year / {user?.profile?.semester} sem
              </p>
            </div>
          </div>
          <div className="justify-center mt-3 font-semibold text-start p-2 items-center space-y-1 mb-5">
            <h2 className="text-2xl font-bold">
              Hii, {user?.profile?.firstName}!
            </h2>
            <p className="text-xs text-gray-400">
              Your job is waiting for you!...
            </p>
          </div>
          <nav className="space-y-4">
            <NavLink
              to="/"
              className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-white/10 ${
                location.pathname === "/" ? "border-b-2 border-white" : ""
              }`}
            >
              <LayoutDashboard className="h-5 w-5" />
              <h1 className="text-xl font-bold">Profile</h1>
            </NavLink>
            <NavLink
              to="/internship"
              className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-white/10 ${
                location.pathname === "/internship"
                  ? "border-b-2 border-white"
                  : ""
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <h1 className="text-xl font-bold">Internship</h1>
            </NavLink>
            <NavLink
              to="/job"
              className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-white/10 ${
                location.pathname === "/job" ? "border-b-2 border-white" : ""
              }`}
            >
              <Briefcase className="h-5 w-5" />
              <h1 className="text-xl font-bold">Job's</h1>
            </NavLink>
            <NavLink
              to="/event"
              className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-white/10 ${
                location.pathname === "/event" ? "border-b-2 border-white" : ""
              }`}
            >
              <Bell className="h-5 w-5" />
              <h1 className="text-xl font-bold">Events</h1>
            </NavLink>
            {/* <NavLink
              to="/highlight"
              className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-white/10 ${
                location.pathname === "/highlight" ? "border-b-2 border-white" : ""
              }`}
            >
              <FaRankingStar  className="h-5 w-5" />
              <h1 className="text-xl font-bold">Highlight</h1>
            </NavLink> */}
            <NavLink
              to="/notify"
              className={`flex items-center gap-3 rounded-lg px-4 py-2 hover:bg-white/10 ${
                location.pathname === "/notify" ? "border-b-2 border-white" : ""
              }`}
            >
              <RiFeedbackLine className="h-5 w-5" />
              <h1 className="text-xl font-bold">Feedback</h1>
            </NavLink>
          </nav>

          <div className="mt-10">
            <div className="relative mx-auto h-40 w-40 transform hover:scale-105 transition-transform duration-200">
              <div className="absolute inset-0 rounded-full border-[2px] border-gray-600 bg-gray-200" />
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background: `conic-gradient(
                    rgba(99, 102, 241, 1) 0%,
                    rgba(99, 102, 241, 1) ${profileCompletion}%,
                    #e5e7eb ${profileCompletion}%,
                    #e5e7eb 100%
                  )`,
                  clipPath: "circle(50% at 50% 50%)",
                  boxShadow: "0px 0px 10px rgba(99, 102, 241, 0.8)",
                }}
              />
              <div className="absolute inset-[10%] rounded-full border-[2px] border-gray-600 bg-gray-200 shadow-lg" />
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-bold text-sky-600">
                  {profileCompletion}%
                </span>
                <span className="text-xs font-semibold text-gray-600 tracking-wide">
                  Profile Completed
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="p-4">
          <div className="px-3 py-4 bg-transparent justify-start items-start">
            <p className="text-xs">
              Made by <span className="text-red-500">❤️</span>{" "}
              <span className="text-xs font-bold">Harit Tech Solution</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="flex w-full items-center justify-center gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
