import React from 'react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'health-outcomes', label: 'Health Outcomes', icon: '🏥' },
    { id: 'exposures', label: 'Exposures', icon: '⚕️' },
    { id: 'protection', label: 'Protection', icon: '🛡️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'ai-prediction', label: 'AI Prediction', icon: '🤖' }
  ];

  return (
    <div className="w-64 bg-white shadow-lg h-full">
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-8">AgriHealth Dashboard</h1>
        <nav>
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full text-left p-3 mb-2 rounded flex items-center ${
                activeTab === item.id ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'
              }`}
            >
              <span className="mr-3">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;