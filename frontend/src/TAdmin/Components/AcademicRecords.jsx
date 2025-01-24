import React from "react";

const AcademicRecords = ({ academicRecords }) => {
  if (!academicRecords) return null;

  return (
    <div className="w-full">
      <h2 className="text-[22px] mb-2 font-semibold text-gray-700">Academic Records</h2>
      <div className="flex gap-5 mt-2 items-center h-[350px]">
        <div className="p-5 bg-[#ffffff38] backdrop-blur-sm shadow-md rounded-[20px] h-full w-[580px]">
          <h2 className="text-[20px] font-semibold mb-1 text-gray-700">Qualification's:</h2>
          <ul className="list-none m-0 pl-2">
            <li className="text-[16px] mb-2 flex items-center">
              <strong>Diploma College Name:</strong>
              <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                {academicRecords.diploma.collegeName || "NA"}
              </h6>
            </li>
            <li className="text-[16px] mb-2 flex items-center">
              <strong>Diploma Score's:</strong>
              <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                {academicRecords.diploma.percentage || "NA"}
              </h6>
            </li>
            <li className="text-[16px] mb-2 flex items-center">
              <strong>JEE Score's:</strong>
              <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                {academicRecords.jeeScore || "NA"}
              </h6>
            </li>
            <li className="text-[16px] mb-2 flex items-center">
              <strong>MHT-CET Score's:</strong>
              <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                {academicRecords.mhtCetScore || "NA"}
              </h6>
            </li>
            <li className="text-[16px] mb-2 flex items-center">
              <strong>12<sup>th</sup> High School Name:</strong>
              <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                {academicRecords.twelfth.schoolName || "NA"}
              </h6>
            </li>
            <li className="text-[16px] mb-2 flex items-center">
              <strong>12<sup>th</sup> Score's:</strong>
              <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                {academicRecords.twelfth.percentage || "NA"}
              </h6>
            </li>
            <li className="text-[16px] mb-2 flex items-center">
              <strong>10<sup>th</sup> School Name:</strong>
              <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                {academicRecords.tenth.schoolName || "NA"}
              </h6>
            </li>
            <li className="text-[16px] mb-2 flex items-center">
              <strong>10<sup>th</sup> Score's:</strong>
              <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                {academicRecords.tenth.percentage || "NA"}
              </h6>
            </li>
          </ul>
        </div>

        <div className="p-5 bg-[#ffffff38] backdrop-blur-sm shadow-md rounded-[20px] h-full min-w-[350px]">
          <ul className="list-none m-0 pl-2">
            <h2 className="text-[20px] font-semibold mb-1 text-gray-700">CGPA:</h2>
            {academicRecords.cgpa.map((record, index) => (
              record.semesters.map((sem, semIndex) => (
                <li key={`${index}-${semIndex}`} className="text-[16px] mb-2 flex items-center">
                  <strong>{sem.semester} Sem:</strong>
                  <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                    {sem.cgpa || "NA"}
                  </h6>
                </li>
              ))
            ))}

            <h2 className="text-[20px] mt-4 font-semibold mb-1 text-gray-700">Previous Backlogs:</h2>
            {academicRecords.backlogs.length > 0 ? (
              academicRecords.backlogs.map((backlog, index) => (
                <li key={index} className="text-[16px] mb-2 flex items-center">
                  <strong>{backlog.semester} Sem:</strong>
                  <h6 className="text-[16px] ml-2 px-3 border-b border-[rgba(33,86,105,0.758)] bg-gradient-to-b from-transparent via-transparent to-gray-300/25 rounded text-gray-800">
                    {backlog.count || 0} (Dead: {backlog.dead || 0})
                  </h6>
                </li>
              ))
            ) : (
              <li className="text-[16px] mb-2">No Backlogs</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AcademicRecords;