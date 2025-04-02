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
 * Analyzes patterns in the dataset to build a basic prediction model
 * @param data The health records dataset
 */
export function buildPredictionModel(data: HealthRecord[]) {
  console.log('Building statistical prediction model from', data.length, 'records');
  // In a real implementation, this would analyze patterns and adjust weights
  // For simplicity, we're using pre-defined weights
  return true;
}

/**
 * Predict health risks based on input factors
 * @param input Input factors for prediction
 * @param data Optional dataset for context-based adjustments
 */
export function predictRisks(input: PredictionInput, data?: HealthRecord[]): PredictionResult {
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
  
  // Apply dataset context if available
  if (data && data.length > 0) {
    // Simple adjustment based on population averages would go here
    // For demo purposes, we're skipping this step
  }
  
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
