import React, { useState, useEffect } from 'react';
import TextAnalysisComponent from './TextAnalysisComponent';
import RiskPredictionTool from './RiskPredictionTool';
import { loadData } from '../services/DataService';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab }) => {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [textRiskFactors, setTextRiskFactors] = useState<any[]>([]);

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
    return <div className="flex items-center justify-center h-64">Chargement des données...</div>;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
      {/* Text Analysis Section - Takes 1 column on large screens */}
      <div className="lg:col-span-1">
        {activeTab === 'ai-prediction' || activeTab === 'analytics' ? (
          <TextAnalysisComponent 
            data={data} 
            onRiskFactorsGenerated={handleRiskFactorsGenerated} 
          />
        ) : null}
      </div>
      
      {/* Risk Prediction Tool - Takes 2 columns on large screens */}
      <div className="lg:col-span-2">
        {activeTab === 'ai-prediction' && (
          <RiskPredictionTool 
            data={data} 
            textRiskFactors={textRiskFactors} 
          />
        )}
        
        {activeTab === 'analytics' && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Visualisations</h2>
            <p>Cet onglet contiendra vos visualisations basées sur l'analyse PCA/MCA.</p>
            {/* You'll add your PCA/MCA visualization components here */}
          </div>
        )}
        
        {activeTab === 'exposures' && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Analyses des Expositions</h2>
            <p>Cet onglet contiendra vos résultats d'analyses sur les expositions chimiques.</p>
            {/* You'll add your exposure analysis components here */}
          </div>
        )}
        
        {activeTab === 'health-outcomes' && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Résultats de Santé</h2>
            <p>Cet onglet présentera les analyses des problèmes de santé observés.</p>
            {/* You'll add your health outcomes components here */}
          </div>
        )}

        {activeTab === 'protection' && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Équipements de Protection</h2>
            <p>Cet onglet présentera les analyses sur l'utilisation d'équipements de protection.</p>
            {/* You'll add your protection equipment analysis here */}
          </div>
        )}

        {activeTab === 'overview' && (
          <div className="bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Aperçu Général</h2>
            <p>Bienvenue dans le tableau de bord de santé agricole. Utilisez les onglets pour explorer les différentes analyses.</p>
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="border p-3 rounded bg-blue-50">
                <h3 className="font-bold">Problèmes de Santé</h3>
                <p className="text-sm">Analyse des troubles cardio-respiratoires, neurologiques, cognitifs et cutanés.</p>
              </div>
              <div className="border p-3 rounded bg-green-50">
                <h3 className="font-bold">Expositions</h3>
                <p className="text-sm">Analyse des expositions aux produits chimiques et biologiques.</p>
              </div>
              <div className="border p-3 rounded bg-yellow-50">
                <h3 className="font-bold">Protection</h3>
                <p className="text-sm">Analyse de l'utilisation d'équipements de protection.</p>
              </div>
              <div className="border p-3 rounded bg-purple-50">
                <h3 className="font-bold">Prédiction IA</h3>
                <p className="text-sm">Outil de prédiction des risques basé sur l'analyse de texte.</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DashboardContent;