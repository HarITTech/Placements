import express from "express";
import {
  createTnpAdmin,
  createStudent,
  loginUser,
  logoutUser,
  listUsersOfCollege,
  updateStudentProfile, // New controller for updating student profile
  deleteStudent,
  fetchUserById,
  updateProfilePic,
  getProfileCompletionDetails,
  resetPassword,
  forgetPassword,
  blockUser,
  unblockUser
} from "../controller/user.controller.js";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import { checkSubscription } from "../middleware/checkSubscription.middleware.js";
import upload from "../cloud/multerConfig.js";

const router = express.Router();

// Global Admin creates TNP Admin
router.post("/create-tnp-admin", protect, authorizeRoles("global_admin"), createTnpAdmin);

// TNP Admin creates Student (Subscription Check Applied)
router.post(
  "/create-student",
  protect,
  authorizeRoles("tnp_admin"),
  checkSubscription,
  createStudent
);

// Student Updates Their Own Profile
router.put(
  "/update-profile/:studentId",
  protect, // Both Student and TNP Admin can update
  updateStudentProfile
);

// Login and Logout
router.post("/login", loginUser);
router.post("/logout", logoutUser);

// List all users of a specific college
router.get(
  "/college/:collegeId/users",
  protect,
  authorizeRoles( "tnp_admin", "global_admin"),
  listUsersOfCollege
);

// TNP Admin deletes a student
router.delete(
  "/delete-student/:studentId",
  protect,
  authorizeRoles("tnp_admin"),
  deleteStudent
);

// Fetch User by ID
router.get("/user/:userId", protect, fetchUserById);


router.put('/updateProfilePic',  protect, upload.single('profilePic'), updateProfilePic);

// Route for getting profile completion details (accessible by TNP Admin and self)
router.get('/get-profile-completion', protect, getProfileCompletionDetails);

// Forgot password route
router.post("/forgot-password", forgetPassword);

// Reset password route
router.post("/reset-password", resetPassword);

// Route to block a user
router.post("/block-user", protect,
  authorizeRoles( "tnp_admin", "global_admin"), blockUser );

// Route to unblock a user
router.post("/unblock-user", protect,
  authorizeRoles( "tnp_admin", "global_admin"), unblockUser );

export default router;
