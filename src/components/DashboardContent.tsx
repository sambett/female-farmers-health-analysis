// Dashboard.tsx
import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';
import TextAnalysisComponent from '../components/TextAnalysisComponent';
import RiskPredictionTool from '../components/RiskPredictionTool';
import { loadData } from '../services/DataService'; // You'll need to create this

const Dashboard: React.FC = () => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [textRiskFactors, setTextRiskFactors] = useState<any[]>([]);
  const [activeTab, setActiveTab] = useState<string>('prediction');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Load your data from a file or API
        const rawData = await loadData('fixed_female_farmers_data.xlsx');
        setData(rawData);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Callback for receiving risk factors from text analysis
  const handleRiskFactorsGenerated = (factors: any[]) => {
    setTextRiskFactors(factors);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-screen">Chargement des données...</div>;
  }

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab}
        onTabChange={setActiveTab}
      />
      
      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4">
          <h1 className="text-2xl font-bold mb-4">Tableau de Bord de Santé Agricole</h1>
          
          {/* Filter Bar */}
          <FilterBar />
          
          {/* Main Dashboard Content */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
            {/* Text Analysis Section - Takes 1 column on large screens */}
            <div className="lg:col-span-1">
              {activeTab === 'textAnalysis' || activeTab === 'prediction' ? (
                <TextAnalysisComponent 
                  data={data} 
                  onRiskFactorsGenerated={handleRiskFactorsGenerated} 
                />
              ) : null}
            </div>
            
            {/* Risk Prediction Tool - Takes 2 columns on large screens */}
            <div className="lg:col-span-2">
              {activeTab === 'prediction' && (
                <RiskPredictionTool 
                  data={data} 
                  textRiskFactors={textRiskFactors} 
                />
              )}
              
              {activeTab === 'visualization' && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Visualisations</h2>
                  <p>Cet onglet contiendra vos visualisations basées sur l'analyse PCA/MCA.</p>
                  {/* You'll add your PCA/MCA visualization components here */}
                </div>
              )}
              
              {activeTab === 'statistics' && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Analyses Statistiques</h2>
                  <p>Cet onglet contiendra vos résultats d'analyses ANOVA et tests statistiques.</p>
                  {/* You'll add your statistical analysis components here */}
                </div>
              )}
              
              {activeTab === 'findings' && (
                <div className="bg-white p-4 rounded-lg shadow-md">
                  <h2 className="text-xl font-bold mb-4">Conclusions et Recommandations</h2>
                  <p>Cet onglet présentera les principales conclusions et recommandations.</p>
                  {/* You'll add your findings and recommendations here */}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;