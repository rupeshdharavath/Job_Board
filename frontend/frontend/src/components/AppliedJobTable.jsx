import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from './ui/table';
import { Badge } from './ui/badge';
import { useSelector } from 'react-redux';

const AppliedJobTable = () => {
  const { allAppliedJobs } = useSelector(store => store.job);
  console.log(allAppliedJobs);

  const getStatusColor = (status) => {
    switch (status) {
      case 'rejected':
        return 'bg-red-400';
      case 'pending':
        return 'bg-yellow-400';
      case 'accepted':
        return 'bg-green-500';
      default:
        return 'bg-gray-300';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 mt-10 bg-white rounded-xl shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-800">Applied Jobs (with Student Info)</h2>
      <Table>
        <TableCaption>A list of all job applications and who applied.</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Date</TableHead>
            <TableHead>Job Role</TableHead>
            <TableHead>Company</TableHead>
            <TableHead className="text-right">Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allAppliedJobs && allAppliedJobs.length > 0 ? (
            allAppliedJobs.map((appliedJob) => (
              <TableRow key={appliedJob._id}>
                <TableCell>{appliedJob?.job?.createdAt?.split('T')[0]}</TableCell>
                <TableCell>{appliedJob?.job?.title || 'N/A'}</TableCell>
                <TableCell>{appliedJob?.job?.company?.name || 'N/A'}</TableCell>
                <TableCell className="text-right">
                  <Badge className={getStatusColor(appliedJob.status)}>
                    {appliedJob.status?.toUpperCase() || 'UNKNOWN'}
                  </Badge>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={6} className="text-center text-gray-500 py-4">
                No job applications found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default AppliedJobTable;

/*📊 End-to-End Flow Summary

Backend API → /api/applications/applied returns applied jobs with job + company.

Redux async thunk (fetchAppliedJobs) → calls backend → stores data in state.job.allAppliedJobs.

Page (AppliedJobsPage.jsx) → dispatches fetchAppliedJobs() on mount.

Component (AppliedJobTable.jsx) → useSelector grabs allAppliedJobs from Redux → maps → renders the table.

👉 Final result = Table showing applied jobs with Date, Role, Company, and Status.*/