// SmallSidebar.js
import React from "react";
import { NavLink, useLocation } from "react-router-dom";

import { LayoutDashboard, Briefcase } from "lucide-react";
import { MdEventAvailable, MdWork } from "react-icons/md";
import { FaBook } from "react-icons/fa";
import { logoutUser, resetState } from "../redux/userSlice";
import { RiFeedbackLine } from "react-icons/ri";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

const SmallSidebar = () => {
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { profileCompletionDetails } = useSelector((state) => state.user);
  const profileCompletion = profileCompletionDetails?.profileCompletion || 0;

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      dispatch(resetState());
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="lg:hidden sticky  top-0 left-0 z-50 w-full bg-[#002146b7] backdrop-blur-sm text-[rgb(192,192,192)]">
      <nav className="flex justify-around p-2">
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
            location.pathname === "/internship" ? "border-b-2 border-white" : ""
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
          <MdWork className="h-5 w-5" />
        </NavLink>
        <NavLink
          to="/training"
          className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 ${
            location.pathname === "/training" ? "border-b-2 border-white" : ""
          }`}
        >
          <FaBook className="h-5 w-5" />
        </NavLink>
        <NavLink
          to="/event"
          className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 ${
            location.pathname === "/event" ? "border-b-2 border-white" : ""
          }`}
        >
          <MdEventAvailable className="h-5 w-5" />
        </NavLink>
        <NavLink
          to="/notify"
          className={`flex items-center justify-center w-12 h-12 rounded-lg hover:bg-white/10 ${
            location.pathname === "/notify" ? "border-b-2 border-white" : ""
          }`}
        >
          <RiFeedbackLine className="h-5 w-5" />
        </NavLink>
        

        {/* Profile Completion */}
        <div className="flex flex-col items-center justify-center mt-2 ml-4">
          <div className="relative mx-auto h-10 w-10 transform hover:scale-105 transition-transform duration-200">
            <div className="absolute inset-0 rounded-full border-[2px] border-gray-600 bg-gray-200" />
            <div
              className="absolute inset-0 rounded-full"
              style={{
                background: `conic-gradient(
          ${
            profileCompletion > 80
              ? "rgba(34, 197, 94, 1)"
              : profileCompletion >= 40
              ? "rgba(245, 158, 11, 1)"
              : "rgba(239, 68, 68, 1)"
          } 0%,
          ${
            profileCompletion > 80
              ? "rgba(34, 197, 94, 1)"
              : profileCompletion >= 40
              ? "rgba(245, 158, 11, 1)"
              : "rgba(239, 68, 68, 1)"
          } ${profileCompletion}%,
          #e5e7eb ${profileCompletion}%,
          #e5e7eb 100%
        )`,
                clipPath: "circle(50% at 50% 50%)",
                boxShadow: "0px 0px 10px rgba(99, 102, 241, 0.8)",
              }}
            />
            <div className="absolute inset-[10%] rounded-full border-[2px] border-gray-600 bg-gray-200 shadow-lg" />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-xs font-bold text-gray-800">
                {profileCompletion}%
              </span>
            </div>
          </div>
        </div>

         {/* Logout Button */}
      <div className="p-3">
        <button
          onClick={handleLogout}
          className="flex w-full  gap-2 rounded-lg bg-white/10 px-4 py-2 text-sm hover:bg-white/20"
        >
          <BiLogOut className="h-4 w-4" />
        </button>
      </div>

      </nav>
    </div>
  );
};

export default SmallSidebar;
