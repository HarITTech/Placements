import { Communication } from "../models/communication.model.js";
import { User } from "../models/user.model.js";

// Send a message from student to admin
export const sendMessageToAdmin = async (req, res) => {
    try {
      const { message } = req.body;
  
      // Ensure the user is a student
      if (req.user.role !== "student") {
        return res.status(403).json({
          message: "Access denied. Only students can send messages to admins.",
        });
      }
  
      // Fetch the student's details
      const student = await User.findById(req.user._id).select(
        "profile.firstName profile.lastName profile.branch profile.semester profile.collegeID profile.profilePic"
      );
  
      if (!student) {
        return res.status(404).json({ message: "Student not found." });
      }
  
      // Create a new communication document with student details
      const newCommunication = {
        studentId: req.user._id, // Add studentId here
        studentDetails: {
          firstName: student.profile.firstName,
          lastName: student.profile.lastName,
          branch: student.profile.branch,
          semester: student.profile.semester,
          collegeId: student.profile.collegeID,
          profilePic: student.profile.profilePic,
        },
        message: message,
        senderRole: "student",
      };
  
      // Save the communication
      const communicationDoc = await Communication.create(newCommunication);
  
      res.status(201).json({
        message: "Message sent to admin successfully.",
        communication: communicationDoc,
      });
    } catch (error) {
      res.status(500).json({
        message: "Failed to send message to admin.",
        error: error.message,
      });
    }
  };

// Send a message from admin to student
export const sendMessageToStudent = async (req, res) => {
  try {
    const { studentId, message } = req.body;

    // Ensure the user is an admin
    if (req.user.role !== "tnp_admin" && req.user.role !== "global_admin") {
      return res.status(403).json({
        message: "Access denied. Only admins can send messages to students.",
      });
    }

    // Fetch the student's details
    const student = await User.findById(studentId).select(
      "profile.firstName profile.lastName profile.branch profile.semester profile.collegeID profile.profilePic"
    );

    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Fetch the admin's details
    const admin = await User.findById(req.user._id).select(
      "profile.firstName profile.lastName profile.profilePic"
    );

    if (!admin) {
      return res.status(404).json({ message: "Admin not found." });
    }

    // Create a new communication document with student and admin details
    const newCommunication = {
        studentId: req.user._id, 
      studentDetails: {
        firstName: student.profile.firstName,
        lastName: student.profile.lastName,
        branch: student.profile.branch,
        semester: student.profile.semester,
        collegeId: student.profile.collegeID,
        profilePic: student.profile.profilePic,
      },
      adminDetails: {
        firstName: admin.profile.firstName,
        lastName: admin.profile.lastName,
        profilePic: admin.profile.profilePic,
      },
      message: message,
      senderRole: req.user.role,
    };

    // Save the communication
    const communicationDoc = await Communication.create(newCommunication);

    res.status(201).json({
      message: "Message sent to student successfully.",
      communication: communicationDoc,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to send message to student.",
      error: error.message,
    });
  }
};

// Get all messages for a student
export const getMessagesForStudent = async (req, res) => {
  try {
    // Ensure the user is a student
    if (req.user.role !== "student") {
      return res.status(403).json({
        message: "Access denied. Only students can view their messages.",
      });
    }

    // Fetch all messages for the student
    const messages = await Communication.find({
      "studentDetails.collegeId": req.user.profile.collegeID,
    });

    res.status(200).json({
      message: "Fetched messages successfully.",
      messages: messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages.",
      error: error.message,
    });
  }
};

// Get all messages for an admin
export const getMessagesForAdmin = async (req, res) => {
  try {
    // Ensure the user is an admin
    if (req.user.role !== "tnp_admin" && req.user.role !== "global_admin") {
      return res.status(403).json({
        message: "Access denied. Only admins can view messages.",
      });
    }

    // Fetch all messages sent to the admin
    const messages = await Communication.find({
      "adminDetails.firstName": req.user.profile.firstName,
    });

    res.status(200).json({
      message: "Fetched messages successfully.",
      messages: messages,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch messages.",
      error: error.message,
    });
  }
};
