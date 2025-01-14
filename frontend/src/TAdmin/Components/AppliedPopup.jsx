import React, { useEffect, useState } from "react";
import {
  IoChevronBackOutline,
  IoEllipsisVertical,
  IoInformationCircleOutline,
  IoThumbsDownOutline,
  IoThumbsUpOutline,
} from "react-icons/io5";
import { IoClose } from "react-icons/io5";
import { FaRankingStar } from "react-icons/fa6";
import { FaAnglesRight } from "react-icons/fa6";
import { IoCreate } from "react-icons/io5";
import { PiStudentBold } from "react-icons/pi";
import { VscFeedback } from "react-icons/vsc";
import { MdOutlineFeedback } from "react-icons/md";
import { HiArchiveBoxXMark } from "react-icons/hi2";
import { IoCheckmarkDoneCircle } from "react-icons/io5";
import { IoIosCloseCircle } from "react-icons/io";
import { FaCircleCheck } from "react-icons/fa6";
import { useSelector, useDispatch } from "react-redux";
import {
  addPlacement,
  createRounds,
  getPlacementsForJob,
  updateRoundResults,
} from "../../redux/jobSlice";
import toast from "react-hot-toast";
import { deleteFeedback, getFeedbacksForJob } from "../../redux/feedbackSlice";

const AppliedPopup = ({ onClose, job }) => {
  const dispatch = useDispatch();
  const [activeRoundIndex, setActiveRoundIndex] = useState(null); // Track the active round
  const [rounds, setRounds] = useState(job.rounds || []); // Initialize rounds from job response
  const [showRoundResult, setShowRoundResult] = useState(false); // Track visibility of Round Result Table
  const [showCreateRound, setShowCreateRound] = useState(false);
  const [roundName, setRoundName] = useState("");
  const [roundDate, setRoundDate] = useState("");
  const [placedStudents, setPlacedStudents] = useState([]);
  const [students] = useState([
    {
      name: "Student A",
      branch: "CSE",
      semester: "6th",
      feedback: "Great experience!",
    },
    {
      name: "Student B",
      branch: "ECE",
      semester: "5th",
      feedback: "Could be better.",
    },
    {
      name: "Student C",
      branch: "ME",
      semester: "4th",
      feedback: "Good overall!",
    },
    {
      name: "Student D",
      branch: "ME",
      semester: "4th",
      feedback: "Great experience!",
    },
    {
      name: "Student E",
      branch: "ME",
      semester: "4th",
      feedback: "Great experience!",
    },
    {
      name: "Student F",
      branch: "ME",
      semester: "4th",
      feedback: "Great experience!",
    },
    {
      name: "Student G",
      branch: "ME",
      semester: "4th",
      feedback: "Great experience!",
    },
    {
      name: "Student H",
      branch: "ME",
      semester: "4th",
      feedback: "Great experience!",
    },
    {
      name: "Student I",
      branch: "ME",
      semester: "4th",
      feedback: "Great experience!",
    },
    {
      name: "Student J",
      branch: "ME",
      semester: "4th",
      feedback: "Good overall!",
    },
    {
      name: "Student K",
      branch: "ME",
      semester: "4th",
      feedback: "Good overall!",
    },
  ]);
  const [packageAmounts, setPackageAmounts] = useState({});
  const [showInfo, setShowInfo] = useState(false);
  const [results, setResults] = useState(
    students.reduce((acc, student) => ({ ...acc, [student.id]: null }), {})
  );
  const [errorMessage, setErrorMessage] = useState("");
  const [selectedStudents, setSelectedStudents] = useState([]); // Initialize as an array
  const [absentStudents, setAbsentStudents] = useState([]); // Initialize as an array
  const [unqualifiedStudents, setUnqualifiedStudents] = useState([]); // Initialize as an array
  const [loading, setLoading] = useState(false);
  const { feedbacks, error } = useSelector((state) => state.feedback.feedbacks);
  const [showPlacementSection, setShowPlacementSection] = useState(false);
  const [showFeedbackSection, setShowFeedbackSection] = useState(false);
  const [fetchFeedback, setFetchFeedback] = useState(false);
  const [showPlacedResult, setShowPlacedResult] = useState(false);
  const [showGetResultSection, setShowGetResultSection] = useState({});

  const handleCreateRound = async () => {
    if (window.confirm("Are you sure you want to create a new round?")) {
      setLoading(true);
      const reqBody = {
        jobId: job._id,
        rounds: [
          {
            name: roundName,
            dateTime: roundDate + "T10:00:00Z",
          },
        ],
      };

      try {
        await dispatch(createRounds(reqBody));
        toast.success("Round created successfully!");
        setLoading(false);
      } catch (error) {
        toast.error("Failed to create round.");
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (fetchFeedback) {
      dispatch(getFeedbacksForJob(job._id));
    }
  }, [dispatch, job._id, fetchFeedback]);

  const Comment = ({ comment }) => {
    return (
      <div className="flex items-center gap-2 mb-2">
        <img
          src={comment.studentId.profile.profilePic}
          alt={comment.studentId.profile.firstName}
          className="w-8 h-8 rounded-full"
        />
        <div>
          <p className="font-medium text-lg">
            {comment.studentId.profile.firstName}{" "}
            {comment.studentId.profile.lastName}
          </p>
          <p className="text-sm text-gray-600">{comment.comment}</p>
        </div>
      </div>
    );
  };

  const handleInputChange = (index, field, value) => {
    const updatedRounds = [...rounds];
    updatedRounds[index][field] = value;
    setRounds(updatedRounds);
  };

  // Function to calculate the number of selected students for the active round
  const getSelectedStudentsCount = () => {
    if (activeRoundIndex !== null && rounds[activeRoundIndex]) {
      return rounds[activeRoundIndex].qualifiedStudents.length;
    }
    return 0;
  };

  const createRound = (index) => {
    const round = rounds[index];
    if (!round.roundName || !round.date) {
      setErrorMessage("All fields are required to create a round.");
      return;
    }
    setErrorMessage("");
    const updatedRounds = [...rounds];
    updatedRounds[index].isCreated = true;
    setRounds(updatedRounds);
  };

  const toggleManage = (index) => {
    setRounds((prevRounds) =>
      prevRounds.map((round, i) =>
        i === index ? { ...round, showResults: !round.showResults } : round
      )
    );
  };

  const toggleResults = (index) => {
    setActiveRoundIndex(index); // Set the active round index
    setShowRoundResult(true); // Show the Round Result table
  };

  const hideResultsSection = (index) => {
    setShowRoundResult(false); // Hide the Round Result table
  };

  // const handleAction = (studentName, action) => {
  //   setResults((prevResults) => ({
  //     ...prevResults,
  //     [studentName]: action,
  //   }));
  // };

  const handleStudentSelection = (studentId, status) => {
    // Update the results state for the selected student
    const updatedResults = { ...results, [studentId]: status };
    setResults(updatedResults);

    // Update selected, absent, and unqualified students based on the status
    if (status === "qualified") {
      setSelectedStudents((prev) => [...prev, studentId]);
      setAbsentStudents((prev) => prev.filter((id) => id !== studentId));
      setUnqualifiedStudents((prev) => prev.filter((id) => id !== studentId));
    } else if (status === "unqualified") {
      setUnqualifiedStudents((prev) => [...prev, studentId]);
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
      setAbsentStudents((prev) => prev.filter((id) => id !== studentId));
    } else if (status === "absent") {
      setAbsentStudents((prev) => [...prev, studentId]);
      setSelectedStudents((prev) => prev.filter((id) => id !== studentId));
      setUnqualifiedStudents((prev) => prev.filter((id) => id !== studentId));
    }
  };

  const getStudentsForPlacement = (job) => {
    const lastRound = job.rounds[job.rounds.length - 1];
    if (lastRound && lastRound.qualifiedStudents.length > 0) {
      return lastRound.qualifiedStudents.map((studentId) => {
        return (
          job.appliedStudents.find(
            (student) => student.studentId === studentId
          ) || {}
        );
      });
    } else {
      return job.appliedStudents;
    }
  };

  const handleUpdate = () => {
    // Confirm before sending the update
    if (window.confirm("Are you sure you want to update the results?")) {
      const reqBody = {
        jobId: job._id,
        roundId: rounds[activeRoundIndex]._id,
        qualifiedStudents: selectedStudents,
        unqualifiedStudents: unqualifiedStudents,
        absentStudents: absentStudents,
      };

      console.log("Sending data:", reqBody);

      // Dispatch the update action
      dispatch(updateRoundResults(reqBody));

      // Show toast notification
      toast.success("Results updated successfully!");

      // Reset selections
      setResults({});
      setSelectedStudents([]);
      setAbsentStudents([]);
      setUnqualifiedStudents([]);
    }
  };

  const handleAction = (roundIndex, studentName, action) => {
    const updatedRounds = [...rounds];
    const roundResults = updatedRounds[roundIndex].roundResults || {};
    roundResults[studentName] = action;
    updatedRounds[roundIndex].roundResults = roundResults;
    setRounds(updatedRounds);
  };

  // Function to handle button actions (Absent, Selected, Unselected)
  const handleActions = (studentId, action) => {
    const updatedRounds = rounds.map((round, index) => {
      if (index === activeRoundIndex) {
        // Update the current round's lists based on the action
        const updatedRound = { ...round };
        if (action === "Absent") {
          updatedRound.absentStudents = [
            ...updatedRound.absentStudents,
            studentId,
          ];
        } else if (action === "Selected") {
          updatedRound.qualifiedStudents = [
            ...updatedRound.qualifiedStudents,
            studentId,
          ];
        } else if (action === "Unselected") {
          updatedRound.unqualifiedStudents = [
            ...updatedRound.unqualifiedStudents,
            studentId,
          ];
        }
        return updatedRound;
      }
      return round;
    });
    setRounds(updatedRounds);

    // Close Manage Students Table and show Round Result Table
    setShowRoundResult(true);
  };

  // Function to get the list of students for the active round
  // Function to get the list of students for the active round
  const getStudentsForRound = (roundIndex) => {
    if (roundIndex === 0) {
      // For the first round, show all applied students
      return job.appliedStudents;
    } else {
      // For subsequent rounds, show qualified students from the previous round
      const previousRound = rounds[roundIndex - 1];
      return job.appliedStudents.filter((student) =>
        previousRound.qualifiedStudents.includes(student.studentId)
      );
    }
  };

  const handlePlacementAction = (studentName, status) => {
    setResults((prevResults) => ({
      ...prevResults,
      [studentName]: status,
    }));
  };

  const handlePlacement = (studentId, status) => {
    if (status === "Placed") {
      const packageAmount = packageAmounts[studentId]; // Access packageAmount from packageAmounts state
      if (packageAmount) {
        if (window.confirm("Are you sure you want to add this placement?")) {
          dispatch(
            addPlacement({
              jobId: job._id,
              studentId: studentId,
              packageAmount: packageAmount,
            })
          )
            .unwrap()
            .then(() => {
              toast.success("Placement added successfully!");
              setPlacedStudents((prevPlacedStudents) => [
                ...prevPlacedStudents,
                studentId,
              ]);
            })
            .catch((error) => {
              toast.error("Failed to add placement.");
            });
        }
      } else {
        toast.error("Please enter package amount.");
      }
    } else {
      // handle other status
    }
  };

  return (
    <div className="fixed p-6 inset-0 bg-[#a6c0cf80] backdrop-blur-[9px] flex justify-center z-50">
      <div className="bg-gradient-to-br from-[#ffffff30] via-[#a6c0cfa5] to-[#00214644]  backdrop-blur-[4px] shadow-lg rounded-3xl w-[90%] h-full relative overflow-y-auto scrollbar-hide">
        <div className="relative p-5">
          <button
            className="absolute top-4 left-4 text-[rgb(22,22,59)] pl-[2px] pr-[6px] py-1 rounded-full hover:bg-[#ffffff86]"
            onClick={onClose}
          >
            <IoChevronBackOutline className="text-[28px] font-black" />
          </button>
          <button
            className="absolute top-4 right-4 text-[rgb(22,22,59)] px-1 py-1 rounded-full hover:bg-[#ffffff86]"
            onClick={onClose}
          >
            <IoClose className="text-[28px] font-black" />
          </button>
        </div>
        <div className="relative p-8">
          <h2 className="text-2xl text-[rgb(22,22,59)] font-bold mb-4">
            Job Details
          </h2>
          <div className="grid grid-cols-2 gap-7">
            <div className="bg-[#ffffff38] p-5 rounded-[20px] shadow-md">
              <h3 className="text-xl font-semibold mb-2">Eligible Students</h3>
              <div className="w-auto h-[270px] overflow-y-auto scrollbar-hide rounded-[12px]">
                <table className="table-auto w-full border-collapse bg-[#cdd9e156] backdrop-blur-sm shadow-md rounded-[12px] overflow-hidden">
                  <thead className="bg-[#ffffffa1] border border-[#ecedef]">
                    <tr>
                      <th className="text-left px-4 py-2 text-base font-bold">
                        Name
                      </th>
                      <th className="text-left px-4 py-2 text-base font-bold">
                        Branch
                      </th>
                      <th className="text-left px-4 py-2 text-base font-bold">
                        Semester
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.eligibleStudents.map((student, i) => (
                      <tr key={i}>
                        <td className="border border-[#ecedef] px-4 py-2">
                          {student.firstName || "No Name"} {student.lastName}
                        </td>
                        <td className="border border-[#ecedef] px-4 py-2">
                          {student.branch || "No Branch"}
                        </td>
                        <td className="border border-[#ecedef] px-4 py-2">
                          {student.semester}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div className="bg-[#ffffff38] p-5 rounded-[20px] shadow-md w-auto h-[350px] ">
              <h3 className="text-xl font-semibold mb-2">Applied Students</h3>
              <div className="w-auto h-[270px] overflow-y-auto scrollbar-hide rounded-[12px]">
                <table className="table-auto w-full border-collapse bg-[#cdd9e156] backdrop-blur-sm shadow-md rounded-[12px]">
                  <thead className="bg-[#ffffffa1] border border-[#ecedef]">
                    <tr>
                      <th className="text-left px-4 py-2 text-base font-bold">
                        Name
                      </th>
                      <th className="text-left px-4 py-2 text-base font-bold">
                        Branch
                      </th>
                      <th className="text-left px-4 py-2 text-base font-bold">
                        Semester
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {job.appliedStudents.map((student, i) => (
                      <tr key={i}>
                        <td className="border border-[#ecedef] px-4 py-2">
                          {student.firstName || "No Name"} {student.lastName}
                        </td>
                        <td className="border border-[#ecedef] px-4 py-2">
                          {student.branch}
                        </td>
                        <td className="border border-[#ecedef] px-4 py-2">
                          {student.semester}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          <div className="mt-6">
            <h3 className="text-xl font-semibold mb-4">Rounds</h3>
            {rounds.map((round, index) => (
              <div
                key={index}
                className="bg-[#ffffff38] p-4 rounded-[20px] shadow-md mb-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-lg font-semibold">{round.name}</p>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(round.dateTime).toLocaleDateString()}
                    </p>
                  </div>

                  <div className="flex gap-4">
                    <button
                      onClick={() => {
                        setActiveRoundIndex(index);
                        setShowRoundResult(false); // Close Round Result table
                      }}
                      className="flex items-center gap-[6px] px-2 pt-[0px] pb-[1px] pl-2 bg-[#a2bfd0cc] shadow-lg text-[#16163b] rounded-[11px] text-[16px] font-medium hover:bg-[#769eb5]"
                    >
                      Manage <FaAnglesRight />
                    </button>

                    <button
                      onClick={() => {
                        toggleResults(index); // Show Round Result table
                      }}
                      className="flex items-center gap-[6px] px-2 pt-[0px] pb-[1px] pl-2 bg-[#a2bfd0cc] shadow-lg text-[#16163b] rounded-[11px] text-[16px] font-medium hover:bg-[#769eb5] relative"
                    >
                      Get Result <FaAnglesRight />
                      {activeRoundIndex === index &&
                        rounds[index] &&
                        rounds[index].qualifiedStudents.length > 0 && (
                          <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-2 py-1">
                            {rounds[index].qualifiedStudents.length}
                          </span>
                        )}
                    </button>
                  </div>
                </div>

                {/* Manage Students Table */}
                {activeRoundIndex === index && !showRoundResult && (
                  <div className="mt-4">
                    <h4 className="text-lg font-semibold mb-2 flex items-center">
                      Manage Students
                      <button
                        className="ml-2 text-gray-800 hover:text-gray-900"
                        onMouseOver={() => setShowInfo(true)}
                        onMouseOut={() => setShowInfo(false)}
                      >
                        <IoInformationCircleOutline className="text-lg" />
                      </button>
                      {showInfo && (
                        <p className="font-sans font-semibold ml-1 p-1 px-2 bg-yellow-400 shadow-sm rounded-md text-black mt-1 text-xs">
                          Once You Provide Result, it's Not Editable!!
                        </p>
                      )}
                    </h4>
                    <div className="overflow-x-auto">
                      <table className="table-auto w-full border-collapse bg-[#cdd9e16d] backdrop-blur-sm shadow-md rounded-[12px]">
                        <thead className="bg-[#ffffffa1] border border-[#ecedef]">
                          <tr>
                            <th className="border border-gray-300 px-4 py-2">
                              Name
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                              Branch
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                              Semester
                            </th>
                            <th className="border border-gray-300 px-4 py-2">
                              Actions
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {getStudentsForRound(index).map((student, i) => (
                            <tr key={i}>
                              <td className="border border-gray-300 px-4 py-2">{`${student.firstName} ${student.lastName}`}</td>
                              <td className="border border-gray-300 px-4 py-2">
                                {student.branch}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                {student.semester}
                              </td>
                              <td className="border border-gray-300 px-4 py-2">
                                <div className="flex gap-2">
                                  {/* Absent Button */}
                                  <button
                                    onClick={() =>
                                      handleStudentSelection(
                                        student.studentId,
                                        "absent"
                                      )
                                    }
                                    disabled={
                                      results[student.studentId] ===
                                        "qualified" ||
                                      results[student.studentId] ===
                                        "unqualified"
                                    }
                                    className={`flex items-center gap-[6px] px-2 py-[1px] ${
                                      results[student.studentId] === "absent"
                                        ? "bg-[rgb(199,52,52)]"
                                        : "bg-[rgba(239,68,68,0.5)]"
                                    } shadow-lg text-[#ffffffeb] rounded-[10px] border border-[rgb(210,59,59)] text-[15px] font-normal hover:bg-[rgb(199,52,52)] hover:text-[#ffffff]`}
                                  >
                                    Absent
                                  </button>
                                  {/* Selected Button */}
                                  <button
                                    onClick={() =>
                                      handleStudentSelection(
                                        student.studentId,
                                        "qualified"
                                      )
                                    }
                                    disabled={
                                      results[student.studentId] === "absent" ||
                                      results[student.studentId] ===
                                        "unqualified"
                                    }
                                    className={`flex items-center gap-[6px] px-2 py-[1px] ${
                                      results[student.studentId] === "qualified"
                                        ? "bg-[rgb(4,121,47)]"
                                        : "bg-[rgba(34,197,94,0.5)]"
                                    } shadow-lg text-[#ffffffeb] rounded-[10px] border border-[rgb(25,175,80)] text-[15px] font-normal hover:bg-[rgb(4,121,47)] hover:text-[#ffffff]`}
                                  >
                                    Selected
                                  </button>
                                  {/* Unselected Button */}
                                  <button
                                    onClick={() =>
                                      handleStudentSelection(
                                        student.studentId,
                                        "unqualified"
                                      )
                                    }
                                    disabled={
                                      results[student.studentId] === "absent" ||
                                      results[student.studentId] === "qualified"
                                    }
                                    className={`flex items-center gap-[6px] px-2 py-[1px] ${
                                      results[student.studentId] ===
                                      "unqualified"
                                        ? "bg-[rgb(194,146,3)]"
                                        : "bg-[rg ba(234,179,8,0.5)]"
                                    } shadow-lg text-[#ffffffeb] rounded-[10px] border border-[rgb(194,146,3)] text-[15px] font-normal hover:bg-[rgb(194,146,3)] hover:text-[#ffffff]`}
                                  >
                                    Unselected
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>

                      <div className="pr-5 mt-5 w-full flex items-center justify-end">
                        <button
                          onClick={handleUpdate}
                          disabled={
                            rounds[activeRoundIndex].qualifiedStudents.length >
                            1
                          }
                          className={`flex items-center gap-[6px] p-2  pt-[0px] pb-[1px] pl-2 bg-[#a2bfd0cc] shadow-lg text-[#16163b] rounded-[11px] text-[16px] font-medium hover:bg-[#769eb5] ${
                            rounds[activeRoundIndex].qualifiedStudents.length >
                            0
                              ? "opacity-50 cursor-not-allowed"
                              : ""
                          }`}
                        >
                          Update <FaAnglesRight />
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Round Result Section */}
                {activeRoundIndex === index && showRoundResult && (
                  <div className="mt-4 bg-[#ffffff38] p-4 rounded-[20px] shadow-md">
                    <h3 className="text-xl font-semibold mb-4">Round Result</h3>
                    <div className="w-auto max-h-[300px] h-auto overflow-y-auto scrollbar-hide rounded-[12px]">
                      <table className="table-auto w-full border-collapse bg-[#cdd9e16d] backdrop-blur-sm shadow-md rounded-[12px]">
                        <thead className="bg-[#ffffffa1] border border-[#ecedef]">
                          <tr>
                            <th className="px-4 py-2 text-base font-bold">
                              Selected
                            </th>
                            <th className="px-4 py-2 text-base font-bold">
                              Unselected
                            </th>
                            <th className="px-4 py-2 text-base font-bold">
                              Absent
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr>
                            <td className="border border-[#ecedef] px-4 py-2">
                              {rounds[activeRoundIndex].qualifiedStudents.map(
                                (studentId, i) => {
                                  const student = job.appliedStudents.find(
                                    (s) => s.studentId === studentId
                                  );
                                  return (
                                    <div key={i}>
                                      <p className="font-medium">
                                        {student
                                          ? `${student.firstName} ${student.lastName}`
                                          : "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {student
                                          ? `${student.branch} - ${student.semester}`
                                          : "N/A"}
                                      </p>
                                    </div>
                                  );
                                }
                              )}
                            </td>
                            <td className="border border-[#ecedef] px-4 py-2">
                              {rounds[activeRoundIndex].unqualifiedStudents.map(
                                (studentId, i) => {
                                  const student = job.appliedStudents.find(
                                    (s) => s.studentId === studentId
                                  );
                                  return (
                                    <div key={i}>
                                      <p className="font-medium">
                                        {student
                                          ? `${student.firstName} ${student.lastName}`
                                          : "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {student
                                          ? `${student.branch} - ${student.semester}`
                                          : "N/A"}
                                      </p>
                                    </div>
                                  );
                                }
                              )}
                            </td>
                            <td className="border border-[#ecedef] px-4 py-2">
                              {rounds[activeRoundIndex].absentStudents.map(
                                (studentId, i) => {
                                  const student = job.appliedStudents.find(
                                    (s) => s.studentId === studentId
                                  );
                                  return (
                                    <div key={i}>
                                      <p className="font-medium">
                                        {student
                                          ? `${student.firstName} ${student.lastName}`
                                          : "N/A"}
                                      </p>
                                      <p className="text-sm text-gray-600">
                                        {student
                                          ? `${student.branch} - ${student.semester}`
                                          : "N/A"}
                                      </p>
                                    </div>
                                  );
                                }
                              )}
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Create Round */}
          <div className="flex mt-6">
            <button
              onClick={() => setShowCreateRound(!showCreateRound)}
              className="flex items-center gap-[6px] px-2 py-[3px] pr-3 bg-[#A6C0CF] shadow-md text-[#16163b] border border-[#517488] rounded-[11px] text-[16px] font-medium hover:bg-[#80a7be]"
            >
              <FaRankingStar /> Create Round
            </button>
            {showCreateRound && (
              <div className="flex ml-3 items-center gap-4">
                <input
                  type="text"
                  placeholder="Enter Round Name"
                  value={roundName}
                  onChange={(e) => setRoundName(e.target.value)}
                  className="text-[rgb(22,22,59)] text-[15px] font-medium px-3 py-[5px] border border-[#4d7082] rounded-[12px] bg-[#ffffffbd] placeholder:text-[#4d7082] placeholder:text-[15px] placeholder:font-medium focus:outline-none focus:border-[2px] focus:border-[rgb(22,22,59)]"
                />
                <input
                  type="date"
                  value={roundDate}
                  onChange={(e) => setRoundDate(e.target.value)}
                  className="text-[rgb(22,22,59)] text-[15px] font-medium px-3 py-[5px] border border-[#4d7082] rounded-[12px] bg-[#ffffffbd] placeholder:text-[#4d7082] placeholder:text-[15px] placeholder:font-medium focus:outline-none focus:border-[2px] focus:border-[rgb(22,22,59)]"
                />
                <button
                  onClick={handleCreateRound}
                  disabled={loading}
                  className={`flex items-center gap-[4px] px-3 pt-[2px] pb-[4px] pr-[13px] bg-[#668a9e] text-white text-[17px] font-medium rounded-[12px] hover:bg-[#4b6b7e] ${
                    loading ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  <IoCreate /> Create
                </button>
              </div>
            )}
          </div>

          {/* placements */}
          <div className="relative p-5">
            <div className="mt-6 flex gap-4">
              <button
                onClick={() => {
                  setShowPlacementSection(!showPlacementSection);
                  setShowFeedbackSection(false);
                }}
                className="flex items-center gap-[6px] px-2 py-[3px] pr-3 bg-[#A6C0CF] shadow-md text-[#16163b] border border-[#517488] rounded-[11px] text-[16px] font-medium hover:bg-[#80a7be]"
              >
                <PiStudentBold /> Placement
              </button>
              <button
                onClick={() => {
                  setShowFeedbackSection(!showFeedbackSection);
                  setShowPlacementSection(false);
                  setFetchFeedback(true);
                }}
                className="flex items-center gap-[6px] px-2 py-[3px] pr-3 bg-[#A6C0CF] shadow-md text-[#16163b] border border-[#517488] rounded-[11px] text-[16px] font-medium hover:bg-[#80a7be]"
              >
                <MdOutlineFeedback /> Feedback
              </button>
            </div>

            {/* Placement Section */}
            {showPlacementSection && (
              <div className="mt-6 bg-[#ffffff38] p-4 rounded-[20px] shadow-md">
                <h3 className="text-xl font-semibold mb-4">
                  Placement Actions
                </h3>
                <div className="w-auto max-h-[270px] h-auto overflow-y-auto scrollbar-hide rounded-[12px]">
                  <table className="table-auto w-full border-collapse bg-[#cdd9e16d] backdrop-blur-sm shadow-md rounded-[12px]">
                    <thead className="bg-[#ffffffa1] border border-[#ecedef]">
                      <tr>
                        <th className="px-4 py-2 text-base font-bold">Name</th>
                        <th className="px-4 py-2 text-base font-bold">
                          Branch
                        </th>
                        <th className="px-4 py-2 text-base font-bold">
                          Semester
                        </th>
                        <th className="px-4 py-2 text-base font-bold">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getStudentsForPlacement(job).map((student, i) => (
                        <tr key={i} className="text-center">
                          <td className="border border-[#ecedef] px-4 py-2">
                            {student.firstName} {student.lastName}
                          </td>
                          <td className="border border-[#ecedef] px-4 py-2">
                            {student.branch}
                          </td>
                          <td className="border border-[#ecedef] px-4 py-2">
                            {student.semester}
                          </td>
                          <td className="flex items-center justify-around border border-[#ecedef] px-4 py-2">
                            <button
                              onClick={() =>
                                handlePlacementAction(
                                  student.studentId,
                                  "Placed"
                                )
                              }
                              disabled={placedStudents.includes(
                                student.studentId
                              )}
                              className={`flex items-center gap-[6px] px-2 py-[1px] bg-[rgba(34,197,94,0.82)] shadow-lg text-[#ffffffeb] rounded-[10px] border border-[rgb(25,175,80)] text-[15px] font-normal hover:bg-[rgb(25,175,80)] hover:text-[#ffffff] ${
                                placedStudents.includes(student.studentId)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title={
                                placedStudents.includes(student.studentId)
                                  ? "Student is already placed"
                                  : ""
                              }
                            >
                              <FaCircleCheck /> Placed
                            </button>

                            <button
                              onClick={() =>
                                handlePlacementAction(
                                  student.studentId,
                                  "Unplaced"
                                )
                              }
                              disabled={placedStudents.includes(
                                student.studentId
                              )}
                              className={`flex items-center gap-[6px] px-2 py-[1px] bg-[rgba(239,68,68,0.82)] shadow-lg text-[#ffffffeb] rounded-[10px] border border-[rgb(210,59,59)] text-[15px] font-normal hover:bg-[rgb(199,52,52)] hover:text-[#ffffff] ${
                                placedStudents.includes(student.studentId)
                                  ? "opacity-50 cursor-not-allowed"
                                  : ""
                              }`}
                              title={
                                placedStudents.includes(student.studentId)
                                  ? "Student is already placed"
                                  : ""
                              }
                            >
                              <IoIosCloseCircle /> Unplaced
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Get Result Button */}
                <div className="mt-4 text-right">
                  <button
                    onClick={() => setShowPlacedResult(!showPlacedResult)}
                    className="flex justify-end items-center gap-[6px] px-2 pt-[0px] pb-[1px] pl-2 bg-[#a2bfd0cc] shadow-lg text-[#16163b] rounded-[11px] text-[16px] font-medium hover:bg-[#769eb5]"
                  >
                    Get Result <FaAnglesRight />
                  </button>
                </div>

                {/* Placed Students Section */}
                {showPlacedResult && (
                  <div className="mt-6 bg-[#ffffff78] p-4 rounded-[20px] shadow-md">
                    <h3 className="text-xl font-semibold mb-1">
                      Create Placements
                    </h3>
                    <ul className="p-3 w-auto max-h-[320px] h-auto overflow-y-auto scrollbar-hide">
                      {Object.keys(results)
                        .filter((key) => results[key] === "Placed")
                        .map((studentId, i) => {
                          const student = job.appliedStudents.find(
                            (s) => s.studentId === studentId
                          );
                          if (student) {
                            return (
                              <li key={i} className="mb-4">
                                <div className=" bg-[#ffffffee] p-4 rounded-2xl shadow-lg ">
                                  <div className=" flex items-center gap-5 justify-between px-5">
                                    <div>
                                      <p>
                                        <span className="font-semibold">
                                          Name:
                                        </span>{" "}
                                        {student.firstName} {student.lastName}
                                      </p>
                                      <div className="flex items-center gap-5 mt-1">
                                        <p>
                                          <span className="font-semibold">
                                            Branch:
                                          </span>{" "}
                                          {student.branch}
                                        </p>
                                        <p>
                                          <span className="font-semibold">
                                            Semester:
                                          </span>{" "}
                                          {student.semester}
                                        </p>
                                      </div>
                                    </div>
                                    <div className="mt-2">
                                      <input
                                        type="number"
                                        value={packageAmounts[studentId] || ""}
                                        onChange={(e) =>
                                          setPackageAmounts(
                                            (prevPackageAmounts) => ({
                                              ...prevPackageAmounts,
                                              [studentId]: e.target.value,
                                            })
                                          )
                                        }
                                        placeholder="Enter package"
                                        className="text-[rgb(22,22,59)] text-[15px] font-medium px-3 py-[5px] border border-[#4d7082] rounded-[12px] bg-[#ffffff] placeholder:text-[#4d7082] placeholder:text-[15px] placeholder:font-medium focus:outline-none focus:border-[2px] focus:border-[rgb(22,22,59)]"
                                      />
                                    </div>
                                  </div>
                                  <div className="mt-3 flex items-center justify-around">
                                    <button
                                      onClick={() =>
                                        handlePlacementAction(
                                          student.studentId,
                                          "Unplaced"
                                        )
                                      }
                                      className="flex items-center gap-[4px] px-3 pt-[1px] pb-[3px] pr-[13px] bg-[#668a9e] text-white text-[17px] font-medium rounded-[10px] hover:bg-[#4b6b7e]"
                                    >
                                      <HiArchiveBoxXMark /> Remove
                                    </button>
                                    <button
                                      onClick={() =>
                                        handlePlacement(
                                          student.studentId,
                                          "Placed",
                                          packageAmounts[studentId]
                                        )
                                      }
                                      className="flex items-center gap-[4px] px-3 pt-[1px] pb-[3px] pr-[13px] bg-[#668a9e] text-white text-[17px] font-medium rounded-[10px] hover:bg-[#4b6b7e]"
                                    >
                                      <IoCheckmarkDoneCircle /> Submit
                                    </button>
                                  </div>
                                </div>
                              </li>
                            );
                          } else {
                            return null;
                          }
                        })}
                    </ul>
                  </div>
                )}
              </div>
            )}

            {/* Feedback Section */}
            {showFeedbackSection && (
              <div className="mt-6 bg-[#ffffff38] p-4 rounded-[20px] shadow-md">
                <h3 className="text-xl font-semibold mb-4">Student Feedback</h3>

                {loading ? (
                  <div className="text-center mt-4">
                    <p>Loading...</p>
                  </div>
                ) : error ? (
                  <div className="text-center mt-4">
                    <p>Error: {error}</p>
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-4">
                    {Array.isArray(feedbacks) && feedbacks.length > 0 ? (
                      feedbacks?.map((feedback, i) => (
                        <div
                          key={i}
                          className="bg-[#ffffffa1] p-4 rounded-[20px] shadow-md w-full md:w-1/2 lg:w-1/3 xl:w-1/4 relative"
                        >
                          <div className="absolute top-4 right-4">
                            <button
                              className="text-gray-600 hover:text-gray-900"
                              onClick={() => {
                                const dropdown = document.getElementById(
                                  `dropdown-${i}`
                                );
                                dropdown.classList.toggle("hidden");
                              }}
                            >
                              <IoEllipsisVertical className="text-lg" />
                            </button>
                            <div
                              id={`dropdown-${i}`}
                              className="absolute top-8 right-4 bg-[#ffffffa1] p-3 rounded-[12px] shadow-md hidden space-y-0"
                            >
                              <button className="text-gray-600 hover:text-gray-900">
                                Share
                              </button>
                              <button
                                className="text-gray-600 hover:text-gray-900"
                                onClick={() => {
                                  if (
                                    window.confirm(
                                      "Are you sure you want to delete this feedback?"
                                    )
                                  ) {
                                    dispatch(deleteFeedback(feedback._id))
                                      .unwrap()
                                      .then(() => {
                                        toast.success(
                                          "Feedback deleted successfully!"
                                        );
                                      })
                                      .catch((error) => {
                                        toast.error(
                                          "Failed to delete feedback."
                                        );
                                      });
                                  }
                                }}
                              >
                                Delete
                              </button>
                            </div>
                          </div>
                          <div className="flex items-center gap-2 mb-2">
                            <img
                              src={feedback.studentId.profile.profilePic}
                              alt={feedback.studentId.profile.firstName}
                              className="w-8 h-8 rounded-full"
                            />
                            <div>
                              <p className="font-medium text-lg">
                                {feedback.studentId.profile.firstName}{" "}
                                {feedback.studentId.profile.lastName}
                              </p>
                              <p className="text-sm text-gray-600">
                                {feedback.studentId.profile.branch} -{" "}
                                {feedback.studentId.profile.semester}
                              </p>
                            </div>
                          </div>
                          <div className="bg-[#cdd9e16d] p-4 rounded-[12px] mb-4">
                            <p className="text-sm text-gray-600">
                              {feedback.message}
                            </p>
                          </div>
                          <div className="flex justify-between mb-4">
                            <div className="flex items-center gap-2">
                              <button className="text-gray-600 hover:text-gray-900">
                                <IoThumbsUpOutline className="text-lg" />
                              </button>
                              <p className="text-sm text-gray-600">
                                {feedback.likes.length}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <button className="text-gray-600 hover:text-gray-900">
                                <IoThumbsDownOutline className="text-lg" />
                              </button>
                              <p className="text-sm text-gray-600">
                                {feedback.dislikes.length}
                              </p>
                            </div>
                          </div>
                          <div className="bg-[#cdd9e16d] p-4 rounded-[12px]">
                            <p className="text-base font-medium mb-2">
                              Comments:
                            </p>
                            <div className="flex flex-col gap-2">
                              {feedback.comments.map((comment, j) => (
                                <div
                                  key={j}
                                  className="flex items-center gap-2"
                                >
                                  <img
                                    src={comment.studentId.profile.profilePic}
                                    alt={comment.studentId.profile.firstName}
                                    className="w-6 h-6 rounded-full"
                                  />
                                  <div>
                                    <p className="font-medium text-sm">
                                      {comment.studentId.profile.firstName}{" "}
                                      {comment.studentId.profile.lastName}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                      {comment.comment}
                                    </p>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-center">
                        <p>No feedbacks available.</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppliedPopup;
