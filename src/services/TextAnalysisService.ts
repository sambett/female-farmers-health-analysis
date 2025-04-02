// TextAnalysisService.ts
// This service handles the NLP processing of textual fields

import * as natural from 'natural';
import stopwords from './stopwords-fr';
import { StructuredTextData, RiskFactor, HealthRecord } from '../types';

// Check if window.fs is defined - add this to avoid TypeScript errors
declare global {
  interface Window {
    fs?: {
      readFile(path: string, options?: { encoding?: string }): Promise<Uint8Array | string>;
    };
  }
}

// Tokenizer for French text
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmerFr;

// Define domain-specific dictionaries to improve term recognition
const healthTermDictionary = {
  // Respiratory
  'dyspnée': 'dyspnée',
  'toux': 'toux',
  'asthme': 'asthme',
  'bronchite': 'bronchite',
  'pneumonie': 'pneumonie',
  'emphysème': 'emphysème',
  'respiratoire': 'respiratoire',
  'pulmonaire': 'pulmonaire',
  
  // Cardiac
  'palpitations': 'palpitations',
  'cardio': 'cardio',
  'hypertension': 'hypertension',
  'hypotension': 'hypotension',
  'tachycardie': 'tachycardie',
  'arythmie': 'arythmie',
  
  // Neurological
  'céphalées': 'céphalées',
  'migraine': 'migraine',
  'vertiges': 'vertiges',
  'étourdissements': 'vertiges',
  'paresthésies': 'paresthésies',
  'tremblements': 'tremblements',
  'convulsions': 'convulsions',
  'neurologique': 'neurologique',
  
  // Cognitive
  'mémoire': 'mémoire',
  'cognitif': 'cognitif',
  'oubli': 'mémoire',
  'concentration': 'concentration',
  'confusion': 'confusion',
  
  // Skin
  'dermatite': 'dermatite',
  'irritation': 'irritation',
  'prurit': 'prurit',
  'démangeaisons': 'prurit',
  'cutané': 'cutané',
  'dermatose': 'dermatose',
  'eczéma': 'eczéma',
  'érythème': 'érythème',
  'rougeur': 'érythème',
  'peau': 'cutané',
};

const chemicalTermDictionary = {
  'pesticide': 'pesticide',
  'pesticides': 'pesticide',
  'herbicide': 'herbicide',
  'herbicides': 'herbicide',
  'insecticide': 'insecticide',
  'insecticides': 'insecticide',
  'fongicide': 'fongicide',
  'fongicides': 'fongicide',
  'nématicide': 'nématicide',
  'engrais': 'engrais',
  'chimique': 'chimique',
  'chimiques': 'chimique',
  'organique': 'organique',
  'organiques': 'organique',
  'phosphore': 'phosphore',
  'azote': 'azote',
  'potasse': 'potasse',
  'potassium': 'potasse',
  'nitrate': 'nitrate',
  'ammoniac': 'ammoniac',
  'ammonium': 'ammoniac',
  'sulfate': 'sulfate',
  'paraquat': 'paraquat',
  'glyphosate': 'glyphosate',
  'roundup': 'glyphosate',
  'pyrèthre': 'pyrèthre',
};

const taskTermDictionary = {
  'épandage': 'épandage',
  'épend': 'épandage',
  'traitement': 'traitement',
  'trait': 'traitement',
  'récolte': 'récolte',
  'récolt': 'récolte',
  'cueillette': 'cueillette',
  'cueil': 'cueillette',
  'taille': 'taille',
  'semis': 'semis',
  'semailles': 'semis',
  'désherbage': 'désherbage',
  'sarclage': 'désherbage',
  'désherbant': 'désherbage',
  'désherbe': 'désherbage',
  'irrigation': 'irrigation',
  'irrig': 'irrigation',
  'arrosage': 'irrigation',
  'labour': 'labour',
  'labeur': 'labour',
  'labourage': 'labour',
  'nettoyage': 'nettoyage',
  'nettoy': 'nettoyage',
  'stockage': 'stockage',
  'stock': 'stockage',
  'plantation': 'plantation',
  'plant': 'plantation',
  'fertilisation': 'fertilisation',
  'fertil': 'fertilisation',
};



// Main class for text analysis
export class TextAnalysisService {
  
  // Process all text fields from a dataset
  processTextData(data: HealthRecord[]): StructuredTextData {
    // Initialize our result structure
    const result: StructuredTextData = {
      healthIssueTerms: [],
      chemicalExposureTerms: [],
      taskTerms: [],
      healthChemicalRelations: []
    };
    
    // Process each record
    data.forEach(record => {
      // Process health issues text fields
      this.processHealthIssues(record, result);
      
      // Process chemical exposure text
      this.processChemicalExposure(record, result);
      
      // Process tasks performed
      this.processTasks(record, result);
      
      // Find relations between health issues and chemicals
      this.findHealthChemicalRelations(record, result);
    });
    
    // Sort all term lists by count (descending)
    result.healthIssueTerms.sort((a, b) => b.count - a.count);
    result.chemicalExposureTerms.sort((a, b) => b.count - a.count);
    result.taskTerms.sort((a, b) => b.count - a.count);
    result.healthChemicalRelations.sort((a, b) => b.count - a.count);
    
    return result;
  }
  
  // Process health issue text fields
  private processHealthIssues(record: HealthRecord, result: StructuredTextData): void {
    // Combine all health-related text fields
    const healthText = [
      record['Troubles cardio-respiratoires'] || '',
      record['Troubles cognitifs'] || '',
      record['Troubles neurologiques'] || '',
      record['Troubles cutanés/phanères'] || '',
      record['Autres plaintes'] || ''
    ].join(' ').toLowerCase();
    
    // Extract terms using the health dictionary
    const terms = this.extractMeaningfulTerms(healthText, healthTermDictionary);
    
    // Update term counts
    terms.forEach(term => {
      const existing = result.healthIssueTerms.find(t => t.term === term);
      if (existing) {
        existing.count++;
      } else {
        result.healthIssueTerms.push({ term, count: 1 });
      }
    });
  }
  
  // Process chemical exposure text
  private processChemicalExposure(record: HealthRecord, result: StructuredTextData): void {
    // Get chemical text
    const chemicalText = [
      record['Produits chimiques utilisés'] || '',
      record['Engrais utilisés'] || '',
      record['Produits biologiques utilisés'] || ''
    ].join(' ').toLowerCase();
    
    // Extract terms using chemical dictionary
    const terms = this.extractMeaningfulTerms(chemicalText, chemicalTermDictionary);
    
    // Update term counts
    terms.forEach(term => {
      const existing = result.chemicalExposureTerms.find(t => t.term === term);
      if (existing) {
        existing.count++;
      } else {
        result.chemicalExposureTerms.push({ term, count: 1 });
      }
    });
  }
  
  // Process tasks text
  private processTasks(record: HealthRecord, result: StructuredTextData): void {
    // Get tasks text
    const tasksText = record['Tâches effectuées'] || '';
    
    // Extract terms using task dictionary
    const terms = this.extractMeaningfulTerms(tasksText.toLowerCase(), taskTermDictionary);
    
    // Update term counts
    terms.forEach(term => {
      const existing = result.taskTerms.find(t => t.term === term);
      if (existing) {
        existing.count++;
      } else {
        result.taskTerms.push({ term, count: 1 });
      }
    });
  }
  
  // Find relations between health issues and chemicals
  private findHealthChemicalRelations(record: HealthRecord, result: StructuredTextData): void {
    // Extract health terms using health dictionary
    const healthText = [
      record['Troubles cardio-respiratoires'] || '',
      record['Troubles cognitifs'] || '',
      record['Troubles neurologiques'] || '',
      record['Troubles cutanés/phanères'] || '',
      record['Autres plaintes'] || ''
    ].join(' ').toLowerCase();
    const healthTerms = this.extractMeaningfulTerms(healthText, healthTermDictionary);
    
    // Extract chemical terms using chemical dictionary
    const chemicalText = [
      record['Produits chimiques utilisés'] || '',
      record['Engrais utilisés'] || '',
      record['Produits biologiques utilisés'] || ''
    ].join(' ').toLowerCase();
    const chemicalTerms = this.extractMeaningfulTerms(chemicalText, chemicalTermDictionary);
    
    // Create relations if both exist
    if (healthTerms.length > 0 && chemicalTerms.length > 0) {
      healthTerms.forEach(health => {
        chemicalTerms.forEach(chemical => {
          // Skip relation if either term is too general
          if (health === 'cutané' && chemical === 'chimique') return;
          
          const existing = result.healthChemicalRelations.find(r => 
            r.health === health && r.chemical === chemical);
          
          if (existing) {
            existing.count++;
          } else {
            result.healthChemicalRelations.push({
              health,
              chemical,
              count: 1
            });
          }
        });
      });
    }
    
    // Also check for task-related health impacts
    const tasksText = record['Tâches effectuées'] || '';
    if (tasksText && healthTerms.length > 0) {
      const taskTerms = this.extractMeaningfulTerms(tasksText.toLowerCase(), taskTermDictionary);
      
      // Map tasks to chemicals when appropriate to find indirect relations
      const taskToChemical = {
        'épandage': 'engrais',
        'traitement': 'pesticide',
        'désherbage': 'herbicide'
      };
      
      taskTerms.forEach(task => {
        // If task is related to chemical application
        if (task in taskToChemical) {
          const relatedChemical = taskToChemical[task as keyof typeof taskToChemical];
          
          healthTerms.forEach(health => {
            const existing = result.healthChemicalRelations.find(r => 
              r.health === health && r.chemical === relatedChemical);
            
            if (existing) {
              existing.count += 0.5; // Lower weight for indirect relations
            } else {
              result.healthChemicalRelations.push({
                health,
                chemical: relatedChemical,
                count: 0.5
              });
            }
          });
        }
      });
    }
  }
  
  // Extract meaningful terms from text, removing stopwords and using dictionaries
  private extractMeaningfulTerms(text: string, dictionary?: Record<string, string>): string[] {
    if (!text) return [];
    
    // Normalize text: lowercase and remove accents for better matching
    text = text.toLowerCase();
    
    // Split by common separators (commas, semicolons, etc.)
    const segments = text.split(/[,;\/.\-\s]+/);
    const result = new Set<string>();
    
    // First pass: check for exact matches in dictionary (for multi-word terms)
    if (dictionary) {
      Object.keys(dictionary).forEach(term => {
        if (text.includes(term)) {
          result.add(dictionary[term]);
        }
      });
    }
    
    // Second pass: tokenize and process individual terms
    segments.forEach(segment => {
      // Tokenize
      const tokens = tokenizer.tokenize(segment) || [];
      
      // Remove stopwords and short terms
      const filteredTokens = tokens.filter(token => 
        !stopwords.includes(token) && token.length > 2);
      
      // Process each token
      filteredTokens.forEach(token => {
        if (dictionary && token in dictionary) {
          // If in dictionary, use the standardized term
          result.add(dictionary[token]);
        } else {
          // Otherwise stem the word
          const stemmed = stemmer.stem(token);
          // Only add stems that are meaningful (longer than 2 chars)
          if (stemmed.length > 2) {
            result.add(stemmed);
          }
        }
      });
    });
    
    return Array.from(result);
  }
  
  // Get the top risk factors for a predictive model
  getTopRiskFactors(structuredData: StructuredTextData, limit: number = 10): RiskFactor[] {
    // Calculate the maximum relationship count for normalization
    const maxCount = Math.max(
      structuredData.healthChemicalRelations.reduce((max, r) => 
        r.count > max ? r.count : max, 0), 1);
    
    // Define severity weights for different health issues
    const healthSeverityWeights: Record<string, number> = {
      'respiratoire': 1.5,
      'pulmonaire': 1.5,
      'dyspnée': 1.3,
      'asthme': 1.4,
      'toux': 1.2,
      'palpitations': 1.4,
      'cardio': 1.4,
      'hypertension': 1.3,
      'céphalées': 1.1,
      'vertiges': 1.2,
      'paresthésies': 1.3,
      'convulsions': 1.5,
      'neurologique': 1.4,
      'cognitif': 1.3,
      'mémoire': 1.2,
      'dermatite': 1.1,
      'irritation': 1.0,
      'cutané': 1.0,
      'eczéma': 1.1,
      'érythème': 1.0
    };
    
    // Define risk weights for different chemicals/exposures
    const chemicalRiskWeights: Record<string, number> = {
      'pesticide': 1.8,
      'herbicide': 1.5,
      'insecticide': 1.7,
      'fongicide': 1.4,
      'nématicide': 1.6,
      'glyphosate': 1.7,
      'paraquat': 1.8,
      'engrais': 1.2,
      'chimique': 1.3,
      'organique': 0.8,
      'ammoniac': 1.4,
      'nitrate': 1.3,
      'phosphore': 1.2,
      'potasse': 1.1
    };
    
    // Process and score the risk factors
    return structuredData.healthChemicalRelations
      // Filter out relations with very low counts (might be noise)
      .filter(relation => relation.count >= 0.5)
      // Sort by count (descending)
      .sort((a, b) => b.count - a.count)
      // Take the top 'limit' results
      .slice(0, limit)
      // Map to structured risk factors with weighted scores
      .map(relation => {
        // Get severity weights (default to 1.0 if not specified)
        const healthWeight = healthSeverityWeights[relation.health] || 1.0;
        const chemicalWeight = chemicalRiskWeights[relation.chemical] || 1.0;
        
        // Calculate normalized base score (0-100)
        const baseScore = (relation.count / maxCount) * 60; // Scale to 0-60
        
        // Apply weights to get final risk score (max 100)
        const weightedScore = Math.min(baseScore * healthWeight * chemicalWeight, 100);
        
        return {
          healthIssue: relation.health,
          exposure: relation.chemical,
          occurrenceCount: relation.count,
          riskScore: Math.round(weightedScore)
        };
      });
  }
}