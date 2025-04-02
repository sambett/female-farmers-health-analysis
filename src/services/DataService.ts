// DataService.ts
import * as XLSX from 'xlsx';

// Function to load data from an Excel file
export const loadData = async (filePath: string): Promise<any[]> => {
  try {
    // In a browser environment, use a direct approach to load the file
    // This should work with the expected file structure
    const response = await fetch(filePath);
    const arrayBuffer = await response.arrayBuffer();
    
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
    });
    
    // Process data to handle specific fields
    return processData(jsonData);
  } catch (error) {
    console.error('Error loading data:', error);
    
    // For development/testing purposes, return sample data if real data fails to load
    return getSampleData();
  }
};

// Process the data to handle specific formats and clean values
const processData = (data: any[]): any[] => {
  return data.map(record => {
    const processedRecord = { ...record };
    
    // Ensure health issue fields are strings
    ['Troubles cardio-respiratoires', 'Troubles cognitifs', 
     'Troubles neurologiques', 'Troubles cutanés/phanères', 
     'Autres plaintes'].forEach(field => {
      if (processedRecord[field] === undefined || processedRecord[field] === null) {
        processedRecord[field] = '';
      } else {
        processedRecord[field] = processedRecord[field].toString();
      }
    });
    
    // Ensure chemical fields are strings
    ['Produits chimiques utilisés', 'Engrais utilisés', 
     'Produits biologiques utilisés'].forEach(field => {
      if (processedRecord[field] === undefined || processedRecord[field] === null) {
        processedRecord[field] = '';
      } else {
        processedRecord[field] = processedRecord[field].toString();
      }
    });
    
    // Ensure task field is a string
    if (processedRecord['Tâches effectuées'] === undefined || 
        processedRecord['Tâches effectuées'] === null) {
      processedRecord['Tâches effectuées'] = '';
    } else {
      processedRecord['Tâches effectuées'] = processedRecord['Tâches effectuées'].toString();
    }
    
    return processedRecord;
  });
};

// Sample data for development/testing purposes
const getSampleData = (): any[] => {
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
export const getUniqueValues = (data: any[], field: string): string[] => {
  const valueSet = new Set<string>();
  
  data.forEach(record => {
    const value = record[field];
    if (value !== undefined && value !== null && value !== '') {
      // If it's a comma-separated list, split and add each value
      if (typeof value === 'string' && value.includes(',')) {
        value.split(',').forEach(v => valueSet.add(v.trim()));
      } else {
        valueSet.add(value.toString().trim());
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