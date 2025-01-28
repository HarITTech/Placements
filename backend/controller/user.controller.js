import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import { College } from "../models/college.model.js";
import dotenv from "dotenv";
import {
  deleteImageFromCloudinary,
  uploadImageOnCloudinary,
} from "../cloud/cloudinary.js";
import { sendResetPasswordEmail } from "../config/emailService.js";

dotenv.config();

// Generate JWT token
const generateToken = (res, userId) => {
  const token = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: "30d",
  });

  res.cookie("token", token, {
    httpOnly: true, // Secure the cookie
    secure: process.env.NODE_ENV === "production", // HTTPS only in production
    sameSite: "strict", // Prevent CSRF
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
  });
};

// Global Admin creates a TNP Admin
export const createTnpAdmin = async (req, res) => {
  const { email, password, collegeId } = req.body;

  try {
    // 1. Check if College exists
    const college = await College.findById(collegeId);
    if (!college) return res.status(404).json({ message: "College not found" });

    // 2. Check for existing user
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // 3. Create a TNP Admin user
    const tnpAdmin = new User({
      email,
      password,
      role: "tnp_admin",
      college: college._id,
    });
    await tnpAdmin.save();

    // 4. Link TNP Admin to the college
    college.tnpAdmin = tnpAdmin._id;
    await college.save();

    res
      .status(201)
      .json({ message: "TNP Admin created successfully", tnpAdmin });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// TNP Admin creates a Student
export const createStudent = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Ensure role-based access
    if (req.user.role !== "tnp_admin") {
      return res
        .status(403)
        .json({ message: "Only TNP Admins can create students" });
    }

    // 1. Check if email is already in use
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ message: "Email already in use" });

    // 2. Create a Student user linked to the same college as the TNP Admin
    const student = new User({
      email,
      password,
      role: "student",
      college: req.user.college,
    });
    await student.save();

    res.status(201).json({ message: "Student created successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// User Login
export const loginUser  = async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Find the user
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User  not found" });

    // 2. Check if the user is blocked
    if (user.blocked && user.blockedUntil > Date.now()) {
      return res.status(403).json({
        message: `Your account is blocked Contact TNP Department.`,
      });
    }

    // 3. Validate password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid)
      return res.status(401).json({ message: "Invalid credentials" });

    // 4. Generate JWT token and set it in cookies
    const tokenPayload = { id: user._id, role: user.role };

    // Add college to the payload if it exists
    if (user.college) {
      tokenPayload.college = user.college._id;
    }

    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, {
      expiresIn: "31d",
    });

    res.cookie("mpsp", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
    });

    res.status(200).json({
      message: "Login successful",
      user: { id: user._id, role: user.role, token },
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Logout User
export const logoutUser = (req, res) => {
  res.cookie("mpsp", "", {
    httpOnly: true,
    expires: new Date(0),
  });
  res.status(200).json({ message: "Logout successful" });
};

// List all users of a specific college
export const listUsersOfCollege = async (req, res) => {
  try {
    // Get the college ID from the URL params
    const { collegeId } = req.params;

    // Ensure the current user is either a TNP Admin of that college or a Global Admin
    if (req.user.role !== "global_admin") {
      const userCollege = await College.findById(collegeId);
      if (!userCollege) {
        return res.status(404).json({ message: "College not found" });
      }

      // Check if the current user is the TNP Admin of the college
      if (userCollege.tnpAdmin.toString() !== req.user._id.toString()) {
        return res
          .status(403)
          .json({ message: "Not authorized to view users for this college" });
      }
    }

    // Fetch all users related to the specific college
    const users = await User.find({ college: collegeId }).populate(
      "college",
      "name"
    );

    // If no users found
    if (users.length === 0) {
      return res
        .status(404)
        .json({ message: "No users found for this college" });
    }

    // Send the response with the list of users
    res.status(200).json({
      message: "Users fetched successfully",
      users,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

// Fetch user by ID
export const fetchUserById = async (req, res) => {
  try {
    const { userId } = req.params; // User ID from the request params

    // Fetch the user by ID and populate necessary fields
    const user = await User.findById(userId)
      .populate("college", "name address subscription") // Populating the college name
      .populate(
        "profile.appliedJobsHistory.jobId",
        "title company location type description logo"
      ); // Populating job history with job details

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Filter out null or deleted jobs from the appliedJobsHistory
    const filteredAppliedJobsHistory = user.profile.appliedJobsHistory.filter(
      (job) => job.jobId !== null
    );

    // Replace the original appliedJobsHistory with the filtered one
    user.profile.appliedJobsHistory = filteredAppliedJobsHistory;

    res.status(200).json({
      message: "User details fetched successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
};

export const deleteStudent = async (req, res) => {
  const { studentId } = req.params;

  try {
    // Ensure role-based access
    if (req.user.role !== "tnp_admin") {
      return res
        .status(403)
        .json({ message: "Only TNP Admins can delete students" });
    }

    // Find the student to delete
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Ensure the student belongs to the same college as the TNP Admin
    if (student.college.toString() !== req.user.college.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to delete this student" });
    }

    await User.findByIdAndDelete(studentId);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Middleware to ensure the user is a student
const isStudent = (user) => user.role === "student";

export const updateProfilePic = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user is authenticated and the user ID is available in req.user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Delete the previous profile picture from Cloudinary if exists
    if (user.profile.profilePic) {
      await deleteImageFromCloudinary(user.profile.profilePic);
    }

    // Upload the new profile picture to Cloudinary
    const result = await uploadImageOnCloudinary(req.file.path);

    // Update the user profile with the new profile picture URL
    user.profile.profilePic = result.secure_url;

    await user.save();

    res.status(200).json({
      message: "Profile picture updated successfully",
      profilePic: result.secure_url,
    });
  } catch (error) {
    console.error("Error updating profile picture:", error);
    res.status(500).json({ message: "Failed to update profile picture" });
  }
};

// Update Student Profile
export const updateStudentProfile = async (req, res) => {
  try {
    const studentId = req.user._id; // Authenticated student
    const updates = req.body;

    // Fetch the student
    const student = await User.findById(studentId);
    if (!student || !isStudent(student)) {
      return res.status(404).json({ message: "Student not found" });
    }

    // Update profile fields selectively
    if (updates.profile) {
      // Only update the fields that are included in the request body
      const profileUpdates = { ...updates.profile };

      // If the user has updated the 10th details, update those
      if (profileUpdates.tenthDetails !== undefined) {
        student.profile.tenthDetails = {
          ...student.profile.tenthDetails,
          ...profileUpdates.tenthDetails,
        };
      }

      // If the user has updated the 12th details, update those
      if (profileUpdates.twelfthDetails !== undefined) {
        student.profile.twelfthDetails = {
          ...student.profile.twelfthDetails,
          ...profileUpdates.twelfthDetails,
        };
      }

      // For other profile fields (like cgpa, achievements, etc.), update them as well
      student.profile = { ...student.profile, ...profileUpdates };
    }

    // Save the updated student profile
    await student.save();

    res.status(200).json({ message: "Profile updated successfully", student });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// TNP Admin Dashboard - View Student Profile Completion
// TNP Admin or user can view profile completion details
export const getProfileCompletionDetails = async (req, res) => {
  try {
    // Check if the request is from a TNP Admin or the user themselves
    const userId = req.user._id;
    const userRole = req.user.role;

    // If the user is a TNP Admin, they can view any student in their college
    if (userRole === "tnp_admin") {
      // Fetch all students of the same college as the TNP Admin
      const students = await User.find({
        college: req.user.college,
        role: "student",
      });

      // Calculate profile completion for each student
      const profileDetails = students.map((student) => ({
        id: student._id,
        name: `${student.profile.firstName || ""} ${
          student.profile.lastName || ""
        }`,
        email: student.email,
        profileCompletion: student.profileCompletion,
      }));

      return res.status(200).json({
        message: "Profile completion details fetched for all students",
        profileDetails,
      });
    }

    // If the user is not a TNP Admin, they can only view their own profile completion
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileCompletion = {
      id: user._id,
      name: `${user.profile.firstName || ""} ${user.profile.lastName || ""}`,
      email: user.email,
      profileCompletion: user.profileCompletion,
    };

    return res.status(200).json({
      message: "Profile completion details fetched successfully",
      profileDetails: profileCompletion,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Forget Password: Send reset password email with a reset code
export const forgetPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // 2. Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    user.resetPasswordOTP = otp;
    user.resetPasswordOTPExpires = Date.now() + 10 * 60 * 1000; // OTP valid for 10 minutes
    await user.save();

    // 3. Send OTP to the user's email
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Password Reset OTP",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="https://res.cloudinary.com/dihc0jxm8/image/upload/v1736521415/default/file_1736521413798.jpg" alt="TNP Portal Logo" style="width: 150px; height: auto;">
            <h1 style="font-size: 24px; color: #333;">TNP Portal</h1>
          </div>
          <h2 style="font-size: 20px; color: #333; text-align: center;">Password Reset OTP</h2>
          <p style="font-size: 16px; text-align: center;">Your OTP for password reset is:</p>
          <h2 style="font-size: 36px; font-weight: bold; color: #007BFF; text-align: center;">${otp}</h2>
          <p style="font-size: 14px; text-align: center;">It is valid for 10 minutes.</p>
          <hr style="margin: 20px 0;">
          <p style="font-size: 14px; text-align: center;">If you did not request this, please ignore this email.</p>
          <div style="text-align: center; margin-top: 20px;">
            <p style="font-size: 14px;">Follow us on</p>
            <a href="https://www.linkedin.com/company/harit-tech-solution/posts/?feedView=all" style="margin: 0 10px;">LinkedIn</a>
            <a href="http://www.harittech.in" style="margin: 0 10px;">Website</a>
            <a href="mailto:info@harittech.in" style="margin: 0 10px;">Email</a>
          </div>
          <footer style="margin-top: 20px; font-size: 12px; text-align: center; color: #777;">
            <p>&copy; ${new Date().getFullYear()} HarIT Tech Solution. All rights reserved.</p>
          </footer>
        </div>
      `,
    };

    await sendResetPasswordEmail(mailOptions);

    res.status(200).json({
      message: "OTP has been sent to your email",
    });
  } catch (error) {
    console.error("Error in forgetPassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Reset Password: Reset the user's password using the reset code
export const resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  try {
    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: "User  not found" });
    }

    // 2. Validate OTP
    if (
      user.resetPasswordOTP !== otp ||
      user.resetPasswordOTPExpires < Date.now()
    ) {
      return res.status(400).json({ message: "Invalid or expired OTP" });
    }

    // 3. Update the user's password
    user.password = newPassword;
    user.resetPasswordOTP = null; // Clear OTP
    user.resetPasswordOTPExpires = null; // Clear OTP expiration
    await user.save();

    res.status(200).json({
      message: "Password has been reset successfully",
    });
  } catch (error) {
    console.error("Error in resetPassword:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};



export const blockUser  = async (req, res) => {
  const { userId, days } = req.body; // Expecting userId and days to block

  try {
    // Ensure role-based access
    if (req.user.role !== "tnp_admin") {
      return res.status(403).json({ message: "Only TNP Admins can block users" });
    }

    // Find the user to block
    const user = await User.findById(userId);
    if (!user || user.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Block the user
    user.blocked = true;
    user.blockedUntil = new Date(Date.now() + days * 24 * 60 * 60 * 1000); // Block for specified days
    await user.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Account Blocked Notification",
      html: `
        <div>
          <h1>Your Account Has Been Blocked</h1>
          <p>Your account has been blocked for ${days} days. You will not be able to log in until ${user.blockedUntil.toLocaleString()}.</p>
          <p>If you believe this is a mistake, please contact your TNP Department.</p>
           <div style="text-align: center; margin-top: 80px;">
            <p style="font-size: 14px;">Follow us on</p>
            <a href="https://www.linkedin.com/company/harit-tech-solution/posts/?feedView=all" style="margin: 0 10px;">LinkedIn</a>
            <a href="http://www.harittech.in" style="margin: 0 10px;">Website</a>
            <a href="mailto:info@harittech.in" style="margin: 0 10px;">Email</a>
          </div>
          <footer style="margin-top: 20px; font-size: 12px; text-align: center; color: #777;">
            <p>&copy; ${new Date().getFullYear()} HarIT Tech Solution. All rights reserved.</p>
          </footer>
        </div>
      `,
    };

    await sendResetPasswordEmail(mailOptions);

    res.status(200).json({ message: "User  blocked successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

export const unblockUser  = async (req, res) => {
  const { userId } = req.body; // Expecting userId to unblock

  try {
    // Ensure role-based access
    if (req.user.role !== "tnp_admin") {
      return res.status(403).json({ message: "Only TNP Admins can unblock users" });
    }

    // Find the user to unblock
    const user = await User.findById(userId);
    if (!user || user.role !== "student") {
      return res.status(404).json({ message: "Student not found" });
    }

    // Unblock the user
    user.blocked = false;
    user.blockedUntil = null; // Clear the blockedUntil date
    await user.save();

    // Send email notification
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Account Unblocked Notification",
      html: `
        <div>
          <h1>Your Account Has Been Unblocked</h1>
          <p>Your account has been successfully unblocked. You can now log in.</p>
          <p>If you have any questions, please contact your TNP Department.</p>
           <div style="text-align: center; margin-top: 80px;">
            <p style="font-size: 14px;">Follow us on</p>
            <a href="https://www.linkedin.com/company/harit-tech-solution/posts/?feedView=all" style="margin: 0 10px;">LinkedIn</a>
            <a href="http://www.harittech.in" style="margin: 0 10px;">Website</a>
            <a href="mailto:info@harittech.in" style="margin: 0 10px;">Email</a>
          </div>
          <footer style="margin-top: 20px; font-size: 12px; text-align: center; color: #777;">
            <p>&copy; ${new Date().getFullYear()} HarIT Tech Solution. All rights reserved.</p>
          </footer>
        </div>
      `,
    };

    await sendResetPasswordEmail(mailOptions);

    res.status(200).json({ message: "User  unblocked successfully", user });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};