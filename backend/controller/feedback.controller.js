import { Feedback } from "../models/job.feedback.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// Create Feedback for a Specific Job
export const createFeedback = async (req, res) => {
    try {
      const { jobId } = req.params;
      const { message, content } = req.body;
  
      // Ensure the user is a student
      if (req.user.role !== "student") {
        return res.status(403).json({
          message: "Access denied. Only students can create feedback.",
        });
      }
  
      // Fetch the job by jobId
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: "Job not found." });
      }
  
      // Create a new feedback document
      const newFeedback = {
        jobId: job._id,
        studentId: req.user._id,
        message: message,
        content: content,
      };
  
      // Save the feedback
      const feedbackDoc = await Feedback.create(newFeedback);
  
      res.status(201).json({
        message: "Feedback created successfully.",
        feedback: feedbackDoc,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to create feedback.",
        error: error.message,
      });
    }
  };


  // Like Feedback
export const likeFeedback = async (req, res) => {
    try {
      const { feedbackId } = req.params;
  
      // Fetch the feedback by feedbackId
      const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found." });
      }
  
      // Check if the user has already liked the feedback
      if (feedback.likes.includes(req.user._id)) {
        return res.status(400).json({ message: "You have already liked this feedback." });
      }
  
      // Add the user to the likes array
      feedback.likes.push(req.user._id);
  
      // Save the updated feedback
      await feedback.save();
  
      res.status(200).json({
        message: "Feedback liked successfully.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to like feedback.",
        error: error.message,
      });
    }
  };
  
  // Dislike Feedback
  export const dislikeFeedback = async (req, res) => {
    try {
      const { feedbackId } = req.params;
  
      // Fetch the feedback by feedbackId
      const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found." });
      }
  
      // Check if the user has already disliked the feedback
      if (feedback.dislikes.includes(req.user._id)) {
        return res.status(400).json({ message: "You have already disliked this feedback." });
      }
  
      // Add the user to the dislikes array
      feedback.dislikes.push(req.user._id);
  
      // Save the updated feedback
      await feedback.save();
  
      res.status(200).json({
        message: "Feedback disliked successfully.",
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to dislike feedback.",
        error: error.message,
      });
    }
  };


// Add Comment to Feedback
export const addCommentToFeedback = async (req, res) => {
    try {
      const { feedbackId } = req.params;
      const { comment } = req.body;
  
      // Fetch the feedback by feedbackId
      const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found." });
      }
  
      // Create a new comment object
      const newComment = {
        studentId: req.user._id,
        comment: comment,
      };
  
      // Add the comment to the feedback's comments array
      feedback.comments.push(newComment);
  
      // Save the updated feedback
      await feedback.save();
  
      res.status(200).json({
        message: "Comment added successfully.",
        feedback: feedback,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to add comment.",
        error: error.message,
      });
    }
  };


  // Get Feedback with Comments
export const getFeedbackWithComments = async (req, res) => {
    try {
      const { feedbackId } = req.params;
  
      // Fetch the feedback by feedbackId and populate comments
      const feedback = await Feedback.findById(feedbackId).populate('comments.studentId', 'firstName lastName');
      if (!feedback) {
        return res.status(404).json({ message: "Feedback not found." });
      }
  
      res.status(200).json({
        message: "Fetched feedback successfully.",
        feedback: feedback,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to fetch feedback.",
        error: error.message,
      });
    }
  };

  // Get Feedbacks for a Specific Job
// Get Feedbacks for a Specific Job
export const getFeedbacksForJob = async (req, res) => {
    try {
      const { jobId } = req.params;
  
      // Fetch the job by jobId
      const job = await Job.findById(jobId);
      if (!job) {
        return res.status(404).json({ message: 'Job not found' });
      }
  
      // Fetch all feedbacks for the job
      const feedbacks = await Feedback.find({ jobId: job._id })
        .populate('studentId', 'profile.firstName profile.lastName profile.branch profile.profilePic profile.semester', User)
        .populate('comments.studentId', 'profile.firstName profile.lastName profile.branch profile.profilePic profile.semester', User);
  
      res.status(200).json({
        message: 'Fetched feedbacks successfully.',
        feedbacks: feedbacks,
      });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to fetch feedbacks.',
        error: error.message,
      });
    }
  };

  // Delete Feedback
export const deleteFeedback = async (req, res) => {
    try {
      const { feedbackId } = req.params;
  
      // Fetch the feedback by feedbackId
      const feedback = await Feedback.findById(feedbackId);
      if (!feedback) {
        return res.status(404).json({ message: 'Feedback not found' });
      }
  
      // Check if the user is authorized to delete the feedback
      if (req.user.role === 'student') {
        if (feedback.studentId.toString() !== req.user._id.toString()) {
          return res.status(403).json({ message: 'Access denied. Only the creator of the feedback can delete it.' });
        }
      } else if (req.user.role !== 'tnp_admin' && req.user.role !== 'global_admin') {
        return res.status(403).json({ message: 'Access denied. Only TNP Admin and Global Admin can delete feedback.' });
      }
  
      // Delete the feedback
      await feedback.deleteOne();
  
      res.status(200).json({ message: 'Feedback deleted successfully.' });
    } catch (error) {
      res.status(500).json({
        message: 'Failed to delete feedback.',
        error: error.message,
      });
    }
  };