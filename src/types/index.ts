// Common types used throughout the application

// Health data record structure
export interface HealthRecord {
  "N°"?: number;
  "Age"?: number;
  "Situation maritale"?: string;
  "Nb enfants"?: number;
  "Niveau socio-économique"?: string;
  "Statut"?: string;
  "H travail / jour"?: number;
  "J travail / Sem"?: number;
  "Ancienneté agricole"?: number;
  "Tâches effectuées"?: string;
  "Produits chimiques utilisés"?: string;
  "Engrais utilisés"?: string;
  "Produits biologiques utilisés"?: string;
  "Masque pour pesticides"?: string;
  "Bottes"?: string;
  "Gants"?: string;
  "Casquette/Mdhalla"?: string;
  "Manteau imperméable"?: string;
  "Troubles cardio-respiratoires"?: string;
  "Troubles cognitifs"?: string;
  "Troubles neurologiques"?: string;
  "Troubles cutanés/phanères"?: string;
  "Autres plaintes"?: string;
  "TAS"?: number;
  "TAD"?: number;
  [key: string]: string | number | undefined; // Index signature for other fields
}

// Text Analysis Types
export interface TermData {
  term: string;
  count: number;
}

export interface RelationData {
  health: string;
  chemical: string;
  count: number;
}

export interface StructuredTextData {
  healthIssueTerms: TermData[];
  chemicalExposureTerms: TermData[];
  taskTerms: TermData[];
  healthChemicalRelations: RelationData[];
}

export interface RiskFactor {
  healthIssue: string;
  exposure: string;
  occurrenceCount: number;
  riskScore: number;
}

export interface ChartDataItem {
  name: string;
  value: number;
}

export interface SpecificRisks {
  respiratory: number;
  skin: number;
  neurological: number;
  overall: number;
}

// Machine Learning Model Types
export interface FeatureImportance {
  feature: string;
  importance: number;
}
