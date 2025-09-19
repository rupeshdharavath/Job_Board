import React, { useEffect, useState } from 'react';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Avatar, AvatarImage } from '../ui/avatar';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { Edit2, Eye, MoreHorizontal } from 'lucide-react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

const AdminJobsTable = () => { 
  const { allAdminJobs, searchJobByText } = useSelector(store => store.job);
  const { companies } = useSelector(store => store.company);
  const { user } = useSelector(store => store.auth);  // 👈 Get the logged-in user
  console.log(companies)

  const [filterJobs, setFilterJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => { 
    if (!user || !companies) return;

    // 1. Find all companies owned by the current user
    const userCompanyIds = companies
      .filter(company => company.userId === user._id)
      .map(company => company._id);

    // 2. Filter jobs for only those companies
    const jobsOwnedByUser = allAdminJobs.filter(job => 
      userCompanyIds.includes(job.company._id)
    );

    // 3. Further filter by search text (if any)
    const finalFilteredJobs = jobsOwnedByUser.filter(job => {
      if (!searchJobByText) return true;
      const searchLower = searchJobByText.toLowerCase();
      return (
        job?.title?.toLowerCase().includes(searchLower) ||
        job?.company?.name?.toLowerCase().includes(searchLower)
      );
    });

    setFilterJobs(finalFilteredJobs);
  }, [allAdminJobs, searchJobByText, companies, user]);

  return (
    <div>
      <Table>
        <TableCaption>A list of your recent posted jobs</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead>Company Name</TableHead>
            <TableHead>Role</TableHead>
            <TableHead>Date</TableHead>
            <TableHead className="text-right">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filterJobs?.map((job, index) => (
            <TableRow key={index}>
              <TableCell>{job?.company?.name}</TableCell>
              <TableCell>{job?.title}</TableCell>
              <TableCell>{job?.createdAt?.split('T')[0]}</TableCell>
              <TableCell className="text-right cursor-pointer">
                <Popover>
                  <PopoverTrigger><MoreHorizontal /></PopoverTrigger>
                  <PopoverContent className="w-32">
                    <div onClick={() => navigate(`/admin/companies/${job.company._id}`)} className="flex items-center gap-2 w-fit cursor-pointer">
                      <Edit2 className="w-4" />
                      <span>Edit</span>
                    </div>
                    <div onClick={() => navigate(`/admin/jobs/${job._id}/applicants`)} className="flex items-center w-fit gap-2 cursor-pointer mt-2">
                      <Eye className="w-4" />
                      <span>Applicants</span>
                    </div>
                  </PopoverContent>
                </Popover>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default AdminJobsTable;
