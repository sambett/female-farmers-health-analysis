// EnhancedRiskPredictionTool.tsx - Advanced version with NLP integration
import React, { useState, useEffect } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, Slider, Typography } from '@mui/material';
import { HealthRecord, RiskFactor, SpecificRisks } from '../types';

interface EnhancedRiskPredictionToolProps {
  data: HealthRecord[]; // Your dataset
  textRiskFactors: RiskFactor[]; // Risk factors from text analysis
  highlightedRiskFactor?: RiskFactor | null; // Optionally highlight a specific risk factor
}

const EnhancedRiskPredictionTool: React.FC<EnhancedRiskPredictionToolProps> = ({ 
  data, 
  textRiskFactors,
  highlightedRiskFactor = null
}) => {
  // Form state with more detailed fields
  const [age, setAge] = useState<number>(35);
  const [workExperience, setWorkExperience] = useState<number>(5);
  const [workHoursPerDay, setWorkHoursPerDay] = useState<number>(8);
  const [workDaysPerWeek, setWorkDaysPerWeek] = useState<number>(5);
  const [protectiveEquipment, setProtectiveEquipment] = useState<string[]>([]);
  const [chemicalExposure, setChemicalExposure] = useState<string[]>([]);
  const [tasks, setTasks] = useState<string[]>([]);
  const [hasRespiratoryConditions, setHasRespiratoryConditions] = useState<boolean>(false);
  const [hasSkinConditions, setHasSkinConditions] = useState<boolean>(false);
  const [hasChronicExposure, setHasChronicExposure] = useState<boolean>(false);
  
  // Enhanced result state
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [specificRisks, setSpecificRisks] = useState<SpecificRisks>({
    respiratory: 0,
    skin: 0,
    neurological: 0,
    overall: 0
  });
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<string[]>([]);
  const [matchedRiskFactors, setMatchedRiskFactors] = useState<RiskFactor[]>([]);
  
  // Derived data for dropdowns
  const [availableChemicals, setAvailableChemicals] = useState<string[]>([]);
  const [availableTasks, setAvailableTasks] = useState<string[]>([]);
  
  // Process dataset to extract options and highlight risk factors from text analysis
  useEffect(() => {
    if (data && data.length > 0) {
      // Extract unique chemicals with improved splitting
      const chemicals = new Set<string>();
      data.forEach(record => {
        const chemicalText = record['Produits chimiques utilisés'] || '';
        if (chemicalText) {
          const terms = chemicalText.toLowerCase().split(/[,;\s-]+/);
          terms.forEach(term => {
            const trimmed = term.trim();
            if (trimmed && trimmed.length > 2) chemicals.add(trimmed);
          });
        }
      });
      
      // Extract unique tasks with improved splitting
      const taskSet = new Set<string>();
      data.forEach(record => {
        const taskText = record['Tâches effectuées'] || '';
        if (taskText) {
          const terms = taskText.toLowerCase().split(/[,;\s-]+/);
          terms.forEach(term => {
            const trimmed = term.trim();
            if (trimmed && trimmed.length > 2) taskSet.add(trimmed);
          });
        }
      });
      
      setAvailableChemicals(Array.from(chemicals).sort());
      setAvailableTasks(Array.from(taskSet).sort());
      
      // If a highlighted risk factor is provided, pre-select it
      if (highlightedRiskFactor) {
        // Pre-select the chemical exposure
        if (chemicals.has(highlightedRiskFactor.exposure)) {
          setChemicalExposure([highlightedRiskFactor.exposure]);
        }
        
        // Look for related tasks
        const relatedTasks: string[] = [];
        if (highlightedRiskFactor.exposure === 'pesticide') {
          Array.from(taskSet).forEach(task => {
            if (task.includes('trait') || task.includes('pulvéris') || task.includes('épand')) {
              relatedTasks.push(task);
            }
          });
        } else if (highlightedRiskFactor.exposure === 'herbicide') {
          Array.from(taskSet).forEach(task => {
            if (task.includes('désherbag') || task.includes('désherb')) {
              relatedTasks.push(task);
            }
          });
        }
        
        if (relatedTasks.length > 0) {
          setTasks(relatedTasks);
        }
        
        // Pre-set health conditions based on the risk factor
        const healthIssue = highlightedRiskFactor.healthIssue.toLowerCase();
        if (
          healthIssue.includes('dyspnée') || 
          healthIssue.includes('respir') || 
          healthIssue.includes('toux') || 
          healthIssue.includes('asthme')
        ) {
          setHasRespiratoryConditions(true);
        }
        
        if (
          healthIssue.includes('cutané') || 
          healthIssue.includes('dermat') || 
          healthIssue.includes('irrit') || 
          healthIssue.includes('peau')
        ) {
          setHasSkinConditions(true);
        }
      }
    }
  }, [data, highlightedRiskFactor]);
  
  // Get available protective equipment options
  const protectiveEquipmentOptions = [
    { value: 'masque', label: 'Masque' },
    { value: 'gants', label: 'Gants' },
    { value: 'bottes', label: 'Bottes' },
    { value: 'casquette', label: 'Casquette/Mdhalla' },
    { value: 'manteau', label: 'Manteau imperméable' }
  ];
  
  // Enhanced risk calculation with detailed factors and system integration
  const calculateRisk = () => {
    // Initialize base risks by category
    let overallScore = 15; // Base risk starts at 15
    let respiratoryRisk = 10;
    let skinRisk = 10;
    let neurologicalRisk = 10;
    
    const factors: string[] = [];
    const recommendations: string[] = [];
    const matched: RiskFactor[] = [];
    
    // Age-related risk factors
    if (age > 50) {
      overallScore += 10;
      respiratoryRisk += 12;
      skinRisk += 8;
      neurologicalRisk += 7;
      factors.push("Âge supérieur à 50 ans");
      recommendations.push("Envisager un suivi médical plus régulier compte tenu de l'âge");
    } else if (age > 40) {
      overallScore += 5;
      respiratoryRisk += 6;
      skinRisk += 4;
      factors.push("Âge entre 40 et 50 ans");
    }
    
    // Work experience risk factors
    if (workExperience < 3) {
      overallScore += 12;
      factors.push("Moins de 3 ans d'expérience professionnelle");
      recommendations.push("Suivre une formation sur les pratiques agricoles sécuritaires");
    } else if (workExperience < 5) {
      overallScore += 6;
      factors.push("Expérience professionnelle limitée (3-5 ans)");
    } else if (workExperience > 15) {
      // Long-term exposure also has risks
      overallScore += 4;
      respiratoryRisk += 8;
      neurologicalRisk += 10;
      factors.push("Exposition professionnelle prolongée (>15 ans)");
      recommendations.push("Envisager un dépistage des maladies chroniques liées à l'exposition à long terme");
    }
    
    // Work intensity factors
    const weeklyHours = workHoursPerDay * workDaysPerWeek;
    if (weeklyHours > 48) {
      overallScore += 15;
      factors.push("Charge de travail très élevée (>48h/semaine)");
      recommendations.push("Réduire les heures de travail ou prévoir des pauses régulières");
    } else if (weeklyHours > 40) {
      overallScore += 8;
      factors.push("Charge de travail élevée (>40h/semaine)");
    }
    
    if (workHoursPerDay > 8) {
      overallScore += 8;
      factors.push("Journées de travail prolongées (>8h/jour)");
    }
    
    // Protection equipment evaluation
    const protectionPercentage = (protectiveEquipment.length / protectiveEquipmentOptions.length) * 100;
    
    // Check for specific essential protection
    const hasMask = protectiveEquipment.includes('masque');
    const hasGloves = protectiveEquipment.includes('gants');
    
    if (protectionPercentage < 40) {
      overallScore += 20;
      respiratoryRisk += 25;
      skinRisk += 25;
      factors.push("Utilisation insuffisante d'équipement de protection");
      recommendations.push("Utiliser systématiquement l'équipement de protection complet");
    } else if (protectionPercentage >= 80) {
      overallScore -= 15;
      respiratoryRisk -= 15;
      skinRisk -= 15;
      factors.push("Bonne utilisation d'équipement de protection");
    }
    
    if (!hasMask && chemicalExposure.length > 0) {
      respiratoryRisk += 15;
      factors.push("Absence de protection respiratoire lors de l'utilisation de produits chimiques");
      recommendations.push("Porter systématiquement un masque adapté lors de l'utilisation de produits chimiques");
    }
    
    if (!hasGloves && chemicalExposure.length > 0) {
      skinRisk += 15;
      factors.push("Absence de protection des mains lors de l'utilisation de produits chimiques");
      recommendations.push("Porter systématiquement des gants lors de la manipulation de produits chimiques");
    }
    
    // Chemical exposure risk
    if (chemicalExposure.length > 0) {
      overallScore += 5 * chemicalExposure.length;
      factors.push(`Exposition à ${chemicalExposure.length} produits chimiques`);
      
      // Integration with text analysis
      let highestRiskScore = 0;
      
      chemicalExposure.forEach(chemical => {
        // Look for matching risk factors from text analysis
        const matchingRiskFactors = textRiskFactors.filter(rf => 
          rf.exposure.includes(chemical) || chemical.includes(rf.exposure));
        
        if (matchingRiskFactors.length > 0) {
          // Add all matching risk factors to our list
          matchingRiskFactors.forEach(riskFactor => {
            if (!matched.some(m => m.healthIssue === riskFactor.healthIssue && m.exposure === riskFactor.exposure)) {
              matched.push(riskFactor);
            }
          });
          
          // Add the highest risk score
          const highestRiskFactor = matchingRiskFactors.sort((a, b) => b.riskScore - a.riskScore)[0];
          highestRiskScore = Math.max(highestRiskScore, highestRiskFactor.riskScore);
          
          // Add category-specific risk based on health issue
          const healthIssue = highestRiskFactor.healthIssue.toLowerCase();
          
          if (healthIssue.includes('respir') || healthIssue.includes('dyspnée') || 
              healthIssue.includes('toux') || healthIssue.includes('pulmonaire')) {
            respiratoryRisk += highestRiskFactor.riskScore / 3;
            factors.push(`Association entre ${chemical} et troubles respiratoires (${highestRiskFactor.healthIssue})`);
            recommendations.push("Utiliser un masque respiratoire avec filtres adaptés");
          }
          
          if (healthIssue.includes('cutan') || healthIssue.includes('dermat') || 
              healthIssue.includes('peau') || healthIssue.includes('irritation')) {
            skinRisk += highestRiskFactor.riskScore / 3;
            factors.push(`Association entre ${chemical} et troubles cutanés (${highestRiskFactor.healthIssue})`);
            recommendations.push("Porter des vêtements longs et des gants lors de l'exposition");
          }
          
          if (healthIssue.includes('neuro') || healthIssue.includes('céphal') || 
              healthIssue.includes('mémoire') || healthIssue.includes('vertige')) {
            neurologicalRisk += highestRiskFactor.riskScore / 3;
            factors.push(`Association entre ${chemical} et troubles neurologiques (${highestRiskFactor.healthIssue})`);
            recommendations.push("Limiter la durée d'exposition et assurer une bonne ventilation");
          }
          
          // Add to overall score
          overallScore += highestRiskFactor.riskScore / 4;
        }
      });
    }
    
    // Task-related risk
    if (tasks.length > 0) {
      // High-risk tasks by category
      const highRespiratoryRiskTasks = ['pesticide', 'traitement', 'pulvérisation', 'fumigation'];
      const highSkinRiskTasks = ['désherbage', 'récolte', 'taille'];
      const highNeurologicalRiskTasks = ['pesticide', 'traitement', 'épandage'];
      
      // Check if high respiratory risk tasks are selected
      const hasHighRespiratoryRiskTask = tasks.some(task => 
        highRespiratoryRiskTasks.some(highRisk => task.includes(highRisk))
      );
      
      // Check if high skin risk tasks are selected
      const hasHighSkinRiskTask = tasks.some(task => 
        highSkinRiskTasks.some(highRisk => task.includes(highRisk))
      );
      
      // Check if high neurological risk tasks are selected
      const hasHighNeurologicalRiskTask = tasks.some(task => 
        highNeurologicalRiskTasks.some(highRisk => task.includes(highRisk))
      );
      
      // Apply risk factors based on tasks
      if (hasHighRespiratoryRiskTask) {
        respiratoryRisk += 15;
        factors.push("Tâches à haut risque respiratoire sélectionnées");
        recommendations.push("Porter un masque respiratoire lors des tâches impliquant des produits chimiques");
      }
      
      if (hasHighSkinRiskTask) {
        skinRisk += 12;
        factors.push("Tâches pouvant affecter la peau sélectionnées");
        recommendations.push("Utiliser des crèmes barrières et laver soigneusement la peau après le travail");
      }
      
      if (hasHighNeurologicalRiskTask) {
        neurologicalRisk += 15;
        factors.push("Tâches pouvant affecter le système nerveux sélectionnées");
        recommendations.push("Prendre des pauses régulières et travailler dans des zones bien ventilées");
      }
    }
    
    // Pre-existing health conditions factors
    if (hasRespiratoryConditions) {
      respiratoryRisk += 20;
      overallScore += 10;
      factors.push("Antécédents de troubles respiratoires");
      recommendations.push("Consulter un médecin pour évaluer la compatibilité entre votre condition respiratoire et votre travail");
    }
    
    if (hasSkinConditions) {
      skinRisk += 20;
      overallScore += 8;
      factors.push("Antécédents de troubles cutanés");
      recommendations.push("Consulter un dermatologue pour des recommandations spécifiques à votre condition");
    }
    
    if (hasChronicExposure) {
      overallScore += 15;
      neurologicalRisk += 15;
      respiratoryRisk += 10;
      factors.push("Exposition chronique aux produits chimiques");
      recommendations.push("Envisager une rotation des tâches pour réduire l'exposition aux mêmes produits");
    }
    
    // Cap scores at 100
    respiratoryRisk = Math.min(Math.max(respiratoryRisk, 0), 100);
    skinRisk = Math.min(Math.max(skinRisk, 0), 100);
    neurologicalRisk = Math.min(Math.max(neurologicalRisk, 0), 100);
    overallScore = Math.min(Math.max(overallScore, 0), 100);
    
    // Remove duplicate recommendations
    const uniqueRecommendations = Array.from(new Set(recommendations));
    
    // Update state with calculated risks
    setRiskScore(overallScore);
    setRiskFactors(factors);
    setSpecificRisks({
      respiratory: Math.round(respiratoryRisk),
      skin: Math.round(skinRisk),
      neurological: Math.round(neurologicalRisk),
      overall: Math.round(overallScore)
    });
    setPersonalizedRecommendations(uniqueRecommendations);
    setMatchedRiskFactors(matched);
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
      <h2 className="text-xl font-bold mb-4">Outil de Prédiction des Risques Avancé</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Typography gutterBottom>Âge</Typography>
            <Slider
              value={age}
              onChange={(_, newValue) => setAge(newValue as number)}
              valueLabelDisplay="auto"
              min={18}
              max={70}
              marks={[{value: 18, label: '18'}, {value: 50, label: '50'}, {value: 70, label: '70'}]}
            />
          </div>
          
          <div>
            <Typography gutterBottom>Années d'expérience en agriculture</Typography>
            <Slider
              value={workExperience}
              onChange={(_, newValue) => setWorkExperience(newValue as number)}
              valueLabelDisplay="auto"
              min={0}
              max={40}
              marks={[{value: 0, label: '0'}, {value: 15, label: '15'}, {value: 40, label: '40'}]}
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Typography gutterBottom>Heures de travail par jour</Typography>
              <Slider
                value={workHoursPerDay}
                onChange={(_, newValue) => setWorkHoursPerDay(newValue as number)}
                valueLabelDisplay="auto"
                min={1}
                max={12}
                marks={[{value: 1, label: '1'}, {value: 8, label: '8'}, {value: 12, label: '12'}]}
              />
            </div>
            
            <div>
              <Typography gutterBottom>Jours de travail par semaine</Typography>
              <Slider
                value={workDaysPerWeek}
                onChange={(_, newValue) => setWorkDaysPerWeek(newValue as number)}
                valueLabelDisplay="auto"
                min={1}
                max={7}
                marks={[{value: 1, label: '1'}, {value: 5, label: '5'}, {value: 7, label: '7'}]}
              />
            </div>
          </div>
          
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
          
          {/* Health conditions checkboxes */}
          <div className="mt-4 border p-4 rounded-lg bg-gray-50">
            <Typography variant="subtitle1" className="font-bold mb-2">Antécédents médicaux</Typography>
            <div className="flex flex-col space-y-2">
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={hasRespiratoryConditions}
                  onChange={e => setHasRespiratoryConditions(e.target.checked)}
                  className="mr-2"
                />
                Antécédents de troubles respiratoires
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={hasSkinConditions}
                  onChange={e => setHasSkinConditions(e.target.checked)}
                  className="mr-2"
                />
                Antécédents de problèmes cutanés
              </label>
              <label className="flex items-center">
                <input 
                  type="checkbox" 
                  checked={hasChronicExposure}
                  onChange={e => setHasChronicExposure(e.target.checked)}
                  className="mr-2"
                />
                Exposition chronique aux produits chimiques
              </label>
            </div>
          </div>
        </div>
        
        <div className="space-y-4">
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
          
          {/* Highlight text analysis risk factors if any */}
          {highlightedRiskFactor && (
            <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg my-4">
              <p className="font-bold text-yellow-800">Facteur de risque identifié par analyse de texte:</p>
              <p className="text-sm">
                Association entre <span className="font-bold">{highlightedRiskFactor.exposure}</span> et{' '}
                <span className="font-bold">{highlightedRiskFactor.healthIssue}</span>
              </p>
              <p className="text-xs mt-1">Score de risque: {highlightedRiskFactor.riskScore}</p>
            </div>
          )}
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={calculateRisk}
            className="mt-4 w-full py-3"
          >
            Calculer le Risque
          </Button>
        </div>
      </div>
      
      {/* Enhanced Results Section */}
      {riskScore !== null && (
        <div className="mt-6 p-4 border rounded-lg">
          <h3 className="text-lg font-bold mb-4">Résultats de l'Évaluation des Risques</h3>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            {/* Overall Risk */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: getRiskColor(specificRisks.overall) }}
              >
                {specificRisks.overall}%
              </div>
              <p className="mt-2 font-semibold">Risque global</p>
              <p className="text-sm">{getRiskLevel(specificRisks.overall)}</p>
            </div>
            
            {/* Respiratory Risk */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: getRiskColor(specificRisks.respiratory) }}
              >
                {specificRisks.respiratory}%
              </div>
              <p className="mt-2 font-semibold">Risque respiratoire</p>
              <p className="text-sm">{getRiskLevel(specificRisks.respiratory)}</p>
            </div>
            
            {/* Skin Risk */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: getRiskColor(specificRisks.skin) }}
              >
                {specificRisks.skin}%
              </div>
              <p className="mt-2 font-semibold">Risque cutané</p>
              <p className="text-sm">{getRiskLevel(specificRisks.skin)}</p>
            </div>
            
            {/* Neurological Risk */}
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <div 
                className="w-20 h-20 rounded-full mx-auto flex items-center justify-center text-white text-xl font-bold"
                style={{ backgroundColor: getRiskColor(specificRisks.neurological) }}
              >
                {specificRisks.neurological}%
              </div>
              <p className="mt-2 font-semibold">Risque neurologique</p>
              <p className="text-sm">{getRiskLevel(specificRisks.neurological)}</p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <div>
              <h4 className="font-bold mb-2">Facteurs de risque identifiés:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
            </div>
            
            {/* Personalized Recommendations */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Recommandations personnalisées:</h4>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                {personalizedRecommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Text Analysis Risk Factors */}
          {matchedRiskFactors.length > 0 && (
            <div className="mt-6">
              <h4 className="font-bold mb-2">Associations issues de l'analyse textuelle:</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {matchedRiskFactors.map((factor, index) => (
                  <div key={index} className="p-3 border rounded-lg bg-yellow-50">
                    <p><span className="font-bold">{factor.healthIssue}</span> + <span className="font-bold">{factor.exposure}</span></p>
                    <p className="text-sm">Occurrences: {factor.occurrenceCount}</p>
                    <p className="text-sm">Score de risque: {factor.riskScore}/100</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default EnhancedRiskPredictionTool;