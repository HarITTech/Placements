import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { loginUser } from "../redux/userSlice";
import college from "../assets/college.png";
import harit from "../assets/harit.png";
import { FaLinkedin, FaUserCog } from "react-icons/fa";
import back from "../assets/back.png";
import Cookies from "js-cookie";
import Loading from "../component/Loading";
import ForgetPasswordPopup from "../component/ForgetPasswordPopup";

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, user } = useSelector((state) => state.user);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showForgetPassword, setShowForgetPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(loginUser({ email, password }));
  };

  useEffect(() => {
    localStorage.clear(); // Clear all local storage
    Cookies.remove("mpsp"); // Remove specific cookie
  }, []);

  // Toast Notifications and Error Handling
  useEffect(() => {
    if (error) {
      toast.error(`Login failed: ${error}`, { position: "top-center" });
    }
    if (user) {
      toast.success("Login successful!", { position: "top-center" });
      navigate("/");
    }
  }, [error, user, navigate]);

  // Handle long loading state
  useEffect(() => {
    let timeoutId;
    if (loading) {
      timeoutId = setTimeout(() => {
        toast.warn("Taking too long to load. Refreshing...", {
          position: "top-center",
        });
        Cookies.remove("mpsp");
        localStorage.removeItem("persist:root");
        window.location.reload();
      }, 6000); // 1 minute timeout
    }
    return () => clearTimeout(timeoutId);
  }, [loading]);

  return (
    <div className="bg-sky-300/20 min-h-screen flex flex-col">
      <header className="bg-[rgb(22,22,59)] text-white py-4 px-6 flex justify-between items-center">
        <div className="flex items-center">
          <img
            src={college}
            alt="College Logo"
            className="lg:h-20 lg:w-[800px] ml-3 mr-4"
          />
        </div>
        <div className="flex items-center">
          <img
            src={harit}
            alt="Harit Tech Logo"
            className="lg:h-20 lg:w-[200px] mr-4 object-fill rounded-[20px]"
          />
        </div>
      </header>
      <div className="bg-yellow-500 border-t-2 border-gray-700 w-full">
        <div className="overflow-hidden whitespace-nowrap">
          <marquee
            behavior="scroll"
            direction="left"
            className="text-black font-normal text-sm sm:text-base "
            scrollamount="10"
          >
            Update your profile to at least 80% completion before 1st February
            2025 to remain eligible for all benefits... For any query or help,
            contact us at <span className="font-medium text-blue-600">info@harittech.in</span>{" "}
            or message us on{" "}
            <a
              href="https://www.linkedin.com/company/harit-tech-solution/posts/?feedView=all/"
              className=" items-center gap-1 text-blue-500 font-medium inline-flex "
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaLinkedin size={16} />
              LinkedIn
            </a>
          </marquee>
        </div>
      </div>

      {/* <div className="flex justify-end p-3">
        <a
          href="#"
          className="text-gray-950 font-normal hover:text-blue-500 flex items-center group"
        >
          <FaUserCog className="mr-2 text-gray-950 font-semibold group-hover:text-blue-500" />
          Admin login
        </a>
      </div> */}

      <main className="flex-grow flex justify-center items-center relative">
        <div className="absolute inset-0 flex justify-center items-center -z-10">
          <img
            src={back}
            alt="Back"
            className="w-[1200px] h-full object-center"
          />
        </div>
        <div className="absolute inset-0 bg-white bg-opacity-5 backdrop-blur-sm -z-10"></div>

        <form
          className="bg-white bg-opacity-80 backdrop-blur-sm p-8 rounded-3xl shadow-lg w-full max-w-md space-y-6 z-10"
          onSubmit={handleSubmit}
        >
          <div className="flex justify-center mb-4">
            <button className="font-bold border-b-2 border-black">
              Log in
            </button>
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-gray-700 mb-3">
              Email or phone
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-2 rounded bg-sky-100"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-gray-700 mb-3">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full p-2 rounded bg-sky-100"
            />
          </div>
          <div className="flex justify-between items-center mb-4">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2 bg-sky-400 text-white font-semibold rounded-lg shadow-md hover:bg-sky-600 transition duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-400 flex items-center justify-center"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-5 w-5 mr-2 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8z"
                    ></path>
                  </svg>
                  <Loading />
                </>
              ) : (
                "Login"
              )}
            </button>
            <a
              onClick={() => setShowForgetPassword(true)}
              className="text-gray-700 hover:text-blue-700 font-medium text-sm cursor-pointer"
            >
              Forgot password?
            </a>
          </div>
        </form>
      </main>
      {showForgetPassword && (
        <ForgetPasswordPopup onClose={() => setShowForgetPassword(false)} />
      )}

      <footer className="px-3 py-4 bg-transparent justify-start items-start">
        <p className="text-xs">
          Made by <span className="text-red-500">❤️</span>{" "}
          <a
            href="https://www.harittech.in"
            target="_blank"
            rel="noopener noreferrer"
            className="text-xs font-bold  hover:text-blue-500"
          >
            Harit Tech Solution
          </a>
        </p>
      </footer>
    </div>
  );
};

export default Login;
