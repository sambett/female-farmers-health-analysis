// TextAnalysisComponent.tsx
import React, { useEffect, useState } from 'react';
import { TextAnalysisService } from '../services/TextAnalysisService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';

// Define colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

interface TextAnalysisProps {
  data: any[]; // Your dataset
  onRiskFactorsGenerated: (riskFactors: any[]) => void; // Callback to send risk factors to prediction tool
}

const TextAnalysisComponent: React.FC<TextAnalysisProps> = ({ data, onRiskFactorsGenerated }) => {
  const [analysisResults, setAnalysisResults] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('health');

  useEffect(() => {
    if (data && data.length > 0) {
      setLoading(true);
      
      // Create text analysis service
      const textAnalysisService = new TextAnalysisService();
      
      // Process the data
      const results = textAnalysisService.processTextData(data);
      setAnalysisResults(results);
      
      // Generate risk factors and send to prediction tool
      const riskFactors = textAnalysisService.getTopRiskFactors(results);
      onRiskFactorsGenerated(riskFactors);
      
      setLoading(false);
    }
  }, [data, onRiskFactorsGenerated]);

  if (loading || !analysisResults) {
    return <div className="p-4">Chargement de l'analyse de texte...</div>;
  }

  // Prepare data for visualization
  const prepareChartData = (termData: {term: string, count: number}[], limit: number = 10) => {
    return termData.slice(0, limit).map(item => ({
      name: item.term,
      value: item.count
    }));
  };

  // Prepare relation data
  const prepareRelationData = () => {
    return analysisResults.healthChemicalRelations
      .slice(0, 10)
      .map(relation => ({
        name: `${relation.health} - ${relation.chemical}`,
        value: relation.count
      }));
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Analyse Textuelle</h2>
      
      {/* Tab Navigation */}
      <div className="flex space-x-2 mb-4">
        <button 
          className={`px-3 py-1 rounded ${activeTab === 'health' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('health')}
        >
          Problèmes de Santé
        </button>
        <button 
          className={`px-3 py-1 rounded ${activeTab === 'chemicals' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('chemicals')}
        >
          Produits Chimiques
        </button>
        <button 
          className={`px-3 py-1 rounded ${activeTab === 'tasks' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('tasks')}
        >
          Tâches
        </button>
        <button 
          className={`px-3 py-1 rounded ${activeTab === 'relations' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
          onClick={() => setActiveTab('relations')}
        >
          Relations
        </button>
      </div>
      
      {/* Content based on active tab */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          {activeTab === 'relations' ? (
            // Pie chart for relations
            <PieChart>
              <Pie
                data={prepareRelationData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {prepareRelationData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          ) : (
            // Bar charts for terms
            <BarChart
              data={
                activeTab === 'health' 
                  ? prepareChartData(analysisResults.healthIssueTerms)
                  : activeTab === 'chemicals'
                    ? prepareChartData(analysisResults.chemicalExposureTerms)
                    : prepareChartData(analysisResults.taskTerms)
              }
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <XAxis type="number" />
              <YAxis type="category" dataKey="name" width={80} />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8" name="Fréquence" />
            </BarChart>
          )}
        </ResponsiveContainer>
      </div>
      
      {/* Risk Factors Section */}
      {activeTab === 'relations' && (
        <div className="mt-4">
          <h3 className="font-bold">Facteurs de Risque Principaux</h3>
          <div className="mt-2 space-y-2">
            {analysisResults.healthChemicalRelations.slice(0, 5).map((relation, index) => (
              <div key={index} className="flex items-center">
                <div 
                  className="w-4 h-4 rounded-full mr-2" 
                  style={{ backgroundColor: COLORS[index % COLORS.length] }}
                ></div>
                <span>
                  {relation.health} + {relation.chemical} (Occurrences: {relation.count})
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default TextAnalysisComponent;