import React, { useState, useEffect } from 'react';
import {
  FormControl, InputLabel, MenuItem, Select, Button, Slider, Typography,
  TextField, Chip, Divider, CircularProgress, Tab, Tabs, Tooltip,
  Alert, Snackbar
} from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import PersonIcon from '@mui/icons-material/Person';
import WorkIcon from '@mui/icons-material/Work';
import HealthAndSafetyIcon from '@mui/icons-material/HealthAndSafety';
import ScienceIcon from '@mui/icons-material/Science';
import { HealthRecord, RiskFactor, SpecificRisks, FeatureImportance } from '../types';
import { predictRisk, predictRiskFromText, extractKeywords, checkBackendHealth, getMockRiskAssessment, useFallbackData } from '../services/ApiService';

interface EnhancedRiskPredictionToolProps {
  data: HealthRecord[];
  textRiskFactors: RiskFactor[];
  highlightedRiskFactor?: RiskFactor | null;
}

interface Suggestion {
  text: string;
  type: 'chemical' | 'task' | 'health' | 'protection';
}

// Custom theme for agricultural context
const theme = createTheme({
  palette: {
    primary: { main: '#4caf50' }, // Green for positive actions
    secondary: { main: '#ff9800' }, // Orange for warnings
    error: { main: '#d32f2f' }, // Red for risks
    success: { main: '#388e3c' }, // Darker green for success/protection
  },
  typography: {
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    h3: { fontWeight: 700 },
    h4: { fontWeight: 600 },
  },
  components: {
    MuiSlider: {
      styleOverrides: {
        thumb: { backgroundColor: '#4caf50' },
        track: { backgroundColor: '#81c784' },
        rail: { backgroundColor: '#e0e0e0' },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { transition: 'transform 0.2s ease-in-out' },
      },
    },
  },
});

const EnhancedRiskPredictionTool: React.FC<EnhancedRiskPredictionToolProps> = ({
  textRiskFactors,
  highlightedRiskFactor = null,
}) => {
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
  
  const [generalDescription, setGeneralDescription] = useState<string>('');
  const [freeTextChemicals, setFreeTextChemicals] = useState<string>('');
  const [freeTextTasks, setFreeTextTasks] = useState<string>('');
  const [freeTextHealthConditions, setFreeTextHealthConditions] = useState<string>('');
  const [customProtectiveEquipment, setCustomProtectiveEquipment] = useState<string>('');
  
  const [extractedChemicals, setExtractedChemicals] = useState<string[]>([]);
  const [extractedTasks, setExtractedTasks] = useState<string[]>([]);
  const [extractedHealthConditions, setExtractedHealthConditions] = useState<string[]>([]);
  const [extractedProtection, setExtractedProtection] = useState<string[]>([]);
  
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [activeTab, setActiveTab] = useState<number>(0);
  const [riskScore, setRiskScore] = useState<number | null>(null);
  const [riskFactors, setRiskFactors] = useState<string[]>([]);
  const [specificRisks, setSpecificRisks] = useState<SpecificRisks>({
    respiratory: 0,
    skin: 0,
    neurological: 0,
    overall: 0,
  });
  const [personalizedRecommendations, setPersonalizedRecommendations] = useState<string[]>([]);
  const [matchedRiskFactors, setMatchedRiskFactors] = useState<RiskFactor[]>([]);
  const [modelReady, setModelReady] = useState<boolean>(false);
  const [processingText, setProcessingText] = useState<boolean>(false);
  const [featureImportance, setFeatureImportance] = useState<FeatureImportance[]>([]);
  const [confidenceInterval, setConfidenceInterval] = useState<[number, number]>([0, 0]);
  const [whatIfScenarios, setWhatIfScenarios] = useState<{ label: string, score: number }[]>([]);
  const [selectedWorkerProfile, setSelectedWorkerProfile] = useState<string | null>(null);
  const [calculatingRisk, setCalculatingRisk] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [backendStatus, setBackendStatus] = useState<'unchecked' | 'running' | 'error'>('unchecked');

  const [availableChemicals] = useState<string[]>(['pesticides', 'herbicides', 'fongicides', 'insecticides', 'engrais chimiques']);
  const [availableTasks] = useState<string[]>(['épandage', 'traitement', 'récolte', 'désherbage', 'taille']);
  const [maritalStatusOptions] = useState<string[]>(['célibataire', 'mariée', 'veuve', 'divorcée']);
  const [socioEconomicOptions] = useState<string[]>(['bas', 'moyen', 'bon']);
  const [employmentStatusOptions] = useState<string[]>(['permanente', 'saisonnière']);
  const [protectiveEquipmentOptions] = useState<{ value: string, label: string }[]>([
    { value: 'masque', label: 'Masque pour pesticides' },
    { value: 'gants', label: 'Gants de protection' },
    { value: 'bottes', label: 'Bottes' },
    { value: 'casquette', label: 'Casquette/Mdhalla' },
    { value: 'manteau', label: 'Manteau imperméable' },
  ]);

  const [workerProfiles] = useState<{ name: string, description: string, values: Record<string, any> }[]>([
    {
      name: "Jeune Travailleuse Protégée",
      description: "Travailleuse jeune avec bonne éducation et pratiques de protection",
      values: { age: 38, workExperience: 8, workHoursPerDay: 7, workDaysPerWeek: 5, protectiveEquipment: ['masque', 'gants', 'bottes', 'casquette'], chemicalExposure: ['pesticides', 'engrais chimiques'], socioEconomicStatus: 'moyen', employmentStatus: 'saisonnière' },
    },
    {
      name: "Travailleuse Expérimentée à Haut Risque",
      description: "Travailleuse plus âgée avec expérience extensive mais protection minimale",
      values: { age: 59, workExperience: 28, workHoursPerDay: 7, workDaysPerWeek: 7, protectiveEquipment: ['casquette'], chemicalExposure: ['pesticides', 'insecticides', 'herbicides', 'engrais chimiques'], socioEconomicStatus: 'bas', employmentStatus: 'permanente', hasChronicExposure: true },
    },
    {
      name: "Travailleuse Âgée à Risque Très Élevé",
      description: "Travailleuse âgée avec protection minimale et risques cardiovasculaires",
      values: { age: 67, workExperience: 42, workHoursPerDay: 6, workDaysPerWeek: 5, protectiveEquipment: [], chemicalExposure: ['pesticides', 'herbicides'], socioEconomicStatus: 'bas', employmentStatus: 'permanente', hasChronicExposure: true, hasRespiratoryConditions: true },
    },
    {
      name: "Travailleuse avec Charge Familiale",
      description: "Mère de famille nombreuse avec équilibre travail-famille complexe",
      values: { age: 44, workExperience: 12, workHoursPerDay: 8, workDaysPerWeek: 6, numberOfChildren: 5, protectiveEquipment: ['gants', 'casquette'], chemicalExposure: ['pesticides', 'engrais chimiques'], maritalStatus: 'mariée', socioEconomicStatus: 'moyen', employmentStatus: 'permanente' },
    },
  ]);

  // Check the backend status on component mount
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const response = await fetch('http://localhost:8000/health');
        if (response.ok) {
          setBackendStatus('running');
          setModelReady(true);
        } else {
          setBackendStatus('error');
        }
      } catch (err) {
        setBackendStatus('error');
        console.error('Backend connection error:', err);
      }
    };
    
    checkBackend();
  }, []);

  const applyWorkerProfile = (profileName: string) => {
    setSelectedWorkerProfile(profileName);
    const profile = workerProfiles.find(p => p.name === profileName);
    if (profile) {
      const values = profile.values;
      if ('age' in values) setAge(values.age);
      if ('workExperience' in values) setWorkExperience(values.workExperience);
      if ('workHoursPerDay' in values) setWorkHoursPerDay(values.workHoursPerDay);
      if ('workDaysPerWeek' in values) setWorkDaysPerWeek(values.workDaysPerWeek);
      if ('protectiveEquipment' in values) setProtectiveEquipment(values.protectiveEquipment);
      if ('chemicalExposure' in values) setChemicalExposure(values.chemicalExposure);
      if ('hasRespiratoryConditions' in values) setHasRespiratoryConditions(values.hasRespiratoryConditions || false);
      if ('hasSkinConditions' in values) setHasSkinConditions(values.hasSkinConditions || false);
      if ('hasChronicExposure' in values) setHasChronicExposure(values.hasChronicExposure || false);
      if ('maritalStatus' in values) setMaritalStatus(values.maritalStatus);
      if ('numberOfChildren' in values) setNumberOfChildren(values.numberOfChildren);
      if ('socioEconomicStatus' in values) setSocioEconomicStatus(values.socioEconomicStatus);
      if ('employmentStatus' in values) setEmploymentStatus(values.employmentStatus);
    }
  };

  const processTextInput = async (text: string, type: 'chemical' | 'task' | 'health' | 'protection') => {
    if (!text.trim()) return;
    
    setProcessingText(true);
    try {
      // Check if backend is available
      const shouldUseFallback = await useFallbackData();
      
      let keywords;
      if (shouldUseFallback) {
        // Use client-side basic text analysis
        setBackendStatus('error');
        console.log("Using fallback text analysis");
        
        // Simple keyword extraction based on common terms
        const lowerText = text.toLowerCase();
        
        switch (type) {
          case 'chemical':
            keywords = ['pesticides', 'herbicides', 'fongicides', 'insecticides', 'engrais chimiques']
              .filter(term => lowerText.includes(term));
            break;
          case 'task':
            keywords = ['épandage', 'traitement', 'récolte', 'désherbage', 'taille']
              .filter(term => lowerText.includes(term));
            break;
          case 'health':
            keywords = ['respiratoire', 'cutané', 'allergie', 'mal de tête', 'peau']
              .filter(term => lowerText.includes(term));
            break;
          case 'protection':
            keywords = ['masque', 'gants', 'bottes', 'casquette', 'manteau']
              .filter(term => lowerText.includes(term));
            break;
        }
      } else {
        // Use the backend extraction service
        keywords = await extractKeywords(text, type);
      }
      
      switch (type) {
        case 'chemical': 
          setExtractedChemicals(keywords);
          break;
        case 'task': 
          setExtractedTasks(keywords);
          break;
        case 'health': 
          setExtractedHealthConditions(keywords);
          break;
        case 'protection': 
          setExtractedProtection(keywords);
          break;
      }
    } catch (err) {
      console.error(`Error processing ${type} text:`, err);
      setError(`Erreur lors de l'analyse du texte ${type}. Veuillez réessayer.`);
    } finally {
      setProcessingText(false);
    }
  };

  const handleSuggestionSelect = (suggestion: Suggestion) => {
    switch (suggestion.type) {
      case 'chemical': setExtractedChemicals(prev => [...prev, suggestion.text]); break;
      case 'task': setExtractedTasks(prev => [...prev, suggestion.text]); break;
      case 'health': setExtractedHealthConditions(prev => [...prev, suggestion.text]); break;
      case 'protection': setExtractedProtection(prev => [...prev, suggestion.text]); break;
    }
    setSuggestions(prev => prev.filter(s => s.text !== suggestion.text));
  };

  const calculateRisk = async () => {
    setCalculatingRisk(true);
    setError(null);
    
    try {
      // Check if we should use fallback data
      const shouldUseFallback = await useFallbackData();
      let result;
      
      if (activeTab === 0) {
        // Structured input data object
        const data = {
          age,
          work_experience: workExperience,
          work_hours_per_day: workHoursPerDay,
          work_days_per_week: workDaysPerWeek,
          protective_equipment: protectiveEquipment,
          chemical_exposure: chemicalExposure,
          tasks,
          has_respiratory_conditions: hasRespiratoryConditions,
          has_skin_conditions: hasSkinConditions,
          has_chronic_exposure: hasChronicExposure,
          marital_status: maritalStatus,
          number_of_children: numberOfChildren,
          socio_economic_status: socioEconomicStatus,
          employment_status: employmentStatus
        };
        
        if (shouldUseFallback) {
          console.log("Using fallback risk assessment");
          setBackendStatus('error');
          // Use client-side fallback when backend is unavailable
          result = getMockRiskAssessment(data);
        } else {
          // Use backend prediction service
          result = await predictRisk(data);
        }
      } else {
        // Free text input
        const data = {
          general_description: generalDescription,
          chemicals_text: freeTextChemicals,
          tasks_text: freeTextTasks,
          health_text: freeTextHealthConditions,
          protection_text: customProtectiveEquipment
        };
        
        if (shouldUseFallback) {
          console.log("Using fallback for text analysis");
          setBackendStatus('error');
          // For text input, create a simplified data object for the mock assessment
          const simplifiedData = {
            age: 35, // Default values
            work_experience: 5,
            work_hours_per_day: 8,
            work_days_per_week: 5,
            protective_equipment: extractedProtection,
            chemical_exposure: extractedChemicals,
            tasks: extractedTasks,
            has_respiratory_conditions: extractedHealthConditions.some(c => c.includes('respir')),
            has_skin_conditions: extractedHealthConditions.some(c => c.includes('peau') || c.includes('cutan')),
            has_chronic_exposure: false,
            marital_status: 'mariée',
            number_of_children: 2,
            socio_economic_status: 'moyen',
            employment_status: 'permanente'
          };
          result = getMockRiskAssessment(simplifiedData);
        } else {
          // Use backend text prediction service
          result = await predictRiskFromText(data);
        }
      }
      
      // Process the result
      setRiskScore(result.overall_risk);
      setSpecificRisks({
        respiratory: result.respiratory_risk,
        skin: result.skin_risk,
        neurological: result.neurological_risk,
        overall: result.overall_risk
      });
      setRiskFactors(result.risk_factors);
      setPersonalizedRecommendations(result.recommendations);
      setFeatureImportance(result.feature_importance);
      setConfidenceInterval(result.confidence_interval);
      setWhatIfScenarios(result.what_if_scenarios);
      
      // Create matched risk factors from text risk factors if available
      if (textRiskFactors.length > 0) {
        // Filter text risk factors based on the extracted data
        const matchedFactors = textRiskFactors.filter(factor => {
          const chemicalMatch = chemicalExposure.some(chem => 
            factor.exposure.toLowerCase().includes(chem.toLowerCase())
          );
          return chemicalMatch;
        });
        
        setMatchedRiskFactors(matchedFactors.slice(0, 3));
      }
      
    } catch (err) {
      console.error('Error calculating risk:', err);
      setError('Erreur lors du calcul du risque. Veuillez réessayer.');
    } finally {
      setCalculatingRisk(false);
    }
  };

  const getRiskLevel = (score: number): string => {
    if (score < 30) return "Faible";
    if (score < 50) return "Modéré";
    if (score < 70) return "Élevé";
    return "Très élevé";
  };

  const getRiskColor = (score: number): string => {
    if (score < 30) return "#4caf50"; // Green
    if (score < 50) return "#ff9800"; // Orange
    if (score < 70) return "#f44336"; // Red
    return "#9c27b0"; // Purple
  };

  const handleCloseError = () => {
    setError(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Outil de Prédiction des Risques IA</h2>

        {backendStatus === 'error' && (
          <Alert severity="warning" className="mb-4">
            <div>
              <strong>Mode Démonstration:</strong> Le serveur backend n'est pas disponible. L'application fonctionne en mode démonstration avec un modèle local simplement. Les prédictions sont approximatives.
              <p className="mt-2 text-sm">
                <em>Note: Pour des résultats plus précis, le modèle complet est disponible en démarrant le serveur Python.</em>
              </p>
            </div>
          </Alert>
        )}

        {error && (
          <Snackbar open={!!error} autoHideDuration={6000} onClose={handleCloseError}>
            <Alert onClose={handleCloseError} severity="error" sx={{ width: '100%' }}>
              {error}
            </Alert>
          </Snackbar>
        )}

        {/* Worker Profile Selection */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
            <PersonIcon sx={{ color: '#4caf50' }} /> Profil de Travailleuse
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {workerProfiles.map(profile => (
              <div
                key={profile.name}
                className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 ${
                  selectedWorkerProfile === profile.name
                    ? 'border-green-500 bg-green-50 shadow-md'
                    : 'border-gray-200 hover:border-green-300 hover:shadow-sm'
                }`}
                onClick={() => applyWorkerProfile(profile.name)}
              >
                <h3 className="text-md font-semibold text-gray-800">{profile.name}</h3>
                <p className="text-sm text-gray-600 mt-1">{profile.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Input Mode Selector */}
        <Tabs value={activeTab} onChange={(e, newValue) => setActiveTab(newValue)} centered className="mb-6 border-b">
          <Tab label="Entrée Structurée" />
          <Tab label="Entrée Texte Libre" />
        </Tabs>

        {activeTab === 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PersonIcon sx={{ color: '#4caf50' }} /> Information Personnelle
                </h3>
                <Typography gutterBottom>Âge</Typography>
                <Slider
                  value={age}
                  onChange={(_, newValue) => setAge(newValue as number)}
                  min={18}
                  max={70}
                  marks={[{ value: 18, label: '18' }, { value: 35, label: '35' }, { value: 50, label: '50' }, { value: 70, label: '70' }]}
                  valueLabelDisplay="auto"
                />
                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <InputLabel>Situation maritale</InputLabel>
                  <Select value={maritalStatus} onChange={(e) => setMaritalStatus(e.target.value)} label="Situation maritale">
                    {maritalStatusOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                  </Select>
                </FormControl>
                <Typography gutterBottom sx={{ mt: 2 }}>Nombre d'enfants</Typography>
                <Slider
                  value={numberOfChildren}
                  onChange={(_, newValue) => setNumberOfChildren(newValue as number)}
                  min={0}
                  max={10}
                  marks={[{ value: 0, label: '0' }, { value: 5, label: '5' }, { value: 10, label: '10' }]}
                  valueLabelDisplay="auto"
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <FormControl fullWidth size="small">
                    <InputLabel>Niveau socio-économique</InputLabel>
                    <Select value={socioEconomicStatus} onChange={(e) => setSocioEconomicStatus(e.target.value)} label="Niveau socio-économique">
                      {socioEconomicOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                    </Select>
                    <Tooltip title="Niveau basé sur revenu, éducation et accès aux ressources">
                      <span className="text-gray-500 text-xs mt-1 cursor-help">ⓘ</span>
                    </Tooltip>
                  </FormControl>
                  <FormControl fullWidth size="small">
                    <InputLabel>Statut d'emploi</InputLabel>
                    <Select value={employmentStatus} onChange={(e) => setEmploymentStatus(e.target.value)} label="Statut d'emploi">
                      {employmentStatusOptions.map(option => <MenuItem key={option} value={option}>{option}</MenuItem>)}
                    </Select>
                  </FormControl>
                </div>
              </div>

              <div className="p-4 bg-teal-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <WorkIcon sx={{ color: '#4caf50' }} /> Travail & Expérience
                </h3>
                <Typography gutterBottom>Années d'expérience</Typography>
                <Slider
                  value={workExperience}
                  onChange={(_, newValue) => setWorkExperience(newValue as number)}
                  min={0}
                  max={40}
                  marks={[{ value: 0, label: '0' }, { value: 20, label: '20' }, { value: 40, label: '40' }]}
                  valueLabelDisplay="auto"
                />
                <div className="grid grid-cols-2 gap-4 mt-4">
                  <div>
                    <Typography gutterBottom>Heures par jour</Typography>
                    <Slider
                      value={workHoursPerDay}
                      onChange={(_, newValue) => setWorkHoursPerDay(newValue as number)}
                      min={1}
                      max={12}
                      marks={[{ value: 1, label: '1' }, { value: 8, label: '8' }, { value: 12, label: '12' }]}
                      valueLabelDisplay="auto"
                    />
                  </div>
                  <div>
                    <Typography gutterBottom>Jours par semaine</Typography>
                    <Slider
                      value={workDaysPerWeek}
                      onChange={(_, newValue) => setWorkDaysPerWeek(newValue as number)}
                      min={1}
                      max={7}
                      marks={[{ value: 1, label: '1' }, { value: 5, label: '5' }, { value: 7, label: '7' }]}
                      valueLabelDisplay="auto"
                    />
                  </div>
                </div>
              </div>

              <div className="p-4 bg-red-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HealthAndSafetyIcon sx={{ color: '#d32f2f' }} /> Antécédents médicaux
                </h3>
                <div className="flex flex-col space-y-2">
                  <label className="flex items-center">
                    <input type="checkbox" checked={hasRespiratoryConditions} onChange={e => setHasRespiratoryConditions(e.target.checked)} className="mr-2" />
                    Troubles respiratoires
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={hasSkinConditions} onChange={e => setHasSkinConditions(e.target.checked)} className="mr-2" />
                    Problèmes cutanés
                  </label>
                  <label className="flex items-center">
                    <input type="checkbox" checked={hasChronicExposure} onChange={e => setHasChronicExposure(e.target.checked)} className="mr-2" />
                    Exposition chronique
                  </label>
                </div>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HealthAndSafetyIcon sx={{ color: '#ff9800' }} /> Équipement de protection
                </h3>
                <FormControl fullWidth size="small">
                  <InputLabel>Équipement utilisé</InputLabel>
                  <Select
                    multiple
                    value={protectiveEquipment}
                    onChange={(e) => setProtectiveEquipment(e.target.value as string[])}
                    renderValue={(selected) => (selected as string[]).map(value => protectiveEquipmentOptions.find(opt => opt.value === value)?.label).join(', ')}
                  >
                    {protectiveEquipmentOptions.map(option => <MenuItem key={option.value} value={option.value}>{option.label}</MenuItem>)}
                  </Select>
                </FormControl>
                {extractedProtection.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold">Protection extraite:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {extractedProtection.map((item, index) => (
                        <Chip key={index} label={protectiveEquipmentOptions.find(opt => opt.value === item)?.label || item} size="small" color="success" variant="outlined" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="p-4 bg-green-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ScienceIcon sx={{ color: '#4caf50' }} /> Expositions & Tâches
                </h3>
                <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                  <InputLabel>Produits chimiques</InputLabel>
                  <Select multiple value={chemicalExposure} onChange={(e) => setChemicalExposure(e.target.value as string[])} renderValue={(selected) => (selected as string[]).join(', ')}>
                    {availableChemicals.map(chemical => <MenuItem key={chemical} value={chemical}>{chemical}</MenuItem>)}
                  </Select>
                </FormControl>
                {extractedChemicals.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold">Produits extraits:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {extractedChemicals.map((chemical, index) => (
                        <Chip key={index} label={chemical} size="small" color="error" variant="outlined" />
                      ))}
                    </div>
                  </div>
                )}
                <FormControl fullWidth size="small" sx={{ mt: 2 }}>
                  <InputLabel>Tâches effectuées</InputLabel>
                  <Select multiple value={tasks} onChange={(e) => setTasks(e.target.value as string[])} renderValue={(selected) => (selected as string[]).join(', ')}>
                    {availableTasks.map(task => <MenuItem key={task} value={task}>{task}</MenuItem>)}
                  </Select>
                </FormControl>
                {extractedTasks.length > 0 && (
                  <div className="mt-2">
                    <h4 className="text-sm font-semibold">Tâches extraites:</h4>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {extractedTasks.map((task, index) => (
                        <Chip key={index} label={task} size="small" color="warning" variant="outlined" />
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {highlightedRiskFactor && (
                <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                  <p className="font-bold text-yellow-800">Facteur de risque identifié:</p>
                  <p className="text-sm">{highlightedRiskFactor.exposure} → {highlightedRiskFactor.healthIssue}</p>
                  <p className="text-xs mt-1">Score: {highlightedRiskFactor.riskScore}</p>
                </div>
              )}

              <div className={`p-2 text-xs border rounded-lg ${modelReady ? 'bg-green-50 border-green-300' : 'bg-yellow-50 border-yellow-300'}`}>
                {modelReady ? 'Modèle prêt' : 'Initialisation...'}
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-6">
              <div className="p-4 bg-green-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <PersonIcon sx={{ color: '#4caf50' }} /> Description générale
                </h3>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Exemple : Je suis une femme de 45 ans, je travaille 8h par jour dans les champs..."
                  variant="outlined"
                  size="small"
                  value={generalDescription}
                  onChange={(e) => setGeneralDescription(e.target.value)}
                />
              </div>
              <div className="p-4 bg-green-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <ScienceIcon sx={{ color: '#4caf50' }} /> Produits chimiques et tâches
                </h3>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Exemple : J'utilise des pesticides et des herbicides, je fais de l'épandage..."
                  variant="outlined"
                  size="small"
                  value={freeTextChemicals}
                  onChange={(e) => setFreeTextChemicals(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 2, '&:hover': { transform: 'scale(1.05)' } }}
                  disabled={processingText || !freeTextChemicals.trim() || backendStatus !== 'running'}
                  onClick={() => processTextInput(freeTextChemicals, 'chemical')}
                  startIcon={processingText ? <CircularProgress size={14} /> : null}
                >
                  Analyser produits
                </Button>
                <Divider sx={{ my: 3 }} />
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Exemple : Je fais de l'épandage et de la récolte..."
                  variant="outlined"
                  size="small"
                  value={freeTextTasks}
                  onChange={(e) => setFreeTextTasks(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 2, '&:hover': { transform: 'scale(1.05)' } }}
                  disabled={processingText || !freeTextTasks.trim() || backendStatus !== 'running'}
                  onClick={() => processTextInput(freeTextTasks, 'task')}
                  startIcon={processingText ? <CircularProgress size={14} /> : null}
                >
                  Analyser tâches
                </Button>
              </div>
            </div>
            <div className="space-y-6">
              <div className="p-4 bg-red-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HealthAndSafetyIcon sx={{ color: '#d32f2f' }} /> Antécédents médicaux
                </h3>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Exemple : J'ai des problèmes respiratoires depuis 5 ans..."
                  variant="outlined"
                  size="small"
                  value={freeTextHealthConditions}
                  onChange={(e) => setFreeTextHealthConditions(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 2, '&:hover': { transform: 'scale(1.05)' } }}
                  disabled={processingText || !freeTextHealthConditions.trim() || backendStatus !== 'running'}
                  onClick={() => processTextInput(freeTextHealthConditions, 'health')}
                  startIcon={processingText ? <CircularProgress size={14} /> : null}
                >
                  Analyser santé
                </Button>
              </div>
              <div className="p-4 bg-yellow-50 rounded-lg shadow-sm">
                <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                  <HealthAndSafetyIcon sx={{ color: '#ff9800' }} /> Équipement de protection
                </h3>
                <TextField
                  fullWidth
                  multiline
                  rows={4}
                  placeholder="Exemple : Je porte un masque et des gants..."
                  variant="outlined"
                  size="small"
                  value={customProtectiveEquipment}
                  onChange={(e) => setCustomProtectiveEquipment(e.target.value)}
                />
                <Button
                  variant="contained"
                  color="primary"
                  size="small"
                  sx={{ mt: 2, '&:hover': { transform: 'scale(1.05)' } }}
                  disabled={processingText || !customProtectiveEquipment.trim() || backendStatus !== 'running'}
                  onClick={() => processTextInput(customProtectiveEquipment, 'protection')}
                  startIcon={processingText ? <CircularProgress size={14} /> : null}
                >
                  Analyser équipement
                </Button>
              </div>
              {extractedHealthConditions.length > 0 && (
                <div className="p-4 bg-red-100 rounded-lg shadow-sm">
                  <h4 className="font-bold mb-2">Problèmes détectés:</h4>
                  <div className="flex flex-wrap gap-2">
                    {extractedHealthConditions.map((condition, index) => (
                      <Chip key={index} label={condition} color="error" size="small" />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        <Button
          variant="contained"
          color="primary"
          onClick={calculateRisk}
          disabled={calculatingRisk || backendStatus !== 'running'}
          sx={{ mt: 6, py: 1.5, width: '100%', '&:hover': { transform: 'scale(1.05)' } }}
          size="large"
        >
          {calculatingRisk ? (
            <>
              <CircularProgress size={24} color="inherit" sx={{ mr: 1 }} />
              Calcul en cours...
            </>
          ) : (
            "Calculer le Risque"
          )}
        </Button>

        {/* Results */}
        {riskScore !== null && (
          <div className="mt-6 p-6 border rounded-lg shadow-sm transition-opacity duration-500 opacity-100">
            <h3 className="text-lg font-bold text-gray-800 mb-6">Résultats de l'Évaluation</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              {['overall', 'respiratory', 'skin', 'neurological'].map((key, idx) => (
                <div key={idx} className="bg-gray-50 p-4 rounded-lg text-center">
                  <div className="relative w-20 h-20 mx-auto">
                    <CircularProgress
                      variant="determinate"
                      value={specificRisks[key as keyof SpecificRisks]}
                      size={80}
                      thickness={4}
                      sx={{ color: getRiskColor(specificRisks[key as keyof SpecificRisks]) }}
                    />
                    <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-lg font-bold">
                      {specificRisks[key as keyof SpecificRisks]}%
                    </span>
                  </div>
                  <p className="mt-2 font-semibold">{key === 'overall' ? 'Risque global' : `Risque ${key}`}</p>
                  <p className="text-sm">{getRiskLevel(specificRisks[key as keyof SpecificRisks])}</p>
                  {key === 'overall' && modelReady && (
                    <p className="text-xs mt-1 text-gray-500">IC: [{Math.round(confidenceInterval[0])}% - {Math.round(confidenceInterval[1])}%]</p>
                  )}
                </div>
              ))}
            </div>

            {whatIfScenarios.length > 0 && (
              <div className="mb-6 p-4 bg-indigo-50 rounded-lg">
                <h4 className="font-bold text-indigo-800 mb-3">Scénarios alternatifs:</h4>
                <div className="flex flex-wrap gap-3">
                  {whatIfScenarios.map((scenario, index) => (
                    <div key={index} className="flex-1 min-w-[180px] p-2 bg-white rounded border border-indigo-200">
                      <p className="text-sm font-medium mb-1">{scenario.label}</p>
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold mr-2" style={{ backgroundColor: getRiskColor(scenario.score) }}>
                          {Math.round(scenario.score)}%
                        </div>
                        <div className="text-xs">
                          {scenario.score < specificRisks.overall ? (
                            <span className="text-green-600">↓ {Math.round(specificRisks.overall - scenario.score)}%</span>
                          ) : (
                            <span className="text-red-600">↑ {Math.round(scenario.score - specificRisks.overall)}%</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <h4 className="font-bold mb-2">Facteurs de risque:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {riskFactors.map((factor, index) => <li key={index}>{factor}</li>)}
                </ul>
                {modelReady && featureImportance.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-bold mb-2">Facteurs d'influence:</h4>
                    <div className="space-y-2">
                      {featureImportance.slice(0, 5).map((feature, idx) => (
                        <div key={idx} className="flex items-center">
                          <div className="h-4 rounded bg-blue-500" style={{ width: `${feature.importance * 100}%` }}></div>
                          <span className="ml-2 text-sm">{feature.feature} ({(feature.importance * 100).toFixed(1)}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <h4 className="font-bold text-blue-800 mb-2">Recommandations:</h4>
                <ul className="list-disc pl-5 text-blue-700 space-y-1">
                  {personalizedRecommendations.map((rec, index) => <li key={index}>{rec}</li>)}
                </ul>
                {modelReady && (
                  <p className="mt-3 text-xs text-blue-600 italic">Basé sur l'analyse de données similaires.</p>
                )}
              </div>
            </div>

            {matchedRiskFactors.length > 0 && (
              <div className="mt-6">
                <h4 className="font-bold mb-2">Associations textuelles:</h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {matchedRiskFactors.map((factor, index) => (
                    <div key={index} className="p-3 border rounded-lg bg-yellow-50">
                      <p><span className="font-bold">{factor.healthIssue}</span> + <span className="font-bold">{factor.exposure}</span></p>
                      <p className="text-sm">Occurrences: {factor.occurrenceCount}</p>
                      <p className="text-sm">Score: {factor.riskScore}/100</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </ThemeProvider>
  );
};

export default EnhancedRiskPredictionTool;