import React, { useState, useEffect } from 'react';
import TextAnalysisComponent from './TextAnalysisComponent';
import RiskPredictionTool from './RiskPredictionTool';
import EnhancedRiskPredictionTool from './EnhancedRiskPredictionTool';
import { loadData } from '../services/DataService';
import * as XLSX from 'xlsx'; // Import XLSX directly as well for fallback
import { HealthRecord, RiskFactor } from '../types';

interface DashboardContentProps {
  activeTab: string;
}

const DashboardContent: React.FC<DashboardContentProps> = ({ activeTab }) => {
  const [data, setData] = useState<HealthRecord[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [textRiskFactors, setTextRiskFactors] = useState<RiskFactor[]>([]);
  const [selectedRiskFactor, setSelectedRiskFactor] = useState<RiskFactor | null>(null);
  const [useEnhancedTool, setUseEnhancedTool] = useState<boolean>(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // Try to load the file using window.fs if available, otherwise fallback to fetch API
        let arrayBuffer;
        
        if (typeof window !== 'undefined' && 'fs' in window && window.fs) {
          try {
            // Use window.fs to load the fixed_female_farmers_data.xlsx file
            const fileBuffer = await window.fs.readFile('fixed_female_farmers_data.xlsx');
            if (fileBuffer instanceof Uint8Array) {
              arrayBuffer = fileBuffer.buffer;
            } else {
              throw new Error('Expected Uint8Array from window.fs.readFile');
            }
          } catch (fsError) {
            console.warn('Error reading with window.fs:', fsError);
            // Fallback to fetch API
            const response = await fetch('fixed_female_farmers_data.xlsx');
            arrayBuffer = await response.arrayBuffer();
          }
        } else {
          // window.fs not available, use fetch API
          const response = await fetch('fixed_female_farmers_data.xlsx');
          arrayBuffer = await response.arrayBuffer();
        }
        
        // Process the data using XLSX directly
        let workbook;
        try {
          // Try dynamic import first
          const XLSXModule = await import('xlsx');
          workbook = XLSXModule.read(new Uint8Array(arrayBuffer), {
            type: 'array',
            cellDates: true,
            cellNF: true,
            cellStyles: true
          });
        } catch (importError) {
          console.warn('Dynamic import failed, using static import:', importError);
          // Fallback to static import
          workbook = XLSX.read(new Uint8Array(arrayBuffer), {
            type: 'array',
            cellDates: true,
            cellNF: true,
            cellStyles: true
          });
        }
        
        // Validate workbook data
        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
          console.warn('Invalid workbook data, using sample data');
          const sampleData = await loadData('sample');
          setData(sampleData);
          return;
        }
        
        // Get first sheet
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '', // Default value for empty cells
          raw: false  // Convert values to string
        });
        
        // Process the data to ensure all needed fields are properly formatted
        const processedData = jsonData.map((record: Record<string, unknown>): HealthRecord => {
          // Create a new record of the correct type
          const processedRecord: HealthRecord = {};

          // Copy numeric fields
          if (typeof record['N°'] !== 'undefined') processedRecord['N°'] = Number(record['N°']);
          if (typeof record['Age'] !== 'undefined') processedRecord['Age'] = Number(record['Age']);
          if (typeof record['Nb enfants'] !== 'undefined') processedRecord['Nb enfants'] = Number(record['Nb enfants']);
          if (typeof record['H travail / jour'] !== 'undefined') processedRecord['H travail / jour'] = Number(record['H travail / jour']);
          if (typeof record['J travail / Sem'] !== 'undefined') processedRecord['J travail / Sem'] = Number(record['J travail / Sem']);
          if (typeof record['Ancienneté agricole'] !== 'undefined') processedRecord['Ancienneté agricole'] = Number(record['Ancienneté agricole']);
          if (typeof record['TAS'] !== 'undefined') processedRecord['TAS'] = Number(record['TAS']);
          if (typeof record['TAD'] !== 'undefined') processedRecord['TAD'] = Number(record['TAD']);
          
          // Copy string fields
          if (typeof record['Situation maritale'] !== 'undefined') processedRecord['Situation maritale'] = String(record['Situation maritale']);
          if (typeof record['Niveau socio-économique'] !== 'undefined') processedRecord['Niveau socio-économique'] = String(record['Niveau socio-économique']);
          if (typeof record['Statut'] !== 'undefined') processedRecord['Statut'] = String(record['Statut']);
          if (typeof record['Masque pour pesticides'] !== 'undefined') processedRecord['Masque pour pesticides'] = String(record['Masque pour pesticides']);
          if (typeof record['Bottes'] !== 'undefined') processedRecord['Bottes'] = String(record['Bottes']);
          if (typeof record['Gants'] !== 'undefined') processedRecord['Gants'] = String(record['Gants']);
          if (typeof record['Casquette/Mdhalla'] !== 'undefined') processedRecord['Casquette/Mdhalla'] = String(record['Casquette/Mdhalla']);
          if (typeof record['Manteau imperméable'] !== 'undefined') processedRecord['Manteau imperméable'] = String(record['Manteau imperméable']);
          
          // Ensure health issue fields are strings
          ['Troubles cardio-respiratoires', 'Troubles cognitifs', 
           'Troubles neurologiques', 'Troubles cutanés/phanères', 
           'Autres plaintes'].forEach(field => {
            const value = record[field];
            if (value === undefined || value === null) {
              processedRecord[field] = '';
            } else {
              processedRecord[field] = String(value);
            }
          });
          
          // Ensure chemical fields are strings
          ['Produits chimiques utilisés', 'Engrais utilisés', 
           'Produits biologiques utilisés'].forEach(field => {
            const value = record[field];
            if (value === undefined || value === null) {
              processedRecord[field] = '';
            } else {
              processedRecord[field] = String(value);
            }
          });
          
          // Ensure task field is a string
          const taskField = 'Tâches effectuées';
          const taskValue = record[taskField];
          if (taskValue === undefined || taskValue === null) {
            processedRecord[taskField] = '';
          } else {
            processedRecord[taskField] = String(taskValue);
          }
          
          return processedRecord;
        });
        
        setData(processedData);
      } catch (error) {
        console.error('Error loading data:', error);
        // Fallback to sample data in case of error
        setData([
          {
            "N°": 1,
            "Age": 45,
            "Situation maritale": "mariée",
            "Nb enfants": 3,
            "Niveau socio-économique": "moyen",
            "Statut": "permanente",
            "H travail / jour": 8,
            "J travail / Sem": 6,
            "Ancienneté agricole": 15,
            "Tâches effectuées": "epandage des engrais, cueillette des olives",
            "Produits chimiques utilisés": "pesticides, engrais chimiques",
            "Masque pour pesticides": "parfois",
            "Bottes": "souvent",
            "Gants": "parfois",
            "Casquette/Mdhalla": "toujours",
            "Manteau imperméable": "jamais",
            "Troubles cardio-respiratoires": "dyspnée, palpitations",
            "Troubles cognitifs": "",
            "Troubles neurologiques": "céphalées",
            "Troubles cutanés/phanères": "irritation cutanée",
            "TAS": 130,
            "TAD": 85
          },
          {
            "N°": 2,
            "Age": 52,
            "Situation maritale": "mariée",
            "Nb enfants": 4,
            "Niveau socio-économique": "bas",
            "Statut": "saisonnière",
            "H travail / jour": 10,
            "J travail / Sem": 5,
            "Ancienneté agricole": 25,
            "Tâches effectuées": "cueillette des fruits, désherbage",
            "Produits chimiques utilisés": "herbicides",
            "Masque pour pesticides": "jamais",
            "Bottes": "parfois",
            "Gants": "jamais",
            "Casquette/Mdhalla": "toujours",
            "Manteau imperméable": "jamais",
            "Troubles cardio-respiratoires": "toux chronique",
            "Troubles cognitifs": "troubles de la mémoire",
            "Troubles neurologiques": "vertiges, céphalées",
            "Troubles cutanés/phanères": "dermatite",
            "TAS": 145,
            "TAD": 90
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Callback for receiving risk factors from text analysis
  const handleRiskFactorsGenerated = (factors: RiskFactor[]) => {
    setTextRiskFactors(factors);
    // If we have at least one risk factor, select the first one for highlighting
    if (factors.length > 0) {
      setSelectedRiskFactor(factors[0]);
    }
  };
  
  // Handle clicking on a risk factor in the text analysis component
  const handleRiskFactorSelect = (factor: RiskFactor) => {
    setSelectedRiskFactor(factor);
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
            onRiskFactorSelected={handleRiskFactorSelect}
          />
        ) : null}
      </div>
      
      {/* Risk Prediction Tool - Takes 2 columns on large screens */}
      <div className="lg:col-span-2">
        {activeTab === 'ai-prediction' && (
          <>
            <div className="flex justify-end mb-2">
              <label className="inline-flex items-center cursor-pointer">
                <span className="mr-2 text-sm font-medium text-gray-700">
                  {useEnhancedTool ? 'Outil avancé' : 'Outil standard'}
                </span>
                <div className="relative">
                  <input 
                    type="checkbox" 
                    checked={useEnhancedTool}
                    onChange={() => setUseEnhancedTool(!useEnhancedTool)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </div>
              </label>
            </div>

            <EnhancedRiskPredictionTool 
              data={data} 
              textRiskFactors={textRiskFactors}
              highlightedRiskFactor={selectedRiskFactor}
            />
          </>
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