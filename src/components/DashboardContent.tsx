import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { healthData } from '../data/sampleData';
import RiskPredictionTool from './RiskPredictionTool';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab }) => {
  switch (activeTab) {
    case 'overview':
      return (
        <div className="p-6 bg-white rounded-lg shadow-md animate-fade-in">
          <h2 className="text-2xl font-bold text-slate mb-6">Study Overview</h2>
          <div className="h-64">
            <ResponsiveContainer>
              <BarChart data={healthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#FF6F61" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      );
    case 'ai-prediction':
      return <RiskPredictionTool />;
    default:
      return <div className="p-6 text-slate">Select a section</div>;
  }
};

export default DashboardContent;