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
        
        // Enhanced feature engineering function with more sophisticated features
        const extractFeatures = (record: HealthRecord): Record<string, number> => {
          const features: Record<string, number> = {};
          
          // Numeric features - with better handling of missing values
          features.age = record.Age || 35; // Default age if missing
          features.workExperience = record['Ancienneté agricole'] || 0;
          features.workHoursPerDay = record['H travail / jour'] || 8; // Default to 8 hours
          features.workDaysPerWeek = record['J travail / Sem'] || 5; // Default to 5 days
          features.childrenCount = record['Nb enfants'] || 0;
          
          // Derived features
          features.weeklyWorkHours = features.workHoursPerDay * features.workDaysPerWeek;
          features.workIntensity = features.weeklyWorkHours > 48 ? 3 : (features.weeklyWorkHours > 40 ? 2 : 1);
          
          // Additional age-related features
          features.ageGroup = features.age < 30 ? 1 : (features.age < 45 ? 2 : (features.age < 60 ? 3 : 4));
          features.experienceToAgeRatio = features.age > 0 ? features.workExperience / features.age : 0;
          
          // Categorical features - one-hot encoding with missing value handling
          const maritalStatus = record['Situation maritale'] || 'non_spécifié';
          features[`maritalStatus_${maritalStatus}`] = 1;
          
          const socioEconomic = record['Niveau socio-économique'] || 'moyen';  
          features[`socioEconomic_${socioEconomic}`] = 1;
          
          const employmentStatus = record['Statut'] || 'permanente';
          features[`employmentStatus_${employmentStatus}`] = 1;
          
          // Enhanced protection equipment score with weighting based on importance
          let protectionScore = 0;
          let maxPossibleScore = 0;
          
          // Mask - highest importance for chemical protection
          maxPossibleScore += 5;
          if (record['Masque pour pesticides'] === 'toujours') protectionScore += 5;
          else if (record['Masque pour pesticides'] === 'souvent') protectionScore += 3;
          else if (record['Masque pour pesticides'] === 'parfois') protectionScore += 1;
          
          // Gloves - high importance
          maxPossibleScore += 5;
          if (record['Gants'] === 'toujours') protectionScore += 5;
          else if (record['Gants'] === 'souvent') protectionScore += 3;
          else if (record['Gants'] === 'parfois') protectionScore += 1;
          
          // Boots - medium importance
          maxPossibleScore += 4;
          if (record['Bottes'] === 'toujours') protectionScore += 4;
          else if (record['Bottes'] === 'souvent') protectionScore += 2;
          else if (record['Bottes'] === 'parfois') protectionScore += 1;
          
          // Hat/Head cover - lower importance but still relevant
          maxPossibleScore += 3;
          if (record['Casquette/Mdhalla'] === 'toujours') protectionScore += 3;
          else if (record['Casquette/Mdhalla'] === 'souvent') protectionScore += 2;
          else if (record['Casquette/Mdhalla'] === 'parfois') protectionScore += 1;
          
          // Waterproof coat - important for chemical protection
          maxPossibleScore += 4;
          if (record['Manteau imperméable'] === 'toujours') protectionScore += 4;
          else if (record['Manteau imperméable'] === 'souvent') protectionScore += 2;
          else if (record['Manteau imperméable'] === 'parfois') protectionScore += 1;
          
          // Calculate percentage of protection score
          features.protectionScore = protectionScore;
          features.protectionPercent = maxPossibleScore > 0 ? (protectionScore / maxPossibleScore) * 100 : 0;
          features.protectionCategory = features.protectionPercent >= 75 ? 3 : 
                                        (features.protectionPercent >= 50 ? 2 : 
                                        (features.protectionPercent >= 25 ? 1 : 0));
          
          // Chemical exposure - enhanced detection with better text parsing
          const chemicalText = (record['Produits chimiques utilisés'] || '').toLowerCase();
          const chemicalTerms = chemicalText.split(/[,;\s-]+/).map(t => t.trim()).filter(t => t.length > 2);
          
          // Specific chemical exposures
          features.pesticide = chemicalText.includes('pesticide') ? 1 : 0;
          features.herbicide = chemicalText.includes('herbicide') ? 1 : 0;
          features.insecticide = chemicalText.includes('insecticide') ? 1 : 0;
          features.fongicide = chemicalText.includes('fongicide') || chemicalText.includes('fongique') ? 1 : 0;
          features.engrais = chemicalText.includes('engrais') ? 1 : 0;
          
          // Count of different chemical exposures
          features.chemicalExposureCount = [
            features.pesticide, features.herbicide, features.insecticide, 
            features.fongicide, features.engrais
          ].filter(Boolean).length;
          
          // Hazardous chemical exposure
          features.hazardousChemicalExposure = (features.pesticide || features.herbicide || features.insecticide) ? 1 : 0;
          
          // Task-related features with better detection
          const taskText = (record['Tâches effectuées'] || '').toLowerCase();
          const taskTerms = taskText.split(/[,;\s-]+/).map(t => t.trim()).filter(t => t.length > 2);
          
          // Specific tasks
          features.epandageTasks = taskText.includes('épand') ? 1 : 0;
          features.treatmentTasks = taskText.includes('trait') || taskText.includes('pulvéris') ? 1 : 0;
          features.harvestingTasks = taskText.includes('récolt') || taskText.includes('cueil') ? 1 : 0;
          features.weedingTasks = taskText.includes('désherb') ? 1 : 0;
          features.pruningTasks = taskText.includes('taill') ? 1 : 0;
          
          // High risk task count (tasks involving chemical exposure)
          features.highRiskTaskCount = [
            features.epandageTasks, features.treatmentTasks, features.weedingTasks
          ].filter(Boolean).length;
          
          // Task variety (total number of different tasks)
          features.taskVariety = [
            features.epandageTasks, features.treatmentTasks, features.harvestingTasks,
            features.weedingTasks, features.pruningTasks
          ].filter(Boolean).length;
          
          // Health indicators - with more detailed extraction
          // Respiratory issues
          const respiratoryText = (record['Troubles cardio-respiratoires'] || '').toLowerCase();
          features.hasTroubleRespiratoire = respiratoryText.length > 0 ? 1 : 0;
          features.hasDyspnea = respiratoryText.includes('dyspn') ? 1 : 0;
          features.hasCough = respiratoryText.includes('toux') ? 1 : 0;
          features.hasAsthma = respiratoryText.includes('asthm') ? 1 : 0;
          features.respiratorySeverity = features.hasDyspnea ? 3 : (features.hasCough ? 2 : (features.hasTroubleRespiratoire ? 1 : 0));
          
          // Cognitive issues
          const cognitiveText = (record['Troubles cognitifs'] || '').toLowerCase();
          features.hasTroubleCognitif = cognitiveText.length > 0 ? 1 : 0;
          features.hasMemoryIssues = cognitiveText.includes('mémoire') ? 1 : 0;
          features.cognitivitySeverity = features.hasMemoryIssues ? 2 : (features.hasTroubleCognitif ? 1 : 0);
          
          // Neurological issues
          const neuroText = (record['Troubles neurologiques'] || '').toLowerCase();
          features.hasTroubleNeurologique = neuroText.length > 0 ? 1 : 0;
          features.hasHeadaches = neuroText.includes('céphal') || neuroText.includes('migrain') ? 1 : 0;
          features.hasVertigo = neuroText.includes('vertige') ? 1 : 0;
          features.neurologicalSeverity = features.hasVertigo ? 3 : (features.hasHeadaches ? 2 : (features.hasTroubleNeurologique ? 1 : 0));
          
          // Skin issues
          const skinText = (record['Troubles cutanés/phanères'] || '').toLowerCase();
          features.hasTroubleCutane = skinText.length > 0 ? 1 : 0;
          features.hasDermatitis = skinText.includes('dermat') ? 1 : 0;
          features.hasIrritation = skinText.includes('irrit') ? 1 : 0;
          features.skinSeverity = features.hasDermatitis ? 3 : (features.hasIrritation ? 2 : (features.hasTroubleCutane ? 1 : 0));
          
          // Health measurements with better handling of missing values and derived features
          features.tas = record['TAS'] || 120; // Default to 120 if missing
          features.tad = record['TAD'] || 80;  // Default to 80 if missing
          
          // Derived blood pressure features
          features.hypertension = (features.tas > 140 || features.tad > 90) ? 1 : 0;
          features.hypotension = (features.tas < 90 || features.tad < 60) ? 1 : 0;
          features.bpCategory = features.hypertension ? 3 : (features.hypotension ? 1 : 2); // 3=high, 2=normal, 1=low
          
          // Count of health issues
          features.healthIssueCount = [
            features.hasTroubleRespiratoire, features.hasTroubleCognitif,
            features.hasTroubleNeurologique, features.hasTroubleCutane
          ].filter(Boolean).length;
          
          // Overall severity score
          features.overallHealthSeverity = features.respiratorySeverity + 
                                          features.cognitivitySeverity + 
                                          features.neurologicalSeverity + 
                                          features.skinSeverity;
          
          // Protection adequacy based on chemical exposure
          features.chemicalProtectionGap = features.hazardousChemicalExposure && features.protectionPercent < 50 ? 1 : 0;
          
          return features;
        };
        
        // Enhanced risk score calculation that better captures health risks
        const calculateRiskScore = (record: HealthRecord): number => {
          let score = 0;
          
          // Base risk from reported health issues with improved weighting
          const respText = (record['Troubles cardio-respiratoires'] || '');
          if (respText.length > 0) {
            // Higher weight for specific conditions
            score += 20;
            if (respText.includes('dyspn')) score += 5;
            if (respText.includes('toux')) score += 3;
            if (respText.includes('asthm')) score += 7;
          }
          
          // Cognitive issues
          const cogText = (record['Troubles cognitifs'] || '');
          if (cogText.length > 0) {
            score += 15;
            if (cogText.includes('mémoire')) score += 5;
            if (cogText.includes('concentration')) score += 3;
          }
          
          // Neurological issues
          const neuroText = (record['Troubles neurologiques'] || '');
          if (neuroText.length > 0) {
            score += 20;
            if (neuroText.includes('céphal') || neuroText.includes('migrain')) score += 3;
            if (neuroText.includes('vertige')) score += 5;
            if (neuroText.includes('tremblement')) score += 7;
          }
          
          // Skin issues
          const skinText = (record['Troubles cutanés/phanères'] || '');
          if (skinText.length > 0) {
            score += 15;
            if (skinText.includes('dermat')) score += 5;
            if (skinText.includes('irrit')) score += 3;
            if (skinText.includes('eczéma')) score += 7;
          }
          
          // Add risk based on blood pressure with better thresholds
          const tas = record['TAS'] || 120;
          const tad = record['TAD'] || 80;
          
          if (tas >= 160 || tad >= 100) score += 15; // Stage 2 hypertension
          else if (tas >= 140 || tad >= 90) score += 10; // Stage 1 hypertension
          else if (tas <= 90 || tad <= 60) score += 5; // Hypotension
          
          // Age factor - higher risk for older ages
          const age = record['Age'] || 35;
          if (age >= 60) score += 15;
          else if (age >= 50) score += 10;
          else if (age >= 40) score += 5;
          
          // Work intensity factor
          const hoursPerDay = record['H travail / jour'] || 8;
          const daysPerWeek = record['J travail / Sem'] || 5;
          const weeklyHours = hoursPerDay * daysPerWeek;
          
          if (weeklyHours > 60) score += 15;
          else if (weeklyHours > 48) score += 10;
          else if (weeklyHours > 40) score += 5;
          
          // Protection equipment impact
          let protectionScore = 0;
          let maxScore = 0;
          
          // Assess protection equipment usage
          const assessProtection = (usage: string | undefined, weight: number) => {
            maxScore += weight;
            if (usage === 'toujours') return weight;
            if (usage === 'souvent') return weight * 0.6;
            if (usage === 'parfois') return weight * 0.2;
            return 0;
          };
          
          protectionScore += assessProtection(record['Masque pour pesticides'], 5);
          protectionScore += assessProtection(record['Gants'], 5);
          protectionScore += assessProtection(record['Bottes'], 4);
          protectionScore += assessProtection(record['Casquette/Mdhalla'], 3);
          protectionScore += assessProtection(record['Manteau imperméable'], 4);
          
          // Calculate protection percentage
          const protectionPercent = maxScore > 0 ? (protectionScore / maxScore) * 100 : 0;
          
          // Adjust risk based on protection percentage
          if (protectionPercent < 30) score += 15;
          else if (protectionPercent < 50) score += 10;
          else if (protectionPercent < 70) score += 5;
          else if (protectionPercent >= 90) score -= 10;
          else if (protectionPercent >= 80) score -= 5;
          
          // Exposure to chemicals factor
          const chemicalText = (record['Produits chimiques utilisés'] || '').toLowerCase();
          
          if (chemicalText.includes('pesticide')) score += 12;
          if (chemicalText.includes('herbicide')) score += 10;
          if (chemicalText.includes('insecticide')) score += 10;
          if (chemicalText.includes('fongicide')) score += 8;
          
          // Experience factor - less experience increases risk
          const experience = record['Ancienneté agricole'] || 0;
          if (experience < 2) score += 10;
          else if (experience < 5) score += 5;
          
          // Socioeconomic factor - lower socioeconomic status may increase risk due to access to resources
          const socioEconomic = (record['Niveau socio-économique'] || '').toLowerCase();
          if (socioEconomic === 'bas') score += 5;
          
          // Tasks factor
          const taskText = (record['Tâches effectuées'] || '').toLowerCase();
          
          if (taskText.includes('épand') || taskText.includes('pulvéris')) score += 10;
          if (taskText.includes('trait')) score += 8;
          if (taskText.includes('désherb')) score += 7;
          
          // Calculate final normalized score (0-100) with limits
          return Math.min(Math.max(score, 0), 100);
        };
        
        // Prepare training data
        trainingData.forEach(record => {
          const features = extractFeatures(record);
          const riskScore = calculateRiskScore(record);
          
          X.push(features);
          y.push(riskScore);
        });
        
        // Advanced feature scaling - normalize numeric features
        const numericFeatures = [
          'age', 'workExperience', 'workHoursPerDay', 'workDaysPerWeek', 
          'childrenCount', 'protectionScore', 'protectionPercent', 'tas', 'tad',
          'weeklyWorkHours', 'chemicalExposureCount', 'highRiskTaskCount', 
          'taskVariety', 'healthIssueCount', 'overallHealthSeverity'
        ];
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
        
        // Improved regression model with regularization to prevent overfitting
        // Calculate weights using gradient descent with L2 regularization
        const learningRate = 0.01;
        const iterations = 1500;
        const regularizationRate = 0.01; // L2 regularization parameter
        const weights: Record<string, number> = {};
        let intercept = 0;
        
        // Initialize weights to small random values
        const allFeatures = new Set<string>();
        X.forEach(sample => {
          Object.keys(sample).forEach(feature => allFeatures.add(feature));
        });
        
        Array.from(allFeatures).forEach(feature => {
          weights[feature] = Math.random() * 0.1 - 0.05; // Initialize to small random values
        });
        
        // Advanced gradient descent with regularization
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
                // Add L2 regularization term to gradient
                weightGradients[feature] += error * X[j][feature] + regularizationRate * weights[feature];
              }
            });
          }
          
          // Update weights and intercept with adaptive learning rate
          const effectiveLearningRate = learningRate / (1 + i / 500); // Decrease learning rate over time
          intercept -= (effectiveLearningRate * interceptGradient) / X.length;
          Object.keys(weights).forEach(feature => {
            weights[feature] -= (effectiveLearningRate * weightGradients[feature]) / X.length;
          });
        }
        
        // Calculate feature importance with improved normalization
        let maxImportance = 0;
        const rawImportance: FeatureImportance[] = [];
        
        Object.keys(weights).forEach(feature => {
          const importance = Math.abs(weights[feature]);
          maxImportance = Math.max(maxImportance, importance);
          rawImportance.push({ feature, importance });
        });
        
        // Normalize importance values to 0-1 range
        const importance = rawImportance.map(item => ({
          feature: item.feature,
          importance: maxImportance > 0 ? item.importance / maxImportance : 0
        }));
        
        // Sort by importance (descending)
        importance.sort((a, b) => b.importance - a.importance);
        
        // Calculate model performance metrics
        const predictions: number[] = [];
        const errors: number[] = [];
        const squaredErrors: number[] = [];
        
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
          
          // Calculate errors
          const error = Math.abs(prediction - y[i]);
          errors.push(error);
          squaredErrors.push(error * error);
        });
        
        // Calculate mean absolute error (MAE)
        const meanError = errors.reduce((sum, err) => sum + err, 0) / errors.length;
        
        // Calculate root mean squared error (RMSE)
        const mse = squaredErrors.reduce((sum, err) => sum + err, 0) / squaredErrors.length;
        const rmse = Math.sqrt(mse);
        
        // Calculate R-squared (coefficient of determination)
        const meanY = y.reduce((sum, val) => sum + val, 0) / y.length;
        const totalSumOfSquares = y.reduce((sum, val) => sum + (val - meanY) * (val - meanY), 0);
        const residualSumOfSquares = squaredErrors.reduce((sum, err) => sum + err, 0);
        const rSquared = 1 - (residualSumOfSquares / totalSumOfSquares);
        
        // Simple accuracy estimation (percentage of predictions within 10% of actual value)
        const accurateCount = errors.filter(err => err <= 10).length;
        const accuracy = (accurateCount / errors.length) * 100;
        
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
        
        // Build a simple decision tree for interpretable predictions
        // Here we'll just create a basic decision tree based on the most important features
        const buildSimpleDecisionTree = (): TreeNode => {
          // Start with the top important features
          const topFeatures = importance.slice(0, 5).map(f => f.feature);
          
          // Create a simple tree based on the most important feature
          if (topFeatures.length > 0) {
            // Use the most important feature as the first split
            const rootFeature = topFeatures[0];
            const featureValues = X.map(sample => sample[rootFeature] || 0);
            const meanValue = featureValues.reduce((sum, val) => sum + val, 0) / featureValues.length;
            
            return {
              feature: rootFeature,
              threshold: meanValue,
              depth: 0,
              trueNode: {
                depth: 1,
                value: y.filter((_, i) => (X[i][rootFeature] || 0) > meanValue)
                        .reduce((sum, val) => sum + val, 0) / 
                        y.filter((_, i) => (X[i][rootFeature] || 0) > meanValue).length || 50
              },
              falseNode: {
                depth: 1,
                value: y.filter((_, i) => (X[i][rootFeature] || 0) <= meanValue)
                        .reduce((sum, val) => sum + val, 0) / 
                        y.filter((_, i) => (X[i][rootFeature] || 0) <= meanValue).length || 50
              }
            };
          } else {
            // Default leaf node with the mean target value
            return {
              depth: 0,
              value: y.reduce((sum, val) => sum + val, 0) / y.length
            };
          }
        };
        
        // Set the trained model with enhanced metadata
        setPredictionModel({
          weights,
          intercept,
          catFeatureMap,
          importance: importance.slice(0, 10), // Top 10 most important features
          confidenceInterval: meanError,
          accuracy: accuracy,
          featureScaling: featureStats
        });
        
        setFeatureImportance(importance.slice(0, 10));
        setModelReady(true);
        
        console.log("Model training completed successfully!");
        console.log(`Model performance metrics - MAE: ${meanError.toFixed(2)}, RMSE: ${rmse.toFixed(2)}, R²: ${rSquared.toFixed(2)}, Accuracy: ${accuracy.toFixed(2)}%`);
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

  
  // Enhanced function to prepare features from current form inputs with derived features
  const prepareFeatures = useCallback(() => {
    const features: Record<string, number> = {};
    
    // Numeric features with additional derived features
    features.age = age;
    features.workExperience = workExperience;
    features.workHoursPerDay = workHoursPerDay;
    features.workDaysPerWeek = workDaysPerWeek;
    features.childrenCount = numberOfChildren;
    
    // Derived features
    features.weeklyWorkHours = workHoursPerDay * workDaysPerWeek;
    features.workIntensity = features.weeklyWorkHours > 48 ? 3 : (features.weeklyWorkHours > 40 ? 2 : 1);
    features.ageGroup = age < 30 ? 1 : (age < 45 ? 2 : (age < 60 ? 3 : 4));
    features.experienceToAgeRatio = age > 0 ? workExperience / age : 0;
    
    // Enhanced protection equipment calculation
    let protectionScore = 0;
    let maxPossibleScore = 0;
    
    // Calculate scores based on equipment selected
    const hasEquipment = (equipment: string) => protectiveEquipment.includes(equipment);
    
    // Mask
    maxPossibleScore += 5;
    protectionScore += hasEquipment('masque') ? 5 : 0;
    
    // Gloves
    maxPossibleScore += 5;
    protectionScore += hasEquipment('gants') ? 5 : 0;
    
    // Boots
    maxPossibleScore += 4;
    protectionScore += hasEquipment('bottes') ? 4 : 0;
    
    // Hat/Head cover
    maxPossibleScore += 3;
    protectionScore += hasEquipment('casquette') ? 3 : 0;
    
    // Waterproof coat
    maxPossibleScore += 4;
    protectionScore += hasEquipment('manteau') ? 4 : 0;
    
    // Protection metrics
    features.protectionScore = protectionScore;
    features.protectionPercent = maxPossibleScore > 0 ? (protectionScore / maxPossibleScore) * 100 : 0;
    features.protectionCategory = features.protectionPercent >= 75 ? 3 : 
                                (features.protectionPercent >= 50 ? 2 : 
                                (features.protectionPercent >= 25 ? 1 : 0));
    
    // Chemical exposure with more detailed analysis
    features.pesticide = chemicalExposure.some(c => c.includes('pesticide')) ? 1 : 0;
    features.herbicide = chemicalExposure.some(c => c.includes('herbicide')) ? 1 : 0;
    features.insecticide = chemicalExposure.some(c => c.includes('insecticide')) ? 1 : 0;
    features.fongicide = chemicalExposure.some(c => c.includes('fongicide')) ? 1 : 0;
    features.engrais = chemicalExposure.some(c => c.includes('engrais')) ? 1 : 0;
    
    // Derived chemical exposure features
    features.chemicalExposureCount = [
      features.pesticide, features.herbicide, features.insecticide, 
      features.fongicide, features.engrais
    ].filter(Boolean).length;
    
    features.hazardousChemicalExposure = (features.pesticide || features.herbicide || features.insecticide) ? 1 : 0;
    
    // Task-related features with improved categorization
    features.epandageTasks = tasks.some(t => t.includes('épand')) ? 1 : 0;
    features.treatmentTasks = tasks.some(t => t.includes('trait') || t.includes('pulvéris')) ? 1 : 0;
    features.harvestingTasks = tasks.some(t => t.includes('récolt') || t.includes('cueil')) ? 1 : 0;
    features.weedingTasks = tasks.some(t => t.includes('désherb')) ? 1 : 0;
    features.pruningTasks = tasks.some(t => t.includes('taill')) ? 1 : 0;
    
    // Derived task-related features
    features.highRiskTaskCount = [
      features.epandageTasks, features.treatmentTasks, features.weedingTasks
    ].filter(Boolean).length;
    
    features.taskVariety = [
      features.epandageTasks, features.treatmentTasks, features.harvestingTasks,
      features.weedingTasks, features.pruningTasks
    ].filter(Boolean).length;
    
    // Health indicators with better categorization
    features.hasTroubleRespiratoire = hasRespiratoryConditions ? 1 : 0;
    features.hasTroubleCutane = hasSkinConditions ? 1 : 0;
    features.hasTroubleNeurologique = 0; // Not explicitly in form
    features.hasTroubleCognitif = 0; // Not explicitly in form
    
    // Derived health indicators
    features.hasDyspnea = hasRespiratoryConditions ? 1 : 0; // Simplified for form
    features.hasCough = hasRespiratoryConditions ? 0.5 : 0; // Assumption
    features.hasAsthma = hasRespiratoryConditions ? 0.3 : 0; // Assumption
    features.respiratorySeverity = hasRespiratoryConditions ? 2 : 0;
    
    features.hasDermatitis = hasSkinConditions ? 0.7 : 0; // Assumption
    features.hasIrritation = hasSkinConditions ? 0.8 : 0; // Assumption
    features.skinSeverity = hasSkinConditions ? 2 : 0;
    
    features.hasHeadaches = 0; // Not explicitly captured
    features.hasVertigo = 0; // Not explicitly captured
    features.neurologicalSeverity = 0;
    
    features.hasMemoryIssues = 0; // Not explicitly captured
    features.cognitivitySeverity = 0;
    
    // Health measurements
    features.tas = 120; // Default value
    features.tad = 80;  // Default value
    
    // Derived health metrics
    features.hypertension = 0; // Using default values
    features.hypotension = 0; // Using default values
    features.bpCategory = 2; // Normal by default
    
    // Overall health metrics
    features.healthIssueCount = [
      features.hasTroubleRespiratoire, features.hasTroubleCutane,
      features.hasTroubleNeurologique, features.hasTroubleCognitif
    ].filter(Boolean).length;
    
    features.overallHealthSeverity = features.respiratorySeverity + 
                                  features.skinSeverity + 
                                  features.neurologicalSeverity + 
                                  features.cognitivitySeverity;
    
    // Protection adequacy
    features.chemicalProtectionGap = features.hazardousChemicalExposure && features.protectionPercent < 50 ? 1 : 0;
    
    // Categorical features with missing value handling
    features[`maritalStatus_${maritalStatus}`] = 1;
    features[`socioEconomic_${socioEconomicStatus}`] = 1;
    features[`employmentStatus_${employmentStatus}`] = 1;
    
    // Chronic exposure impact
    if (hasChronicExposure) {
      features.hazardousChemicalExposure = 1;
      features.overallHealthSeverity += 2;
    }
    
    return features;
  }, [
    age, workExperience, workHoursPerDay, workDaysPerWeek, numberOfChildren,
    protectiveEquipment, chemicalExposure, tasks, maritalStatus, socioEconomicStatus, 
    employmentStatus, hasRespiratoryConditions, hasSkinConditions, hasChronicExposure
  ]);
  
  // Improved risk prediction function with better feature scaling
  const predictRisk = useCallback((features: Record<string, number>) => {
    if (!predictionModel) return 0;
    
    // Copy features to avoid modifying the original
    const scaledFeatures = { ...features };
    
    // Apply feature scaling to numeric features
    if (predictionModel.featureScaling) {
      Object.keys(predictionModel.featureScaling).forEach(feature => {
        if (feature in scaledFeatures) {
          const stats = predictionModel.featureScaling[feature];
          // Apply same scaling as during training
          if (stats.max !== stats.min) {
            scaledFeatures[feature] = (scaledFeatures[feature] - stats.min) / (stats.max - stats.min);
          } else {
            scaledFeatures[feature] = 0;
          }
        }
      });
    }
    
    // Calculate prediction with regularized weights
    let prediction = predictionModel.intercept;
    
    // Add contribution from all features
    Object.keys(scaledFeatures).forEach(feature => {
      if (feature in predictionModel.weights) {
        prediction += predictionModel.weights[feature] * scaledFeatures[feature];
      }
    });
    
    // Add contribution from categorical features that might not be in the input
    if (maritalStatus in predictionModel.catFeatureMap.maritalStatus) {
      prediction += predictionModel.catFeatureMap.maritalStatus[maritalStatus];
    }
    
    if (socioEconomicStatus in predictionModel.catFeatureMap.socioEconomic) {
      prediction += predictionModel.catFeatureMap.socioEconomic[socioEconomicStatus];
    }
    
    if (employmentStatus in predictionModel.catFeatureMap.employmentStatus) {
      prediction += predictionModel.catFeatureMap.employmentStatus[employmentStatus];
    }
    
    // Apply category-specific adjustments
    // Age-based adjustment
    if (age > 60 && !('ageGroup_4' in scaledFeatures)) {
      prediction += 5; // Add risk for older individuals
    }
    
    // Protection-based adjustment
    const protectionPercent = features.protectionPercent || 0;
    if (features.hazardousChemicalExposure && protectionPercent < 30) {
      prediction += 7; // Add risk for inadequate protection with hazardous chemicals
    }
    
    // Risk from chronic exposure
    if (hasChronicExposure) {
      prediction += 8;
    }
    
    // Ensure prediction is between 0 and 100
    return Math.min(Math.max(prediction, 0), 100);
  }, [predictionModel, maritalStatus, socioEconomicStatus, employmentStatus, age, hasChronicExposure]);
  
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
    
    // Advanced ML-based risk prediction
    if (modelReady && predictionModel) {
      // Prepare features from current inputs with enhanced feature engineering
      const features = prepareFeatures();
      
      // Use the model to predict the overall risk with more accurate scaling
      overallScore = predictRisk(features);
      
      // Calculate improved confidence interval for the prediction based on model accuracy
      // Higher accuracy = narrower confidence interval
      const baseCI = predictionModel.confidenceInterval;
      const accuracyFactor = predictionModel.accuracy ? (100 - predictionModel.accuracy) / 50 : 1;
      const adjustedCI = baseCI * accuracyFactor;
      
      setConfidenceInterval([
        Math.max(0, overallScore - adjustedCI),
        Math.min(100, overallScore + adjustedCI)
      ]);
      
      // Generate what-if scenarios with more detailed alternatives
      const scenarios: {label: string, score: number}[] = [];
      
      // 1. What if we use all protection equipment?
      const allProtectionFeatures = {...features};
      allProtectionFeatures.protectionScore = 21; // Max protection score
      allProtectionFeatures.protectionPercent = 100;
      allProtectionFeatures.protectionCategory = 3;
      const allProtectionScore = predictRisk(allProtectionFeatures);
      scenarios.push({
        label: "Avec tous les équipements de protection",
        score: allProtectionScore
      });
      
      // 2. What if we use respiratory protection only?
      const maskOnlyFeatures = {...features};
      maskOnlyFeatures.protectionScore = Math.max(5, features.protectionScore);
      const protectionPercentage = maskOnlyFeatures.protectionScore / 21 * 100;
      maskOnlyFeatures.protectionPercent = protectionPercentage;
      maskOnlyFeatures.protectionCategory = protectionPercentage >= 75 ? 3 : 
                                 (protectionPercentage >= 50 ? 2 : 
                                 (protectionPercentage >= 25 ? 1 : 0));
      const maskOnlyScore = predictRisk(maskOnlyFeatures);
      scenarios.push({
        label: "Avec un masque respiratoire uniquement",
        score: maskOnlyScore
      });
      
      // 3. What if we reduce chemical exposure?
      const lessChemicalsFeatures = {...features};
      lessChemicalsFeatures.pesticide = 0;
      lessChemicalsFeatures.herbicide = 0;
      lessChemicalsFeatures.insecticide = 0;
      lessChemicalsFeatures.chemicalExposureCount = Math.max(0, features.chemicalExposureCount - 3);
      lessChemicalsFeatures.hazardousChemicalExposure = 0;
      const lessChemicalsScore = predictRisk(lessChemicalsFeatures);
      scenarios.push({
        label: "Sans exposition aux pesticides/herbicides",
        score: lessChemicalsScore
      });
      
      // 4. What if we reduce work hours?
      const lessWorkFeatures = {...features};
      lessWorkFeatures.workHoursPerDay = Math.min(workHoursPerDay, 6);
      lessWorkFeatures.workDaysPerWeek = Math.min(workDaysPerWeek, 5);
      lessWorkFeatures.weeklyWorkHours = lessWorkFeatures.workHoursPerDay * lessWorkFeatures.workDaysPerWeek;
      lessWorkFeatures.workIntensity = lessWorkFeatures.weeklyWorkHours > 48 ? 3 : 
                              (lessWorkFeatures.weeklyWorkHours > 40 ? 2 : 1);
      const lessWorkScore = predictRisk(lessWorkFeatures);
      scenarios.push({
        label: "Avec horaires réduits (max 6h/jour, 5j/semaine)",
        score: lessWorkScore
      });
      
      // 5. What if we avoid high-risk tasks?
      const lowerRiskTasksFeatures = {...features};
      lowerRiskTasksFeatures.epandageTasks = 0;
      lowerRiskTasksFeatures.treatmentTasks = 0;
      lowerRiskTasksFeatures.highRiskTaskCount = 0;
      const lowerRiskTasksScore = predictRisk(lowerRiskTasksFeatures);
      scenarios.push({
        label: "En évitant les tâches à haut risque (épandage, traitement)",
        score: lowerRiskTasksScore
      });
      
      // 6. Combined optimal scenario
      const optimalFeatures = {...features};
      optimalFeatures.protectionScore = 21;
      optimalFeatures.protectionPercent = 100;
      optimalFeatures.protectionCategory = 3;
      optimalFeatures.hazardousChemicalExposure = 0;
      optimalFeatures.weeklyWorkHours = Math.min(workHoursPerDay, 6) * Math.min(workDaysPerWeek, 5);
      optimalFeatures.workIntensity = 1;
      optimalFeatures.highRiskTaskCount = 0;
      const optimalScore = predictRisk(optimalFeatures);
      scenarios.push({
        label: "Scénario optimal combiné (protection + réduction exposition)",
        score: optimalScore
      });
      
      // Save what-if scenarios
      setWhatIfScenarios(scenarios);
      
      // Add ML-based risk factors with more detailed explanations
      factors.push("Prédiction basée sur l'analyse de données similaires dans le secteur agricole");
      
      // Use model accuracy in factors if available
      if (predictionModel.accuracy) {
        factors.push(`Fiabilité du modèle de prédiction: ${Math.round(predictionModel.accuracy)}%`);
      }
      
      // Add feature importance-based factors with better descriptions
      predictionModel.importance.slice(0, 5).forEach(feature => {
        const featureName = feature.feature;
        let readableName = featureName;
        let explanation = "";
        
        // Enhanced feature name mapping with better explanations
        if (featureName === 'age') {
          readableName = "Âge";
          explanation = age > 50 ? "l'âge supérieur à 50 ans augmente certains risques de santé" : 
                        "votre âge est un facteur important dans l'évaluation du risque";
        }
        else if (featureName === 'workExperience') {
          readableName = "Expérience professionnelle";
          explanation = workExperience < 5 ? "une expérience limitée peut augmenter l'exposition aux risques" : 
                        "votre expérience influence votre exposition aux risques";
        }
        else if (featureName === 'workHoursPerDay' || featureName === 'weeklyWorkHours') {
          readableName = "Temps de travail";
          explanation = features.weeklyWorkHours > 48 ? "les longues heures de travail augmentent l'exposition aux risques" : 
                        "la durée d'exposition influence significativement le risque";
        }
        else if (featureName === 'protectionScore' || featureName === 'protectionPercent') {
          readableName = "Niveau de protection";
          explanation = features.protectionPercent < 50 ? "un équipement de protection insuffisant augmente significativement les risques" : 
                        "l'équipement de protection est un facteur crucial pour la réduction des risques";
        }
        else if (featureName === 'pesticide' || featureName === 'hazardousChemicalExposure') {
          readableName = "Exposition aux pesticides";
          explanation = "l'exposition aux pesticides est associée à divers risques de santé";
        }
        else if (featureName === 'herbicide') {
          readableName = "Exposition aux herbicides";
          explanation = "l'exposition aux herbicides peut avoir des effets sur la santé";
        }
        else if (featureName === 'chemicalExposureCount') {
          readableName = "Diversité des expositions chimiques";
          explanation = "l'exposition à plusieurs produits chimiques différents augmente les risques";
        }
        else if (featureName.includes('Respiratoire') || featureName.includes('respiratoire')) {
          readableName = "Antécédents respiratoires";
          explanation = "les problèmes respiratoires préexistants augmentent la vulnérabilité";
        }
        else if (featureName.includes('Cutane') || featureName.includes('cutane')) {
          readableName = "Antécédents cutanés";
          explanation = "les problèmes cutanés préexistants augmentent la sensibilité aux expositions";
        }
        else if (featureName.includes('Task') || featureName.includes('task')) {
          if (featureName.includes('epandage') || featureName.includes('treatment')) {
            readableName = "Tâches d'application de produits";
            explanation = "les tâches impliquant l'application directe de produits chimiques présentent des risques élevés";
          } else {
            readableName = "Type de tâches agricoles";
            explanation = "certaines tâches spécifiques comportent des risques plus élevés";
          }
        }
        else if (featureName.includes('marital') || featureName.includes('socioEconomic') || featureName.includes('employment')) {
          readableName = "Facteurs socio-démographiques";
          explanation = "les facteurs socio-économiques et le statut professionnel influencent l'accès aux ressources protectrices";
        }
        
        if (feature.importance > 0.1) { // Only include significant factors
          factors.push(`${readableName}: ${explanation} (impact: ${Math.round(feature.importance * 100)}%)`);
        }
      });
      
      // Add specific risk factors based on feature values
      // Chemical exposure risk factors
      if (features.hazardousChemicalExposure) {
        if (features.protectionPercent < 50) {
          factors.push("Risque élevé: Exposition aux produits chimiques dangereux sans protection adéquate");
          recommendations.push("Prioritaire: Utiliser un équipement de protection complet lors de la manipulation de produits chimiques");
        } else {
          factors.push("Exposition aux produits chimiques dangereux (avec mesures de protection)");
        }
      }
      
      // Work intensity risk factors
      if (features.weeklyWorkHours > 48) {
        factors.push("Charge de travail excessive (>48h/semaine) augmentant l'exposition aux risques");
        recommendations.push("Réduire le temps de travail ou prévoir des pauses régulières pour limiter l'exposition");
      }
      
      // Health condition risk factors
      if (hasRespiratoryConditions && features.hazardousChemicalExposure) {
        factors.push("Risque élevé: Troubles respiratoires préexistants combinés à l'exposition chimique");
        recommendations.push("Consultation médicale recommandée pour évaluer la compatibilité entre votre condition respiratoire et votre travail");
      }
      
      if (hasChronicExposure) {
        factors.push("Exposition chronique aux produits chimiques pouvant entraîner des effets cumulatifs");
        recommendations.push("Surveillance médicale régulière recommandée pour détecter les effets à long terme");
      }
      
      // Specific task risk factors
      if (features.highRiskTaskCount > 1) {
        factors.push(`Cumul de ${features.highRiskTaskCount} tâches à haut risque augmentant l'exposition`);
        recommendations.push("Envisager une rotation des tâches pour réduire l'exposition répétée aux mêmes risques");
      }
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
    
    // Enhanced chemical exposure risk analysis - common for both approaches
    if (chemicalExposure.length > 0) {
      // Adjust score based on the number and type of chemicals
      overallScore += Math.min(5 * chemicalExposure.length, 20);
      factors.push(`Exposition à ${chemicalExposure.length} produits chimiques`);
      
      // Integration with text analysis for more accurate risk assessment
      let highestRiskScore = 0;
      
      chemicalExposure.forEach(chemical => {
        // Look for matching risk factors from text analysis with improved matching
        const matchingRiskFactors = textRiskFactors.filter(rf => 
          rf.exposure.toLowerCase().includes(chemical.toLowerCase()) || 
          chemical.toLowerCase().includes(rf.exposure.toLowerCase()));
        
        if (matchingRiskFactors.length > 0) {
          // Add all matching risk factors to our list with deduplication
          matchingRiskFactors.forEach(riskFactor => {
            if (!matched.some(m => m.healthIssue === riskFactor.healthIssue && m.exposure === riskFactor.exposure)) {
              matched.push(riskFactor);
            }
          });
          
          // Add the highest risk score
          const highestRiskFactor = matchingRiskFactors.sort((a, b) => b.riskScore - a.riskScore)[0];
          highestRiskScore = Math.max(highestRiskScore, highestRiskFactor.riskScore);
          
          // Add category-specific risk based on health issue with better categorization
          const healthIssue = highestRiskFactor.healthIssue.toLowerCase();
          
          // Respiratory issues
          if (healthIssue.includes('respir') || healthIssue.includes('dyspnée') || 
              healthIssue.includes('toux') || healthIssue.includes('pulmonaire') ||
              healthIssue.includes('asthme')) {
            respiratoryRisk += highestRiskFactor.riskScore / 3;
            factors.push(`Risque respiratoire: ${chemical} associé à des problèmes respiratoires (${highestRiskFactor.healthIssue})`);
            
            // More detailed respiratory protection recommendations
            if (!protectiveEquipment.includes('masque')) {
              recommendations.push(`Prioritaire: Utiliser un masque respiratoire adapté lors de l'exposition à ${chemical}`);
            } else {
              recommendations.push(`Assurer un entretien régulier du masque respiratoire pour l'exposition à ${chemical}`);
            }
          }
          
          // Skin issues
          if (healthIssue.includes('cutan') || healthIssue.includes('dermat') || 
              healthIssue.includes('peau') || healthIssue.includes('irritation') ||
              healthIssue.includes('eczéma')) {
            skinRisk += highestRiskFactor.riskScore / 3;
            factors.push(`Risque cutané: ${chemical} associé à des problèmes cutanés (${highestRiskFactor.healthIssue})`);
            
            // More detailed skin protection recommendations
            if (!protectiveEquipment.includes('gants')) {
              recommendations.push(`Porter des gants adaptés lors de la manipulation de ${chemical}`);
            }
            recommendations.push(`Se laver soigneusement après tout contact avec ${chemical} et utiliser des crèmes barrières`);
          }
          
          // Neurological issues
          if (healthIssue.includes('neuro') || healthIssue.includes('céphal') || 
              healthIssue.includes('mémoire') || healthIssue.includes('vertige') ||
              healthIssue.includes('tremblement')) {
            neurologicalRisk += highestRiskFactor.riskScore / 3;
            factors.push(`Risque neurologique: ${chemical} associé à des troubles neurologiques (${highestRiskFactor.healthIssue})`);
            
            // Neurological protection recommendations
            recommendations.push(`Limiter la durée d'exposition à ${chemical} et travailler dans des espaces bien ventilés`);
            if (highestRiskFactor.riskScore > 50) {
              recommendations.push(`Consulter régulièrement un médecin pour surveiller les effets neurologiques potentiels de ${chemical}`);
            }
          }
        }
      });
      
      // Add extra risk for multiple hazardous chemicals
      const hazardousChemicals = chemicalExposure.filter(c => 
        c.includes('pesticide') || c.includes('herbicide') || c.includes('insecticide') || c.includes('fongicide')
      );
      
      if (hazardousChemicals.length > 1) {
        overallScore += 5;
        factors.push(`Exposition multiple à ${hazardousChemicals.length} produits chimiques dangereux pouvant avoir des effets synergiques`);
        recommendations.push("Consulter un médecin du travail pour évaluer les risques liés aux expositions multiples");
      }
    }
    
    // Enhanced task-related risk assessment - common for both approaches
    if (tasks.length > 0) {
      // Improved task risk categorization
      const highRespiratoryRiskTasks = ['pesticide', 'traitement', 'pulvérisation', 'fumigation', 'épandage'];
      const highSkinRiskTasks = ['désherbage', 'récolte', 'taille', 'manipulation'];
      const highNeurologicalRiskTasks = ['pesticide', 'traitement', 'épandage', 'insecticide'];
      
      // Check task risks with better pattern matching
      const hasHighRespiratoryRiskTask = tasks.some(task => 
        highRespiratoryRiskTasks.some(highRisk => task.toLowerCase().includes(highRisk))
      );
      
      const hasHighSkinRiskTask = tasks.some(task => 
        highSkinRiskTasks.some(highRisk => task.toLowerCase().includes(highRisk))
      );
      
      const hasHighNeurologicalRiskTask = tasks.some(task => 
        highNeurologicalRiskTasks.some(highRisk => task.toLowerCase().includes(highRisk))
      );
      
      // Count high risk tasks for better risk assessment
      const highRiskTaskCount = [
        hasHighRespiratoryRiskTask, hasHighSkinRiskTask, hasHighNeurologicalRiskTask
      ].filter(Boolean).length;
      
      // Apply risk factors based on tasks with better risk gradation
      if (hasHighRespiratoryRiskTask) {
        respiratoryRisk += 15;
        const specificTasks = tasks.filter(task => 
          highRespiratoryRiskTasks.some(highRisk => task.toLowerCase().includes(highRisk))
        ).join(", ");
        
        factors.push(`Risque respiratoire lié aux tâches suivantes: ${specificTasks}`);
        
        if (!protectiveEquipment.includes('masque')) {
          recommendations.push("Prioritaire: Porter un masque respiratoire avec filtres appropriés pour ces tâches à risque");
        } else {
          recommendations.push("S'assurer que le masque utilisé est adapté aux substances manipulées et correctement entretenu");
        }
      }
      
      if (hasHighSkinRiskTask) {
        skinRisk += 12;
        const specificTasks = tasks.filter(task => 
          highSkinRiskTasks.some(highRisk => task.toLowerCase().includes(highRisk))
        ).join(", ");
        
        factors.push(`Risque cutané lié aux tâches suivantes: ${specificTasks}`);
        
        if (!protectiveEquipment.includes('gants') || !protectiveEquipment.includes('manteau')) {
          recommendations.push("Utiliser des gants et des vêtements de protection pour réduire l'exposition cutanée");
        }
        recommendations.push("Laver soigneusement la peau après le travail et appliquer des crèmes protectrices");
      }
      
      if (hasHighNeurologicalRiskTask) {
        neurologicalRisk += 15;
        const specificTasks = tasks.filter(task => 
          highNeurologicalRiskTasks.some(highRisk => task.toLowerCase().includes(highRisk))
        ).join(", ");
        
        factors.push(`Risque neurologique lié aux tâches suivantes: ${specificTasks}`);
        recommendations.push("Travailler dans des espaces bien ventilés et prendre des pauses régulières");
        recommendations.push("Surveiller l'apparition de symptômes comme maux de tête, vertiges ou troubles de concentration");
      }
      
      // Additional risk for task variety and cumulative exposure
      if (tasks.length > 3) {
        overallScore += 5;
        factors.push("Grande variété de tâches pouvant exposer à des risques multiples");
        recommendations.push("Envisager une rotation des tâches pour limiter l'exposition répétée aux mêmes risques");
      }
    }
    
    // Enhanced pre-existing health conditions assessment
    if (hasRespiratoryConditions) {
      respiratoryRisk += 20;
      overallScore += 10;
      factors.push("Antécédents de troubles respiratoires augmentant la vulnérabilité");
      recommendations.push("Consulter un médecin pour évaluer la compatibilité entre votre condition respiratoire et votre travail");
      recommendations.push("Utiliser systématiquement une protection respiratoire adaptée à votre condition");
    }
    
    if (hasSkinConditions) {
      skinRisk += 20;
      overallScore += 8;
      factors.push("Antécédents de troubles cutanés augmentant la sensibilité aux expositions");
      recommendations.push("Consulter un dermatologue pour des recommandations spécifiques à votre condition");
      recommendations.push("Utiliser des gants et vêtements protecteurs, ainsi que des crèmes barrières appropriées");
    }
    
    if (hasChronicExposure) {
      overallScore += 15;
      neurologicalRisk += 15;
      respiratoryRisk += 10;
      factors.push("Exposition chronique aux produits chimiques avec risque d'effets cumulatifs");
      recommendations.push("Prioritaire: Envisager une rotation des tâches pour réduire l'exposition aux mêmes produits");
      recommendations.push("Effectuer un suivi médical régulier pour surveiller les effets à long terme");
    }
    
    // Enhanced socioeconomic and demographic factor assessment
    if (socioEconomicStatus === 'bas') {
      overallScore += 5;
      factors.push("Niveau socio-économique bas pouvant limiter l'accès aux soins et aux équipements");
      recommendations.push("Se renseigner sur les programmes d'aide pour l'acquisition d'équipements de protection");
      recommendations.push("S'informer sur les services de santé accessibles aux travailleurs agricoles");
    }
    
    if (numberOfChildren > 3) {
      overallScore += 3;
      factors.push("Charge familiale importante (plus de 3 enfants) pouvant augmenter la fatigue");
      recommendations.push("Veiller à maintenir un équilibre travail-repos adapté à votre situation familiale");
    }
    
    if (employmentStatus === 'saisonnière') {
      overallScore += 5;
      factors.push("Emploi saisonnier potentiellement associé à moins de formation et d'équipement");
      recommendations.push("Demander une formation de sécurité complète au début de chaque saison");
      recommendations.push("Vérifier que l'équipement de protection fourni est adapté et en bon état");
    }
    
    // Cap scores at 100 with minimum values
    respiratoryRisk = Math.min(Math.max(respiratoryRisk, 5), 100);
    skinRisk = Math.min(Math.max(skinRisk, 5), 100);
    neurologicalRisk = Math.min(Math.max(neurologicalRisk, 5), 100);
    overallScore = Math.min(Math.max(overallScore, 5), 100);
    
    // Remove duplicate recommendations and sort by priority
    const priorityWords = ['prioritaire', 'important', 'essentiel', 'crucial'];
    
    const uniqueRecommendations = Array.from(new Set(recommendations))
      .sort((a, b) => {
        // Sort recommendations with priority words first
        const aPriority = priorityWords.some(word => a.toLowerCase().includes(word));
        const bPriority = priorityWords.some(word => b.toLowerCase().includes(word));
        
        if (aPriority && !bPriority) return -1;
        if (!aPriority && bPriority) return 1;
        return 0;
      });
    
    // Add advanced ML-specific recommendations with more actionable advice
    if (modelReady) {
      if (predictionModel.accuracy) {
        uniqueRecommendations.push(`Les recommandations sont basées sur l'analyse de données de santé avec une fiabilité estimée à ${Math.round(predictionModel.accuracy)}%`);
      } else {
        uniqueRecommendations.push("Les recommandations sont basées sur l'analyse de données de santé similaires");
      }
      
      // What-if based recommendations with better actionability
      if (whatIfScenarios.length > 0) {
        // Sort scenarios by effectiveness (lowest score = best)
        const sortedScenarios = [...whatIfScenarios].sort((a, b) => a.score - b.score);
        
        // Get the most effective scenario
        const bestScenario = sortedScenarios[0];
        const riskReduction = Math.round(overallScore - bestScenario.score);
        
        if (riskReduction > 0) {
          uniqueRecommendations.push(`Stratégie recommandée: "${bestScenario.label}" pourrait réduire votre risque de ${riskReduction} points`);
        }
        
        // Add second best scenario if significantly different from the best
        if (sortedScenarios.length > 1) {
          const secondBest = sortedScenarios[1];
          // Check if this is a different type of intervention than the best
          if (!secondBest.label.includes(bestScenario.label.split(' ')[1]) && 
              !bestScenario.label.includes(secondBest.label.split(' ')[1])) {
            
            const secondRiskReduction = Math.round(overallScore - secondBest.score);
            if (secondRiskReduction > 0) {
              uniqueRecommendations.push(`Alternative efficace: "${secondBest.label}" pourrait réduire votre risque de ${secondRiskReduction} points`);
            }
          }
        }
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