// TextAnalysisService.ts
// This service handles the NLP processing of textual fields

import * as natural from 'natural';
import stopwords from './stopwords-fr'; // You'll need to create this file with French stopwords

// Tokenizer for French text
const tokenizer = new natural.WordTokenizer();
const stemmer = natural.PorterStemmerFr;

// Interface for our structured text data
interface StructuredTextData {
  healthIssueTerms: {term: string, count: number}[];
  chemicalExposureTerms: {term: string, count: number}[];
  taskTerms: {term: string, count: number}[];
  healthChemicalRelations: {health: string, chemical: string, count: number}[];
}

// Main class for text analysis
export class TextAnalysisService {
  
  // Process all text fields from a dataset
processTextData(data: Record<string, any>[]): StructuredTextData {
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
private processHealthIssues(record: Record<string, any>, result: StructuredTextData): void {
    // Combine all health-related text fields
    const healthText = [
      record['Troubles cardio-respiratoires'] || '',
      record['Troubles cognitifs'] || '',
      record['Troubles neurologiques'] || '',
      record['Troubles cutanés/phanères'] || '',
      record['Autres plaintes'] || ''
    ].join(' ').toLowerCase();
    
    // Extract terms
    const terms = this.extractMeaningfulTerms(healthText);
    
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
private processChemicalExposure(record: Record<string, any>, result: StructuredTextData): void {
    // Get chemical text
    const chemicalText = [
      record['Produits chimiques utilisés'] || '',
      record['Engrais utilisés'] || '',
      record['Produits biologiques utilisés'] || ''
    ].join(' ').toLowerCase();
    
    // Extract terms
    const terms = this.extractMeaningfulTerms(chemicalText);
    
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
private processTasks(record: Record<string, any>, result: StructuredTextData): void {
    // Get tasks text
    const tasksText = record['Tâches effectuées'] || '';
    
    // Extract terms
    const terms = this.extractMeaningfulTerms(tasksText.toLowerCase());
    
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
private findHealthChemicalRelations(record: Record<string, any>, result: StructuredTextData): void {
    // Extract health terms
    const healthText = [
      record['Troubles cardio-respiratoires'] || '',
      record['Troubles cognitifs'] || '',
      record['Troubles neurologiques'] || '',
      record['Troubles cutanés/phanères'] || '',
      record['Autres plaintes'] || ''
    ].join(' ').toLowerCase();
    const healthTerms = this.extractMeaningfulTerms(healthText);
    
    // Extract chemical terms
    const chemicalText = [
      record['Produits chimiques utilisés'] || '',
      record['Engrais utilisés'] || '',
      record['Produits biologiques utilisés'] || ''
    ].join(' ').toLowerCase();
    const chemicalTerms = this.extractMeaningfulTerms(chemicalText);
    
    // Create relations if both exist
    if (healthTerms.length > 0 && chemicalTerms.length > 0) {
      healthTerms.forEach(health => {
        chemicalTerms.forEach(chemical => {
          const key = `${health}-${chemical}`;
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
  }
  
  // Extract meaningful terms from text, removing stopwords
  private extractMeaningfulTerms(text: string): string[] {
    if (!text) return [];
    
    // Tokenize
    const tokens = tokenizer.tokenize(text) || [];
    
    // Remove stopwords and short terms
    const filteredTokens = tokens.filter(token => 
      !stopwords.includes(token) && token.length > 2);
    
    // Stem words
    const stemmed = filteredTokens.map(token => stemmer.stem(token));
    
    return stemmed;
  }
  
  // Get the top risk factors for a predictive model
interface StructuredRiskFactor {
    healthIssue: string;
    exposure: string;
    occurrenceCount: number;
    riskScore: number;
}

export class TextAnalysisService {
    // Other methods...

    // Get the top risk factors for a predictive model
    getTopRiskFactors(structuredData: StructuredTextData, limit: number = 10): StructuredRiskFactor[] {
    // Combine health-chemical relations with high counts
    return structuredData.healthChemicalRelations
      .filter(relation => relation.count > 1)
      .sort((a, b) => b.count - a.count)
      .slice(0, limit)
      .map(relation => ({
        healthIssue: relation.health,
        exposure: relation.chemical,
        occurrenceCount: relation.count,
        riskScore: relation.count / 
          Math.max(
            structuredData.healthChemicalRelations.reduce((max, r) => 
              r.count > max ? r.count : max, 0), 1) * 100
      }));
  }
}