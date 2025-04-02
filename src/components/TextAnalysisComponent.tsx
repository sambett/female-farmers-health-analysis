// TextAnalysisComponent.tsx
import React, { useEffect, useState } from 'react';
import { TextAnalysisService } from '../services/TextAnalysisService';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { PieChart, Pie, Cell } from 'recharts';
import { ChartDataItem, StructuredTextData, TermData, RelationData, RiskFactor, HealthRecord } from '../types';

// Define colors for the charts
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#8dd1e1'];

// Define interfaces for our component props
interface TextAnalysisProps {
  data: HealthRecord[]; // Your dataset of health records
  onRiskFactorsGenerated: (riskFactors: RiskFactor[]) => void; // Callback with risk factors
  onRiskFactorSelected?: (riskFactor: RiskFactor) => void; // Optional callback when a risk factor is selected
}

const TextAnalysisComponent: React.FC<TextAnalysisProps> = ({ data, onRiskFactorsGenerated, onRiskFactorSelected }) => {
  const [analysisResults, setAnalysisResults] = useState<StructuredTextData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [activeTab, setActiveTab] = useState<string>('health');
  const [selectedRiskFactor, setSelectedRiskFactor] = useState<RiskFactor | null>(null);

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

  // Handle clicking on a risk factor
  const handleRiskFactorClick = (relation: RelationData) => {
    // Find the corresponding risk factor in the risk factors list
    const textAnalysisService = new TextAnalysisService();
    const riskFactors = textAnalysisService.getTopRiskFactors(analysisResults!);
    
    const clickedFactor = riskFactors.find(rf => 
      rf.healthIssue === relation.health && rf.exposure === relation.chemical
    );
    
    if (clickedFactor) {
      setSelectedRiskFactor(clickedFactor);
      
      // Call the callback if provided
      if (onRiskFactorSelected) {
        onRiskFactorSelected(clickedFactor);
      }
    }
  };
  
  if (loading || !analysisResults) {
    return <div className="p-4">Chargement de l'analyse de texte...</div>;
  }

  // Prepare data for visualization
  const prepareChartData = (termData: TermData[], limit: number = 10): ChartDataItem[] => {
    return termData.slice(0, limit).map(item => ({
      name: item.term,
      value: item.count
    }));
  };

  // Prepare relation data
  const prepareRelationData = (): ChartDataItem[] => {
    return analysisResults.healthChemicalRelations
      .slice(0, 10)
      .map(relation => ({
        name: `${relation.health} - ${relation.chemical}`,
        value: relation.count
      }));
  };

  // Custom label function for pie chart
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renderCustomizedLabel = (props: any) => {
    const { name, percent } = props;
    return `${name} (${(percent * 100).toFixed(0)}%)`;
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
                label={renderCustomizedLabel}
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
              <div 
                key={index} 
                className={`flex items-center cursor-pointer p-2 rounded-md ${selectedRiskFactor && selectedRiskFactor.healthIssue === relation.health && selectedRiskFactor.exposure === relation.chemical ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
                onClick={() => handleRiskFactorClick(relation)}
              >
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