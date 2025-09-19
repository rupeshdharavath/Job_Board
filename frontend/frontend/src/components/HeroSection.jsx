import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import './auth/style.css';

const HeroSection = () => {
  const [searchText, setSearchText] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    if (searchText.trim()) {
      navigate(`/browse?query=${encodeURIComponent(searchText.trim())}`);
    }
  };

  return (
    <div className="text-center">
      <div className="flex flex-col gap-5 my-10">
        <h1 className="text-5xl font-bold">
          Search, Apply & <br />
          Get Your <span className="text-[#6A38C2]">Dream Jobs</span>
        </h1>

        {/* Scrolling marquee */}
        <div className="relative w-full bg-gradient-to-br from-indigo-100 via-sky-100 to-rose-100 py-6 shadow-md">
          <div className="max-w-7xl mx-auto px-4">
            <div className="relative overflow-hidden h-16 flex items-center">
              <div className="animate-marquee whitespace-nowrap bg-white/80 px-4 py-2 rounded-md shadow-md">
                <p className="text-xl md:text-2xl font-medium text-gray-800 font-sans">
                  Discover your dream job — Connect with top companies across all
                  industries on our smart, easy-to-use platform.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search bar */}
        <div className="flex w-[40%] shadow-lg border border-gray-200 pl-3 rounded-full items-center gap-4 mx-auto">
          <input
            type="text"
            placeholder="Find Your dream jobs"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="outline-none border-none w-full"
          />
          <Button onClick={handleSearch} className="rounded-r-full bg-[#6A38C2]">
            <Search className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
/*
⚡ Final result: The HeroSection search bar triggers a navigation → Browse.jsx reads the query → filters jobs accordingly → shows matching job cards.
*/ 