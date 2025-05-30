// DataService.ts
import * as XLSX from 'xlsx';
import { HealthRecord } from '../types';

// Define a more flexible record type for processing raw data
// Using Record<string, unknown> for type safety
type ProcessableRecord = Record<string, unknown>;

// Function to load data from an Excel file
export const loadData = async (filePath: string): Promise<HealthRecord[]> => {
  try {
    // For 'sample' filepath, return sample data immediately
    if (filePath === 'sample') {
      return getSampleData();
    }
    
    // Try multiple methods to load the file
    let arrayBuffer: ArrayBuffer;
    
    // First try window.fs if available
    if (typeof window !== 'undefined' && 'fs' in window && window.fs) {
      try {
        const fileBuffer = await window.fs.readFile(filePath);
        if (fileBuffer instanceof Uint8Array) {
          arrayBuffer = fileBuffer.buffer;
        } else {
          throw new Error('Expected Uint8Array from window.fs.readFile');
        }
      } catch (fsError) {
        console.warn('Error loading with window.fs:', fsError);
        // Fall back to fetch API
        const response = await fetch(filePath);
        arrayBuffer = await response.arrayBuffer();
      }
    } else {
      // window.fs not available, use fetch API
      const response = await fetch(filePath);
      arrayBuffer = await response.arrayBuffer();
    }
    
    // Parse Excel file
    const workbook = XLSX.read(new Uint8Array(arrayBuffer), {
      type: 'array',
      cellDates: true,
      cellNF: true,
      cellStyles: true
    });
    
    // Get first sheet
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
    // Convert to JSON
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
      defval: '', // Default value for empty cells
      raw: false  // Convert values to string
    }) as ProcessableRecord[];
    
    // Process data to handle specific fields
    return processData(jsonData);
  } catch (error) {
    console.error('Error loading data:', error);
    
    // For development/testing purposes, return sample data if real data fails to load
    return getSampleData();
  }
};

// Process the data to handle specific formats and clean values
const processData = (data: ProcessableRecord[]): HealthRecord[] => {
  return data.map(record => {
    // Create a processed record with the correct type
    const processedRecord: HealthRecord = {};
    
    // Copy over numeric fields
    if (record['N°']) processedRecord['N°'] = Number(record['N°']);
    if (record['Age']) processedRecord['Age'] = Number(record['Age']);
    if (record['Nb enfants']) processedRecord['Nb enfants'] = Number(record['Nb enfants']);
    if (record['H travail / jour']) processedRecord['H travail / jour'] = Number(record['H travail / jour']);
    if (record['J travail / Sem']) processedRecord['J travail / Sem'] = Number(record['J travail / Sem']);
    if (record['Ancienneté agricole']) processedRecord['Ancienneté agricole'] = Number(record['Ancienneté agricole']);
    if (record['TAS']) processedRecord['TAS'] = Number(record['TAS']);
    if (record['TAD']) processedRecord['TAD'] = Number(record['TAD']);
    
    // Copy string fields
    if (record['Situation maritale']) processedRecord['Situation maritale'] = String(record['Situation maritale']);
    if (record['Niveau socio-économique']) processedRecord['Niveau socio-économique'] = String(record['Niveau socio-économique']);
    if (record['Statut']) processedRecord['Statut'] = String(record['Statut']);
    if (record['Masque pour pesticides']) processedRecord['Masque pour pesticides'] = String(record['Masque pour pesticides']);
    if (record['Bottes']) processedRecord['Bottes'] = String(record['Bottes']);
    if (record['Gants']) processedRecord['Gants'] = String(record['Gants']);
    if (record['Casquette/Mdhalla']) processedRecord['Casquette/Mdhalla'] = String(record['Casquette/Mdhalla']);
    if (record['Manteau imperméable']) processedRecord['Manteau imperméable'] = String(record['Manteau imperméable']);
    
    // Ensure health issue fields are strings
    ['Troubles cardio-respiratoires', 'Troubles cognitifs', 
     'Troubles neurologiques', 'Troubles cutanés/phanères', 
     'Autres plaintes'].forEach(field => {
      if (record[field] === undefined || record[field] === null) {
        processedRecord[field] = '';
      } else {
        processedRecord[field] = String(record[field]);
      }
    });
    
    // Ensure chemical fields are strings
    ['Produits chimiques utilisés', 'Engrais utilisés', 
     'Produits biologiques utilisés'].forEach(field => {
      if (record[field] === undefined || record[field] === null) {
        processedRecord[field] = '';
      } else {
        processedRecord[field] = String(record[field]);
      }
    });
    
    // Ensure task field is a string
    if (record['Tâches effectuées'] === undefined || 
        record['Tâches effectuées'] === null) {
      processedRecord['Tâches effectuées'] = '';
    } else {
      processedRecord['Tâches effectuées'] = String(record['Tâches effectuées']);
    }
    
    return processedRecord;
  });
};

// Sample data for development/testing purposes
const getSampleData = (): HealthRecord[] => {
  return [
    {
      "N°": 1,
      "Age": 45,
      "Situation maritale": "mariée",
      "Nb enfants": 3,
      "Niveau socio-économique": "moyen",
      "Statut": "permanente",
      "H travail / jour": 8,
      "J travail / Sem": 6,
      "Ancienneté agricole": 15,
      "Tâches effectuées": "epandage des engrais, cueillette des olives",
      "Produits chimiques utilisés": "pesticides, engrais chimiques",
      "Masque pour pesticides": "parfois",
      "Bottes": "souvent",
      "Gants": "parfois",
      "Casquette/Mdhalla": "toujours",
      "Manteau imperméable": "jamais",
      "Troubles cardio-respiratoires": "dyspnée, palpitations",
      "Troubles cognitifs": "",
      "Troubles neurologiques": "céphalées",
      "Troubles cutanés/phanères": "irritation cutanée",
      "TAS": 130,
      "TAD": 85
    },
    {
      "N°": 2,
      "Age": 52,
      "Situation maritale": "mariée",
      "Nb enfants": 4,
      "Niveau socio-économique": "bas",
      "Statut": "saisonnière",
      "H travail / jour": 10,
      "J travail / Sem": 5,
      "Ancienneté agricole": 25,
      "Tâches effectuées": "cueillette des fruits, désherbage",
      "Produits chimiques utilisés": "herbicides",
      "Masque pour pesticides": "jamais",
      "Bottes": "parfois",
      "Gants": "jamais",
      "Casquette/Mdhalla": "toujours",
      "Manteau imperméable": "jamais",
      "Troubles cardio-respiratoires": "toux chronique",
      "Troubles cognitifs": "troubles de la mémoire",
      "Troubles neurologiques": "vertiges, céphalées",
      "Troubles cutanés/phanères": "dermatite",
      "TAS": 145,
      "TAD": 90
    },
    {
      "N°": 3,
      "Age": 38,
      "Situation maritale": "mariée",
      "Nb enfants": 2,
      "Niveau socio-économique": "moyen",
      "Statut": "permanente",
      "H travail / jour": 7,
      "J travail / Sem": 6,
      "Ancienneté agricole": 10,
      "Tâches effectuées": "traitement pesticides, récolte",
      "Produits chimiques utilisés": "pesticides, fongicides",
      "Masque pour pesticides": "souvent",
      "Bottes": "toujours",
      "Gants": "toujours",
      "Casquette/Mdhalla": "toujours",
      "Manteau imperméable": "parfois",
      "Troubles cardio-respiratoires": "",
      "Troubles cognitifs": "",
      "Troubles neurologiques": "céphalées occasionnelles",
      "Troubles cutanés/phanères": "",
      "TAS": 120,
      "TAD": 80
    }
  ];
};

// Function to extract unique values for a given field
export const getUniqueValues = (data: HealthRecord[], field: string): string[] => {
  const valueSet = new Set<string>();
  
  data.forEach(record => {
    const value = record[field];
    if (value !== undefined && value !== null && value !== '') {
      // If it's a comma-separated list, split and add each value
      if (typeof value === 'string' && value.includes(',')) {
        value.split(',').forEach(v => valueSet.add(v.trim()));
      } else {
        valueSet.add(String(value).trim());
      }
    }
  });
  
  return Array.from(valueSet).sort();
};

// Function to get text analysis stopwords for French
export const getFrenchStopwords = (): string[] => {
  return [
    "a", "à", "au", "aux", "avec", "ce", "ces", "dans", "de", "des", "du", "elle", 
    "en", "et", "eux", "il", "ils", "je", "j'ai", "j'", "la", "le", "les", 
    "leur", "lui", "ma", "mais", "me", "même", "mes", "moi", "mon", "ni", "notre", 
    "nous", "ou", "par", "pas", "pour", "qu", "que", "qui", "s", "sa", "se", "si", 
    "son", "sur", "ta", "te", "tes", "toi", "ton", "tu", "un", "une", "votre", 
    "vous", "c", "d", "j", "l", "à", "m", "n", "s", "t", "y", "été", "étée", 
    "étées", "étés", "étant", "suis", "es", "est", "sommes", "êtes", "sont", 
    "serai", "seras", "sera", "serons", "serez", "seront", "serais", "serait", 
    "serions", "seriez", "seraient", "étais", "était", "étions", "étiez", 
    "étaient", "fus", "fut", "fûmes", "fûtes", "furent", "sois", "soit", 
    "soyons", "soyez", "soient", "fusse", "fusses", "fût", "fussions", 
    "fussiez", "fussent"
  ];
};