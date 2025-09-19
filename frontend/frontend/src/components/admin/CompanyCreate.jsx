import React, { useState } from 'react';
import Navbar from '../shared/Navbar';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { COMPANY_API_END_POINT } from '../../utils/costant';
import { toast } from 'sonner';
import { useDispatch, useSelector } from 'react-redux';
import { setSingleCompany } from '../../redux/companySlice';

const CompanyCreate = () => {
    const navigate = useNavigate();
    const [companyName, setCompanyName] = useState('');
    const dispatch = useDispatch();

    const jobs = useSelector((state) => state.job.allJobs);

    const registerNewCompany = async () => {
        if (!companyName.trim()) {
            toast.error("Company name cannot be empty.");
            return;
        }

        try {
            const res = await axios.post(
                `${COMPANY_API_END_POINT}/register`,
                { companyName },
                {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    withCredentials: true
                }
            );

            if (res?.data?.success) {
                dispatch(setSingleCompany(res.data.company));
                toast.success(res.data.message);
                const companyId = res?.data?.company?._id;
                navigate(`/admin/companies/${companyId}`);
            } else {
                toast.error(res?.data?.message || "Something went wrong.");
            }
        } catch (error) {
            console.error(error);
            toast.error(error?.response?.data?.message || "Failed to create company.");
        }
    };

    return (
        <div>
            <Navbar />
            <div className="max-w-4xl mx-auto">
                <div className="my-10">
                    <h1 className="font-bold text-2xl">Your Company Name</h1>
                    <div className="text-gray-500 max-h-32 overflow-y-auto scrollbar-thin scrollbar-thumb-rounded scrollbar-thumb-gray-400">
                        What would you like to give your company name? You can change this later. 
                        <br />
                        Please ensure that the name accurately reflects your business and meets any legal requirements in your jurisdiction.
                    </div>
                </div>

                <Label>Company Name</Label>
                <Input
                    type="text"
                    className="my-2"
                    placeholder="JobHunt, Microsoft etc."
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                />
                <div className="flex items-center gap-2 my-10">
                    <Button variant="outline" onClick={() => navigate("/admin/companies")}>
                        Cancel
                    </Button>
                    <Button onClick={registerNewCompany}>
                        Continue
                    </Button>
                </div>

                {/* Displaying Jobs in Compact Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {jobs.map((job) => (
                        <div
                            key={job.id}
                            className="bg-gray-100 p-3 rounded-md shadow-sm text-sm flex flex-col justify-between items-start h-40 w-40"
                        >
                            <h2 className="font-bold truncate">{job.title}</h2>
                            <p className="text-gray-500 truncate">{job.location}</p>
                            <p className="text-gray-500 truncate">{job.salaryRange}</p>
                            <Button className="mt-2 text-xs w-full">View Details</Button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default CompanyCreate;
