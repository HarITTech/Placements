import express from "express";
import {
  createJob,
  getAllJobs,
  getEligibleJobs,
  deleteJob,
  showEligibleStudents,
  applyForJob,
  getAppliedStudents,
  createRounds,
  updateRoundResults,
  getNotifications,
  updateLogo,
  addPlacement,
  getPlacementsForJob,
  fetchAppliedJobs,
} from "../controller/job.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import upload from "../cloud/multerConfig.js";

const router = express.Router();

// Routes for TNP Admin
router.post("/create", protect, createJob);
router.get("/all", protect, getAllJobs);
router.delete("/:jobId", protect, deleteJob);

// Routes for Students
router.get("/eligible", protect, getEligibleJobs);

// Route to show eligible students before creating a job
router.post("/eligible-students", protect, showEligibleStudents);

router.post("/:jobId/apply", protect, applyForJob); // Apply for a job
router.get("/:jobId/applied-students",protect, getAppliedStudents); // View applied students
router.post("/:jobId/rounds", protect, createRounds); // Create rounds for a job
router.put("/:jobId/rounds/:roundId",protect, updateRoundResults); // Update round results
router.get("/notifications", protect, getNotifications); // Get notifications for students
router.put("/:jobId/logo",protect, upload.single("logo"), updateLogo);
// Route to add placement
router.post("/placement/:jobId",protect, addPlacement);

// Route to get placements for a specific job
router.get("/placement/:jobId",protect, getPlacementsForJob);

router.get("/applied",protect, fetchAppliedJobs);

export default router;
