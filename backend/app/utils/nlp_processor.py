import re
import random
from typing import List, Dict, Any, Set, Union
import nltk
from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# Download necessary NLTK data (uncomment if not already downloaded)
try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt')

try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords')

# Define dictionaries of keywords for different categories
CHEMICAL_KEYWORDS = {
    'pesticides': 9,
    'herbicides': 7,
    'fongicides': 7,
    'insecticides': 8,
    'engrais chimiques': 6,
    'engrais': 5,
    'produits phytosanitaires': 8,
    'produits chimiques': 7,
    'roundup': 9,
    'glyphosate': 9,
    'désherbant': 7,
    'fongicide': 7,
    'insecticide': 8,
    'pesticide': 9,
}

TASK_KEYWORDS = {
    'épandage': 8,
    'traitement': 7,
    'récolte': 4,
    'désherbage': 6,
    'taille': 3,
    'plantation': 2,
    'semis': 2,
    'pulvérisation': 9,
    'cueillette': 3,
    'labour': 4,
    'irrigation': 3,
    'mélange des produits': 8,
    'préparation des produits': 8,
}

HEALTH_KEYWORDS = {
    'respiratoire': 8,
    'cutané': 7,
    'peau': 7,
    'asthme': 9,
    'allergie': 6,
    'toux': 7,
    'irritation': 6,
    'maux de tête': 5,
    'céphalées': 5,
    'vertiges': 7,
    'nausées': 6,
    'fatigue': 4,
    'dyspnée': 8,
    'difficulté à respirer': 9,
    'problèmes respiratoires': 9,
    'dermatite': 7,
    'éruption cutanée': 7,
    'irritation cutanée': 7,
    'irritation des yeux': 6,
    'problèmes neurologiques': 8,
    'tremblements': 8,
    'transpiration excessive': 5,
}

PROTECTION_KEYWORDS = {
    'masque': 9,
    'gants': 8,
    'bottes': 7,
    'casquette': 5,
    'mdhalla': 5,
    'manteau': 6,
    'imperméable': 6,
    'lunettes': 7,
    'protection respiratoire': 9,
    'protection cutanée': 8,
    'protection des yeux': 7,
    'équipement de protection': 8,
    'vêtements de protection': 7,
}

# French stopwords
FRENCH_STOPWORDS = set(stopwords.words('french'))

def extract_keywords(text: str, keyword_type: str = 'chemical') -> List[str]:
    """
    Extract keywords from text based on the specified type
    
    Args:
        text: The input text to analyze
        keyword_type: Type of keywords to extract ('chemical', 'task', 'health', or 'protection')
        
    Returns:
        List of extracted keywords
    """
    if not text:
        return []
    
    text = text.lower()
    
    # Select the appropriate keyword dictionary
    if keyword_type == 'chemical':
        keywords_dict = CHEMICAL_KEYWORDS
    elif keyword_type == 'task':
        keywords_dict = TASK_KEYWORDS
    elif keyword_type == 'health':
        keywords_dict = HEALTH_KEYWORDS
    elif keyword_type == 'protection':
        keywords_dict = PROTECTION_KEYWORDS
    else:
        return []
    
    # Extract all keywords from the text
    found_keywords = []
    for keyword in keywords_dict:
        if re.search(r'\b' + re.escape(keyword) + r'\b', text):
            found_keywords.append(keyword)
    
    return found_keywords

def extract_features_from_text(
    general_description: str,
    chemicals_text: str,
    tasks_text: str,
    health_text: str,
    protection_text: str
) -> Dict[str, Any]:
    """
    Extract structured features from text inputs for use in the risk model
    
    Args:
        general_description: General text description
        chemicals_text: Text about chemical usage
        tasks_text: Text about tasks performed
        health_text: Text about health conditions
        protection_text: Text about protective equipment
        
    Returns:
        Dictionary of extracted features
    """
    features = {}
    
    # Extract age from text
    age_match = re.search(r'\b(\d{1,2})\s*ans\b', general_description.lower())
    if age_match:
        features['age'] = int(age_match.group(1))
    else:
        features['age'] = 40  # Default age
    
    # Extract work experience from text
    exp_match = re.search(r'\b(\d{1,2})\s*ans?\s*d\'(expérience|ancienneté)', general_description.lower())
    if exp_match:
        features['work_experience'] = int(exp_match.group(1))
    else:
        features['work_experience'] = 10  # Default experience
    
    # Extract work hours from text
    hours_match = re.search(r'\b(\d{1,2})\s*heures?\s*(par jour|\/jour)', general_description.lower())
    if hours_match:
        features['work_hours_per_day'] = int(hours_match.group(1))
    else:
        features['work_hours_per_day'] = 8  # Default hours
    
    # Extract days per week from text
    days_match = re.search(r'\b(\d{1})\s*(jours?|j)\s*(par semaine|\/semaine)', general_description.lower())
    if days_match:
        features['work_days_per_week'] = int(days_match.group(1))
    else:
        features['work_days_per_week'] = 5  # Default days
    
    # Extract chemicals from text
    chemical_keywords = extract_keywords(chemicals_text, 'chemical')
    features['chemical_exposure'] = chemical_keywords
    features['chemical_exposure_count'] = len(chemical_keywords)
    
    # Extract tasks from text
    task_keywords = extract_keywords(tasks_text, 'task')
    features['tasks'] = task_keywords
    
    # Extract health conditions from text
    health_keywords = extract_keywords(health_text, 'health')
    features['has_respiratory_conditions'] = any(
        keyword in health_keywords for keyword in [
            'asthme', 'toux', 'dyspnée', 'difficulté à respirer', 
            'problèmes respiratoires', 'respiratoire'
        ]
    )
    
    features['has_skin_conditions'] = any(
        keyword in health_keywords for keyword in [
            'cutané', 'peau', 'dermatite', 'éruption cutanée', 
            'irritation cutanée'
        ]
    )
    
    features['has_chronic_exposure'] = 'exposition chronique' in health_text.lower() or \
                                       'exposition prolongée' in health_text.lower() or \
                                       any(
                                            re.search(
                                                r'\b(depuis|pendant|il y a)\s+(\d+|plusieurs|longtemps)\s+(ans|années|mois)', 
                                                health_text.lower()
                                            )
                                        )
    
    # Extract protective equipment from text
    protection_keywords = extract_keywords(protection_text, 'protection')
    features['protective_equipment'] = protection_keywords
    features['protective_equipment_count'] = len(protection_keywords)
    
    # Extract marital status from text if present
    for status in ['célibataire', 'mariée', 'divorcée', 'veuve']:
        if status in general_description.lower():
            features['marital_status'] = status
            break
    else:
        features['marital_status'] = 'mariée'  # Default value
    
    # Extract number of children if present
    children_match = re.search(r'\b(\d{1,2})\s*enfants?\b', general_description.lower())
    if children_match:
        features['number_of_children'] = int(children_match.group(1))
    else:
        features['number_of_children'] = 2  # Default value
    
    # Extract socioeconomic status if present
    for status in ['bas', 'moyen', 'bon']:
        if f"niveau socio-économique {status}" in general_description.lower() or \
           f"niveau économique {status}" in general_description.lower():
            features['socio_economic_status'] = status
            break
    else:
        features['socio_economic_status'] = 'moyen'  # Default value
    
    # Extract employment status if present
    for status in ['permanente', 'saisonnière']:
        if status in general_description.lower():
            features['employment_status'] = status
            break
    else:
        features['employment_status'] = 'permanente'  # Default value
    
    return features

def analyze_text(text: str) -> Dict[str, Any]:
    """
    Perform full text analysis to extract risk factors and correlations
    
    Args:
        text: The input text to analyze
        
    Returns:
        Dictionary with analysis results
    """
    if not text:
        return {"factors": [], "correlations": []}
    
    # Tokenize and clean text
    tokens = word_tokenize(text.lower())
    tokens = [token for token in tokens if token.isalpha() and token not in FRENCH_STOPWORDS]
    
    # Extract all keywords
    chemicals = [kw for kw in CHEMICAL_KEYWORDS.keys() if kw in text.lower()]
    tasks = [kw for kw in TASK_KEYWORDS.keys() if kw in text.lower()]
    health_issues = [kw for kw in HEALTH_KEYWORDS.keys() if kw in text.lower()]
    protection = [kw for kw in PROTECTION_KEYWORDS.keys() if kw in text.lower()]
    
    # Generate risk factors
    risk_factors = []
    
    # Look for health issue + chemical combinations
    for health in health_issues:
        for chemical in chemicals:
            # Check if they appear close to each other
            health_match = re.search(r'\b' + re.escape(health) + r'\b', text.lower())
            chemical_match = re.search(r'\b' + re.escape(chemical) + r'\b', text.lower())
            
            if health_match and chemical_match:
                health_pos = health_match.start()
                chemical_pos = chemical_match.start()
                
                # If they appear within 100 characters of each other, consider them related
                if abs(health_pos - chemical_pos) < 100:
                    # Calculate risk score based on keyword severity
                    health_severity = HEALTH_KEYWORDS.get(health, 5)
                    chemical_severity = CHEMICAL_KEYWORDS.get(chemical, 5)
                    risk_score = (health_severity + chemical_severity) * 5  # Scale to 0-100
                    
                    risk_factors.append({
                        "exposure": chemical,
                        "healthIssue": health,
                        "riskScore": min(100, risk_score),
                        "occurrenceCount": 1  # Placeholder for now
                    })
    
    # Generate correlations (simple associations between chemicals and health issues)
    correlations = []
    for chemical in chemicals:
        chem_risks = []
        for health in health_issues:
            chem_risks.append({
                "health_issue": health,
                "correlation": round(random.uniform(0.3, 0.9), 2)  # Mock correlation for demonstration
            })
        
        # Sort by correlation strength
        chem_risks.sort(key=lambda x: x["correlation"], reverse=True)
        
        # Take top 3 correlations
        if chem_risks:
            correlations.append({
                "chemical": chemical,
                "associated_issues": chem_risks[:3]
            })
    
    # Include protection effectiveness assessment
    protection_assessment = []
    if protection:
        for chemical in chemicals:
            appropriate_protection = []
            if chemical in ['pesticides', 'herbicides', 'fongicides', 'insecticides']:
                appropriate_protection.append('masque')
            if chemical:  # All chemicals need some protection
                appropriate_protection.extend(['gants', 'bottes'])
            
            missing_protection = [p for p in appropriate_protection if p not in protection]
            
            if missing_protection:
                protection_assessment.append({
                    "chemical": chemical,
                    "missing_protection": missing_protection,
                    "recommendation": f"Ajouter {', '.join(missing_protection)} lors de l'utilisation de {chemical}"
                })
    
    return {
        "factors": risk_factors,
        "correlations": correlations,
        "protection_assessment": protection_assessment,
        "keywords": {
            "chemicals": chemicals,
            "tasks": tasks,
            "health_issues": health_issues,
            "protection": protection
        }
    }
