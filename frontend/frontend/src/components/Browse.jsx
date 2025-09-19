import React from 'react'
import Navbar from './shared/Navbar'
import Job from './Job';
import Jobs from './jobs';
import { useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';

const Browse = () => {
  const { allJobs, searchedQuery } = useSelector((s) => s.job);
  return (
    <div>
    <Navbar/>
    <div className='max-w-7xl mx-auto my-10 '>
    <h1 className='font-bold text-center text-3xl'>All Jobs</h1>
    <main className="flex-1 h-[88vh] overflow-y-auto pb-5">
          {allJobs.length === 0 ? (
            <p className="text-gray-500">No jobs found.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <AnimatePresence>
                {allJobs.map((job) => (
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
    </div>
  )
}

export default Browse
/*
step 1: Backend -> API Call   (GET/api/jobs)
step 2: Redux ->Store Jobs   Your Redux actions fectAllJobs calls the API and saves responnse in it
step 3: Frontend->Dispaly JObs 
*/

