import React from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from '@radix-ui/react-avatar';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

// Reusable Badge component
const Badge = ({ children, className = '' }) => (
  <span className={`px-3 py-1 bg-gray-100 rounded-full text-sm ${className}`}>
    {children}
  </span>
);

const Job = ({ job }) => {
  const navigate = useNavigate();

  // Calculates how many days ago the job was posted
  const daysAgoFunction = (mongodbTime) => {
    const createdAt = new Date(mongodbTime);
    const currentTime = new Date();
    const timeDifference = currentTime - createdAt;
    return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  };

  const daysAgo = daysAgoFunction(job?.createdAt);

  return (
    <div className="border w-full h-full rounded-xl p-4 flex flex-col gap-4 shadow-md bg-white">
      {/* Top Bar */}
      <div className="flex justify-between items-center text-sm text-gray-500">
        <p>{daysAgo === 0 ? 'Today' : `${daysAgo} days ago`}</p>
        <Button variant="outline" className="rounded-full" size="icon">
          <Bookmark onClick={()=>toast.success("Job Saved Successfully!!")}/>
        </Button>
      </div>

      {/* Company Info */}
      <div className="flex items-center gap-3">
        <Avatar className="w-12 h-12 rounded-full overflow-hidden">
          <AvatarImage
            className="w-full h-full object-cover"
            src={job?.company?.logo || 'https://via.placeholder.com/150'}
            alt="Company Logo"
          />
        </Avatar>
        <div>
          <h2 className="text-lg font-semibold line-clamp-1">{job?.company?.name || 'Unknown Company'}</h2>
          <p className="text-sm text-gray-600">Tech Company</p>
          <p className="text-sm text-gray-500">{job?.location || 'Location not specified'}</p>
        </div>
      </div>

      {/* Job Description */}
      <div>
        <h1 className="font-bold text-lg my-2 line-clamp-1">{job?.title || 'Job Title'}</h1>
        <p className="text-sm text-gray-600 line-clamp-1">{job?.description || 'No description provided.'}</p>
      </div>

      {/* Tags */}
      <div className="flex items-center gap-2 mt-4 flex-wrap">
        <Badge className="text-blue-700 font-bold bg-blue-100">
          {job?.position || 'N/A'} Position
        </Badge>
        <Badge className="text-[#F83002] font-bold bg-red-100">
          {job?.jobType || 'Full-Time'}
        </Badge>
        <Badge className="text-[#7209b7] font-bold bg-purple-100">
          {job?.salary || '0'} LPA
        </Badge>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-4">
        <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className="w-full bg-[#7209b7] text-white">
          Details
        </Button>
      </div>
    </div>
  );
};

export default Job;
