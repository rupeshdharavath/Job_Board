import React from 'react';
import { Label } from './ui/label';
import { RadioGroup, RadioGroupItem } from './ui/radio-group';

const filterData = [
  {
    filterType: 'Location',
    options: ['Delhi', 'Bangalore', 'Hyderabad', 'Pune', 'Mumbai'],
  },
  {
    filterType: 'Industry',
    options: [
      'Frontend Developer',
      'Backend Developer',
      'Full Stack Developer',
      'Mobile App Developer',
      'Game Developer',
      'DevOps Engineer',
      'Security Analyst',
      'Machine Engineer',
      'Cloud Engineer',
      'Product Manager',
    ],
  },
  {
    filterType: 'Salary',
    options: ['0-30', '31-50', '51-60'], // interpreted as LPA ranges
  },
];

const FilterCard = ({ selectedFilters, onFilterChange }) => {
  return (
    <div className="bg-white p-3 rounded-md">
      <h1 className="font-bold text-lg">Filter Jobs</h1>
      <hr className="my-3" />

      <RadioGroup>
        {filterData.map(({ filterType, options }) => (
          <div key={filterType} className="mb-4">
            <h2 className="font-semibold">{filterType}</h2>
            {options.map((opt) => (
              <label
                key={opt}
                className="flex items-center space-x-2 my-1 cursor-pointer"
              >
                <input
                  type="radio"
                  name={filterType}
                  value={opt}
                  checked={selectedFilters[filterType] === opt}
                  onChange={() => onFilterChange(filterType, opt)}
                  onClick={() => {
                    /* clicking the already-checked radio will clear it */
                    if (selectedFilters[filterType] === opt) {
                      onFilterChange(filterType, opt);
                    }
                  }}
                  className="form-radio"
                />
                <Label>{opt}</Label>
              </label>
            ))}
          </div>
        ))}
      </RadioGroup>
    </div>
  );
};

export default FilterCard;
/*
Define Filters
Users Selects a Filter
Update Job List
(e.g: GET /api/jobs?location=Hyderabad&industry=Frontend%20Developer&salary=31-50)
*/
