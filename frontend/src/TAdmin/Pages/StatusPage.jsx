import { useDispatch, useSelector } from 'react-redux';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { TbProgressCheck } from "react-icons/tb";
import JobCard from '../Components/JobCard';
import Content from '../Components/Content';
import { getAllJobs } from '../../redux/jobSlice';
import Loading from '../../component/Loading';

const StatusPage = () => {
    const dispatch = useDispatch();
    const { jobs, loading, error } = useSelector((state) => state.jobs);
    const [activeForm, setActiveForm] = useState('job'); // Default to showing "job" posts

    useEffect(() => {
        dispatch(getAllJobs()); // Fetch all jobs on component mount
    }, [dispatch]);

    useEffect(() => {
        if (error) {
            toast.error(error); // Display error notifications if an error occurs
        }
    }, [error]);

    const sortedJobs = jobs
    ? [...jobs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    : [];

    return (
        <div className="relative flex flex-col flex-1 bg-[#A3B5C0] min-h-screen rounded-l-[35px]">
            <div className="sticky flex items-center">
                <h1 className="text-[28px] font-bold p-2 mt-5 mb-3 ml-7 text-[rgb(22,22,59)]">
                    Post's Status
                </h1>
            </div>
            <Content/>
            <div className="flex flex-col items-center w-full">
                {/* Buttons to switch between Job and Internship posts */}
                <div className="flex items-center justify-evenly w-[92%] mb-5 mx-[40px]">
                    <button
                        className={`flex items-center gap-2 px-4 py-3 rounded-md overflow-hidden cursor-pointer h-[30px] border-b-2 ${
                            activeForm === 'job' ? 'border-[#16163B]' : 'border-transparent'
                        } hover:bg-[#5081A7]/40`}
                        onClick={() => setActiveForm('job')}
                    >
                        <TbProgressCheck className="text-[22px] text-[#16163B] font-extrabold" />
                        <h2 className="text-[20px] font-semibold text-[#16163B]">
                            Posted Job's
                        </h2>
                    </button>
                    <span className="h-[30px] w-[2px] rounded-full bg-[#215669]/75"></span>
                    <button
                        className={`flex items-center gap-2 px-4 py-3 rounded-md overflow-hidden cursor-pointer h-[30px] border-b-2 ${
                            activeForm === 'internship' ? 'border-[#16163B]' : 'border-transparent'
                        } hover:bg-[#5081A7]/40`}
                        onClick={() => setActiveForm('internship')}
                    >
                        <TbProgressCheck className="text-[22px] text-[#16163B] font-extrabold" />
                        <h2 className="text-[18px] font-semibold text-[#16163B] font-raleway">
                            Posted Internship's
                        </h2>
                    </button>
                </div>

                {/* Display filtered job cards based on activeForm */}
                {loading ? (
                    <p className="text-center text-lg text-gray-600"><Loading/></p>
                ) : (
                    <div className="w-full">
                        {sortedJobs.length > 0 ? (
                            sortedJobs
                                .filter((job) => job.type.toLowerCase() === activeForm)
                                .map((job) => <JobCard key={job._id} job={job} />)
                        ) : (
                            <p className="text-center text-lg text-gray-600">
                                No {activeForm === 'job' ? 'jobs' : 'internships'} available.
                            </p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatusPage;
