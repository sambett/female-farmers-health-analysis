// ApiService.ts
// API service for communicating with the backend

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

interface StructuredPredictionInput {
  age: number;
  work_experience: number;
  work_hours_per_day: number;
  work_days_per_week: number;
  protective_equipment: string[];
  chemical_exposure: string[];
  tasks?: string[];
  has_respiratory_conditions: boolean;
  has_skin_conditions: boolean;
  has_chronic_exposure: boolean;
  marital_status: string;
  number_of_children: number;
  socio_economic_status: string;
  employment_status: string;
}

interface TextPredictionInput {
  general_description: string;
  chemicals_text: string;
  tasks_text: string;
  health_text: string;
  protection_text: string;
}

// Predict risk using structured input
export const predictRisk = async (data: StructuredPredictionInput) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict_risk`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error predicting risk:', error);
    throw error;
  }
};

// Predict risk using free text input
export const predictRiskFromText = async (data: TextPredictionInput) => {
  try {
    const response = await fetch(`${API_BASE_URL}/predict_risk_from_text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error predicting risk from text:', error);
    throw error;
  }
};

// Extract keywords from text
export const extractKeywords = async (text: string, type: 'chemical' | 'task' | 'health' | 'protection' = 'chemical') => {
  try {
    const response = await fetch(`${API_BASE_URL}/extract_keywords?type=${type}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    const data = await response.json();
    return data.keywords || [];
  } catch (error) {
    console.error(`Error extracting ${type} keywords:`, error);
    return [];
  }
};

// Analyze text for risk factors
export const analyzeText = async (text: string) => {
  try {
    const response = await fetch(`${API_BASE_URL}/analyze_text`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error (${response.status}): ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error analyzing text:', error);
    throw error;
  }
};

// Health check to test backend connection
export const checkBackendHealth = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    return response.ok;
  } catch (error) {
    console.error('Backend health check failed:', error);
    return false;
  }
};

// Fallback data for when backend is not available
export const useFallbackData = async () => {
  try {
    const isBackendHealthy = await checkBackendHealth();
    return !isBackendHealthy;
  } catch (error) {
    console.error('Error checking backend health:', error);
    return true; // Use fallback if we can't even check health
  }
};

// Get mock data for demo purposes
export const getMockRiskAssessment = (data: StructuredPredictionInput) => {
  // Create a reproducible but varied risk score based on input
  const riskBase = 30;
  const ageRisk = data.age > 50 ? 15 : data.age > 40 ? 10 : 5;
  const protectionReduction = data.protective_equipment.length * 5;
  const chemicalRisk = data.chemical_exposure.length * 8;
  const healthRisk = (data.has_respiratory_conditions ? 15 : 0) + 
                     (data.has_skin_conditions ? 10 : 0) + 
                     (data.has_chronic_exposure ? 12 : 0);
                     
  const overallRisk = Math.min(riskBase + ageRisk + chemicalRisk + healthRisk - protectionReduction, 100);
  
  return {
    overall_risk: Math.max(10, Math.round(overallRisk)),
    respiratory_risk: Math.round(overallRisk + (data.has_respiratory_conditions ? 15 : 0)),
    skin_risk: Math.round(overallRisk + (data.has_skin_conditions ? 15 : 0)),
    neurological_risk: Math.round(overallRisk + (data.has_chronic_exposure ? 10 : 0)),
    risk_factors: [
      data.age > 50 ? `Âge élevé (${data.age} ans)` : null,
      data.work_experience > 15 ? `Exposition prolongée (${data.work_experience} ans)` : null,
      data.protective_equipment.length < 3 ? "Protection insuffisante" : null,
      data.chemical_exposure.includes("pesticides") ? "Exposition aux pesticides" : null,
      data.has_respiratory_conditions ? "Antécédents respiratoires" : null,
    ].filter(Boolean),
    recommendations: [
      data.protective_equipment.length < 3 ? "Utiliser davantage d'équipements de protection" : null,
      !data.protective_equipment.includes("mask") && data.chemical_exposure.some(c => ["pesticides", "herbicides"].includes(c)) ? 
        "Porter un masque lors de l'utilisation de produits chimiques" : null,
      !data.protective_equipment.includes("gloves") ? "Porter des gants pour éviter le contact cutané" : null,
      data.has_respiratory_conditions ? "Consulter régulièrement un médecin pour le suivi respiratoire" : null,
    ].filter(Boolean),
    feature_importance: [
      {"feature": "Âge", "importance": 0.8},
      {"feature": "Protection", "importance": 0.75},
      {"feature": "Produits chimiques", "importance": 0.7},
      {"feature": "Heures de travail", "importance": 0.65},
      {"feature": "Antécédents médicaux", "importance": 0.6}
    ],
    confidence_interval: [Math.max(0, overallRisk - 5), Math.min(100, overallRisk + 5)],
    what_if_scenarios: [
      data.protective_equipment.length < 3 ? {
        "label": "Avec protection complète",
        "score": Math.max(10, Math.round(overallRisk - 15))
      } : null,
      (data.work_hours_per_day * (data.work_days_per_week || 5)) > 40 ? {
        "label": "Avec horaire réduit",
        "score": Math.max(10, Math.round(overallRisk - 10))
      } : null
    ].filter(Boolean)
  };
};
