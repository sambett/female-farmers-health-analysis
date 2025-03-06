import React from 'react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, PieChart, Pie, Cell, ScatterChart, Scatter, ZAxis, LineChart, Line, Legend } from 'recharts';
import { healthData, ageData, exposureData, employmentData, bpData, pcaData, featureData, protectionData } from '../data/sampleData';
import RiskPredictionTool from './RiskPredictionTool';

interface DashboardContentProps {
  activeTab: string;
}

const COLORS = ['#2B6A6E', '#FF6F61', '#A0AEC0', '#2D3748'];

const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab }) => {
  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl font-bold text-slate mb-6">Study Overview</h2>
            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded border-l-4 border-teal gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="text-lightSlate text-sm">Sample Size</h3>
                <p className="text-2xl font-bold text-teal">81</p>
                <p className="text-xs text-lightSlate">Agricultural workers</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-coral gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="text-lightSlate text-sm">Variables</h3>
                <p className="text-2xl font-bold text-coral">61</p>
                <p className="text-xs text-lightSlate">Health & occupational metrics</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-slate gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="text-lightSlate text-sm">Region</h3>
                <p className="text-2xl font-bold text-slate">Monastir</p>
                <p className="text-xs text-lightSlate">Tunisia</p>
              </div>
            </div>
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded mb-8 border-l-4 border-teal">
              <p className="leading-relaxed text-gray-700">
                This study analyzes occupational health risks faced by female agricultural workers in Tunisia. 
                The research investigates relationships between working conditions, protective measures, and 
                health outcomes to develop targeted prevention strategies.
              </p>
            </div>
            <h3 className="text-xl font-bold mb-4 text-slate">Sample Demographics</h3>
            <div className="grid grid-cols-2 gap-6">
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">Age Distribution</h4>
                <ResponsiveContainer>
                  <BarChart data={ageData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="age" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Bar dataKey="count" fill="#FF6F61" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">Employment Status</h4>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={employmentData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {employmentData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        );

      case 'health':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl font-bold text-slate mb-6">Health Outcomes</h2>
            <div className="grid grid-cols-4 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded border-l-4 border-coral gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="text-lightSlate text-sm">Respiratory Issues</h3>
                <p className="text-2xl font-bold text-coral">30%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-yellow-500 gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="text-lightSlate text-sm">Neurological Issues</h3>
                <p className="text-2xl font-bold text-yellow-600">20%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-teal gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="text-lightSlate text-sm">Cognitive Issues</h3>
                <p className="text-2xl font-bold text-teal">15%</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-purple-500 gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="text-lightSlate text-sm">Skin Issues</h3>
                <p className="text-2xl font-bold text-purple-600">25%</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">Health Issues Prevalence</h4>
                <ResponsiveContainer>
                  <BarChart data={healthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis label={{ value: 'Prevalence (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Bar dataKey="value" fill="#FF6F61" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">Blood Pressure Distribution</h4>
                <ResponsiveContainer>
                  <ScatterChart>
                    <CartesianGrid />
                    <XAxis type="number" dataKey="systolic" name="Systolic" domain={[90, 160]} label={{ value: 'Systolic (mmHg)', position: 'bottom' }} />
                    <YAxis type="number" dataKey="diastolic" name="Diastolic" domain={[60, 100]} label={{ value: 'Diastolic (mmHg)', angle: -90, position: 'insideLeft' }} />
                    <ZAxis type="number" range={[60]} />
                    <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Scatter name="Blood Pressure" data={bpData} fill="#61a5c2">
                      {bpData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.issues === 1 ? '#e63946' : '#2B6A6E'} />
                      ))}
                    </Scatter>
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded mb-4 border-l-4 border-teal">
              <h3 className="font-bold mb-2">Key Insights:</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Respiratory issues are the most common health complaint among workers</li>
                <li>Workers with limited protective equipment show 40% higher rates of health issues</li>
                <li>Seasonal workers report more health complaints than permanent workers</li>
              </ul>
            </div>
          </div>
        );

      case 'exposure':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl font-bold text-slate mb-6">Occupational Exposures</h2>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-50 p-4 rounded border-l-4 border-teal gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="text-lightSlate text-sm">Pesticide Exposure</h3>
                <p className="text-2xl font-bold text-teal">60%</p>
                <p className="text-xs text-lightSlate">of workers</p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-coral gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="text-lightSlate text-sm">Fertilizer Exposure</h3>
                <p className="text-2xl font-bold text-coral">70%</p>
                <p className="text-xs text-lightSlate">of workers</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">Chemical Exposure by Month</h4>
                <ResponsiveContainer>
                  <LineChart data={exposureData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis label={{ value: 'Exposure (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Legend />
                    <Line type="monotone" dataKey="pesticides" stroke="#2B6A6E" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="fertilizers" stroke="#FF6F61" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">Daily Working Hours</h4>
                <ResponsiveContainer>
                  <BarChart data={[
                    { hours: '4-6', count: 10 },
                    { hours: '6-8', count: 25 },
                    { hours: '8-10', count: 35 },
                    { hours: '10-12', count: 9 },
                    { hours: '12+', count: 2 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="hours" />
                    <YAxis />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Bar dataKey="count" fill="#2B6A6E" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded mb-4 border-l-4 border-yellow-500">
              <h3 className="font-bold mb-2">Exposure Impact:</h3>
              <p className="text-gray-700">
                Workers exposed to pesticides show 2.5x higher rates of respiratory issues compared
                to those without exposure. Protective equipment reduces this risk by approximately 40%.
              </p>
            </div>
          </div>
        );

      case 'protection':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl font-bold text-slate mb-6">Protection Equipment</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">Mask Usage Frequency</h4>
                <ResponsiveContainer>
                  <PieChart>
                    <Pie
                      data={protectionData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      label
                    >
                      {protectionData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">Mask Usage & Respiratory Issues</h4>
                <ResponsiveContainer>
                  <BarChart data={[
                    { usage: 'Never', value: 45 },
                    { usage: 'Sometimes', value: 35 },
                    { usage: 'Often', value: 20 },
                    { usage: 'Always', value: 12 },
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="usage" />
                    <YAxis label={{ value: 'Respiratory Issues (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Bar dataKey="value" fill="#FF6F61" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="bg-gray-50 p-4 rounded border-l-4 border-teal gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="font-bold mb-2">Protection Usage by Employment Status:</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Permanent workers:</span> 45% use masks regularly
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Seasonal workers:</span> Only 18% use masks regularly
                </p>
              </div>
              <div className="bg-gray-50 p-4 rounded border-l-4 border-coral gradient-border transition-all hover:shadow-lg hover:scale-105">
                <h3 className="font-bold mb-2">Protection by Socioeconomic Status:</h3>
                <p className="text-gray-700 mb-2">
                  <span className="font-semibold">Higher status:</span> 62% use complete protection
                </p>
                <p className="text-gray-700">
                  <span className="font-semibold">Lower status:</span> Only 23% use complete protection
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded mb-4 border-l-4 border-teal">
              <h3 className="font-bold mb-2">Key Insights:</h3>
              <ul className="list-disc pl-5 text-gray-700">
                <li>Only 30% of workers use masks often or always during chemical application</li>
                <li>Proper protection correlates with 40% reduction in respiratory complaints</li>
                <li>Main barriers to protection: cost (45%), discomfort (32%), unavailability (23%)</li>
              </ul>
            </div>
          </div>
        );

      case 'analytics':
        return (
          <div className="p-6 bg-white rounded-lg shadow-md animate-fade-in">
            <h2 className="text-2xl font-bold text-slate mb-6">Advanced Analytics</h2>
            <div className="grid grid-cols-2 gap-6 mb-6">
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">PCA - Cumulative Variance Explained</h4>
                <ResponsiveContainer>
                  <LineChart data={pcaData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="component" />
                    <YAxis label={{ value: 'Cumulative Variance (%)', angle: -90, position: 'insideLeft' }} />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Line type="monotone" dataKey="variance" stroke="#2B6A6E" activeDot={{ r: 8 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
              <div className="h-64 bg-white p-3 border rounded gradient-border">
                <h4 className="text-sm font-semibold text-slate mb-2">Feature Importance</h4>
                <ResponsiveContainer>
                  <BarChart data={featureData} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis type="number" />
                    <YAxis dataKey="feature" type="category" width={100} />
                    <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                    <Bar dataKey="importance" fill="#FF6F61" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
            <div className="bg-gray-50 p-4 rounded mb-6 border-l-4 border-purple-500">
              <h3 className="font-bold mb-2">Predictive Model Results:</h3>
              <p className="text-gray-700 mb-2">
                Our model predicts respiratory issues with 76% accuracy based on five key factors.
                The most important predictors are pesticide exposure, age, and protection equipment usage.
              </p>
            </div>
            <div className="bg-gray-50 p-4 rounded mb-4 border-l-4 border-teal">
              <h3 className="font-bold mb-2">Recommended Interventions:</h3>
              <ol className="list-decimal pl-5 text-gray-700">
                <li>Targeted education on proper protection equipment usage</li>
                <li>Subsidized protection equipment for seasonal and low-income workers</li>
                <li>Reduced pesticide application hours and improved ventilation</li>
                <li>Regular health monitoring for workers with highest exposure</li>
                <li>Region-specific guidelines for agricultural work safety</li>
              </ol>
            </div>
          </div>
        );

      case 'ai-prediction':
        return <RiskPredictionTool />;

      default:
        return <div className="p-6 text-slate">Select a section</div>;
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      {renderContent()}
    </div>
  );
};

export default DashboardContent;