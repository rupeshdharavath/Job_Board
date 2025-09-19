import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import Job from './Job';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((s) => s.job);
  const [filteredJobs, setFilteredJobs] = useState(allJobs);
  const [filters, setFilters] = useState({
    Location: null,
    Industry: null,
    Salary: null,
  });

  // Recompute whenever jobs, search text, or any filter changes
  useEffect(() => {
    let jobs = [...allJobs];

    // 1) text search
    if (searchedQuery) {
      const q = searchedQuery.toLowerCase();
      jobs = jobs.filter(
        ({ title, description, location }) =>
          title.toLowerCase().includes(q) ||
          description.toLowerCase().includes(q) ||
          location.toLowerCase().includes(q)
      );
    }

    // 2) location
    if (filters.Location) {
      jobs = jobs.filter((j) => j.location === filters.Location);
    }

    // 3) industry (we assume job.title carries the role text)
    if (filters.Industry) {
      const term = filters.Industry.toLowerCase();
      jobs = jobs.filter((j) =>
        j.title.toLowerCase().includes(term)
      );
    }

    // 4) salary (e.g. "0-30" means 0 ≤ salary ≤ 30 LPA)
    if (filters.Salary) {
      const [min, max] = filters.Salary.split('-').map(Number);
      jobs = jobs.filter((j) => {
        const sal = Number(j.salary); // or parseInt if it’s a string
        return sal >= min && sal <= max;
      });
    }

    setFilteredJobs(jobs);
  }, [allJobs, searchedQuery, filters]);

  const onFilterChange = (filterType, value) => {
    setFilters((f) => ({
      ...f,
      [filterType]: f[filterType] === value ? null : value, // toggle same click → clear
    }));
  };

  return (
    <>
      <Navbar />
      <div className="max-w-7xl mx-auto mt-5 flex gap-5">
        {/* Sidebar */}
        <aside className="w-1/5">
          <FilterCard
            selectedFilters={filters}
            onFilterChange={onFilterChange}
          />
        </aside>

        {/* Job Grid */}
        <main className="flex-1 h-[88vh] overflow-y-auto pb-5">
          {filteredJobs.length === 0 ? (
            <p className="text-gray-500">No jobs found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {filteredJobs.map((job) => (
                  <motion.div
                    key={job._id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3 }}
                    className="
                      w-full
                      min-h-[450px]
                      bg-white
                      p-3
                      rounded-md
                      shadow-sm
                      flex
                    "
                  >
                    <Job job={job} />
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          )}
        </main>
      </div>
    </>
  );
};

export default Jobs;
