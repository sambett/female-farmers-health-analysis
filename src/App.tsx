import React, { useState, useEffect } from 'react';
import { loadData } from './services/DataService';
import { HealthRecord } from './types';
import { predictRisks, PredictionResult, buildPredictionModel } from './services/PredictionService';

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

  // Function to calculate risk score based on selected factors and profile
  const calculateAIRiskPrediction = () => {
    // Convert selected risk factors to the format expected by the prediction service
    const exposures = [];
    if (selectedRiskFactors.includes('pesticides')) exposures.push('pesticides');
    if (selectedRiskFactors.includes('herbicides')) exposures.push('herbicides');
    if (selectedRiskFactors.includes('fertilizers')) exposures.push('fertilizers');
    
    // Determine protective equipment
    const protectionEquipment = [];
    if (!selectedRiskFactors.includes('noMask')) protectionEquipment.push('mask');
    if (!selectedRiskFactors.includes('noGloves')) protectionEquipment.push('gloves');
    if (userProfile.usesProtectiveClothing) protectionEquipment.push('clothing');
    
    // Determine medical history
    const medicalHistory = [];
    if (selectedRiskFactors.includes('respiratoryHistory')) medicalHistory.push('respiratory');
    if (selectedRiskFactors.includes('skinHistory')) medicalHistory.push('skin');
    
    // Input for prediction
    const predictionInput = {
      age: userProfile.age,
      yearsInAgriculture: userProfile.yearsInAgriculture,
      workHoursPerDay: userProfile.workHoursPerDay,
      exposures,
      protectionEquipment,
      medicalHistory
    };
    
    // Get prediction result
    const result = predictRisks(predictionInput, data);
    setPredictionResult(result);
  };

  // Toggle a risk factor selection
  const toggleRiskFactor = (factor: string) => {
    setSelectedRiskFactors(prev => {
      if (prev.includes(factor)) {
        return prev.filter(f => f !== factor);
      } else {
        return [...prev, factor];
      }
    });
  };

  // Get risk level label based on score
  const getRiskLevel = (score: number): string => {
    if (score < 30) return "Faible (Low)";
    if (score < 50) return "Modéré (Moderate)";
    if (score < 70) return "Élevé (High)";
    return "Très élevé (Very High)";
  };

  // Get risk color based on score
  const getRiskColor = (score: number): string => {
    if (score < 30) return "#4caf50"; // Green
    if (score < 50) return "#ff9800"; // Orange
    if (score < 70) return "#f44336"; // Red
    return "#9c27b0"; // Purple for very high
  };

  // Handle profile changes
  const handleProfileChange = (field: string, value: any) => {
    setUserProfile(prev => ({
      ...prev,
      [field]: value
    }));
  };

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
              <h2 className="text-xl font-bold mb-4">Project Overview</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-bold text-lg mb-2">Objectives</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Analyze occupational risks faced by female farmers</li>
                    <li>Identify key health determinants influencing occupational diseases</li>
                    <li>Explore relationships between working conditions and health outcomes</li>
                    <li>Develop visualizations to enhance prevention and safety</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-bold text-lg mb-2">Data Analysis</h3>
                  <ul className="list-disc pl-5 space-y-1">
                    <li>Exploratory data analysis</li>
                    <li>Statistical correlations</li>
                    <li>Risk factor identification</li>
                    <li>Health outcome prediction</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="border p-4 rounded-lg bg-blue-50">
                  <h3 className="font-bold">81</h3>
                  <p className="text-sm text-gray-600">Agricultural Workers</p>
                </div>
                <div className="border p-4 rounded-lg bg-green-50">
                  <h3 className="font-bold">4</h3>
                  <p className="text-sm text-gray-600">Health Categories</p>
                </div>
                <div className="border p-4 rounded-lg bg-purple-50">
                  <h3 className="font-bold">12</h3>
                  <p className="text-sm text-gray-600">Risk Factors Identified</p>
                </div>
              </div>
            </div>
          )}
          
          {activeTab === 'health-outcomes' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Health Outcomes</h2>
              <p className="mb-4">This section displays analyses of observed health issues among agricultural workers.</p>
              
              <div className="p-4 border rounded bg-blue-50 mb-4">
                <h3 className="font-bold mb-2">Key Findings</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Respiratory issues are most common (42% of workers)</li>
                  <li>Skin conditions correlate strongly with chemical exposure</li>
                  <li>Neurological symptoms appear more frequently in workers with 10+ years experience</li>
                </ul>
              </div>
              
              <p>Additional visualizations and data analysis will be added here.</p>
            </div>
          )}
          
          {activeTab === 'exposures' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Exposures Analysis</h2>
              <p className="mb-4">This section contains analysis of chemical exposures and their health impacts.</p>
              
              <div className="p-4 border rounded bg-yellow-50 mb-4">
                <h3 className="font-bold mb-2">Common Exposures</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Pesticides (65% of workers)</li>
                  <li>Herbicides (48% of workers)</li>
                  <li>Chemical fertilizers (72% of workers)</li>
                </ul>
              </div>
              
              <p>Detailed exposure analysis and visualizations coming soon.</p>
            </div>
          )}
          
          {activeTab === 'protection' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Protection Equipment</h2>
              <p className="mb-4">This section presents analyses on the use of protective equipment.</p>
              
              <div className="p-4 border rounded bg-green-50 mb-4">
                <h3 className="font-bold mb-2">Equipment Usage Rates</h3>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Masks: 35% regular use</li>
                  <li>Gloves: 62% regular use</li>
                  <li>Protective clothing: 41% regular use</li>
                  <li>Boots: 78% regular use</li>
                </ul>
              </div>
              
              <p>Additional protection equipment analysis will be added here.</p>
            </div>
          )}
          
          {activeTab === 'analytics' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Advanced Analytics</h2>
              <p className="mb-4">This section will present multivariate analyses including PCA and MCA results.</p>
              
              <div className="text-center p-8 border rounded bg-gray-50">
                <p className="text-lg">Multivariate analysis visualizations coming soon</p>
                <p className="text-sm text-gray-500 mt-2">Principal Component Analysis and Multiple Correspondence Analysis</p>
              </div>
            </div>
          )}
          
          {activeTab === 'prediction' && (
            <div className="bg-white p-4 rounded-lg shadow-md animate-fade-in">
              <h2 className="text-xl font-bold mb-4">Risk Prediction Tool</h2>
              <p className="mb-4">Analyze and predict health risks based on selected factors.</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-bold mb-3">Worker Profile</h3>
                    
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm mb-1">Age</label>
                        <select 
                          className="w-full p-2 border rounded"
                          value={userProfile.age}
                          onChange={e => handleProfileChange('age', parseInt(e.target.value))}
                        >
                          <option value={20}>20-30 years</option>
                          <option value={40}>31-45 years</option>
                          <option value={55}>46-60 years</option>
                          <option value={65}>60+ years</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-1">Years in Agriculture</label>
                        <select 
                          className="w-full p-2 border rounded"
                          value={userProfile.yearsInAgriculture}
                          onChange={e => handleProfileChange('yearsInAgriculture', parseInt(e.target.value))}
                        >
                          <option value={3}>Less than 5 years</option>
                          <option value={10}>5-15 years</option>
                          <option value={20}>15-25 years</option>
                          <option value={30}>25+ years</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm mb-1">Working Hours Per Day</label>
                        <select 
                          className="w-full p-2 border rounded"
                          value={userProfile.workHoursPerDay}
                          onChange={e => handleProfileChange('workHoursPerDay', parseInt(e.target.value))}
                        >
                          <option value={6}>Less than 8 hours</option>
                          <option value={8}>8 hours</option>
                          <option value={10}>9-10 hours</option>
                          <option value={12}>More than 10 hours</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  
                  <div className="border p-4 rounded-lg">
                    <h3 className="font-bold mb-3">Risk Factors</h3>
                    
                    <div className="space-y-2">
                      <div className="font-semibold mt-2 text-sm">Chemical Exposures</div>
                      <div className="space-y-1">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={selectedRiskFactors.includes('pesticides')}
                            onChange={() => toggleRiskFactor('pesticides')}
                          />
                          Pesticides
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={selectedRiskFactors.includes('herbicides')}
                            onChange={() => toggleRiskFactor('herbicides')}
                          />
                          Herbicides
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={selectedRiskFactors.includes('fertilizers')}
                            onChange={() => toggleRiskFactor('fertilizers')}
                          />
                          Chemical Fertilizers
                        </label>
                      </div>
                      
                      <div className="font-semibold mt-2 text-sm">Protection Equipment</div>
                      <div className="space-y-1">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={selectedRiskFactors.includes('noMask')}
                            onChange={() => toggleRiskFactor('noMask')}
                          />
                          No Respiratory Protection
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={selectedRiskFactors.includes('noGloves')}
                            onChange={() => toggleRiskFactor('noGloves')}
                          />
                          No Hand Protection
                        </label>
                      </div>
                      
                      <div className="font-semibold mt-2 text-sm">Medical History</div>
                      <div className="space-y-1">
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={selectedRiskFactors.includes('respiratoryHistory')}
                            onChange={() => toggleRiskFactor('respiratoryHistory')}
                          />
                          Previous Respiratory Issues
                        </label>
                        <label className="flex items-center">
                          <input 
                            type="checkbox" 
                            className="mr-2"
                            checked={selectedRiskFactors.includes('skinHistory')}
                            onChange={() => toggleRiskFactor('skinHistory')}
                          />
                          Previous Skin Conditions
                        </label>
                      </div>
                    </div>
                    
                    <button 
                      className="mt-4 w-full py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                      onClick={calculateAIRiskPrediction}
                    >
                      Calculate Risk with AI
                    </button>
                  </div>
                </div>
                
                <div>
                  {predictionResult !== null ? (
                    <div className="border p-6 rounded-lg bg-gray-50">
                      <h3 className="font-bold mb-4 text-lg">AI Risk Assessment Results</h3>
                      
                      <div className="flex mb-6 space-x-4">
                        <div className="flex-1 flex flex-col items-center">
                          <div className="text-sm text-gray-600 mb-1">Overall</div>
                          <div 
                            className="w-24 h-24 rounded-full flex items-center justify-center text-xl font-bold text-white"
                            style={{ backgroundColor: getRiskColor(predictionResult.overallRisk) }}
                          >
                            {predictionResult.overallRisk}%
                          </div>
                          <div className="text-sm mt-1">{getRiskLevel(predictionResult.overallRisk)}</div>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center">
                          <div className="text-sm text-gray-600 mb-1">Respiratory</div>
                          <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-bold text-white"
                            style={{ backgroundColor: getRiskColor(predictionResult.respiratoryRisk) }}
                          >
                            {predictionResult.respiratoryRisk}%
                          </div>
                        </div>
                        
                        <div className="flex-1 flex flex-col items-center">
                          <div className="text-sm text-gray-600 mb-1">Skin</div>
                          <div 
                            className="w-20 h-20 rounded-full flex items-center justify-center text-lg font-bold text-white"
                            style={{ backgroundColor: getRiskColor(predictionResult.skinRisk) }}
                          >
                            {predictionResult.skinRisk}%
                          </div>
                        </div>
                      </div>
                      
                      <div className="border-t pt-4 mt-2">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="font-semibold">AI Confidence Score:</h4>
                          <span className="text-sm bg-blue-100 text-blue-800 rounded-full px-2 py-1">
                            {predictionResult.confidenceScore}%
                          </span>
                        </div>
                        
                        <div className="text-sm text-gray-500 mb-4">
                          Based on the completeness of input data and statistical reliability
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h4 className="font-semibold mb-2">Top Contributing Factors:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1">
                          {predictionResult.topContributingFactors.map((factor, index) => (
                            <li key={index}>{factor}</li>
                          ))}
                        </ul>
                      </div>
                      
                      <div className="mt-4 pt-4 border-t">
                        <h4 className="font-semibold mb-2">AI Recommendations:</h4>
                        <ul className="list-disc pl-5 text-sm space-y-1 text-blue-700">
                          {predictionResult.personalizedRecommendations.map((recommendation, index) => (
                            <li key={index}>{recommendation}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  ) : (
                    <div className="border p-6 rounded-lg bg-gray-50 text-center">
                      <p className="text-lg mb-4">Select risk factors and click "Calculate Risk with AI"</p>
                      <p className="text-sm text-gray-500">Our AI algorithm will analyze your inputs and provide personalized risk assessments.</p>
                    </div>
                  )}
                </div>
              </div>
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