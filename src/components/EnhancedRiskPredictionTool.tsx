// RiskPredictionTool.tsx
import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, TextField, Button, Slider, Typography } from '@mui/material';

// Import text-derived risk factors types
interface TextRiskFactor {
  healthIssue: string;
  exposure: string;
  occurrenceCount: number;
  riskScore: number;
}

interface RiskPredictionToolProps {
  data: any[]; // Your dataset
  textRiskFactors: TextRiskFactor[]; // Risk factors from text analysis
}

const RiskPredictionTool: React.FC<RiskPredictionToolProps> = ({ data, textRiskFactors }) => {
  // Form state
  const [age, setAge] = useState<number>(35);
  const [workExperience, setWorkExperience] = useState<number>(5);
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number>(8);
  const [protectiveEquipment, setProtectiveEquipment] = useState<string[]>([]);
  const [chemicalExposure, setChemicalExposure] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  
  // Result state
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  
  // Derived data for dropdowns
  const [availableChemicals, setAvailableChemicals] = useState<string[]>([]);
  const [availableTasks, setAvailableTasks] = useState<string[]>([]);
  
  // Process dataset to extract options
  useEffect(() => {
    if (data && data.length > 0) {
      // Extract unique chemicals
      const chemicals = new Set<string>();
      data.forEach(record => {
        const chemicalText = record['Produits chimiques utilisés'] || '';
        if (chemicalText) {
          const terms = chemicalText.toLowerCase().split(/[,;]/);
          terms.forEach(term => {
            const trimmed = term.trim();
            if (trimmed) chemicals.add(trimmed);
          });
        }
      });
      
      // Extract unique tasks
      const taskSet = new Set<string>();
      data.forEach(record => {
        const taskText = record['Tâches effectuées'] || '';
        if (taskText) {
          const terms = taskText.toLowerCase().split(/[,;]/);
          terms.forEach(term => {
            const trimmed = term.trim();
            if (trimmed) taskSet.add(trimmed);
          });
        }
      });
      
      setAvailableChemicals(Array.from(chemicals));
      setAvailableTasks(Array.from(taskSet));
    }
  }, [data]);
  
  // Get available protective equipment options
  const protectiveEquipmentOptions = [
    { value: 'masque', label: 'Masque' },
    { value: 'gants', label: 'Gants' },
    { value: 'bottes', label: 'Bottes' },
    { value: 'casquette', label: 'Casquette/Mdhalla' },
    { value: 'manteau', label: 'Manteau imperméable' }
  ];
  
  // Calculate risk based on form inputs and text analysis
  const calculateRisk = () => {
    // Base risk score starts at 20 (minimum risk)
    let score = 20;
    const factors: string[] = [];
    
    // Age factor (> 50 years increases risk)
    if (age > 50) {
      score += 10;
      factors.push("Âge supérieur à 50 ans");
    }
    
    // Work experience factor (less experience = higher risk)
    if (workExperience < 3) {
      score += 10;
      factors.push("Moins de 3 ans d'expérience");
    }
    
    // Long working hours factor
    if (workHoursPerDay > 8) {
      score += 15;
      factors.push("Plus de 8 heures de travail par jour");
    }
    
    // Protective equipment factor (subtract from risk)
    const protectionPercentage = (protectiveEquipment.length / protectiveEquipmentOptions.length) * 100;
    if (protectionPercentage < 40) {
      score += 20;
      factors.push("Utilisation insuffisante d'équipement de protection");
    } else if (protectionPercentage >= 80) {
      score -= 15;
      factors.push("Bonne utilisation d'équipement de protection");
    }
    
    // Chemical exposure factor
    if (chemicalExposure.length > 0) {
      score += 5 * chemicalExposure.length;
      factors.push(`Exposition à ${chemicalExposure.length} produits chimiques`);
      
      // Check against text-derived risk factors
      chemicalExposure.forEach(chemical => {
        const matchingRiskFactors = textRiskFactors.filter(rf => 
          rf.exposure.includes(chemical) || chemical.includes(rf.exposure));
        
        if (matchingRiskFactors.length > 0) {
          // Add the highest risk score
          const highestRiskFactor = matchingRiskFactors.sort((a, b) => b.riskScore - a.riskScore)[0];
          score += highestRiskFactor.riskScore / 5; // Scale it down a bit
          factors.push(`Association connue entre ${chemical} et ${highestRiskFactor.healthIssue}`);
        }
      });
    }
    
    // Task-related risk
    if (tasks.length > 0) {
      // Check if any high-risk tasks are selected
      const highRiskTasks = ['pesticide', 'epandage', 'traitement'];
      const hasHighRiskTask = tasks.some(task => 
        highRiskTasks.some(highRisk => task.includes(highRisk))
      );
      
      if (hasHighRiskTask) {
        score += 15;
        factors.push("Tâches à haut risque sélectionnées");
      }
    }
    
    // Cap the score at 100
    score = Math.min(Math.max(score, 0), 100);
    
    setRiskScore(score);
    setRiskFactors(factors);
  };
  
  // Risk level label based on score
  const getRiskLevel = (score: number): string => {
    if (score < 30) return "Faible";
    if (score < 50) return "Modéré";
    if (score < 70) return "Élevé";
    return "Très élevé";
  };
  
  // Risk color based on score
  const getRiskColor = (score: number): string => {
    if (score < 30) return "#4caf50"; // Green
    if (score < 50) return "#ff9800"; // Orange
    if (score < 70) return "#f44336"; // Red
    return "#9c27b0"; // Purple for very high
  };
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4">Outil de Prédiction des Risques</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Typography gutterBottom>Âge</Typography>
          <Slider
            value={age}
            onChange={(_, newValue) => setAge(newValue as number)}
            valueLabelDisplay="auto"
            min={18}
            max={70}
          />
          
          <Typography gutterBottom>Années d'expérience en agriculture</Typography>
          <Slider
            value={workExperience}
            onChange={(_, newValue) => setWorkExperience(newValue as number)}
            valueLabelDisplay="auto"
            min={0}
            max={40}
          />
          
          <Typography gutterBottom>Heures de travail par jour</Typography>
          <Slider
            value={workHoursPerDay}
            onChange={(_, newValue) => setWorkHoursPerDay(newValue as number)}
            valueLabelDisplay="auto"
            min={1}
            max={12}
          />
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Équipement de protection utilisé</InputLabel>
            <Select
              multiple
              value={protectiveEquipment}
              onChange={(e) => setProtectiveEquipment(e.target.value as string[])}
              renderValue={(selected) => (selected as string[])
                .map(value => protectiveEquipmentOptions.find(opt => opt.value === value)?.label)
                .join(', ')}
            >
              {protectiveEquipmentOptions.map((option) => (
                <MenuItem key={option.value} value={option.value}>
                  {option.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </div>
        
        <div>
          <FormControl fullWidth margin="normal">
            <InputLabel>Produits Chimiques Utilisés</InputLabel>
            <Select
              multiple
              value={chemicalExposure}
              onChange={(e) => setChemicalExposure(e.target.value as string[])}
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {availableChemicals.map((chemical) => (
                <MenuItem key={chemical} value={chemical}>
                  {chemical}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <FormControl fullWidth margin="normal">
            <InputLabel>Tâches Effectuées</InputLabel>
            <Select
              multiple
              value={tasks}
              onChange={(e) => setTasks(e.target.value as string[])}
              renderValue={(selected) => (selected as string[]).join(', ')}
            >
              {availableTasks.map((task) => (
                <MenuItem key={task} value={task}>
                  {task}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={calculateRisk}
            className="mt-4 w-full"
          >
            Calculer le Risque
          </Button>
        </div>
      </div>
      
      {/* Results Section */}
      {riskScore !== null && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-bold mb-2">Résultats de l'Évaluation des Risques</h3>
          
          <div className="flex items-center mb-4">
            <div 
              className="w-24 h-24 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4"
              style={{ backgroundColor: getRiskColor(riskScore) }}
            >
              {Math.round(riskScore)}%
            </div>
            
            <div>
              <p className="text-lg font-semibold">
                Niveau de risque: <span style={{ color: getRiskColor(riskScore) }}>{getRiskLevel(riskScore)}</span>
              </p>
              <p className="text-sm text-gray-600">
                Basé sur les facteurs de risque identifiés et l'analyse de texte des données historiques
              </p>
            </div>
          </div>
          
          <div>
            <h4 className="font-bold mb-2">Facteurs de risque identifiés:</h4>
            <ul className="list-disc pl-5">
              {riskFactors.map((factor, index) => (
                <li key={index}>{factor}</li>
              ))}
            </ul>
          </div>
          
          {riskScore > 50 && (
            <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded">
              <h4 className="font-bold text-red-700">Recommandations:</h4>
              <ul className="list-disc pl-5 text-red-700">
                <li>Augmenter l'utilisation des équipements de protection</li>
                <li>Réduire l'exposition aux produits chimiques identifiés</li>
                <li>Envisager une formation supplémentaire sur les pratiques sécuritaires</li>
                <li>Consulter un professionnel de la santé pour un suivi régulier</li>
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RiskPredictionTool;