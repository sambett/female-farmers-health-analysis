// ApiService.ts
// API service for communicating with the backend

const API_BASE_URL = 'http://localhost:8000';

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
