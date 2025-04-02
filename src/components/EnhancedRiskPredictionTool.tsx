// EnhancedRiskPredictionTool.tsx - Advanced version with ML integration for risk prediction
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FormControl, InputLabel, MenuItem, Select, Button, Slider, Typography } from '@mui/material';
import { HealthRecord, RiskFactor, SpecificRisks, FeatureImportance } from '../types';

interface EnhancedRiskPredictionToolProps {
  data: HealthRecord[]; // Your dataset
  textRiskFactors: RiskFactor[]; // Risk factors from text analysis
  highlightedRiskFactor?: RiskFactor | null; // Optionally highlight a specific risk factor
}

// Simplified client-side ML model object structure
interface MLModel {
  weights: Record<string, number>;
  intercept: number;
  catFeatureMap: Record<string, Record<string, number>>;
  importance: FeatureImportance[];
  confidenceInterval: number;
  accuracy?: number;
  featureScaling: Record<string, {min: number, max: number, mean: number}>;
}

// Decision tree node structure for interpretable models
interface TreeNode {
  feature?: string;
  threshold?: number;
  trueNode?: TreeNode;
  falseNode?: TreeNode;
  value?: number;
  samples?: number;
  depth: number;
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
  const [maritalStatus, setMaritalStatus] = useState<string>('mariée');
  const [numberOfChildren, setNumberOfChildren] = useState<number>(2);
  const [socioEconomicStatus, setSocioEconomicStatus] = useState<string>('moyen');
  const [employmentStatus, setEmploymentStatus] = useState<string>('permanente');
  
  // Result state
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
  const [modelReady, setModelReady] = useState<boolean>(false);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [confidenceInterval, setConfidenceInterval] = useState<[number, number]>([0, 0]);
  const [predictionModel, setPredictionModel] = useState<MLModel | null>(null);
  const [whatIfScenarios, setWhatIfScenarios] = useState<{label: string, score: number}[]>([]);
  
  // Derived data for dropdowns
  const [availableChemicals, setAvailableChemicals] = useState<string[]>([]);
  const [availableTasks, setAvailableTasks] = useState<string[]>([]);
  const [maritalStatusOptions, setMaritalStatusOptions] = useState<string[]>([]);
  const [socioEconomicOptions, setSocioEconomicOptions] = useState<string[]>([]);
  const [employmentStatusOptions, setEmploymentStatusOptions] = useState<string[]>([]);
  
  // Store the trainModel function in a ref to avoid dependency cycles
  const trainModelRef = useRef<(trainingData: HealthRecord[]) => void>();
  
  // Set up the trainModelRef whenever the dependencies change
  useEffect(() => {
    trainModelRef.current = (trainingData: HealthRecord[]) => {
      try {
        // Extract features and target variable
        const X: Array<Record<string, number>> = [];
        const y: number[] = [];
        
        // Feature engineering function
        const extractFeatures = (record: HealthRecord): Record<string, number> => {
          const features: Record<string, number> = {};
          
          // Numeric features
          features.age = record.Age || 0;
          features.workExperience = record['Ancienneté agricole'] || 0;
          features.workHoursPerDay = record['H travail / jour'] || 0;
          features.workDaysPerWeek = record['J travail / Sem'] || 0;
          features.childrenCount = record['Nb enfants'] || 0;
          
          // Categorical features - one-hot encoding
          if (record['Situation maritale']) {
            features[`maritalStatus_${record['Situation maritale']}`] = 1;
          }
          
          if (record['Niveau socio-économique']) {
            features[`socioEconomic_${record['Niveau socio-économique']}`] = 1;
          }
          
          if (record['Statut']) {
            features[`employmentStatus_${record['Statut']}`] = 1;
          }
          
          // Protection equipment score
          let protectionScore = 0;
          if (record['Masque pour pesticides'] === 'toujours') protectionScore += 5;
          else if (record['Masque pour pesticides'] === 'souvent') protectionScore += 3;
          else if (record['Masque pour pesticides'] === 'parfois') protectionScore += 1;
          
          if (record['Gants'] === 'toujours') protectionScore += 5;
          else if (record['Gants'] === 'souvent') protectionScore += 3;
          else if (record['Gants'] === 'parfois') protectionScore += 1;
          
          if (record['Bottes'] === 'toujours') protectionScore += 4;
          else if (record['Bottes'] === 'souvent') protectionScore += 2;
          else if (record['Bottes'] === 'parfois') protectionScore += 1;
          
          if (record['Casquette/Mdhalla'] === 'toujours') protectionScore += 3;
          else if (record['Casquette/Mdhalla'] === 'souvent') protectionScore += 2;
          else if (record['Casquette/Mdhalla'] === 'parfois') protectionScore += 1;
          
          if (record['Manteau imperméable'] === 'toujours') protectionScore += 4;
          else if (record['Manteau imperméable'] === 'souvent') protectionScore += 2;
          else if (record['Manteau imperméable'] === 'parfois') protectionScore += 1;
          
          features.protectionScore = protectionScore;
          
          // Chemical exposure - boolean flags based on text fields
          const chemicalText = (record['Produits chimiques utilisés'] || '').toLowerCase();
          
          features.pesticide = chemicalText.includes('pesticide') ? 1 : 0;
          features.herbicide = chemicalText.includes('herbicide') ? 1 : 0;
          features.insecticide = chemicalText.includes('insecticide') ? 1 : 0;
          features.fongicide = chemicalText.includes('fongicide') ? 1 : 0;
          features.engrais = chemicalText.includes('engrais') ? 1 : 0;
          
          // Task-related features
          const taskText = (record['Tâches effectuées'] || '').toLowerCase();
          
          features.epandageTasks = taskText.includes('épand') ? 1 : 0;
          features.treatmentTasks = taskText.includes('trait') ? 1 : 0;
          features.harvestingTasks = taskText.includes('récolt') || taskText.includes('cueil') ? 1 : 0;
          features.weedingTasks = taskText.includes('désherb') ? 1 : 0;
          
          // Health indicators
          features.hasTroubleRespiratoire = (record['Troubles cardio-respiratoires'] || '').length > 0 ? 1 : 0;
          features.hasTroubleCognitif = (record['Troubles cognitifs'] || '').length > 0 ? 1 : 0;
          features.hasTroubleNeurologique = (record['Troubles neurologiques'] || '').length > 0 ? 1 : 0;
          features.hasTroubleCutane = (record['Troubles cutanés/phanères'] || '').length > 0 ? 1 : 0;
          
          // Health measurements
          features.tas = record['TAS'] || 0;
          features.tad = record['TAD'] || 0;
          
          return features;
        };
        
        // Calculate risk score based on health issues (target variable)
        const calculateRiskScore = (record: HealthRecord): number => {
          let score = 0;
          
          // Base risk from reported health issues
          if ((record['Troubles cardio-respiratoires'] || '').length > 0) score += 25;
          if ((record['Troubles cognitifs'] || '').length > 0) score += 20;
          if ((record['Troubles neurologiques'] || '').length > 0) score += 25;
          if ((record['Troubles cutanés/phanères'] || '').length > 0) score += 20;
          
          // Add risk based on blood pressure
          const tas = record['TAS'] || 0;
          const tad = record['TAD'] || 0;
          
          if (tas > 140 || tad > 90) score += 10;
          
          // Calculate final normalized score (0-100)
          return Math.min(Math.max(score, 0), 100);
        };
        
        // Prepare training data
        trainingData.forEach(record => {
          const features = extractFeatures(record);
          const riskScore = calculateRiskScore(record);
          
          X.push(features);
          y.push(riskScore);
        });
        
        // Simple feature scaling - normalize numeric features
        const numericFeatures = ['age', 'workExperience', 'workHoursPerDay', 'workDaysPerWeek', 
                                 'childrenCount', 'protectionScore', 'tas', 'tad'];
        const featureStats: Record<string, {min: number, max: number, mean: number}> = {};
        
        // Calculate stats for each numeric feature
        numericFeatures.forEach(feature => {
          const values = X.map(sample => sample[feature] || 0);
          const min = Math.min(...values);
          const max = Math.max(...values);
          const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
          
          featureStats[feature] = { min, max, mean };
        });
        
        // Normalize numeric features
        X.forEach(sample => {
          numericFeatures.forEach(feature => {
            const stats = featureStats[feature];
            if (stats.max !== stats.min) { // Avoid division by zero
              sample[feature] = (sample[feature] - stats.min) / (stats.max - stats.min);
            } else {
              sample[feature] = 0;
            }
          });
        });
        
        // Simple linear regression implementation
        // Calculate weights using gradient descent
        const learningRate = 0.01;
        const iterations = 1000;
        const weights: Record<string, number> = {};
        let intercept = 0;
        
        // Initialize weights to 0
        const allFeatures = new Set<string>();
        X.forEach(sample => {
          Object.keys(sample).forEach(feature => allFeatures.add(feature));
        });
        
        Array.from(allFeatures).forEach(feature => {
          weights[feature] = 0;
        });
        
        // Simple gradient descent
        for (let i = 0; i < iterations; i++) {
          let interceptGradient = 0;
          const weightGradients: Record<string, number> = {};
          
          // Initialize weight gradients
          Object.keys(weights).forEach(feature => {
            weightGradients[feature] = 0;
          });
          
          // Calculate gradients
          for (let j = 0; j < X.length; j++) {
            // Prediction
            let prediction = intercept;
            Object.keys(X[j]).forEach(feature => {
              if (feature in weights) {
                prediction += weights[feature] * X[j][feature];
              }
            });
            
            // Error
            const error = prediction - y[j];
            
            // Update gradients
            interceptGradient += error;
            Object.keys(X[j]).forEach(feature => {
              if (feature in weightGradients) {
                weightGradients[feature] += error * X[j][feature];
              }
            });
          }
          
          // Update weights and intercept
          intercept -= (learningRate * interceptGradient) / X.length;
          Object.keys(weights).forEach(feature => {
            weights[feature] -= (learningRate * weightGradients[feature]) / X.length;
          });
        }
        
        // Calculate feature importance
        const importance: FeatureImportance[] = [];
        Object.keys(weights).forEach(feature => {
          importance.push({
            feature,
            importance: Math.abs(weights[feature])
          });
        });
        
        // Sort by importance (descending)
        importance.sort((a, b) => b.importance - a.importance);
        
        // Calculate confidence interval
        const predictions: number[] = [];
        const errors: number[] = [];
        
        X.forEach((sample, i) => {
          let prediction = intercept;
          Object.keys(sample).forEach(feature => {
            if (feature in weights) {
              prediction += weights[feature] * sample[feature];
            }
          });
          
          // Ensure prediction is between 0 and 100
          prediction = Math.min(Math.max(prediction, 0), 100);
          predictions.push(prediction);
          
          // Calculate error
          const error = Math.abs(prediction - y[i]);
          errors.push(error);
        });
        
        // Calculate mean error
        const meanError = errors.reduce((sum, err) => sum + err, 0) / errors.length;
        
        // Create categorical feature mapping for future predictions
        const catFeatureMap: Record<string, Record<string, number>> = {};
        
        // Marital status mapping
        catFeatureMap.maritalStatus = {};
        maritalStatusOptions.forEach(status => {
          catFeatureMap.maritalStatus[status] = weights[`maritalStatus_${status}`] || 0;
        });
        
        // Socio-economic status mapping
        catFeatureMap.socioEconomic = {};
        socioEconomicOptions.forEach(status => {
          catFeatureMap.socioEconomic[status] = weights[`socioEconomic_${status}`] || 0;
        });
        
        // Employment status mapping
        catFeatureMap.employmentStatus = {};
        employmentStatusOptions.forEach(status => {
          catFeatureMap.employmentStatus[status] = weights[`employmentStatus_${status}`] || 0;
        });
        
        // Set the trained model
        setPredictionModel({
          weights,
          intercept,
          catFeatureMap,
          importance: importance.slice(0, 10), // Top 10 most important features
          confidenceInterval: meanError
        });
        
        setFeatureImportance(importance.slice(0, 10));
        setModelReady(true);
        
        console.log("Model training completed successfully!");
      } catch (error) {
        console.error("Error training the model:", error);
      }
    };
  }, [maritalStatusOptions, socioEconomicOptions, employmentStatusOptions]);

  // Process dataset to extract options and train ML model
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

      // Extract unique categorical values for dropdowns
      const maritalSet = new Set<string>();
      const socioEconomicSet = new Set<string>();
      const employmentSet = new Set<string>();

      data.forEach(record => {
        if (record['Situation maritale']) maritalSet.add(record['Situation maritale'] as string);
        if (record['Niveau socio-économique']) socioEconomicSet.add(record['Niveau socio-économique'] as string);
        if (record['Statut']) employmentSet.add(record['Statut'] as string);
      });
      
      setAvailableChemicals(Array.from(chemicals).sort());
      setAvailableTasks(Array.from(taskSet).sort());
      setMaritalStatusOptions(Array.from(maritalSet).sort());
      setSocioEconomicOptions(Array.from(socioEconomicSet).sort());
      setEmploymentStatusOptions(Array.from(employmentSet).sort());
      
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

      // Train the ML model using the ref to avoid dependency cycles
      if (trainModelRef.current) {
        trainModelRef.current(data);
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

  
  // Function to prepare features from current form inputs
  const prepareFeatures = useCallback(() => {
    const features: Record<string, number> = {};
    
    // Numeric features
    features.age = age;
    features.workExperience = workExperience;
    features.workHoursPerDay = workHoursPerDay;
    features.workDaysPerWeek = workDaysPerWeek;
    features.childrenCount = numberOfChildren;
    
    // Protection equipment score
    const protectionScore = protectiveEquipment.length * 5; // Simplified scoring
    features.protectionScore = protectionScore;
    
    // Chemical exposure - boolean flags
    features.pesticide = chemicalExposure.some(c => c.includes('pesticide')) ? 1 : 0;
    features.herbicide = chemicalExposure.some(c => c.includes('herbicide')) ? 1 : 0;
    features.insecticide = chemicalExposure.some(c => c.includes('insecticide')) ? 1 : 0;
    features.fongicide = chemicalExposure.some(c => c.includes('fongicide')) ? 1 : 0;
    features.engrais = chemicalExposure.some(c => c.includes('engrais')) ? 1 : 0;
    
    // Task-related features
    features.epandageTasks = tasks.some(t => t.includes('épand')) ? 1 : 0;
    features.treatmentTasks = tasks.some(t => t.includes('trait')) ? 1 : 0;
    features.harvestingTasks = tasks.some(t => t.includes('récolt') || t.includes('cueil')) ? 1 : 0;
    features.weedingTasks = tasks.some(t => t.includes('désherb')) ? 1 : 0;
    
    // Health indicators (from form)
    features.hasTroubleRespiratoire = hasRespiratoryConditions ? 1 : 0;
    features.hasTroubleCutane = hasSkinConditions ? 1 : 0;
    features.hasTroubleNeurologique = 0; // Not in form, assume 0
    features.hasTroubleCognitif = 0; // Not in form, assume 0
    
    // Health measurements (not in form, use average values)
    features.tas = 120; // Default systolic pressure
    features.tad = 80;  // Default diastolic pressure
    
    return features;
  }, [
    age, workExperience, workHoursPerDay, workDaysPerWeek, numberOfChildren,
    protectiveEquipment, chemicalExposure, tasks,
    hasRespiratoryConditions, hasSkinConditions
  ]);
  
  // Predict risk using the ML model
  const predictRisk = useCallback((features: Record<string, number>) => {
    if (!predictionModel) return 0;
    
    let prediction = predictionModel.intercept;
    
    // Add contribution from numeric features
    Object.keys(features).forEach(feature => {
      if (feature in predictionModel.weights) {
        prediction += predictionModel.weights[feature] * features[feature];
      }
    });
    
    // Add contribution from categorical features
    if (maritalStatus in predictionModel.catFeatureMap.maritalStatus) {
      prediction += predictionModel.catFeatureMap.maritalStatus[maritalStatus];
    }
    
    if (socioEconomicStatus in predictionModel.catFeatureMap.socioEconomic) {
      prediction += predictionModel.catFeatureMap.socioEconomic[socioEconomicStatus];
    }
    
    if (employmentStatus in predictionModel.catFeatureMap.employmentStatus) {
      prediction += predictionModel.catFeatureMap.employmentStatus[employmentStatus];
    }
    
    // Ensure prediction is between 0 and 100
    return Math.min(Math.max(prediction, 0), 100);
  }, [predictionModel, maritalStatus, socioEconomicStatus, employmentStatus]);
  
  // Enhanced risk calculation with ML integration and what-if scenarios
  const calculateRisk = () => {
    // Initialize base risks by category
    let overallScore = 0;
    let respiratoryRisk = 10;
    let skinRisk = 10;
    let neurologicalRisk = 10;
    
    const factors: string[] = [];
    const recommendations: string[] = [];
    const matched: RiskFactor[] = [];
    
    // ML-based risk prediction
    if (modelReady && predictionModel) {
      // Prepare features from current inputs
      const features = prepareFeatures();
      
      // Use the model to predict the overall risk
      overallScore = predictRisk(features);
      
      // Calculate confidence interval for the prediction
      const ciRange = predictionModel.confidenceInterval;
      setConfidenceInterval([
        Math.max(0, overallScore - ciRange),
        Math.min(100, overallScore + ciRange)
      ]);
      
      // Generate what-if scenarios
      const scenarios: {label: string, score: number}[] = [];
      
      // What if we use all protection equipment?
      const allProtectionFeatures = {...features};
      allProtectionFeatures.protectionScore = 25; // Max protection score
      const allProtectionScore = predictRisk(allProtectionFeatures);
      scenarios.push({
        label: "Avec tous les équipements de protection",
        score: allProtectionScore
      });
      
      // What if we reduce chemical exposure?
      const lessChemicalsFeatures = {...features};
      lessChemicalsFeatures.pesticide = 0;
      lessChemicalsFeatures.herbicide = 0;
      lessChemicalsFeatures.insecticide = 0;
      const lessChemicalsScore = predictRisk(lessChemicalsFeatures);
      scenarios.push({
        label: "Sans exposition aux pesticides/herbicides",
        score: lessChemicalsScore
      });
      
      // What if we reduce work hours?
      const lessWorkFeatures = {...features};
      lessWorkFeatures.workHoursPerDay = Math.min(workHoursPerDay, 6);
      lessWorkFeatures.workDaysPerWeek = Math.min(workDaysPerWeek, 5);
      const lessWorkScore = predictRisk(lessWorkFeatures);
      scenarios.push({
        label: "Avec horaires réduits",
        score: lessWorkScore
      });
      
      setWhatIfScenarios(scenarios);
      
      // Add ML-based risk factors
      factors.push("Prédiction basée sur l'analyse de données similaires");
      
      // Add feature importance-based factors
      predictionModel.importance.slice(0, 5).forEach(feature => {
        const featureName = feature.feature;
        let readableName = featureName;
        
        // Map feature names to readable descriptions
        if (featureName === 'age') readableName = "Âge";
        else if (featureName === 'workExperience') readableName = "Expérience professionnelle";
        else if (featureName === 'workHoursPerDay') readableName = "Heures de travail par jour";
        else if (featureName === 'protectionScore') readableName = "Niveau de protection";
        else if (featureName === 'pesticide') readableName = "Exposition aux pesticides";
        else if (featureName === 'herbicide') readableName = "Exposition aux herbicides";
        else if (featureName === 'hasTroubleRespiratoire') readableName = "Antécédents respiratoires";
        else if (featureName === 'hasTroubleCutane') readableName = "Antécédents cutanés";
        else if (featureName === 'epandageTasks') readableName = "Tâches d'épandage";
        else if (featureName === 'treatmentTasks') readableName = "Tâches de traitement";
        
        if (feature.importance > 0.1) { // Only include significant factors
          factors.push(`Le facteur "${readableName}" influence significativement votre niveau de risque`);
        }
      });
    } else {
      // Fallback to rule-based calculation if ML model is not ready
      // Base risk starts at 15
      overallScore = 15;
      
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
    }
    
    // Chemical exposure risk - common for both approaches
    if (chemicalExposure.length > 0) {
      overallScore += Math.min(5 * chemicalExposure.length, 20);
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
        }
      });
    }
    
    // Task-related risk - common for both approaches
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
    
    // Pre-existing health conditions factors - common for both approaches
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
    
    // Socioeconomic and demographic factor adjustments
    if (socioEconomicStatus === 'bas') {
      overallScore += 5;
      factors.push("Niveau socio-économique bas peut limiter l'accès aux soins");
      recommendations.push("Se renseigner sur les programmes de santé accessibles aux travailleurs agricoles");
    }
    
    if (numberOfChildren > 3) {
      overallScore += 3;
      factors.push("Charge familiale importante (plus de 3 enfants)");
    }
    
    if (employmentStatus === 'saisonnière') {
      overallScore += 5;
      factors.push("Emploi saisonnier potentiellement associé à moins de formation sur les risques");
      recommendations.push("Demander une formation de sécurité au début de chaque saison");
    }
    
    // Cap scores at 100
    respiratoryRisk = Math.min(Math.max(respiratoryRisk, 0), 100);
    skinRisk = Math.min(Math.max(skinRisk, 0), 100);
    neurologicalRisk = Math.min(Math.max(neurologicalRisk, 0), 100);
    overallScore = Math.min(Math.max(overallScore, 0), 100);
    
    // Remove duplicate recommendations
    const uniqueRecommendations = Array.from(new Set(recommendations));
    
    // Add ML-specific recommendations
    if (modelReady) {
      uniqueRecommendations.push("Les recommandations sont basées sur l'analyse de données de santé similaires");
      
      // What-if based recommendations
      if (whatIfScenarios.length > 0) {
        const bestScenario = whatIfScenarios.sort((a, b) => a.score - b.score)[0];
        uniqueRecommendations.push(`D'après nos simulations, "${bestScenario.label}" pourrait réduire votre risque considérablement`);
      }
    }
    
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
      <h2 className="text-xl font-bold mb-4">Outil de Prédiction des Risques IA</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left column - Demographics & Work */}
        <div className="space-y-4">
          <div className="p-3 border rounded-lg bg-blue-50">
            <h3 className="font-bold mb-2">Information Personnelle</h3>
            
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
            
            <div className="mt-4">
              <FormControl fullWidth size="small">
                <InputLabel>Situation maritale</InputLabel>
                <Select
                  value={maritalStatus}
                  onChange={(e) => setMaritalStatus(e.target.value)}
                  label="Situation maritale"
                >
                  {maritalStatusOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
            
            <div className="mt-4">
              <Typography gutterBottom>Nombre d'enfants</Typography>
              <Slider
                value={numberOfChildren}
                onChange={(_, newValue) => setNumberOfChildren(newValue as number)}
                valueLabelDisplay="auto"
                min={0}
                max={10}
                marks={[{value: 0, label: '0'}, {value: 5, label: '5'}, {value: 10, label: '10'}]}
              />
            </div>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <FormControl fullWidth size="small">
                <InputLabel>Niveau socio-économique</InputLabel>
                <Select
                  value={socioEconomicStatus}
                  onChange={(e) => setSocioEconomicStatus(e.target.value)}
                  label="Niveau socio-économique"
                >
                  {socioEconomicOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              
              <FormControl fullWidth size="small">
                <InputLabel>Statut d'emploi</InputLabel>
                <Select
                  value={employmentStatus}
                  onChange={(e) => setEmploymentStatus(e.target.value)}
                  label="Statut d'emploi"
                >
                  {employmentStatusOptions.map(option => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          </div>
          
          <div className="p-3 border rounded-lg bg-teal-50">
            <h3 className="font-bold mb-2">Travail & Expérience</h3>
            
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
            
            <div className="mt-4 grid grid-cols-2 gap-4">
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
          </div>
          
          {/* Health conditions section */}
          <div className="p-3 border rounded-lg bg-red-50">
            <h3 className="font-bold mb-2">Antécédents médicaux</h3>
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
        
        {/* Right column - Exposures & Protection */}
        <div className="space-y-4">
          <div className="p-3 border rounded-lg bg-yellow-50">
            <h3 className="font-bold mb-2">Équipement de protection</h3>
            <FormControl fullWidth margin="normal" size="small">
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
          
          <div className="p-3 border rounded-lg bg-green-50">
            <h3 className="font-bold mb-2">Expositions & Tâches</h3>
            <FormControl fullWidth margin="normal" size="small">
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
            
            <FormControl fullWidth margin="normal" size="small">
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
          </div>
          
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
          
          {/* Model status indicator */}
          <div className={`p-2 text-xs border rounded-lg ${modelReady ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
            {modelReady ? (
              <span className="text-green-700">Modèle de prédiction IA prêt à l'emploi</span>
            ) : (
              <span className="text-yellow-700">Initialisation du modèle prédictif...</span>
            )}
          </div>
          
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
      
      {/* Enhanced ML-Based Results Section */}
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
              
              {/* Confidence interval */}
              {modelReady && (
                <p className="text-xs mt-1 text-gray-500">
                  IC: [{Math.round(confidenceInterval[0])}%-{Math.round(confidenceInterval[1])}%]
                </p>
              )}
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
          
          {/* What-if scenarios */}
          {whatIfScenarios.length > 0 && (
            <div className="mb-6 p-3 border rounded-lg bg-indigo-50">
              <h4 className="font-bold text-indigo-800 mb-3">Scénarios alternatifs:</h4>
              <div className="flex flex-wrap gap-3">
                {whatIfScenarios.map((scenario, index) => (
                  <div key={index} className="flex-1 min-w-[180px] p-2 bg-white rounded border border-indigo-200">
                    <p className="text-sm font-medium mb-1">{scenario.label}</p>
                    <div className="flex items-center">
                      <div 
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2"
                        style={{ backgroundColor: getRiskColor(scenario.score) }}
                      >
                        {Math.round(scenario.score)}%
                      </div>
                      <div className="text-xs">
                        {scenario.score < specificRisks.overall ? (
                          <span className="text-green-600">
                            ↓ {Math.round(specificRisks.overall - scenario.score)}% de réduction
                          </span>
                        ) : (
                          <span className="text-red-600">
                            ↑ {Math.round(scenario.score - specificRisks.overall)}% d'augmentation
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Risk Factors */}
            <div>
              <h4 className="font-bold mb-2">Facteurs de risque identifiés:</h4>
              <ul className="list-disc pl-5 space-y-1">
                {riskFactors.map((factor, index) => (
                  <li key={index}>{factor}</li>
                ))}
              </ul>
              
              {/* Feature importance - ML specific */}
              {modelReady && featureImportance.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-bold mb-2">Facteurs d'influence majeurs:</h4>
                  <div className="pl-2">
                    {featureImportance.slice(0, 5).map((feature, idx) => (
                      <div key={idx} className="mb-1">
                        <div className="flex items-center">
                          <div 
                            className="h-4 rounded"
                            style={{ 
                              width: `${Math.min(feature.importance * 200, 100)}%`,
                              backgroundColor: idx % 2 === 0 ? '#3b82f6' : '#8b5cf6'
                            }}
                          ></div>
                          <div className="ml-2 text-xs">{feature.feature}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Personalized Recommendations */}
            <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <h4 className="font-bold text-blue-800 mb-2">Recommandations personnalisées:</h4>
              <ul className="list-disc pl-5 text-blue-700 space-y-1">
                {personalizedRecommendations.map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
              
              {/* ML-based recommendation note */}
              {modelReady && (
                <div className="mt-3 text-xs text-blue-600 italic">
                  Les recommandations sont basées sur l'analyse de données agricoles similaires et 
                  sur des modèles de prédiction des risques de santé.
                </div>
              )}
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