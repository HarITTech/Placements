import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { forgetPassword, resetPassword } from "../redux/userSlice";
import tnp from "../assets/tnpportal.jpg";
import { toast } from "react-toastify";
import Loading from "../component/Loading";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import eye icons

const ForgetPasswordPopup = ({ onClose }) => {
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.user);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otpValid, setOtpValid] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State to toggle password visibility

  const handleForgetPassword = async (e) => {
    e.preventDefault();
    if (!email) {
      toast.error("Please enter your email", { position: "top-center" });
      return;
    }
    try {
      await dispatch(forgetPassword({ email })).unwrap();
      setOtpSent(true);
      toast.success("OTP sent to your email", { position: "top-center" });
    } catch (error) {
      toast.error(`Failed to send OTP: ${error}`, { position: "top-center" });
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match", { position: "top-center" });
      return;
    }
    try {
      await dispatch(
        resetPassword({ email, otp, newPassword: confirmPassword })
      ).unwrap();
      onClose(); // Close the popup on success
    } catch (error) {
      toast.error(`Failed to reset password: ${error}`, {
        position: "top-center",
      });
    }
  };

  const validateOtp = async () => {
    if (!otp) {
      toast.error("Please enter the OTP", { position: "top-center" });
      return;
    }
    setOtpValid(true); // Assume OTP is valid for UI purposes
  };

  return (
    <div className="fixed top-0 z-50 left-0 w-full h-full bg-gray-500 bg-opacity-75 flex justify-center items-center">
      <div className="max-w-md bg-white w-full bg-card rounded-lg shadow-lg p-6">
        <img
          src={tnp}
          alt="Profile picture of a student"
          className="w-14 h-14 rounded-full object-cover"
        />
        <div className="mb-8">
          <h1 className="text-2xl font-bold ">Forget Password</h1>
          <p className=" text-xs hover:text-blue-400 cursor-pointer hover:underline">
            to continue to TNP Portal
          </p>
        </div>
        <p className="text-muted-foreground mb-2">
          Enter your email to reset your password
        </p>
        {otpSent ? (
          <form onSubmit={handleResetPassword}>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter OTP"
              required
              className="w-full p-2 border-[1px] border-gray-600 rounded mb-4 focus:outline-none focus:ring focus:ring-ring"
            />
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="New Password"
                required
                className="w-full p-2 border-[1px] border-gray-600 rounded focus:outline-none focus:ring focus:ring-ring"
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="relative mb-4">
              <input
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Confirm Password"
                required
                className="w-full p-2 border-[1px] border-gray-600 rounded focus:outline-none focus:ring focus:ring-ring"
              />
              <span
                className="absolute right-2 top-2 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="bg-secondary text-gray-800 border-gray-600 border-[1px] rounded-2xl hover:bg-secondary/80 py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-sky-400/80 text-white hover:bg-sky-500 py-2 px-4 rounded"
              >
                {loading ? "Loading..." : "Reset Password"}
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleForgetPassword}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              required
              className="w-full p-2 border-[1px] border-gray-600 rounded mb-1 focus:outline-none focus:ring focus:ring-ring"
            />
            <a href="#" className="text-blue-500 text-sm mb-8 hover:underline">
              Forgot email?
            </a>
            <p className="text-muted-foreground text-sm mt-8">
              Not your computer? Use Guest mode to sign in privately.{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Learn more about using Guest mode
              </a>
            </p>
            <div className="flex justify-between mt-6">
              <button
                onClick={onClose}
                className="bg-secondary text-gray-800 border-gray-600 border-[1px] rounded-2xl hover:bg-secondary/80 py-2 px-4"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="bg-sky-400/80 text-white font-semibold hover:bg-sky-500 py-2 px-4 rounded-2xl"
              >
                {loading ? "Loading..." : "Send OTP"}
              </button>
            </div>
          </form>
        )}
        {error && <p className="text-red-500">{error}</p>}
        {message && <p className="text-green-500">{message}</p>}
      </div>
    </div>
  );
};

export default ForgetPasswordPopup;
