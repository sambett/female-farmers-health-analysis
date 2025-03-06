import { Calendar, Activity, Droplets, Shield, BarChart2, Brain } from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Calendar },
    { id: 'health', label: 'Health Outcomes', icon: Activity },
    { id: 'exposure', label: 'Exposures', icon: Droplets },
    { id: 'protection', label: 'Protection', icon: Shield },
    { id: 'analytics', label: 'Analytics', icon: BarChart2 },
    { id: 'ai-prediction', label: 'AI Prediction', icon: Brain },
  ];

  return (
    <div className="w-64 bg-slate text-white p-4 flex flex-col h-screen">
      <div className="text-center mb-8">
        <h1 className="text-xl font-bold tracking-tight" style={{ textShadow: '0 0 5px rgba(43, 106, 110, 0.5)' }}>
          AgriHealth Dashboard
        </h1>
      </div>
      <nav className="flex-1">
        <ul>
          {tabs.map(({ id, label, icon: Icon }) => (
            <li
              key={id}
              className={`mb-2 rounded-lg ${activeTab === id ? 'bg-teal animate-pulse-slow' : 'hover:bg-teal/80'} transition-colors`}
            >
              <button
                onClick={() => setActiveTab(id)}
                className="flex items-center p-3 w-full text-left text-sm font-medium"
              >
                <Icon size={18} className="mr-3" />
                {label}
              </button>
            </li>
          ))}
        </ul>
      </nav>
      <div className="text-xs text-lightSlate pt-4 border-t border-lightSlate/20">
        <p>Agricultural Workers Study</p>
        <p>Updated: March 2025</p>
      </div>
    </div>
  );
};

export default Sidebar;