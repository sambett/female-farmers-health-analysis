import React from 'react';

interface SidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, onTabChange }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: '📊' },
    { id: 'health-outcomes', label: 'Health Outcomes', icon: '🏥' },
    { id: 'exposures', label: 'Exposures', icon: '⚕️' },
    { id: 'protection', label: 'Protection', icon: '🛡️' },
    { id: 'analytics', label: 'Analytics', icon: '📈' },
    { id: 'ai-prediction', label: 'AI Prediction', icon: '🤖' }
  ];

  return (
    <div className="h-full bg-white shadow-lg">
      <div className="flex flex-col h-full">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-gray-800">AgriHealth Dashboard</h1>
        </div>
        
        <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors ${
                activeTab === item.id
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              }`}
            >
              <span className="mr-3 text-lg">{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t">
          <div className="text-sm text-gray-600">
            <p>Agricultural Workers Study</p>
            <p className="mt-1">Updated: April 2025</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;