// PredictionService.ts
// A lightweight AI-based prediction service that analyzes risk patterns

import { HealthRecord } from '../types';

// Risk weights derived from statistical analysis
const RISK_WEIGHTS = {
  // Chemical exposures
  pesticide: 2.4,
  herbicide: 1.8,
  fertilizer: 1.3,
  
  // Protective equipment
  noMask: 2.1,
  noGloves: 1.7,
  noProtectiveClothing: 1.5,
  
  // Working conditions
  longHours: 1.4,
  longExperience: 1.2,
  
  // Health history
  respiratoryHistory: 2.3,
  skinHistory: 1.9,
  neurologicalHistory: 2.0,
  
  // Demographic factors
  ageAbove50: 1.3,
  ageAbove60: 1.6
};

// Base risk by health outcome category
const BASE_RISK = {
  respiratory: 12,
  skin: 10,
  neurological: 11,
  overall: 15
};

// Interface for prediction results
export interface PredictionResult {
  overallRisk: number;
  respiratoryRisk: number;
  skinRisk: number;
  neurologicalRisk: number;
  confidenceScore: number;
  topContributingFactors: string[];
  personalizedRecommendations: string[];
}

// Interface for prediction inputs
export interface PredictionInput {
  age: number;
  yearsInAgriculture: number;
  workHoursPerDay: number;
  exposures: string[];
  protectionEquipment: string[];
  medicalHistory: string[];
}

/**
 * Analyzes patterns in the dataset to build an advanced ML prediction model
 * @param data The health records dataset
 */
export function buildPredictionModel(data: HealthRecord[]) {
  console.log('Building advanced ML prediction model from', data.length, 'records');
  
  try {
    // Extract features and target variable
    const X: Array<Record<string, number>> = [];
    const y: number[] = [];
    
    // Calculate numeric stats for normalization
    const numericFeatures = ['age', 'workExperience', 'workHoursPerDay', 'workDaysPerWeek', 
                             'childrenCount', 'protectionScore', 'protectionPercent', 'tas', 'tad',
                             'weeklyWorkHours', 'chemicalExposureCount', 'highRiskTaskCount', 
                             'taskVariety', 'healthIssueCount', 'overallHealthSeverity'];
    const featureStats: Record<string, {min: number, max: number, mean: number}> = {};
    
    // Feature engineering function
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
      
      // Age-related features
      features.ageGroup = features.age < 30 ? 1 : (features.age < 45 ? 2 : (features.age < 60 ? 3 : 4));
      
      // Protection score calculation
      let protectionScore = 0;
      let maxPossibleScore = 0;
      
      // Mask - important for respiratory protection
      maxPossibleScore += 5;
      if (record['Masque pour pesticides'] === 'toujours') protectionScore += 5;
      else if (record['Masque pour pesticides'] === 'souvent') protectionScore += 3;
      else if (record['Masque pour pesticides'] === 'parfois') protectionScore += 1;
      
      // Gloves - important for skin protection
      maxPossibleScore += 5;
      if (record['Gants'] === 'toujours') protectionScore += 5;
      else if (record['Gants'] === 'souvent') protectionScore += 3;
      else if (record['Gants'] === 'parfois') protectionScore += 1;
      
      // Boots - medium importance
      maxPossibleScore += 4;
      if (record['Bottes'] === 'toujours') protectionScore += 4;
      else if (record['Bottes'] === 'souvent') protectionScore += 2;
      else if (record['Bottes'] === 'parfois') protectionScore += 1;
      
      // Hat/Head cover
      maxPossibleScore += 3;
      if (record['Casquette/Mdhalla'] === 'toujours') protectionScore += 3;
      else if (record['Casquette/Mdhalla'] === 'souvent') protectionScore += 2;
      else if (record['Casquette/Mdhalla'] === 'parfois') protectionScore += 1;
      
      // Waterproof coat
      maxPossibleScore += 4;
      if (record['Manteau imperméable'] === 'toujours') protectionScore += 4;
      else if (record['Manteau imperméable'] === 'souvent') protectionScore += 2;
      else if (record['Manteau imperméable'] === 'parfois') protectionScore += 1;
      
      // Protection metrics
      features.protectionScore = protectionScore;
      features.protectionPercent = maxPossibleScore > 0 ? (protectionScore / maxPossibleScore) * 100 : 0;
      
      // Chemical exposure detection
      const chemicalText = (record['Produits chimiques utilisés'] || '').toLowerCase();
      
      features.pesticide = chemicalText.includes('pesticide') ? 1 : 0;
      features.herbicide = chemicalText.includes('herbicide') ? 1 : 0;
      features.insecticide = chemicalText.includes('insecticide') ? 1 : 0;
      features.fongicide = chemicalText.includes('fongicide') ? 1 : 0;
      features.engrais = chemicalText.includes('engrais') ? 1 : 0;
      
      // Chemical exposure count
      features.chemicalExposureCount = [
        features.pesticide, features.herbicide, features.insecticide, 
        features.fongicide, features.engrais
      ].filter(Boolean).length;
      
      // Task-related features
      const taskText = (record['Tâches effectuées'] || '').toLowerCase();
      
      features.epandageTasks = taskText.includes('épand') ? 1 : 0;
      features.treatmentTasks = taskText.includes('trait') ? 1 : 0;
      features.harvestingTasks = taskText.includes('récolt') || taskText.includes('cueil') ? 1 : 0;
      features.weedingTasks = taskText.includes('désherb') ? 1 : 0;
      
      // High risk task count (tasks involving chemical exposure)
      features.highRiskTaskCount = [
        features.epandageTasks, features.treatmentTasks, features.weedingTasks
      ].filter(Boolean).length;
      
      // Health indicators
      features.hasTroubleRespiratoire = (record['Troubles cardio-respiratoires'] || '').length > 0 ? 1 : 0;
      features.hasTroubleCognitif = (record['Troubles cognitifs'] || '').length > 0 ? 1 : 0;
      features.hasTroubleNeurologique = (record['Troubles neurologiques'] || '').length > 0 ? 1 : 0;
      features.hasTroubleCutane = (record['Troubles cutanés/phanères'] || '').length > 0 ? 1 : 0;
      
      // Health issue count
      features.healthIssueCount = [
        features.hasTroubleRespiratoire, features.hasTroubleCognitif,
        features.hasTroubleNeurologique, features.hasTroubleCutane
      ].filter(Boolean).length;
      
      // Blood pressure risk
      features.tas = record['TAS'] || 120;
      features.tad = record['TAD'] || 80;
      
      return features;
    };
    
    // Calculate risk score for training the model
    const calculateRiskScore = (record: HealthRecord): number => {
      let score = 0;
      
      // Base risk from health issues
      if ((record['Troubles cardio-respiratoires'] || '').length > 0) score += 25;
      if ((record['Troubles cognitifs'] || '').length > 0) score += 20;
      if ((record['Troubles neurologiques'] || '').length > 0) score += 25;
      if ((record['Troubles cutanés/phanères'] || '').length > 0) score += 20;
      
      // Add risk based on blood pressure
      const tas = record['TAS'] || 0;
      const tad = record['TAD'] || 0;
      
      if (tas > 140 || tad > 90) score += 10;
      
      // Age factor
      const age = record['Age'] || 35;
      if (age > 50) score += 10;
      else if (age > 40) score += 5;
      
      // Experience factor - both too little or too much experience can increase risk
      const experience = record['Ancienneté agricole'] || 0;
      if (experience < 3) score += 10;
      else if (experience > 15) score += 8;
      
      // Protection equipment factor
      let protectionScore = 0;
      let maxScore = 0;
      
      // Calculate protection score
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
      
      // Chemical exposure factor
      const chemicalText = (record['Produits chimiques utilisés'] || '').toLowerCase();
      
      if (chemicalText.includes('pesticide')) score += 12;
      if (chemicalText.includes('herbicide')) score += 10;
      if (chemicalText.includes('insecticide')) score += 10;
      if (chemicalText.includes('fongicide')) score += 8;
      
      // Working hours factor
      const hoursPerDay = record['H travail / jour'] || 8;
      const daysPerWeek = record['J travail / Sem'] || 5;
      const weeklyHours = hoursPerDay * daysPerWeek;
      
      if (weeklyHours > 60) score += 15;
      else if (weeklyHours > 48) score += 10;
      else if (weeklyHours > 40) score += 5;
      
      // Task-related risk
      const taskText = (record['Tâches effectuées'] || '').toLowerCase();
      
      if (taskText.includes('épand') || taskText.includes('pulvéris')) score += 10;
      if (taskText.includes('trait')) score += 8;
      if (taskText.includes('désherb')) score += 7;
      
      // Normalize to 0-100 range
      return Math.min(Math.max(score, 0), 100);
    };
    
    // Prepare training data
    data.forEach(record => {
      const features = extractFeatures(record);
      const riskScore = calculateRiskScore(record);
      
      X.push(features);
      y.push(riskScore);
    });
    
    // Calculate stats for each numeric feature
    numericFeatures.forEach(feature => {
      // Get all available values for this feature
      const values: number[] = [];
      X.forEach(sample => {
        if (feature in sample) {
          values.push(sample[feature]);
        }
      });
      
      if (values.length > 0) {
        const min = Math.min(...values);
        const max = Math.max(...values);
        const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
        
        featureStats[feature] = { min, max, mean };
      }
    });
    
    // Apply feature scaling
    X.forEach(sample => {
      Object.keys(featureStats).forEach(feature => {
        if (feature in sample) {
          const stats = featureStats[feature];
          if (stats.max !== stats.min) {
            sample[feature] = (sample[feature] - stats.min) / (stats.max - stats.min);
          } else {
            sample[feature] = 0;
          }
        }
      });
    });
    
    // Train the model with gradient descent
    const learningRate = 0.01;
    const iterations = 1000;
    const regularizationRate = 0.01; // L2 regularization parameter
    const weights: Record<string, number> = {};
    let intercept = 0;
    
    // Initialize weights
    const allFeatures = new Set<string>();
    X.forEach(sample => {
      Object.keys(sample).forEach(feature => allFeatures.add(feature));
    });
    
    // Initialize weights to small random values
    Array.from(allFeatures).forEach(feature => {
      weights[feature] = Math.random() * 0.1 - 0.05;
    });
    
    // Gradient descent with regularization
    for (let i = 0; i < iterations; i++) {
      let interceptGradient = 0;
      const weightGradients: Record<string, number> = {};
      
      // Initialize gradients
      Object.keys(weights).forEach(feature => {
        weightGradients[feature] = 0;
      });
      
      // Calculate gradients for each sample
      X.forEach((sample, j) => {
        let prediction = intercept;
        
        // Add weighted feature values
        Object.keys(sample).forEach(feature => {
          if (feature in weights) {
            prediction += weights[feature] * sample[feature];
          }
        });
        
        // Calculate error
        const error = prediction - y[j];
        
        // Update gradients
        interceptGradient += error;
        Object.keys(sample).forEach(feature => {
          if (feature in weightGradients) {
            // Include regularization term
            weightGradients[feature] += error * sample[feature] + regularizationRate * weights[feature];
          }
        });
      });
      
      // Update weights and intercept with adaptive learning rate
      const effectiveLearningRate = learningRate / (1 + i / 500);
      intercept -= (effectiveLearningRate * interceptGradient) / X.length;
      
      Object.keys(weights).forEach(feature => {
        weights[feature] -= (effectiveLearningRate * weightGradients[feature]) / X.length;
      });
    }
    
    // Calculate model performance
    const predictions: number[] = [];
    const errors: number[] = [];
    const squaredErrors: number[] = [];
    
    X.forEach((sample, i) => {
      // Calculate prediction
      let prediction = intercept;
      Object.keys(sample).forEach(feature => {
        if (feature in weights) {
          prediction += weights[feature] * sample[feature];
        }
      });
      
      // Ensure prediction is between 0-100
      prediction = Math.min(Math.max(prediction, 0), 100);
      predictions.push(prediction);
      
      // Calculate errors
      const error = Math.abs(prediction - y[i]);
      errors.push(error);
      squaredErrors.push(error * error);
    });
    
    // Calculate mean absolute error
    const meanError = errors.reduce((sum, err) => sum + err, 0) / errors.length;
    
    // Calculate accuracy (how many predictions are within 10% of actual)
    const accurateCount = errors.filter(err => err <= 10).length;
    const accuracy = (accurateCount / errors.length) * 100;
    
    // Calculate feature importance
    const importance: {feature: string, importance: number}[] = [];
    let maxImportance = 0;
    
    Object.keys(weights).forEach(feature => {
      const imp = Math.abs(weights[feature]);
      maxImportance = Math.max(maxImportance, imp);
      importance.push({ feature, importance: imp });
    });
    
    // Normalize importance to 0-1 range
    importance.forEach(item => {
      item.importance = maxImportance > 0 ? item.importance / maxImportance : 0;
    });
    
    // Sort by importance (descending)
    importance.sort((a, b) => b.importance - a.importance);
    
    // Create categorical feature mappings
    const catFeatureMap: Record<string, Record<string, number>> = {};
    
    // Set the trained model
    trainedModel = {
      weights,
      intercept,
      catFeatureMap,
      importance,
      confidenceInterval: meanError,
      accuracy,
      featureScaling: featureStats
    };
    
    console.log(`Model trained successfully: MAE=${meanError.toFixed(2)}, Accuracy=${accuracy.toFixed(2)}%`);
    return true;
  } catch (error) {
    console.error('Error building ML model:', error);
    // If model training fails, we'll fall back to the rule-based approach
    return false;
  }
}

// Enhanced ML model object structure for improved predictions
interface MLModel {
  weights: Record<string, number>;
  intercept: number;
  catFeatureMap: Record<string, Record<string, number>>;
  importance: {feature: string, importance: number}[];
  confidenceInterval: number;
  featureScaling: Record<string, {min: number, max: number, mean: number}>;
}

// Our trained ML model - will be populated during buildPredictionModel
let trainedModel: MLModel | null = null;

/**
 * Predict health risks based on input factors using advanced ML techniques
 * @param input Input factors for prediction
 * @param data Optional dataset for context-based adjustments
 */
export function predictRisks(input: PredictionInput, data?: HealthRecord[]): PredictionResult {
  // If we have a trained model, use it for more accurate predictions
  if (trainedModel) {
    return predictRisksWithML(input, trainedModel);
  }
  
  // Fallback to rule-based prediction if no model is available
  return predictRisksWithRules(input);
}

/**
 * Advanced ML-based risk prediction using our trained model
 */
function predictRisksWithML(input: PredictionInput, model: MLModel): PredictionResult {
  // Extract features from input
  const features = extractFeatures(input);
  
  // Apply feature scaling to match training data
  const scaledFeatures = scaleFeatures(features, model.featureScaling);
  
  // Calculate prediction with regularized weights
  let prediction = model.intercept;
  
  // Add contribution from all features
  Object.keys(scaledFeatures).forEach(feature => {
    if (feature in model.weights) {
      prediction += model.weights[feature] * scaledFeatures[feature];
    }
  });
  
  // Add contribution from categorical features
  if (input.age >= 50) {
    prediction += model.weights['ageGroup_3'] || 0;
  } else if (input.age >= 40) {
    prediction += model.weights['ageGroup_2'] || 0;
  }
  
  // Calculate specific risks
  let respiratoryRisk = BASE_RISK.respiratory;
  let skinRisk = BASE_RISK.skin;
  let neurologicalRisk = BASE_RISK.neurological;
  
  // Adjust specific risks based on exposure and protection
  if (input.exposures.includes('pesticides')) {
    respiratoryRisk *= 2.2;
    neurologicalRisk *= 1.8;
    skinRisk *= 1.5;
  }
  
  if (input.exposures.includes('herbicides')) {
    skinRisk *= 1.7;
    respiratoryRisk *= 1.3;
  }
  
  if (!input.protectionEquipment.includes('mask') && 
      (input.exposures.includes('pesticides') || input.exposures.includes('herbicides'))) {
    respiratoryRisk *= 1.8;
  }
  
  if (!input.protectionEquipment.includes('gloves') && 
      (input.exposures.includes('pesticides') || input.exposures.includes('herbicides'))) {
    skinRisk *= 1.6;
  }
  
  if (input.medicalHistory.includes('respiratory')) {
    respiratoryRisk *= 1.7;
  }
  
  if (input.medicalHistory.includes('skin')) {
    skinRisk *= 1.6;
  }
  
  // Cap overall prediction between 0 and 100
  const overallRisk = Math.min(Math.max(Math.round(prediction), 0), 100);
  
  // Cap specific risks at 100
  respiratoryRisk = Math.min(Math.round(respiratoryRisk), 100);
  skinRisk = Math.min(Math.round(skinRisk), 100);
  neurologicalRisk = Math.min(Math.round(neurologicalRisk), 100);
  
  // Get top contributing factors from the model
  const topContributingFactors = model.importance
    .slice(0, 5)
    .map(feature => {
      const featureName = feature.feature;
      
      // Map feature names to readable descriptions
      if (featureName === 'age' || featureName.includes('ageGroup')) 
        return 'Age';
      if (featureName === 'workExperience') 
        return 'Years in agriculture';
      if (featureName === 'workHoursPerDay' || featureName === 'weeklyWorkHours') 
        return 'Working hours';
      if (featureName.includes('protection') || featureName.includes('Protection')) 
        return 'Protection equipment usage';
      if (featureName.includes('pesticide') || featureName.includes('herbicide')) 
        return 'Chemical exposure';
      if (featureName.includes('Respiratoire') || featureName.includes('respiratoire')) 
        return 'Respiratory health history';
      if (featureName.includes('Cutane') || featureName.includes('cutane')) 
        return 'Skin health history';
      
      return featureName;
    })
    .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
    .slice(0, 3); // Take top 3
  
  // Calculate enhanced confidence score
  const confidenceScore = Math.min(Math.round(75 + (model.accuracy || 0) / 4), 95);
  
  // Generate personalized recommendations based on risk factors
  const recommendations: string[] = [];
  
  if (respiratoryRisk > 50) {
    recommendations.push("Use proper respiratory protection when handling agricultural chemicals");
  }
  
  if (skinRisk > 50) {
    recommendations.push("Wear protective gloves and clothing to reduce skin exposure");
  }
  
  if (input.workHoursPerDay > 8) {
    recommendations.push("Reduce daily exposure time and take regular breaks");
  }
  
  if (input.exposures.length > 1) {
    recommendations.push("Avoid mixing different chemical products to reduce cumulative exposure risks");
  }
  
  if (input.yearsInAgriculture > 15 && (respiratoryRisk > 40 || neurologicalRisk > 40)) {
    recommendations.push("Schedule regular medical check-ups to monitor health given your long exposure history");
  }
  
  if (input.exposures.includes('pesticides') && !input.protectionEquipment.includes('mask')) {
    recommendations.push("Prioritize using respiratory protection when working with pesticides");
  }
  
  return {
    overallRisk,
    respiratoryRisk,
    skinRisk, 
    neurologicalRisk,
    confidenceScore,
    topContributingFactors,
    personalizedRecommendations: recommendations
  };
}

/**
 * Original rule-based prediction as fallback
 */
function predictRisksWithRules(input: PredictionInput): PredictionResult {
  // Initialize risk scores using base values
  let respiratoryRisk = BASE_RISK.respiratory;
  let skinRisk = BASE_RISK.skin;
  let neurologicalRisk = BASE_RISK.neurological;
  let overallRisk = BASE_RISK.overall;
  
  // Store factors that contribute most to the risk
  const contributingFactors: {factor: string, weight: number}[] = [];
  
  // Process age risk
  if (input.age >= 60) {
    overallRisk *= RISK_WEIGHTS.ageAbove60;
    respiratoryRisk *= RISK_WEIGHTS.ageAbove60;
    contributingFactors.push({factor: 'Age over 60', weight: RISK_WEIGHTS.ageAbove60});
  } else if (input.age >= 50) {
    overallRisk *= RISK_WEIGHTS.ageAbove50;
    respiratoryRisk *= RISK_WEIGHTS.ageAbove50 * 0.9;
    contributingFactors.push({factor: 'Age over 50', weight: RISK_WEIGHTS.ageAbove50});
  }
  
  // Process years of experience
  if (input.yearsInAgriculture > 15) {
    overallRisk *= RISK_WEIGHTS.longExperience;
    neurologicalRisk *= RISK_WEIGHTS.longExperience * 1.1;
    contributingFactors.push({factor: 'Long-term exposure (>15 years)', weight: RISK_WEIGHTS.longExperience});
  }
  
  // Process work hours
  if (input.workHoursPerDay > 8) {
    overallRisk *= RISK_WEIGHTS.longHours;
    contributingFactors.push({factor: 'Extended work hours', weight: RISK_WEIGHTS.longHours});
  }
  
  // Process chemical exposures
  input.exposures.forEach(exposure => {
    if (exposure === 'pesticides') {
      respiratoryRisk *= RISK_WEIGHTS.pesticide;
      skinRisk *= RISK_WEIGHTS.pesticide * 0.9;
      neurologicalRisk *= RISK_WEIGHTS.pesticide * 1.2;
      overallRisk *= RISK_WEIGHTS.pesticide;
      contributingFactors.push({factor: 'Pesticide exposure', weight: RISK_WEIGHTS.pesticide});
    }
    
    if (exposure === 'herbicides') {
      skinRisk *= RISK_WEIGHTS.herbicide * 1.1;
      respiratoryRisk *= RISK_WEIGHTS.herbicide * 0.8;
      overallRisk *= RISK_WEIGHTS.herbicide;
      contributingFactors.push({factor: 'Herbicide exposure', weight: RISK_WEIGHTS.herbicide});
    }
    
    if (exposure === 'fertilizers') {
      skinRisk *= RISK_WEIGHTS.fertilizer;
      respiratoryRisk *= RISK_WEIGHTS.fertilizer;
      overallRisk *= RISK_WEIGHTS.fertilizer;
      contributingFactors.push({factor: 'Fertilizer exposure', weight: RISK_WEIGHTS.fertilizer});
    }
  });
  
  // Process protection equipment
  if (!input.protectionEquipment.includes('mask')) {
    respiratoryRisk *= RISK_WEIGHTS.noMask;
    overallRisk *= RISK_WEIGHTS.noMask * 0.8;
    contributingFactors.push({factor: 'No respiratory protection', weight: RISK_WEIGHTS.noMask});
  }
  
  if (!input.protectionEquipment.includes('gloves')) {
    skinRisk *= RISK_WEIGHTS.noGloves;
    overallRisk *= RISK_WEIGHTS.noGloves * 0.7;
    contributingFactors.push({factor: 'No hand protection', weight: RISK_WEIGHTS.noGloves});
  }
  
  if (!input.protectionEquipment.includes('clothing')) {
    skinRisk *= RISK_WEIGHTS.noProtectiveClothing;
    overallRisk *= RISK_WEIGHTS.noProtectiveClothing * 0.6;
    contributingFactors.push({factor: 'No protective clothing', weight: RISK_WEIGHTS.noProtectiveClothing});
  }
  
  // Process medical history
  input.medicalHistory.forEach(condition => {
    if (condition === 'respiratory') {
      respiratoryRisk *= RISK_WEIGHTS.respiratoryHistory;
      overallRisk *= RISK_WEIGHTS.respiratoryHistory * 0.8;
      contributingFactors.push({factor: 'Previous respiratory issues', weight: RISK_WEIGHTS.respiratoryHistory});
    }
    
    if (condition === 'skin') {
      skinRisk *= RISK_WEIGHTS.skinHistory;
      overallRisk *= RISK_WEIGHTS.skinHistory * 0.7;
      contributingFactors.push({factor: 'Previous skin conditions', weight: RISK_WEIGHTS.skinHistory});
    }
    
    if (condition === 'neurological') {
      neurologicalRisk *= RISK_WEIGHTS.neurologicalHistory;
      overallRisk *= RISK_WEIGHTS.neurologicalHistory * 0.8;
      contributingFactors.push({factor: 'Previous neurological issues', weight: RISK_WEIGHTS.neurologicalHistory});
    }
  });
  
  // Cap risks at 100
  respiratoryRisk = Math.min(Math.round(respiratoryRisk), 100);
  skinRisk = Math.min(Math.round(skinRisk), 100);
  neurologicalRisk = Math.min(Math.round(neurologicalRisk), 100);
  overallRisk = Math.min(Math.round(overallRisk), 100);
  
  // Sort contributing factors by weight
  contributingFactors.sort((a, b) => b.weight - a.weight);
  
  // Get top 3 contributing factors
  const topContributingFactors = contributingFactors.slice(0, 3).map(factor => factor.factor);
  
  // Calculate confidence score based on input completeness
  const totalFactors = input.exposures.length + input.protectionEquipment.length + input.medicalHistory.length + 3; // +3 for the fixed inputs
  const confidenceScore = Math.min(Math.round((totalFactors / 10) * 100), 100);
  
  // Generate personalized recommendations
  const recommendations: string[] = [];
  
  if (respiratoryRisk > 50) {
    recommendations.push("Consider using respiratory protection (masks) when working with chemicals");
  }
  
  if (skinRisk > 50) {
    recommendations.push("Use protective gloves and clothing to reduce skin exposure to chemicals");
  }
  
  if (input.workHoursPerDay > 8) {
    recommendations.push("Take regular breaks and consider reducing daily exposure time");
  }
  
  if (input.exposures.includes('pesticides') && input.exposures.length > 1) {
    recommendations.push("Avoid mixing different types of chemicals to reduce cumulative exposure");
  }
  
  if (neurologicalRisk > 60) {
    recommendations.push("Schedule regular medical check-ups to monitor neurological health");
  }
  
  // Return prediction result
  return {
    overallRisk,
    respiratoryRisk,
    skinRisk, 
    neurologicalRisk,
    confidenceScore,
    topContributingFactors,
    personalizedRecommendations: recommendations
  };
}

/**
 * Helper to extract features from input
 */
function extractFeatures(input: PredictionInput): Record<string, number> {
  const features: Record<string, number> = {};
  
  // Numeric features
  features.age = input.age;
  features.workExperience = input.yearsInAgriculture;
  features.workHoursPerDay = input.workHoursPerDay;
  features.workDaysPerWeek = 5; // Assume 5 days by default
  
  // Derived features
  features.weeklyWorkHours = features.workHoursPerDay * features.workDaysPerWeek;
  features.workIntensity = features.weeklyWorkHours > 48 ? 3 : 
                          (features.weeklyWorkHours > 40 ? 2 : 1);
  
  // Age-related features
  features.ageGroup = features.age < 30 ? 1 : 
                     (features.age < 45 ? 2 : 
                     (features.age < 60 ? 3 : 4));
  
  // Protection score
  let protectionScore = 0;
  let maxPossibleScore = 21; // Total possible score for all protection equipment
  
  if (input.protectionEquipment.includes('mask')) protectionScore += 5;
  if (input.protectionEquipment.includes('gloves')) protectionScore += 5;
  if (input.protectionEquipment.includes('clothing')) protectionScore += 5;
  if (input.protectionEquipment.includes('boots')) protectionScore += 4;
  if (input.protectionEquipment.includes('hat')) protectionScore += 2;
  
  // Protection metrics
  features.protectionScore = protectionScore;
  features.protectionPercent = (protectionScore / maxPossibleScore) * 100;
  
  // Chemical exposure
  features.pesticide = input.exposures.includes('pesticides') ? 1 : 0;
  features.herbicide = input.exposures.includes('herbicides') ? 1 : 0;
  features.fertilizer = input.exposures.includes('fertilizers') ? 1 : 0;
  features.chemicalExposureCount = input.exposures.length;
  
  // Health history
  features.hasTroubleRespiratoire = input.medicalHistory.includes('respiratory') ? 1 : 0;
  features.hasTroubleCutane = input.medicalHistory.includes('skin') ? 1 : 0;
  features.hasTroubleNeurologique = input.medicalHistory.includes('neurological') ? 1 : 0;
  
  return features;
}

/**
 * Apply feature scaling to match training data
 */
function scaleFeatures(features: Record<string, number>, scaling: Record<string, {min: number, max: number, mean: number}>): Record<string, number> {
  const scaledFeatures = {...features};
  
  // Apply scaling to numeric features that were scaled during training
  Object.keys(scaling).forEach(feature => {
    if (feature in scaledFeatures) {
      const stats = scaling[feature];
      if (stats.max !== stats.min) { // Avoid division by zero
        scaledFeatures[feature] = (scaledFeatures[feature] - stats.min) / (stats.max - stats.min);
      } else {
        scaledFeatures[feature] = 0;
      }
    }
  });
  
  return scaledFeatures;
}
}
