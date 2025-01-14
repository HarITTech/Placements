import mongoose from "mongoose";

const communicationSchema = new mongoose.Schema({
    studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User ",
        required: true,
    },
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User ",
    },
    studentDetails: {
        firstName: String,
        lastName: String,
        branch: String,
        semester: String,
        collegeId: String,
        profilePic: String,
      },
    adminDetails: {
        firstName: String,
        lastName: String,
        profilePic: String,
      },
    message: {
        type: String,
        required: true,
    },
    senderRole: {
        type : String,
        enum: ["student", "tnp_admin", "global_admin"],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Communication = mongoose.model("Communication", communicationSchema);