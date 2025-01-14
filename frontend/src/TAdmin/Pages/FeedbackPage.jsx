import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Content from "../Components/Content";
import toast from "react-hot-toast";
import {
  getMessagesForAdmin,
  sendMessageToStudent,
} from "../../redux/communicationSlice";
import { MdSend } from "react-icons/md";
import sopan from "../../assets/sopan.jpg";

const FeedbackPage = () => {
  const [notifications] = useState([
    {
      id: 1,
      name: "Piush Ninane",
      message:
        "Sir, I am Puish Niwane from CSE 1st year and I am facing an issue with my height, Bec...",
      time: "Today 10:55 am",
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      id: 2,
      name: "Piush Ninane",
      message:
        "Becoz of which no is accepting me everyone is rejecting me by seeing my height .........",
      time: "Sun 10:55 am",
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      id: 3,
      name: "Piush Ninane",
      message:
        "Becoz of which no is accepting me everyone is rejecting me by seeing my height .........",
      time: "Sun 10:55 am",
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      id: 4,
      name: "Piush Ninane",
      message:
        "Becoz of which no is accepting me everyone is rejecting me by seeing my height .........",
      time: "Sun 10:55 am",
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      id: 5,
      name: "Piush Ninane",
      message:
        "Becoz of which no is accepting me everyone is rejecting me by seeing my height .........",
      time: "Sun 10:55 am",
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      id: 6,
      name: "Piush Ninane",
      message:
        "Becoz of which no is accepting me everyone is rejecting me by seeing my height .........",
      time: "Sun 10:55 am",
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      id: 7,
      name: "Piush Ninane",
      message:
        "Becoz of which no is accepting me everyone is rejecting me by seeing my height .........",
      time: "Sun 10:55 am",
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
    {
      id: 8,
      name: "Piush Ninane",
      message:
        "Becoz of which no is accepting me everyone is rejecting me by seeing my height .........",
      time: "Sun 10:55 am",
      avatar: "https://via.placeholder.com/50", // Replace with actual avatar URL
    },
  ]);
  const dispatch = useDispatch();
  const { messages, loading, error } = useSelector(
    (state) => state.communication
  );
  const { user, status } = useSelector((state) => state.user);
  const [replyMessage, setReplyMessage] = useState("");
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [showReplyInput, setShowReplyInput] = useState(null); // To control visibility of reply input

  // Fetch messages on component mount
  useEffect(() => {
    dispatch(getMessagesForAdmin())
      .unwrap()
      .then(() => toast.success("Messages fetched successfully!"))
      .catch((err) => toast.error(err || "Failed to fetch messages."));
  }, [dispatch]);

  // Handle reply to a message
  const handleReply = (studentId) => {
    if (!replyMessage.trim()) {
      toast.error("Please enter a message.");
      return;
    }

    dispatch(sendMessageToStudent({ studentId, message: replyMessage }))
      .unwrap()
      .then(() => {
        toast.success("Message sent successfully!");
        setReplyMessage("");
        setSelectedStudentId(null);
        setShowReplyInput(null); // Hide reply input after sending
      })
      .catch((err) => toast.error(err || "Failed to send message."));
  };

  

  return (
    <div className="relative flex flex-col flex-1 min-h-screen bg-[#A3B5C0] rounded-l-[35px]">
      <h1 className="text-[28px] font-bold p-2 mt-5 mb-3 ml-7 text-[rgb(22,22,59)]">
        User Feedback/Messages
      </h1>
      <Content />
      <h5 className="text-[22px] font-bold text-[rgb(22,22,59)] px-10 pb-2">
        Notifications
      </h5>
      <div className="w-[90%] h-[490px] mx-auto bg-transparent rounded-[20px] border border-[rgba(33,86,105,0.758)] p-5 shadow-lg overflow-y-auto scrollbar-hide">
        {loading ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-[18px] text-[#333]">Loading...</span>
          </div>
        ) : error ? (
          <div className="flex justify-center items-center h-full">
            <span className="text-[18px] text-red-500">{error}</span>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message._id}
              className="flex items-start mb-4 p-3 bg-[#ffffff37] backdrop-blur-sm shadow-md rounded-[20px] hover:bg-[#ffffff71] cursor-pointer"
            >
              {/* User Profile Picture */}
              <img
                src={
                  message.senderRole === "student"
                    ? message.studentDetails?.profilePic ||
                      "https://via.placeholder.com/50"
                    : "https://img.freepik.com/premium-photo/3d-entrepreneur-icon-business-leader-innovation-illustration-logo_762678-101891.jpg"
                }
                alt="avatar"
                className="w-[52px] h-[52px] rounded-2xl mr-4 object-cover border-2 border-white shadow-sm"
              />
              <div className="flex-1">
                <div className="flex justify-between mb-1">
                  <span className="font-bold text-[16px] text-[#333]">
                    {message.senderRole === "student"
                      ? `${message.studentDetails?.firstName} ${message.studentDetails?.lastName}`
                      : "Admin"}
                  </span>
                  <span className="text-[13px] text-[#717171]">
                    {new Date(message.createdAt).toLocaleString()}
                  </span>
                </div>

                {/* Display Student Details */}
                {message.senderRole === "student" && (
                  <div className="text-[14px] text-[#555] mb-2">
                    <p><strong>{message.studentDetails?.branch}</strong></p>
                    <p> {message.studentDetails?.semester} Sem</p>
                      </div>
                )}

                <div className="text-[15px] text-[#383838] italic">
                  {message.message}
                </div>

                {/* Reply Button */}
                {message.senderRole === "student" && (
                  <button
                    className="mt-2 bg-blue-500 text-white rounded-xl px-4 py-1 hover:bg-blue-600 transition-colors"
                    onClick={() =>
                      setShowReplyInput(
                        message._id === showReplyInput ? null : message._id
                      )
                    }
                  >
                    Reply
                  </button>
                )}

                {/* Reply Input Field */}
                {showReplyInput === message._id && (
                  <div className="flex items-center mt-3 gap-2">
                    <img
                      src={sopan}
                      alt="User  profile"
                      className="w-10 h-10 rounded-full object-cover border-2 border-white shadow-sm"
                    />
                    <div className="flex-1 relative">
                      <textarea
                        placeholder="Write a comment..."
                        rows="1"
                        value={replyMessage}
                        onChange={(e) => setReplyMessage(e.target.value)}
                        className="w-full p-3 pr-12 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none bg-gray-50"
                      />
                      <button
                        onClick={() => handleReply(message.studentId)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors shadow-md"
                      >
                        <MdSend className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};


export default FeedbackPage;
