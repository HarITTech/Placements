import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAppliedJobs } from "../../redux/jobSlice";
import { MdOutlineWorkOutline, MdSend } from "react-icons/md";
import {
  IoChatbubbleOutline,
  IoFlagOutline,
  IoPaperPlaneOutline,
  IoTrashOutline,
} from "react-icons/io5";
import { AiFillDislike, AiFillLike } from "react-icons/ai";
import {
  addCommentToFeedback,
  createFeedback,
  deleteFeedback,
  dislikeFeedback,
  getFeedbacksForJob,
  likeFeedback,
} from "../../redux/feedbackSlice";
import help from "../../assets/help.png";
import toast from "react-hot-toast";
import {
  getMessagesForStudent,
  sendMessageToAdmin,
} from "../../redux/communicationSlice";

const NotificationPage = () => {
  const dispatch = useDispatch();
  const {
    appliedJobs = [],
    loading,
    error,
  } = useSelector((state) => state.jobs);
  const [selectedJob, setSelectedJob] = useState(null);
  const { user } = useSelector((state) => state.user);
  const [showCommentInput, setShowCommentInput] = useState({});
  const [feedbackInput, setFeedbackInput] = useState("");
  const [commentInput, setCommentInput] = useState("");
  const { messages } = useSelector((state) => state.communication);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [formData, setFormData] = useState({
    problem: "",
  });

  const [selectedFeedbackId, setSelectedFeedbackId] = useState(null);
  const {
    feedbacks,
    loading: feedbacksLoading,
    error: feedbacksError,
  } = useSelector((state) => state.feedback.feedbacks);

  useEffect(() => {
    dispatch(getMessagesForStudent());
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAppliedJobs());
  }, [dispatch]);

  useEffect(() => {
    if (!selectedJob && appliedJobs.length > 0) {
      setSelectedJob(appliedJobs[0]);
    }
  }, [appliedJobs, selectedJob]);

  useEffect(() => {
    if (selectedJob) {
      dispatch(getFeedbacksForJob(selectedJob.jobId));
    }
  }, [selectedJob, dispatch]);

  const handleCreateFeedback = async () => {
    if (!feedbackInput.trim()) {
      toast.error("Feedback message cannot be empty.");
      return;
    }

    try {
      const response = await dispatch(
        createFeedback({
          jobId: selectedJob.jobId,
          message: feedbackInput,
          content: "",
        })
      ).unwrap();
      toast.success(response.message);
      setFeedbackInput("");
      dispatch(getFeedbacksForJob(selectedJob.jobId));
    } catch (error) {
      toast.error(error.message || "Failed to create feedback.");
    }
  };

  const handleLikeFeedback = async (feedbackId) => {
    try {
      const response = await dispatch(likeFeedback(feedbackId)).unwrap();
      toast.success(response.message);
    } catch (error) {
      toast.error(error.message || "Failed to like feedback.");
    }
  };

  const handleDislikeFeedback = async (feedbackId) => {
    try {
      await dispatch(dislikeFeedback(feedbackId)).unwrap();
      toast.success("Feedback disliked successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to dislike feedback.");
    }
  };

  const handleShowCommentInput = (feedbackId) => {
    setShowCommentInput((prevShowCommentInput) => ({
      ...prevShowCommentInput,
      [feedbackId]: !prevShowCommentInput[feedbackId],
    }));
  };

  const handleDeleteFeedback = async (feedbackId) => {
    setShowDeleteModal(true);
    setSelectedFeedbackId(feedbackId);
  };

  const handleConfirmDelete = async () => {
    try {
      await dispatch(deleteFeedback(selectedFeedbackId)).unwrap();
      toast.success("Feedback deleted successfully.");
      setShowDeleteModal(false);
    } catch (error) {
      toast.error(error.message || "Failed to delete feedback.");
    }
  };

  const handleCancelDelete = () => {
    setShowDeleteModal(false);
  };

  const handleAddCommentToFeedback = async (feedbackId, comment) => {
    try {
      await dispatch(addCommentToFeedback({ feedbackId, comment })).unwrap();
      toast.success("Comment added successfully.");
    } catch (error) {
      toast.error(error.message || "Failed to add comment.");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.problem) {
      toast.error("Please describe your problem.");
      return;
    }

    const message = `Problem: ${formData.problem}`;

    try {
      const response = await dispatch(sendMessageToAdmin(message)).unwrap();
      toast.success(response.message || "Message sent successfully!");
      setFormData({ problem: "" });
    } catch (error) {
      toast.error(error.message || "Failed to send message.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>Error:</strong> {error}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 sm:p-6">
      {/* Applied Jobs Section */}
      <div className="flex flex-col md:flex-row gap-2">
        {/* Sidebar */}
        <div className="w-full md:w-1/3 bg-white rounded-lg shadow-lg h-auto md:h-screen overflow-y-auto">
          <ul>
            {appliedJobs.length > 0 ? (
              appliedJobs.map((job) => (
                <li
                  key={job.jobId}
                  onClick={() => setSelectedJob(job)}
                  className={`flex items-center gap-4 p-4 border-b-[1px] border-gray-300 hover:bg-gray-50 rounded-sm cursor-pointer ${
                    selectedJob?.jobId === job.jobId ? "bg-gray-100" : ""
                  }`}
                >
                  <img
                    src={job.joblogo}
                    alt={`${job.companyName} logo`}
                    className="h-12 w-12 sm:h-16 sm:w-16 rounded-full object-fill"
                  />
                  <div className="flex flex-col">
                    <h1 className="text-sm sm:text-md text-gray-600 font-bold">
                      {job.jobTitle}
                    </h1>
                    <h3 className="font-thin pb-2 text-sm sm:text-base">
                      {job.companyName}
                    </h3>
                    <p className="text-xs font-semibold text-green-700">
                      Applied on: {new Date(job.appliedOn).toLocaleDateString()}
                    </p>
                  </div>
                </li>
              ))
            ) : (
              <div className="p-4 text-gray-600 h-full flex items-center justify-center">
                <img
                  className="rounded-lg h-full  w-auto"
                  src="https://assets-v2.lottiefiles.com/a/051bbc5e-1178-11ee-8597-4717795896d7/oMojybDy7p.gif"
                  alt="No applied jobs"
                />
              </div>
            )}
          </ul>
        </div>

        {/* Job Details Section */}
        <div className="w-full md:w-2/3 bg-white rounded-lg shadow-lg p-4 sm:p-6 h-auto md:h-screen overflow-y-auto">
          {selectedJob ? (
            <div>
              {/* Job Header Section */}
              <div className="flex flex-col sm:flex-row justify-start gap-5 items-start mb-6">
                <div className="flex justify-center">
                  <img
                    src={selectedJob.joblogo}
                    alt={`${selectedJob.companyName} logo`}
                    className="h-16 w-16 sm:h-24 sm:w-24 rounded-full object-fill"
                  />
                </div>
                <div className="flex-1 items-baseline">
                  <h1 className="text-lg sm:text-2xl font-bold text-gray-800">
                    {selectedJob.jobTitle}
                  </h1>
                  <p className="text-sm sm:text-base text-gray-600">
                    {selectedJob.companyName}
                  </p>
                  <div className="flex items-center pt-4">
                    <span className="text-lg font-bold text-gray-600">
                      <MdOutlineWorkOutline />
                    </span>
                  </div>
                  <p className="text-gray-700 font-semibold">
                    <span className="text-gray-500 font-bold">
                      {new Date(selectedJob.jobDate).toLocaleDateString()}
                    </span>{" "}
                    · {selectedJob.jobLocation} ·{" "}
                    <span className="text-stone-400 font-semibold uppercase">
                      {selectedJob.jobType}{" "}
                    </span>{" "}
                    ·{" "}
                    <span className="text-gray-600 font-semibold">
                      {selectedJob.totalApplications} applicants
                    </span>
                  </p>
                </div>
              </div>

              <hr className="border-t border-[2px] border-gray-200 mb-6" />

              {/* Rounds Section */}
              <section className="mb-6">
                {selectedJob.rounds.length > 0 ? (
                  <div className="space-y-4">
                    {selectedJob.rounds.map((round) => (
                      <div
                        key={round.roundId}
                        className="bg-gray-50 p-4 rounded-lg shadow-sm"
                      >
                        <div className="flex justify-between items-center">
                          <p className="text-gray-700 font-semibold">
                            {round.roundName}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-semibold ${
                              round.status === "Pending"
                                ? "bg-yellow-100 text-yellow-800"
                                : round.status === "Absent"
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {round.status}
                          </span>
                        </div>
                        <p className="text-gray-600 mt-2">
                          {new Date(round.dateTime).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-600">No rounds available.</p>
                )}
              </section>

              {/* Placement Section */}
              {selectedJob.placement ? (
                <div className="bg-green-100 border border-green-200 p-6 rounded-lg shadow-lg mb-6  flex flex-col items-center">
                  <h2 className="text-2xl font-extrabold text-green-800 mb-2 text-center">
                    🎉 Congratulations! 🎉
                  </h2>
                  <p className="text-lg text-gray-800 mb-1 text-center">
                    You have been placed at{" "}
                    <span className="font-semibold">
                      {selectedJob.companyName}
                    </span>
                    !
                  </p>
                  <p className="text-gray-700 mb-1 text-center">
                    <span className="font-semibold">Package Amount:</span> ₹
                    {selectedJob.placement.packageAmount} LPA
                  </p>
                  <p className="text-gray-700 text-center">
                    <span className="font-semibold">Placed On:</span>{" "}
                    {new Date(
                      selectedJob.placement.placedOn
                    ).toLocaleDateString()}
                  </p>
                </div>
              ) : (
                <div className="bg-yellow-100 p-4 rounded-lg shadow-md mb-6">
                  <h2 className="text-xl font-bold text-yellow-800">
                    Keep Going! 💪
                  </h2>
                  <p className="text-gray-700">
                    You haven't been placed yet, but don't lose hope! Keep
                    applying and improving your skills.
                  </p>
                </div>
              )}

              {/* Feedback Section */}
              <h2 className="text-xl font-semibold mb-4">Feedbacks</h2>

              {feedbacksLoading && (
                <div className="flex justify-center items-center">
                  <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
              )}

              {feedbacksError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                  <strong>Error:</strong> {feedbacks.error}
                </div>
              )}
              <div className="flex items-center mb-5 gap-2">
                {/* User Profile Picture */}
                <img
                  src={user?.profile?.profilePic || "/placeholder.svg"}
                  alt="User  profile"
                  className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                />

                {/* Comment Input Field */}
                <div className="flex-1 relative">
                  <textarea
                    placeholder="Write a comment..."
                    rows="1"
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-gray-50"
                  />

                  {/* Send Button with Modern Icon */}
                  <button
                    onClick={handleCreateFeedback}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                  >
                    <MdSend className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {feedbacks && Array.isArray(feedbacks) && feedbacks.length > 0 ? (
                feedbacks.map((feedback, i) => (
                  <div
                    key={i}
                    className="border border-gray-200 rounded-lg shadow-sm mb-4 p-4"
                  >
                    <div className="flex items-center gap-4 mb-4">
                      <img
                        src={feedback.studentId.profile.profilePic}
                        alt="Student profile"
                        className="w-12 h-12 rounded-full object-cover"
                      />
                      <div>
                        <h3 className="font-semibold text-gray-800">
                          {feedback.studentId.profile.firstName}{" "}
                          {feedback.studentId.profile.lastName}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {feedback.studentId.profile.branch},{" "}
                          {feedback.studentId.profile.semester}
                        </p>
                      </div>
                    </div>

                    <div className="pl-12">
                      <p className="text-gray-600 text-sm italic mb-4">
                        {feedback.message}
                      </p>
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex items-center gap-2 text-green-600 cursor-pointer ${
                            feedback.likes.includes(user._id)
                              ? "opacity-50"
                              : ""
                          }`}
                          onClick={() => handleLikeFeedback(feedback._id)}
                        >
                          <AiFillLike />
                          <span>{feedback.likes.length} Likes</span>
                        </div>
                        <div
                          className={`flex items-center gap-2 text-red-600 cursor-pointer ${
                            feedback.dislikes.includes(user._id)
                              ? "opacity-50"
                              : ""
                          }`}
                          onClick={() => handleDislikeFeedback(feedback._id)}
                        >
                          <AiFillDislike />
                          <span>{feedback.dislikes.length} Dislikes</span>
                        </div>
                        <button
                          className="flex items-center gap-2 text-blue-600 cursor-pointer hover:text-blue-700"
                          onClick={() => handleShowCommentInput(feedback._id)}
                        >
                          <IoChatbubbleOutline />
                          <span>Comment</span>
                        </button>

                        {/* Report Button */}
                        <button className="flex items-center gap-2 text-red-600 cursor-pointer hover:text-red-700">
                          <IoFlagOutline />
                          <span>Report</span>
                        </button>

                        {/* Delete Button (Conditional) */}
                        {feedback.studentId._id === user._id && (
                          <button
                            className="flex items-center gap-2 text-red-600 cursor-pointer hover:text-red-700"
                            onClick={() => handleDeleteFeedback(feedback._id)}
                          >
                            <IoTrashOutline />
                            <span>Delete</span>
                          </button>
                        )}

                        {showDeleteModal && (
                          <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white rounded-lg shadow-lg p-4">
                              <h2 className="text-lg font-bold mb-2">
                                Delete Feedback
                              </h2>
                              <p className="text-gray-600 mb-4">
                                Are you sure you want to delete this feedback?
                              </p>
                              <div className="flex justify-end gap-2">
                                <button
                                  className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded"
                                  onClick={handleConfirmDelete}
                                >
                                  Delete
                                </button>
                                <button
                                  className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded"
                                  onClick={handleCancelDelete}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      {/* Comment Input Section */}
                      {showCommentInput[feedback._id] && (
                        <div className="mt-4">
                          <div className="flex items-center gap-2">
                            {/* User Profile Picture */}
                            <img
                              src={
                                user?.profile?.profilePic || "/placeholder.svg"
                              }
                              alt="User  profile"
                              className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                            />

                            {/* Comment Input Field */}
                            <div className="flex-1 relative">
                              <textarea
                                placeholder="Write a comment..."
                                rows="1"
                                value={commentInput}
                                onChange={(e) =>
                                  setCommentInput(e.target.value)
                                }
                                className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-gray-50"
                              />

                              {/* Send Button with Modern Icon */}
                              <button
                                onClick={() =>
                                  handleAddCommentToFeedback(
                                    feedback._id,
                                    commentInput
                                  )
                                }
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                              >
                                <MdSend className="w-5 h-5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {feedback.comments.length > 0 && (
                      <div className="mt-4">
                        <h4 className="font-semibold mb-2">Comments:</h4>
                        {feedback.comments.map((comment) => (
                          <div
                            key={comment._id}
                            className="flex items-start gap-4 mb-2"
                          >
                            <img
                              src={comment.studentId.profile.profilePic}
                              alt="Commenter profile"
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div>
                              <h5 className="font-semibold text-gray-800">
                                {comment.studentId.profile.firstName}{" "}
                                {comment.studentId.profile.lastName}
                              </h5>
                              <p className="text-gray-600 text-sm">
                                {comment.comment}
                              </p>
                              <span className="text-gray-400 text-xs">
                                {new Date(comment.createdAt).toLocaleString()}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))
              ) : (
                <div className="border border-gray-200 rounded-lg shadow-sm mb-4 p-4">
                  <p className="text-gray-600">No feedbacks available.</p>
                </div>
              )}
            </div>
          ) : (
            <p className="text-gray-600">Select a job to see details.</p>
          )}
        </div>
      </div>

      {/* Help Form Section */}
      <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 sm:p-10 rounded-lg shadow-lg">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4 text-center">
            Need Help? Contact TNP Team
          </h2>
          <p className="text-gray-600 text-center mb-8">
            If you have any issues or questions, feel free to reach out to us.
            We're here to help!
          </p>

          {/* Display Current User Info */}
          <div className="mb-6 text-center">
            <p className="text-gray-700 font-semibold">
              Logged in as: {user?.profile?.firstName} {user?.profile?.lastName}{" "}
              ({user?.email})
            </p>
          </div>

          {/* Message Input Form */}
          <form className="space-y-6 mb-10" onSubmit={handleSubmit}>
            {/* Problem Description Field */}
            <div>
              <label
                htmlFor="problem"
                className="block text-sm font-medium text-gray-700"
              >
                Describe Your Problem
              </label>
              <div className="mt-1">
                <textarea
                  id="problem"
                  name="problem"
                  rows="4"
                  placeholder="Explain your issue in detail..."
                  value={formData.problem}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
                />
              </div>
            </div>

            {/* Help Image */}
            <div className="flex justify-center">
              <img
                src={help}
                alt="Help Illustration"
                className="w-1/2 h-auto"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className={`w-full flex justify-center items-center px-4 py-3 text-white font-semibold rounded-lg transition-all ${
                  loading ? "bg-gray-400" : "bg-sky-600 hover:bg-sky-700"
                }`}
              >
                {loading ? (
                  "Sending..."
                ) : (
                  <>
                    <IoPaperPlaneOutline className="mr-2" /> Send Message
                  </>
                )}
              </button>
            </div>
          </form>

          {/* Messages Display Section */}
          <div className="space-y-6">
            {loading ? (
              <p className="text-center text-gray-500">Loading messages...</p>
            ) : error ? (
              <p className="text-center text-red-500">{error}</p>
            ) : (
              messages.map((msg) => (
                <div
                  key={msg._id}
                  className={`p-6 rounded-lg shadow-sm ${
                    msg.senderRole === "student"
                      ? "bg-blue-50 border-l-4 border-blue-500"
                      : "bg-gray-50 border-l-4 border-gray-500"
                  }`}
                >
                  <div className="flex items-center mb-4">
                    <img
                      src={
                        msg.senderRole === "student"
                          ? msg.studentDetails.profilePic
                          : msg.adminDetails.profilePic ||
                            "https://img.freepik.com/premium-photo/3d-entrepreneur-icon-business-leader-innovation-illustration-logo_762678-101891.jpg"
                      }
                      alt="Profile"
                      className="w-12 h-12 rounded-full object-cover mr-3"
                    />
                    <div>
                      <p className="font-semibold">
                        {msg.senderRole === "student"
                          ? `${msg.studentDetails.firstName} ${msg.studentDetails.lastName}`
                          : "TNP Admin"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <p className="text-gray-700">{msg.message}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotificationPage;
