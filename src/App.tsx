import React, { useState, useEffect } from 'react';
import { loadData } from './services/DataService';
import { HealthRecord } from './types';
import { predictRisks, PredictionResult, buildPredictionModel } from './services/PredictionService';
import EnhancedRiskPredictionTool from './components/EnhancedRiskPredictionTool';
import Overview from './components/Overview';
import HealthOutcomes from './components/HealthOutcomes';
import Exposures from './components/Exposures';
import Protection from './components/Protection';
import Analytics from './components/Analytics';

function App() {
  const [activeTab, setActiveTab] = useState('overview');
  const [data, setData] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRiskFactors, setSelectedRiskFactors] = useState<string[]>([]);
  const [predictionResult, setPredictionResult] = useState<PredictionResult | null>(null);
  const [userProfile, setUserProfile] = useState({
    age: 40,
    yearsInAgriculture: 10,
    workHoursPerDay: 8,
    usesMask: false,
    usesGloves: false,
    usesProtectiveClothing: false
  });

  // Load data when component mounts
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const healthData = await loadData('sample');
        setData(healthData);
        
        // Initialize prediction model with data
        buildPredictionModel(healthData);
        
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Prepare text risk factors for Enhanced Tool
  const textRiskFactors = [
    {
      exposure: 'pesticides',
      healthIssue: 'troubles respiratoires',
      riskScore: 75,
      occurrenceCount: 42
    },
    {
      exposure: 'herbicides',
      healthIssue: 'problèmes cutanés',
      riskScore: 65,
      occurrenceCount: 35
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-gray-800">Agricultural Health Dashboard</h1>
        <p className="text-gray-600 text-sm">Analysis of health data from female farmers</p>
      </header>
      
      <main className="flex flex-1">
        {/* Sidebar */}
        <div className="w-64 bg-white shadow-lg">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Navigation</h2>
          </div>
          <nav className="p-4 space-y-2">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'health-outcomes', name: 'Health Outcomes', icon: '🏥' },
              { id: 'exposures', name: 'Exposures', icon: '⚗️' },
              { id: 'protection', name: 'Protection', icon: '🛡️' },
              { id: 'analytics', name: 'Analytics', icon: '📈' },
              { id: 'prediction', name: 'Risk Prediction', icon: '🔮' }
            ].map(tab => (
              <button
                key={tab.id}
                className={`w-full text-left px-3 py-2 rounded flex items-center ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white' 
                    : 'hover:bg-gray-100 text-gray-700'
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 overflow-auto">
          {activeTab === 'overview' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <Overview />
            </div>
          )}
          {activeTab === 'health-outcomes' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <HealthOutcomes />
            </div>
          )}
          {activeTab === 'exposures' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <Exposures />
            </div>
          )}
          {activeTab === 'protection' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <Protection />
            </div>
          )}
          {activeTab === 'analytics' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <Analytics />
            </div>
          )}
          {activeTab === 'prediction' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <EnhancedRiskPredictionTool 
                data={data}
                textRiskFactors={textRiskFactors}
              />
            </div>
          )}
        </div>
      </main>
      
      <footer className="bg-white p-4 shadow-inner text-center text-gray-600 text-sm">
        Agricultural Workers Health Study - Updated: April 2025
      </footer>
    </div>
  );
}

export default App;