import express from "express";
import { protect, authorizeRoles } from "../middleware/auth.middleware.js";
import { addCommentToFeedback, createFeedback, deleteFeedback, dislikeFeedback, getFeedbacksForJob, getFeedbackWithComments, likeFeedback } from "../controller/feedback.controller.js";


const router = express.Router();

// Create Feedback for a Specific Job
router.post("/:jobId/feedback",protect, createFeedback);

// Like Feedback
router.put("/feedback/:feedbackId/like",protect, likeFeedback);

// Dislike Feedback
router.put("/feedback/:feedbackId/dislike",protect, dislikeFeedback);

// Add Comment to Feedback
router.put("/feedback/:feedbackId/comment",protect, addCommentToFeedback);

// Get Feedback with Comments
router.get("/feedback/:feedbackId",protect, getFeedbackWithComments);

// Delete Feedback
router.delete("/feedback/:feedbackId", protect, deleteFeedback);

// Get Feedbacks for a Specific Job
router.get("/:jobId/feedbacks", protect, getFeedbacksForJob);

export default router;