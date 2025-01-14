import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { getMessagesForAdmin, getMessagesForStudent, sendMessageToAdmin, sendMessageToStudent } from "../controller/communication.controller.js";


const router = express.Router();

// Route for students to send messages to admins
router.post("/send-to-admin",protect, sendMessageToAdmin);

// Route for admins to send messages to students
router.post("/send-to-student",protect, sendMessageToStudent);

// Route for students to get their messages
router.get("/messages",protect, getMessagesForStudent);

// Route for admins to get their messages
router.get("/admin/messages",protect, getMessagesForAdmin);

export default router;