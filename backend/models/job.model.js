import mongoose from "mongoose";

const roundSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., "Aptitude Test", "Interview"
  index: { type: Number, required: true }, // Add this line
  dateTime: { type: Date }, // New field for date and time (optional)
  qualifiedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User " }], // Students qualified for this round
  unqualifiedStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User " }], // Students who did not qualify
  absentStudents: [{ type: mongoose.Schema.Types.ObjectId, ref: "User " }], // Students who were absent
});

const jobSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    company: { type: String, required: true },
    location: { type: String, required: true },
    type: {
      type: String,
      required: true,
      enum: ["job", "Internship"],
      default: "job",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: true,
    },
    eligibilityCriteria: {
      branches: {
        type: [String],
        enum: ["CSE", "IT", "Aero", "Bio", "Mech", "EE", "ECE"],
      },
      gender: { type: [String], enum: ["Male", "Female"] },
      cgpa: { type: Number },
      session: {
        type: [String],
        enum: ["2023-2024", "2024-2025", "2025-2026"],
        default: "2024-2025",
      },
      jeeScore: { type: Number },
      mhtCetScore: { type: Number },
      tenthPercentage: { type: Number, default: 0 },
      twelfthPercentage: { type: Number, default: 0 },
      polyPercentage: { type: Number },
      currentBacklogs: { type: Number },
    },
    totalApplications: { type: Number, default: 0 },
    appliedStudents: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        firstName: String,
        lastName: String,
        branch: String,
        semester: String,
      },
    ],
    eligibleStudents: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        firstName: String,
        lastName: String,
        branch: String,
        semester: String,
      },
    ],
    rounds: [roundSchema], // New Field
    logo: { type: String },
    jobDate: { type: Date, required: true },
    placements: [
      {
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: "User " },
        packageAmount: { type: Number, required: true },
        placedOn: { type: Date, default: Date.now },
      },
    ],
  },
  { timestamps: true }
);

export const Job = mongoose.model("Job", jobSchema);
