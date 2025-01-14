import React, { useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { RiDashboardLine } from "react-icons/ri";
import { FaUsers } from "react-icons/fa";
import { BsPostcardFill } from "react-icons/bs";
import { GiProgression } from "react-icons/gi";
import { RiContactsFill } from "react-icons/ri";
import { HiOutlineLogout } from "react-icons/hi";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserById,
  logoutUser,
  resetState,
  getProfileCompletionDetails,
} from "../../redux/userSlice";
import { jwtDecode } from "jwt-decode";
import tnp from "../../assets/sopu.jpeg";

const Navigation = () => {
  const { token, user, profileCompletionDetails } = useSelector(
    (state) => state.user
  );
  const location = useLocation();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch user data if token exists
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

  useEffect(() => {
    // Fetch profile completion details
    if (profileCompletionDetails.length === 0) {
      dispatch(getProfileCompletionDetails());
    }
  }, [dispatch, profileCompletionDetails]);

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
    <div className="sticky top-0 flex flex-col w-[30%] max-w-[420px] min-w-[220px] min-h-screen h-[100vh] bg-[#002146] text-white p-3">
      <img
        src="/harit.png"
        alt="College logo"
        className="mt-2 w-full h-auto mb-3"
      />

      <header className="relative p-4 flex flex-col items-center gap-2">
        <div className="w-20 h-20 rounded-full text-[#dddddd]">
          <img
            src="https://img.freepik.com/premium-photo/3d-entrepreneur-icon-business-leader-innovation-illustration-logo_762678-101891.jpg"
            alt="user-img"
            className="w-full h-full rounded-full object-cover"
          />
        </div>
        <span className="text-2xl font-extrabold text-[#dddddd]">
          {"T&P Head"}
        </span>
      </header>
      <nav>
        <NavLink
          to="/tadmin/dashboard"
          className={({ isActive }) =>
            `flex items-center gap-6 p-5 mt-4 rounded-md h-8 border-b-2 ${
              isActive ? "border-gray-400" : "border-transparent"
            } hover:bg-gray-500/30`
          }
        >
          <RiDashboardLine className="text-xl text-[#dddddd]" />
          <h2 className="text-xl font-bold text-[#dddddd]">Dashboard</h2>
        </NavLink>
        <NavLink
          to="/tadmin/users"
          className={({ isActive }) =>
            `flex items-center gap-6 p-5 mt-4 rounded-md h-8 border-b-2 ${
              isActive ? "border-gray-400" : "border-transparent"
            } hover:bg-gray-500/30`
          }
        >
          <FaUsers className="text-xl text-[#dddddd]" />
          <h2 className="text-xl font-bold text-[#dddddd]">Users</h2>
        </NavLink>
        <NavLink
          to="/tadmin/posts"
          className={({ isActive }) =>
            `flex items-center gap-6 p-5 mt-4 rounded-md h-8 border-b-2 ${
              isActive ? "border-gray-400" : "border-transparent"
            } hover:bg-gray-500/30`
          }
        >
          <BsPostcardFill className="text-xl text-[#dddddd]" />
          <h2 className="text-xl font-bold text-[#dddddd]">Post's</h2>
        </NavLink>
        <NavLink
          to="/tadmin/status"
          className={({ isActive }) =>
            `flex items-center gap-6 p-5 mt-4 rounded-md h-8 border-b-2 ${
              isActive ? "border-gray-400" : "border-transparent"
            } hover:bg-gray-500/30`
          }
        >
          <GiProgression className="text-xl text-[#dddddd]" />
          <h2 className="text-xl font-bold text-[#dddddd]">Status</h2>
        </NavLink>
        <NavLink
          to="/tadmin/feedback"
          className={({ isActive }) =>
            `flex items-center gap-6 p-5 mt-4 rounded-md h-8 border-b-2 ${
              isActive ? "border-gray-400" : "border-transparent"
            } hover:bg-gray-500/30`
          }
        >
          <RiContactsFill className="text-xl text-[#dddddd]" />
          <h2 className="text-xl font-bold text-[#dddddd]">Feedback</h2>
        </NavLink>
      </nav>

      <div className=" w-[92%] absolute bottom-5 justify-items-center text-start">
        <p className="text-xs my-3">
          Made by <span className="text-red-500">❤️</span>{" "}
          <span className="text-xs font-bold">Harit Tech Solution</span>
        </p>
        <button
          onClick={handleLogout}
          className="w-[80%] flex items-center justify-center gap-5 px-5 py-2 text-lg font-bold text-gray-300 bg-gray-500/20 rounded-lg hover:bg-gray-500/30"
        >
          Log Out <HiOutlineLogout />
        </button>
      </div>
    </div>
  );
};

export default Navigation;
