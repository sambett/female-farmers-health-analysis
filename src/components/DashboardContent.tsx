import React, { useState, useEffect } from 'react';
import TextAnalysisComponent from './TextAnalysisComponent';
import RiskPredictionTool from './RiskPredictionTool';
import EnhancedRiskPredictionTool from './EnhancedRiskPredictionTool';
import Overview from './Overview';
import HealthOutcomes from './HealthOutcomes';
import Exposures from './Exposures';
import Protection from './Protection';
import Analytics from './Analytics';
import { loadData } from '../services/DataService';
import * as XLSX from 'xlsx';
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
        let arrayBuffer;
        
        if (typeof window !== 'undefined' && 'fs' in window && window.fs) {
          try {
            const fileBuffer = await window.fs.readFile('fixed_female_farmers_data.xlsx');
            if (fileBuffer instanceof Uint8Array) {
              arrayBuffer = fileBuffer.buffer;
            } else {
              throw new Error('Expected Uint8Array from window.fs.readFile');
            }
          } catch (fsError) {
            console.warn('Error reading with window.fs:', fsError);
            const response = await fetch('fixed_female_farmers_data.xlsx');
            arrayBuffer = await response.arrayBuffer();
          }
        } else {
          const response = await fetch('fixed_female_farmers_data.xlsx');
          arrayBuffer = await response.arrayBuffer();
        }
        
        let workbook;
        try {
          const XLSXModule = await import('xlsx');
          workbook = XLSXModule.read(new Uint8Array(arrayBuffer), {
            type: 'array',
            cellDates: true,
            cellNF: true,
            cellStyles: true
          });
        } catch (importError) {
          console.warn('Dynamic import failed, using static import:', importError);
          workbook = XLSX.read(new Uint8Array(arrayBuffer), {
            type: 'array',
            cellDates: true,
            cellNF: true,
            cellStyles: true
          });
        }
        
        if (!workbook || !workbook.SheetNames || workbook.SheetNames.length === 0) {
          console.warn('Invalid workbook data, using sample data');
          const sampleData = await loadData('sample');
          setData(sampleData);
          return;
        }
        
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
          defval: '',
          raw: false
        });
        
        const processedData = jsonData.map((record: Record<string, unknown>): HealthRecord => {
          const processedRecord: HealthRecord = {};

          if (typeof record['N°'] !== 'undefined') processedRecord['N°'] = Number(record['N°']);
          if (typeof record['Age'] !== 'undefined') processedRecord['Age'] = Number(record['Age']);
          if (typeof record['Nb enfants'] !== 'undefined') processedRecord['Nb enfants'] = Number(record['Nb enfants']);
          if (typeof record['H travail / jour'] !== 'undefined') processedRecord['H travail / jour'] = Number(record['H travail / jour']);
          if (typeof record['J travail / Sem'] !== 'undefined') processedRecord['J travail / Sem'] = Number(record['J travail / Sem']);
          if (typeof record['Ancienneté agricole'] !== 'undefined') processedRecord['Ancienneté agricole'] = Number(record['Ancienneté agricole']);
          if (typeof record['TAS'] !== 'undefined') processedRecord['TAS'] = Number(record['TAS']);
          if (typeof record['TAD'] !== 'undefined') processedRecord['TAD'] = Number(record['TAD']);
          
          if (typeof record['Situation maritale'] !== 'undefined') processedRecord['Situation maritale'] = String(record['Situation maritale']);
          if (typeof record['Niveau socio-économique'] !== 'undefined') processedRecord['Niveau socio-économique'] = String(record['Niveau socio-économique']);
          if (typeof record['Statut'] !== 'undefined') processedRecord['Statut'] = String(record['Statut']);
          if (typeof record['Masque pour pesticides'] !== 'undefined') processedRecord['Masque pour pesticides'] = String(record['Masque pour pesticides']);
          if (typeof record['Bottes'] !== 'undefined') processedRecord['Bottes'] = String(record['Bottes']);
          if (typeof record['Gants'] !== 'undefined') processedRecord['Gants'] = String(record['Gants']);
          if (typeof record['Casquette/Mdhalla'] !== 'undefined') processedRecord['Casquette/Mdhalla'] = String(record['Casquette/Mdhalla']);
          if (typeof record['Manteau imperméable'] !== 'undefined') processedRecord['Manteau imperméable'] = String(record['Manteau imperméable']);
          
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
          
          ['Produits chimiques utilisés', 'Engrais utilisés', 
           'Produits biologiques utilisés'].forEach(field => {
            const value = record[field];
            if (value === undefined || value === null) {
              processedRecord[field] = '';
            } else {
              processedRecord[field] = String(value);
            }
          });
          
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

  const handleRiskFactorsGenerated = (factors: RiskFactor[]) => {
    setTextRiskFactors(factors);
    if (factors.length > 0) {
      setSelectedRiskFactor(factors[0]);
    }
  };
  
  const handleRiskFactorSelect = (factor: RiskFactor) => {
    setSelectedRiskFactor(factor);
  };

  if (loading) {
    return <div className="flex items-center justify-center h-64">Chargement des données...</div>;
  }

  return (
    <>
      {(activeTab === 'ai-prediction' || activeTab === 'analytics') ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4">
          {/* Text Analysis Section - Takes 1 column on large screens */}
          <div className="lg:col-span-1">
            <TextAnalysisComponent 
              data={data} 
              onRiskFactorsGenerated={handleRiskFactorsGenerated}
              onRiskFactorSelected={handleRiskFactorSelect}
            />
          </div>
          
          {/* Main Content - Takes 2 columns on large screens */}
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

                {useEnhancedTool ? (
                  <EnhancedRiskPredictionTool 
                    data={data} 
                    textRiskFactors={textRiskFactors}
                    highlightedRiskFactor={selectedRiskFactor}
                  />
                ) : (
                  <RiskPredictionTool 
                    data={data} 
                    textRiskFactors={textRiskFactors}
                  />
                )}
              </>
            )}
            
            {activeTab === 'analytics' && (
              <Analytics />
            )}
          </div>
        </div>
      ) : (
        <div className="mt-4">
          {activeTab === 'overview' && <Overview />}
          {activeTab === 'health-outcomes' && <HealthOutcomes />}
          {activeTab === 'exposures' && <Exposures />}
          {activeTab === 'protection' && <Protection />}
        </div>
      )}
    </>
  );
};

export default DashboardContent;