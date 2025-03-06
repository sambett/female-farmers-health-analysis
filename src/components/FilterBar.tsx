import React from 'react';

const FilterBar: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow mb-6">
      <div className="grid grid-cols-3 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Age Range
          </label>
          <select className="w-full border rounded-md p-2">
            <option value="">All</option>
            <option value="18-30">18-30</option>
            <option value="31-50">31-50</option>
            <option value="51+">51+</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Employment Status
          </label>
          <select className="w-full border rounded-md p-2">
            <option value="">All</option>
            <option value="full-time">Full Time</option>
            <option value="seasonal">Seasonal</option>
            <option value="contract">Contract</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Socioeconomic Status
          </label>
          <select className="w-full border rounded-md p-2">
            <option value="">All</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
      </div>
      
      <div className="mt-4">
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Apply Filters
        </button>
      </div>
      
      <div className="mt-4 text-sm text-gray-600">
        Agricultural Workers Study
        <br />
        Updated: March 2025
      </div>
    </div>
  );
};

export default FilterBar;