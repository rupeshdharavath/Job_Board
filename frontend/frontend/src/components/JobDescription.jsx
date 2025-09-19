import React, { useEffect, useState } from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '../utils/costant';
import { setSingleJob } from '../redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
  const { singleJob } = useSelector((store) => store.job);
  const { user } = useSelector((store) => store.auth);
  const isIntiallyApplied =
    singleJob?.applications?.some((application) => application.applicant === user?._id) || false;
  const [isApplied, setIsApplied] = useState(isIntiallyApplied);

  const params = useParams();
  const jobId = params.id;
  const dispatch = useDispatch();

  const applyJobHandler = async () => {
    try {
      const res = await axios.get(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {
        withCredentials: true,
      });

      if (res.data.success) {
        setIsApplied(true);
        const updatedSingleJob = {
          ...singleJob,
          applications: [...singleJob.applications, { applicant: user?._id }],
        };
        dispatch(setSingleJob(updatedSingleJob));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response.data.message);
    }
  };

  useEffect(() => {
    const fetchSingleJob = async () => {
      try {
        const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
          withCredentials: true,
        });
        if (res.data.success) {
          dispatch(setSingleJob(res.data.job));
          setIsApplied(
            res.data.job.applications.some(
              (application) => application.applicant === user?._id
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    };
    fetchSingleJob();
  }, [jobId, dispatch, user?._id]);

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 bg-gradient-to-br from-[#fdfbff] to-[#f0eaff] rounded-2xl shadow-xl">
      <div className="flex items-start justify-between flex-wrap gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-[#3A0CA3] mb-4 tracking-tight">
            {singleJob?.title}
          </h1>
          <div className="flex flex-wrap gap-3">
            <Badge className="bg-blue-100 text-blue-700 text-sm px-3 py-1 rounded-full shadow-sm">
              {singleJob?.postion} Positions
            </Badge>
            <Badge className="bg-red-100 text-red-600 text-sm px-3 py-1 rounded-full shadow-sm">
              {singleJob?.jobType}
            </Badge>
            <Badge className="bg-purple-100 text-purple-700 text-sm px-3 py-1 rounded-full shadow-sm">
              ₹{singleJob?.salary} LPA
            </Badge>
          </div>
        </div>

        <Button
          onClick={isApplied ? null : applyJobHandler}
          disabled={isApplied}
          className={`rounded-full px-6 py-2 font-medium shadow-md transition-all duration-300 ${
            isApplied
              ? 'bg-gray-300 text-gray-700 cursor-not-allowed'
              : 'bg-gradient-to-r from-[#7209b7] to-[#f72585] hover:from-[#560bad] hover:to-[#b5179e] text-white'
          }`}
        >
          {isApplied ? '✅ Already Applied' : 'Apply Now'}
        </Button>
      </div>

      <div className="mt-10">
        <h2 className="text-2xl font-semibold text-[#3A0CA3] border-b pb-2 mb-6">
           Job Description
        </h2>
        <div className="space-y-5 text-gray-700 text-[17px] leading-relaxed">
          <p>
            <strong className="text-[#7209b7]">Role:</strong>{' '}
            <span className="ml-2">{singleJob?.title}</span>
          </p>
          <p>
            <strong className="text-[#7209b7]">Location:</strong>{' '}
            <span className="ml-2">{singleJob?.location}</span>
          </p>
          <p>
            <strong className="text-[#7209b7]">Description:</strong>{' '}
            <span className="ml-2">{singleJob?.description}</span>
          </p>
          <p>
            <strong className="text-[#7209b7]">Experience:</strong>{' '}
            <span className="ml-2">{singleJob?.experience} yrs</span>
          </p>
          <p>
            <strong className="text-[#7209b7]">Salary:</strong>{' '}
            <span className="ml-2">₹{singleJob?.salary} LPA</span>
          </p>
          <p>
            <strong className="text-[#7209b7]">Total Applicants:</strong>{' '}
            <span className="ml-2">{singleJob?.applications?.length}</span>
          </p>
          <p>
            <strong className="text-[#7209b7]">Posted Date:</strong>{' '}
            <span className="ml-2">
              {singleJob?.createdAt?.split('T')[0]}
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default JobDescription;
