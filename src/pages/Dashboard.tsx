import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="container mx-auto px-4 py-6">
          <FilterBar />
          
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Agricultural Health Dashboard</h2>
            <p>Welcome to the female farmers health data analysis dashboard.</p>
            <p className="mt-2">Active tab: {activeTab}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="border p-3 rounded bg-blue-50">
                <h3 className="font-bold">Health Issues</h3>
                <p className="text-sm">Analysis of cardio-respiratory, neurological, cognitive, and skin issues.</p>
              </div>
              <div className="border p-3 rounded bg-green-50">
                <h3 className="font-bold">Exposures</h3>
                <p className="text-sm">Analysis of chemical and biological product exposures.</p>
              </div>
              <div className="border p-3 rounded bg-yellow-50">
                <h3 className="font-bold">Protection</h3>
                <p className="text-sm">Analysis of protective equipment usage.</p>
              </div>
              <div className="border p-3 rounded bg-purple-50">
                <h3 className="font-bold">AI Prediction</h3>
                <p className="text-sm">Risk prediction tool based on text analysis.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;