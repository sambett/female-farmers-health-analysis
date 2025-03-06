import { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';
import DashboardContent from '../components/DashboardContent';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 p-8 overflow-auto">
        <FilterBar />
        <DashboardContent activeTab={activeTab} />
      </div>
    </div>
  );
};

export default Dashboard;