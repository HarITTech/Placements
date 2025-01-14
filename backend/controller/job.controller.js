import {
  deleteImageFromCloudinary,
  uploadImageOnCloudinary,
} from "../cloud/cloudinary.js";
import { sendResetPasswordEmail } from "../config/emailService.js";
import { Job } from "../models/job.model.js";
import { User } from "../models/user.model.js";

// Create Job with Eligibility Criteria
export const createJob = async (req, res) => {
  try {
    const jobData = req.body;

    // Ensure the user is authenticated and has the correct role
    if (req.user.role !== "tnp_admin") {
      return res
        .status(403)
        .json({ message: "Access denied. Only TNP Admin can create a job." });
    }

    // Construct eligibility criteria dynamically (same as showEligibleStudents logic)
    const eligibilityCriteria = {
      role: "student",
      college: req.user.college,
      ...(jobData.eligibilityCriteria.branches &&
        jobData.eligibilityCriteria.branches.length > 0 && {
          "profile.branch": { $in: jobData.eligibilityCriteria.branches },
        }),
      ...(jobData.eligibilityCriteria.tenthPercentage && {
        "profile.academicRecords.tenth.percentage": {
          $gte: jobData.eligibilityCriteria.tenthPercentage,
        },
      }),
      ...(jobData.eligibilityCriteria.twelfthPercentage && {
        "profile.academicRecords.twelfth.percentage": {
          $gte: jobData.eligibilityCriteria.twelfthPercentage,
        },
      }),
      ...(jobData.eligibilityCriteria.cgpa && {
        "profile.academicRecords.cgpa": {
          $elemMatch: {
            semesters: {
              $elemMatch: { cgpa: { $gte: jobData.eligibilityCriteria.cgpa } },
            },
          },
        },
      }),
      ...(jobData.eligibilityCriteria.currentBacklogs !== null &&
        jobData.eligibilityCriteria.currentBacklogs !== undefined && {
          $expr: {
            $lte: [
              { $sum: "$profile.academicRecords.backlogs.count" }, // Sum of backlog counts
              jobData.eligibilityCriteria.currentBacklogs,
            ],
          },
        }),
      ...(jobData.eligibilityCriteria.gender && {
        "profile.gender": jobData.eligibilityCriteria.gender,
      }),
      ...(jobData.eligibilityCriteria.jeeScore && {
        "profile.academicRecords.jeeScore": {
          $gte: jobData.eligibilityCriteria.jeeScore,
        },
      }),
      ...(jobData.eligibilityCriteria.mhtCetScore && {
        "profile.academicRecords.mhtCetScore": {
          $gte: jobData.eligibilityCriteria.mhtCetScore,
        },
      }),
      ...(jobData.eligibilityCriteria.session && {
        "profile.session": jobData.eligibilityCriteria.session,
      }),
      ...(jobData.eligibilityCriteria.year && {
        "profile.year": jobData.eligibilityCriteria.year,
      }),
      ...(jobData.eligibilityCriteria.semester && {
        "profile.semester": jobData.eligibilityCriteria.semester,
      }),
    };

    // Fetch eligible students based on criteria
    const eligibleStudents = await User.find(eligibilityCriteria);

    // Create job with eligible students and include college, createdBy
    const newJob = await Job.create({
      ...jobData,
      college: req.user.college,
      createdBy: req.user._id,
      eligibleStudents: eligibleStudents.map((student) => ({
        studentId: student._id,
        firstName: student.profile.firstName,
        lastName: student.profile.lastName,
        branch: student.profile.branch,
        semester: student.profile.semester,
      })),
    });

    return res
      .status(201)
      .json({ message: "Job created successfully", job: newJob });
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error creating job", error: error.message });
  }
};

// GET All Jobs (TNP Admin)
export const getAllJobs = async (req, res) => {
  try {
    // Only TNP Admins can see all jobs for their college
    if (req.user.role !== "tnp_admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const jobs = await Job.find({ college: req.user.college });
    res.status(200).json({ jobs });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// GET Eligible Jobs for Students
export const getEligibleJobs = async (req, res) => {
  try {
    const studentId = req.user.id; // Assuming student ID is fetched from token

    // Fetch jobs where the student is eligible
    const jobs = await Job.find({
      eligibleStudents: { $elemMatch: { studentId } },
    });

    res
      .status(200)
      .json({ message: "Eligible jobs fetched successfully", jobs });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to fetch eligible jobs", error: error.message });
  }
};

// DELETE Job
export const deleteJob = async (req, res) => {
  try {
    if (req.user.role !== "tnp_admin") {
      return res.status(403).json({ message: "Access denied." });
    }

    const { jobId } = req.params;

    const job = await Job.findById(jobId);
    if (!job || job.college.toString() !== req.user.college.toString()) {
      return res
        .status(404)
        .json({ message: "Job not found or unauthorized access." });
    }

    await job.deleteOne();
    res.status(200).json({ message: "Job deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Show Eligible Students Before Creating a Job
export const showEligibleStudents = async (req, res) => {
  const {
    branches,
    tenthPercentage,
    twelfthPercentage,
    cgpa,
    backlogs,
    gender,
    jeeScore,
    mhtCetScore,
    session,
    year,
    semester,
  } = req.body;

  try {
    // Only TNP Admins can access this functionality
    if (req.user.role !== "tnp_admin") {
      console.log("Access denied: User role is not tnp_admin"); // Log role issue
      return res.status(403).json({
        message: "Access denied. Only TNP Admins can view eligible students.",
      });
    }

    // Construct eligibility criteria
    const eligibilityCriteria = {
      role: "student",
      college: req.user.college,
      ...(branches &&
        branches.length > 0 && {
          "profile.branch": { $in: branches },
        }),
      ...(tenthPercentage && {
        "profile.academicRecords.tenth.percentage": { $gte: tenthPercentage },
      }),
      ...(twelfthPercentage && {
        "profile.academicRecords.twelfth.percentage": {
          $gte: twelfthPercentage,
        },
      }),
      ...(cgpa && {
        "profile.academicRecords.cgpa": {
          $elemMatch: { semesters: { $elemMatch: { cgpa: { $gte: cgpa } } } },
        },
      }),
      ...(backlogs !== null &&
        backlogs !== undefined && {
          $expr: {
            $lte: [
              { $sum: "$profile.academicRecords.backlogs.count" }, // Sum of backlog counts
              backlogs,
            ],
          },
        }),
      ...(gender && {
        "profile.gender": gender,
      }),
      ...(jeeScore && {
        "profile.academicRecords.jeeScore": { $gte: jeeScore },
      }),
      ...(mhtCetScore && {
        "profile.academicRecords.mhtCetScore": { $gte: mhtCetScore },
      }),
      ...(session && { "profile.session": session }), // New condition for session
      ...(year && { "profile.year": year }), // New condition for year
      ...(semester && { "profile.semester": semester }), // New condition for semester
    };

    // Find Eligible Students Based on Criteria
    const eligibleStudents = await User.find(eligibilityCriteria);

    return res.status(200).json({
      totalEligibleStudents: eligibleStudents.length,
      students: eligibleStudents,
    });
  } catch (error) {
    console.error("Error fetching eligible students:", error.message); // Log error
    return res.status(500).json({
      message: "Error fetching eligible students",
      error: error.message,
    });
  }
};

export const applyForJob = async (req, res) => {
  try {
    const { jobId } = req.params;
    const studentId = req.user._id;

    // Fetch the job by jobId
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Check if the student is eligible for the job
    const isEligible = job.eligibleStudents.some(
      (student) => student.studentId.toString() === studentId.toString()
    );

    if (!isEligible) {
      return res
        .status(403)
        .json({ message: "You are not eligible to apply for this job." });
    }

    // Check if the student has already applied for the job
    const hasApplied = job.appliedStudents.some(
      (student) => student.studentId.toString() === studentId.toString()
    );

    if (hasApplied) {
      return res
        .status(400)
        .json({ message: "You have already applied for this job." });
    }

    // Fetch the student's details from the User model
    const student = await User.findById(studentId);
    if (!student) {
      return res.status(404).json({ message: "Student not found." });
    }

    // Add the student's details to the appliedStudents array in the Job model
    job.appliedStudents.push({
      studentId: student._id,
      firstName: student.profile.firstName,
      lastName: student.profile.lastName,
      branch: student.profile.branch,
      semester: student.profile.semester,
    });

    // Remove the student from the eligibleStudents array
    job.eligibleStudents = job.eligibleStudents.filter(
      (student) => student.studentId.toString() !== studentId.toString()
    );

    // Increment the totalApplications field by 1
    job.totalApplications += 1;
    // Save the updated job
    await job.save();

    // Add the job to the student's appliedJobsHistory
    student.profile.appliedJobsHistory.push({
      jobId: job._id,
      appliedOn: new Date(),
      roundsHistory: [], // Initialize rounds history as empty
    });

    // Save the updated student
    await student.save();

    res.status(200).json({ message: "Successfully applied for the job." });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to apply for the job", error: error.message });
  }
};

export const getAppliedStudents = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Check if the user is either a global admin or tnp admin
    if (!["global_admin", "tnp_admin"].includes(req.user.role)) {
      return res.status(403).json({
        message:
          "Access denied. Only global admins or TNP admins can access this data.",
      });
    }

    const job = await Job.findById(jobId).populate(
      "appliedStudents",
      "profile.firstName profile.lastName profile.email"
    );

    if (!job || job.college.toString() !== req.user.college.toString()) {
      return res
        .status(404)
        .json({ message: "Job not found or unauthorized access." });
    }

    res.status(200).json({ appliedStudents: job.appliedStudents });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applied students",
      error: error.message,
    });
  }
};

export const createRounds = async (req, res) => {
  try {
    console.log("Authenticated User:", req.user); // Log the req.user object

    const { jobId } = req.params;
    const { rounds } = req.body; // Array of round objects

    // Ensure the user is either Global Admin or TNP Admin
    if (req.user.role !== "global_admin" && req.user.role !== "tnp_admin") {
      return res.status(403).json({
        message:
          "Access denied. Only Global Admin and TNP Admin can create rounds.",
      });
    }

    const job = await Job.findById(jobId);

    if (!job || job.college.toString() !== req.user.college.toString()) {
      return res
        .status(404)
        .json({ message: "Job not found or unauthorized access." });
    }

    // Determine the starting index for the new rounds
    const startingIndex = job.rounds.length + 1;

    // Append the new rounds to the existing rounds array
    const newRounds = rounds.map((round, index) => ({
      name: round.name, // Correctly extract the name field
      index: startingIndex + index, // Assign the correct index
      qualifiedStudents: [],
      dateTime: round.dateTime || null, // Correctly extract the dateTime field
    }));

    job.rounds.push(...newRounds); // Use push with spread to add multiple rounds

    await job.save();

    // Return the updated rounds with the index field
    const updatedRounds = job.rounds.map((round) => ({
      name: round.name,
      index: round.index, // Ensure the index is included in the response
      dateTime: round.dateTime,
      qualifiedStudents: round.qualifiedStudents,
      _id: round._id,
    }));

    res
      .status(201)
      .json({ message: "Rounds created successfully.", rounds: updatedRounds });
  } catch (error) {
    res
      .status(500)
      .json({ message: "Failed to create rounds", error: error.message });
  }
};

// Update Round Results
export const updateRoundResults = async (req, res) => {
  try {
    const { jobId, roundId } = req.params;
    const { qualifiedStudents, unqualifiedStudents, absentStudents } = req.body;

    // Fetch the job by jobId
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Find the round by roundId within the job's rounds array
    const round = job.rounds.id(roundId);
    if (!round) {
      return res.status(404).json({ message: "Round not found." });
    }

    // Update the qualified, unqualified, and absent students for the round
    round.qualifiedStudents = qualifiedStudents || [];
    round.unqualifiedStudents = unqualifiedStudents || [];
    round.absentStudents = absentStudents || [];

    await job.save();

    res.status(200).json({
      message: "Round results updated successfully.",
      round: {
        name: round.name,
        qualifiedStudents: round.qualifiedStudents,
        unqualifiedStudents: round.unqualifiedStudents,
        absentStudents: round.absentStudents,
        _id: round._id,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update round results.",
      error: error.message,
    });
  }
};

export const getNotifications = async (req, res) => {
  try {
    const studentId = req.user._id; // Get the student's ID from the authenticated user

    // Fetch all jobs where the student has applied
    const jobs = await Job.find({ "appliedStudents.studentId": studentId });

    // Create an array of notifications that includes job and round details
    const notifications = jobs.flatMap((job) =>
      job.rounds.map((round) => {
        // Determine the student's status in the round
        let status = "Pending"; // Default status
        if (round.qualifiedStudents.includes(studentId)) {
          status = "Qualified";
        } else if (round.unqualifiedStudents.includes(studentId)) {
          status = "Not Qualified";
        } else if (round.absentStudents.includes(studentId)) {
          status = "Absent";
        }

        // Return the notification object
        return {
          jobTitle: job.title, // Job title
          roundName: round.name, // Round name
          status: status, // Student's status in the round
          jobDetails: {
            jobId: job._id, // Job ID
            jobDescription: job.description, // Job description
            companyName: job.company, // Company name
            jobLocation: job.location, // Job location
            jobType: job.type, // Job type (e.g., job or internship)
            jobDate: job.jobDate, // Job date
            logo: job.logo, // Company logo
          },
          roundDetails: {
            roundId: round._id, // Round ID
            dateTime: round.dateTime, // Round date and time
          },
        };
      })
    );

    // Return the notifications
    res.status(200).json({ notifications });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch notifications",
      error: error.message,
    });
  }
};

export const updateLogo = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Find the job by ID
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found." });
    }

    // Ensure the user is authorized (TNP Admin or Creator)
    if (
      req.user.role !== "tnp_admin" &&
      job.createdBy.toString() !== req.user._id.toString()
    ) {
      return res
        .status(403)
        .json({ message: "Unauthorized to update logo for this job." });
    }

    // Check if a file is uploaded
    const file = req.file; // Assuming the file is passed in `req.file`
    if (!file) {
      return res.status(400).json({ message: "No file uploaded." });
    }

    // Delete the previous logo if it exists
    if (job.logo) {
      await deleteImageFromCloudinary(job.logo); // Assuming `job.logo` stores the public ID
    }

    // Upload the new logo to Cloudinary
    const result = await uploadImageOnCloudinary(file.path);

    // Update the logo field in the job document
    job.logo = result.secure_url;
    await job.save();

    res.status(200).json({
      message: "Logo updated successfully.",
      logo: result.secure_url,
    });
  } catch (error) {
    console.error("Error updating logo:", error);
    res
      .status(500)
      .json({ message: "Failed to update logo.", error: error.message });
  }
};

// Add Placement for a Specific Job
export const addPlacement = async (req, res) => {
  try {
    const { jobId } = req.params;
    const { studentId, packageAmount } = req.body;

    // Ensure the user is a TNP Admin
    if (req.user.role !== "tnp_admin") {
      return res.status(403).json({
        message: "Access denied. Only TNP Admins can add placements.",
      });
    }

    // Fetch the job by jobId
    const job = await Job.findById(jobId);
    if (!job || job.college.toString() !== req.user.college.toString()) {
      return res
        .status(404)
        .json({ message: "Job not found or unauthorized access." });
    }

    // Fetch the student by studentId
    const student = await User.findById(studentId);
    if (!student || student.role !== "student") {
      return res.status(404).json({ message: "Student not found." });
    }


    // Check if the student has already been placed for this job
    const isAlreadyPlaced = job.placements.some(
      (placement) => placement.studentId.toString() === studentId.toString()
    );

    if (isAlreadyPlaced) {
      return res.status(400).json({
        message: "This student has already been placed for this job.",
      });
    }

    // Check if the student has applied for the job
    const hasApplied = job.appliedStudents.some(
      (appliedStudent) =>
        appliedStudent.studentId.toString() === studentId.toString()
    );

    if (!hasApplied) {
      return res
        .status(400)
        .json({ message: "Student has not applied for this job." });
    }

    // Update the student's appliedJobsHistory with placement details
    const appliedJobIndex = student.profile.appliedJobsHistory.findIndex(
      (jobHistory) => jobHistory.jobId.toString() === jobId.toString()
    );

    if (appliedJobIndex === -1) {
      return res
        .status(400)
        .json({ message: "Student has not applied for this job." });
    }

    // Add placement details to the student's appliedJobsHistory
    student.profile.appliedJobsHistory[appliedJobIndex].placement = {
      packageAmount,
      placedOn: new Date(),
    };

    // Save the updated student
    await student.save();

    // Send email to the student with placement details
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: student.email,
      subject: `Congratulations! You have been placed for ${job.title} at ${job.company}`,
      html: `
        <!DOCTYPE html>
<html>
<head>
  <title>Congratulations on Your Placement!</title>
  <style>
    body {
      font-family: Arial, sans-serif;
      margin: 0;
      padding: 0;
    }
    .container {
      width: 600px;
      margin: 40px auto;
      padding: 20px;
      background-color: #f9f9f9;
      border: 1px solid #ddd;
      border-radius: 10px;
      box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    }
    .header {
      background-color: #333;
      color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 10px 10px 0 0;
    }
    .header img {
      width: 100px;
      height: 100px;
      margin: 0 auto;
    }
    .content {
      padding: 20px;
    }
    .content h1 {
      font-size: 24px;
      margin-bottom: 10px;
    }
    .content p {
      font-size: 18px;
      margin-bottom: 20px;
    }
    .content ul {
      list-style: none;
      padding: 0;
      margin: 0;
    }
    .content li {
      font-size: 15px;
      margin-bottom: 10px;
    }
    .content li strong {
      font-size: 18px;
      font-weight: bold;
    }
    .footer {
      background-color: #333;
      color: #fff;
      padding: 10px;
      text-align: center;
      border-radius: 0 0 10px 10px;
    }
    .instructions {
      margin-top: 20px;
      padding: 15px;
      background-color: #f1f1f1;
      border-radius: 5px;
    }
    .instructions h2 {
      font-size: 20px;
      margin-bottom: 10px;
    }
    .instructions p {
      font-size: 16px;
      margin-bottom: 10px;
    }
    .text-xs {
      font-size: 12px;
      margin-top: 20px;
      text-align: center;
    }
    .text-red-500 {
      color: #ef4444;
    }
    .font-bold {
      font-weight: bold;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <img src=${job.logo} alt="Company Logo">
    </div>
    <div class="content">
      <h1>Congratulations on Your Placement!</h1>
      <p>You have been placed for the job <strong>${job.title}</strong> at <strong>${job.company}</strong>.</p>
      <h2>Job Details:</h2>
      <ul>
        <li><strong>Job Title:</strong> ${job.title}</li>
        <li><strong>Company:</strong> ${job.company}</li>
        <li><strong>Location:</strong> ${job.location}</li>
        <li><strong>Job Type:</strong> ${job.type}</li>
        <li><strong>Package Offered:</strong> ${packageAmount} LPA</li>
      </ul>
      <div class="instructions">
        <h2>Next Steps:</h2>
        <p>1. <strong>Contact HR:</strong> Reach out to the HR department of ${job.company} for further instructions.</p>
        <p>2. <strong>Documentation:</strong> Prepare all necessary documents (e.g., resume, academic records, ID proof).</p>
        <p>3. <strong>Joining Date:</strong> Confirm your joining date with the company by TNP Department.</p>
        <p>4. <strong>Stay Updated:</strong> Check your email regularly for updates from the company.</p>
      </div>
      <p>Best wishes for your future endeavors!</p>
    </div>
    <div class="footer">
      <p>&copy; 2025 ${job.company}. All rights reserved.</p>
      <p class="text-xs">
  Wishes by <span class="text-red-500">❤️</span> 
   <a href="https://www.harittech.in" target="_blank" class="text-xs font-bold" style="color: inherit; text-decoration: none;">Harit Tech Solution</a>
</p>
    </div>
  </div>
</body>
</html>

`,
    };

    await sendResetPasswordEmail(mailOptions);

    // Update the placements field in the job document
    job.placements.push({
      studentId: studentId,
      packageAmount: packageAmount,
      placedOn: new Date(),
    });

    // Save the updated job
    await job.save();

    res.status(200).json({
      message: "Placement added successfully and email sent to the student.",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to add placement.",
      error: error.message,
    });
  }
};

// Get All Placements for a Specific Job
export const getPlacementsForJob = async (req, res) => {
  try {
    const { jobId } = req.params;

    // Ensure the user is a TNP Admin
    if (req.user.role !== "tnp_admin") {
      return res.status(403).json({
        message: "Access denied. Only TNP Admins can view placements.",
      });
    }

    // Fetch the job by jobId
    const job = await Job.findById(jobId);
    if (!job || job.college.toString() !== req.user.college.toString()) {
      return res
        .status(404)
        .json({ message: "Job not found or unauthorized access." });
    }

    // Fetch all students who have been placed for this job
    const placedStudents = await User.find({
      "profile.appliedJobsHistory.jobId": jobId,
      "profile.appliedJobsHistory.placement": { $exists: true },
    });

    const placements = placedStudents.map((student) => ({
      studentId: student._id,
      name: student.name,
      email: student.email,
      firstName: student.profile.firstName,
      lastName: student.profile.lastName,
      semester: student.profile.semester,
      branch: student.profile.branch,
      pic: student.profile.profilePic,
      package: student.profile.appliedJobsHistory.find(
        (jobHistory) => jobHistory.jobId.toString() === jobId.toString()
      ).placement.packageAmount,
      placedOn: student.profile.appliedJobsHistory.find(
        (jobHistory) => jobHistory.jobId.toString() === jobId.toString()
      ).placement.placedOn,
    }));

    res.status(200).json({
      message: "Fetched placements successfully.",
      placements,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch placements.",
      error: error.message,
    });
  }
};

// Fetch Applied Jobs
export const fetchAppliedJobs = async (req, res) => {
  try {
    const studentId = req.user._id;

    // Fetch all jobs where the student has applied
    const jobs = await Job.find({
      "appliedStudents.studentId": studentId,
    })
      .populate("createdBy", "name");

    // Map over the jobs to include additional details
    const appliedJobs = await Promise.all(jobs.map(async (job) => {
      const appliedStudent = job.appliedStudents.find(
        (student) => student.studentId.toString() === studentId.toString()
      );

      // Fetch appliedOn from user model
      const user = await User.findById(studentId);
      const appliedJobHistory = user.profile.appliedJobsHistory.find(
        (jobHistory) => jobHistory.jobId.toString() === job._id.toString()
      );

      const roundData = job.rounds.map((round) => {
        const qualifiedStudents = round.qualifiedStudents.includes(studentId);
        const unqualifiedStudents = round.unqualifiedStudents.includes(studentId);
        const absentStudents = round.absentStudents.includes(studentId);

        let status;
        if (qualifiedStudents) {
          status = "Qualified";
        } else if (unqualifiedStudents) {
          status = "Not Qualified";
        } else if (absentStudents) {
          status = "Absent";
        } else {
          status = "Pending";
        }

        return {
          roundId: round._id,
          roundName: round.name,
          dateTime: round.dateTime,
          status,
        };
      });

      const placement = job.placements.find(
        (placement) => placement.studentId.toString() === studentId.toString()
      );

      return {
        jobId: job._id,
        joblogo: job.logo,
        jobTitle: job.title,
        companyName: job.company,
        jobLocation: job.location,
        totalApplications: job.totalApplications,
        jobType: job.type,
        jobDate: job.jobDate,
        createdBy: job.createdBy.name,
        appliedOn: appliedJobHistory.appliedOn, // Show appliedOn from user model
        rounds: roundData,
        placement: placement
          ? {
              packageAmount: placement.packageAmount,
              placedOn: placement.placedOn,
            }
          : null,
      };
    }));

    res.status(200).json({
      message: "Fetched applied jobs successfully.",
      appliedJobs,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch applied jobs.",
      error: error.message,
    });
  }
};