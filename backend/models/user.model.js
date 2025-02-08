import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Define the User Schema
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true },
    role: {
      type: String,
      enum: ["student", "tnp_admin", "global_admin"],
      default: "student",
    },
    college: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "College",
      required: function () {
        return this.role === "tnp_admin" || this.role === "student";
      },
    },
    profile: {
      firstName: String,
      lastName: String,
      phoneNum: String,
      userEmail: { type: String, unique: true, lowercase: true },
      collegeID: String,
      subcollege: { type: String, default: null },
      branch: {
        type: String,
        enum: ["CSE", "IT", "Aero", "Bio", "Mech", "EE", "ECE", "CE"],
      },
      year: {
        type: String,
        enum: ["1st", "2nd", "3rd", "4th"],
        default: "4th",
      }, // New field
      semester: {
        type: String,
        enum: ["1st", "2nd", "3rd", "4th", "5th", "6th", "7th", "8th"],
        default: "7th",
      }, // New field
      profilePic: { type: String, default: null },
      dob: { type: Date, default: null },
      address: { type: String, default: null },
      session: {
        type: String,
        enum: ["2023-2024", "2024-2025", "2025-2026"],
        default: "2024-2025",
      }, // New session field
      gender: {
        type: String,
        enum: ["Male", "Female"],
        required: true,
        default: "Male",
      }, // Added gender field
      academicRecords: {
        diploma: {
          collegeName: { type: String, default: "NA" },
          percentage: { type: Number, default: null },
        },
        jeeScore: { type: Number, default: null },
        mhtCetScore: { type: Number, default: null },
        twelfth: {
          schoolName: { type: String, default: null },
          percentage: { type: Number, default: null },
        },
        gap: String,
        tenth: {
          schoolName: { type: String, default: null },
          percentage: { type: Number, default: null },
        },
        cgpa: [
          {
            semesters: [
              {
                semester: { type: String },
                cgpa: { type: Number, default: null },
              },
            ],
          },
        ],
        backlogs: [
          {
            semester: { type: String },
            count: { type: Number, default: 0 },
            dead: { type: Number, default: 0 },
          },
        ],
      },
      studentType: { type: String, enum: ["Regular", "DSY"] },
      courses: {
        type: [String], // Array of strings to hold course names
        enum: ["BTech", "MTech", "MCA", "Poly"],
        default: [],
    },
      achievements: [String],
      skills: [String],
      currentStatus: {
        isWorking: { type: Boolean, default: false },
        companyName: { type: String, default: null },
        position: { type: String, default: null },
        duration: { type: String, default: null },
        jobType: { type: String, default: null },
        location: { type: String, default: null },
        startDate: { type: Date, default: null },
        endDate: { type: Date, default: null },
      },
      appliedJobsHistory: [
        {
          jobId: { type: mongoose.Schema.Types.ObjectId, ref: "Job" },
          appliedOn: { type: Date, default: Date.now },
          roundsHistory: [
            {
              roundId: { type: mongoose.Schema.Types.ObjectId, ref: "Round" }, // Reference to a specific round
              status: {
                type: String,
                enum: ["qualified", "not_qualified", "pending"],
                default: "pending",
              }, // Status of the student in this round
              date: { type: Date, default: Date.now }, // Date when the round status was updated
            },
          ],
          placement: {
            packageAmount: { type: Number, default: null }, // Add this field
            placedOn: { type: Date, default: null }, // Add this field
          },
        },
      ],
    },
    resetPasswordOTP: { type: String, default: null },
    resetPasswordOTPExpires: { type: Date, default: null },
    blocked: { type: Boolean, default: false },
    blockedUntil: { type: Date, default: null },
  },
  { timestamps: true }
);

// Virtual field for profile completion percentage
userSchema.virtual("profileCompletion").get(function () {
  const profileFields = [
    "firstName",
    "lastName",
    "phoneNum",
    "collegeID",
    "branch",
    "dob",
    "session",
    "gender",
    "address",
    "academicRecords.diploma.collegeName",
    "academicRecords.diploma.percentage",
    "academicRecords.jeeScore",
    "academicRecords.mhtCetScore",
    "academicRecords.twelfth.schoolName",
    "academicRecords.twelfth.percentage",
    "academicRecords.tenth.schoolName",
    "academicRecords.tenth.percentage",
  ];
  let completedFields = 0;

  profileFields.forEach((field) => {
    const fieldParts = field.split(".");
    const value = fieldParts.reduce((acc, part) => acc?.[part], this.profile);
    if (value) completedFields++;
  });

  return Math.round((completedFields / profileFields.length) * 100);
});

// Encrypt the password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

// Compare password during login
userSchema.methods.comparePassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

export const User = mongoose.model("User", userSchema);
