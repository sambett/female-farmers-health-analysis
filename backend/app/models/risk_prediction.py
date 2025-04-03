import pandas as pd
import numpy as np
import joblib
import os
from typing import Dict, List, Union, Any
from sklearn.ensemble import RandomForestRegressor
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import StandardScaler
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error
import random

# Path for saving the model
MODEL_PATH = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), "model_data")
os.makedirs(MODEL_PATH, exist_ok=True)

# Model file paths
MODEL_FILE = os.path.join(MODEL_PATH, "risk_model.joblib")
SCALER_FILE = os.path.join(MODEL_PATH, "scaler.joblib")
FEATURE_IMPORTANCE_FILE = os.path.join(MODEL_PATH, "feature_importance.joblib")

class RiskModel:
    def __init__(self, model=None, scaler=None, feature_names=None):
        self.model = model if model is not None else RandomForestRegressor(
            n_estimators=100, 
            max_depth=10,
            random_state=42
        )
        self.scaler = scaler if scaler is not None else StandardScaler()
        self.feature_names = feature_names if feature_names is not None else []
        
        # Mapping dictionaries for categorical variables
        self.categorical_mappings = {
            "marital_status": {"célibataire": 0, "mariée": 1, "divorcée": 2, "veuve": 3},
            "socio_economic_status": {"bas": 0, "moyen": 1, "bon": 2},
            "employment_status": {"saisonnière": 0, "permanente": 1},
        }
        
        # Known chemicals and their severity ratings (0-10)
        self.chemical_severity = {
            "pesticides": 9.0,
            "herbicides": 7.5,
            "fongicides": 7.0,
            "insecticides": 8.5,
            "engrais chimiques": 6.0,
            "engrais naturels": 3.0,
            "produits phytosanitaires": 8.0,
        }
        
        # Known protection equipment and their effectiveness ratings (0-10)
        self.protection_effectiveness = {
            "masque": 9.0,  # Very effective for respiratory protection
            "gants": 8.0,   # Very effective for skin contact
            "bottes": 7.0,  # Effective for lower body protection
            "casquette": 5.0,  # Less effective (only protects from sun)
            "manteau": 6.0,  # Moderately effective for body protection
        }
        
        # Health risk coefficients (higher = more impact on risk)
        self.health_risk_coefficients = {
            "respiratory": 2.0,
            "skin": 1.5,
            "neurological": 1.8,
        }
    
    def fit(self, X, y):
        """Train the model with features X and target y"""
        if isinstance(X, pd.DataFrame):
            self.feature_names = X.columns.tolist()
            X = X.values
        X_scaled = self.scaler.fit_transform(X)
        self.model.fit(X_scaled, y)
        return self
    
    def predict(self, features):
        """
        Predict risk based on input features
        
        Args:
            features: Dict with feature values
            
        Returns:
            Dict with risk scores and associated information
        """
        # Process features for prediction
        processed_features = self._process_features(features)
        
        # In a real model, we would scale and predict
        # Here we're using a more comprehensive synthetic prediction
        # to demonstrate the capabilities
        
        # Calculate risk based on feature combinations with some randomness
        overall_risk = self._calculate_synthetic_risk(processed_features)
        
        # Calculate specific health risks
        respiratory_risk = self._calculate_respiratory_risk(processed_features, overall_risk)
        skin_risk = self._calculate_skin_risk(processed_features, overall_risk)
        neurological_risk = self._calculate_neurological_risk(processed_features, overall_risk)
        
        # Generate risk factors based on features
        risk_factors = self._generate_risk_factors(processed_features, overall_risk)
        
        # Generate recommendations based on risk factors
        recommendations = self._generate_recommendations(processed_features, risk_factors)
        
        # Calculate feature importance
        feature_importance = self._calculate_feature_importance(processed_features)
        
        # Calculate confidence interval (mock)
        confidence_margin = 5.0  # 5% margin of error
        confidence_interval = [
            max(0, overall_risk - confidence_margin),
            min(100, overall_risk + confidence_margin)
        ]
        
        # Generate what-if scenarios
        what_if_scenarios = self._generate_what_if_scenarios(processed_features, overall_risk)
        
        return {
            "overall_risk": overall_risk,
            "respiratory_risk": respiratory_risk,
            "skin_risk": skin_risk,
            "neurological_risk": neurological_risk,
            "risk_factors": risk_factors,
            "recommendations": recommendations,
            "feature_importance": feature_importance,
            "confidence_interval": confidence_interval,
            "what_if_scenarios": what_if_scenarios
        }
    
    def _process_features(self, features):
        """Process and normalize input features"""
        processed = {}
        
        # Numeric features
        numeric_features = [
            "age", "work_experience", "work_hours_per_day", 
            "work_days_per_week", "protective_equipment_count",
            "chemical_exposure_count", "number_of_children"
        ]
        
        for feature in numeric_features:
            if feature in features:
                processed[feature] = float(features[feature])
            else:
                # Default values
                defaults = {
                    "age": 40,
                    "work_experience": 10,
                    "work_hours_per_day": 8,
                    "work_days_per_week": 5,
                    "protective_equipment_count": 0,
                    "chemical_exposure_count": 0,
                    "number_of_children": 2
                }
                processed[feature] = defaults[feature]
        
        # Binary features
        binary_features = [
            "has_respiratory_conditions", "has_skin_conditions", "has_chronic_exposure"
        ]
        
        for feature in binary_features:
            if feature in features:
                # Convert to 1 or 0
                processed[feature] = 1 if features[feature] in [True, 1, "1", "true", "True", "yes", "Yes"] else 0
            else:
                processed[feature] = 0
        
        # Categorical features
        for feature, mapping in self.categorical_mappings.items():
            if feature in features:
                value = features[feature]
                if value in mapping:
                    processed[feature] = mapping[value]
                else:
                    # Default to first category if invalid
                    processed[feature] = list(mapping.values())[0]
            else:
                # Default to first category if missing
                processed[feature] = list(mapping.values())[0]
        
        # Process arrays of equipment and chemicals
        if "protective_equipment" in features:
            equipment_list = features["protective_equipment"]
            if isinstance(equipment_list, str):
                equipment_list = equipment_list.split(",")
            
            # Calculate protection score
            protection_score = 0
            for item in equipment_list:
                item = item.strip().lower()
                if item in self.protection_effectiveness:
                    protection_score += self.protection_effectiveness[item]
            
            # Normalize to 0-10 scale
            max_possible = sum(self.protection_effectiveness.values())
            processed["protection_score"] = 10 * protection_score / max_possible if max_possible > 0 else 0
        else:
            processed["protection_score"] = 0
        
        if "chemical_exposure" in features:
            chemical_list = features["chemical_exposure"]
            if isinstance(chemical_list, str):
                chemical_list = chemical_list.split(",")
            
            # Calculate chemical risk score
            chemical_risk = 0
            for item in chemical_list:
                item = item.strip().lower()
                if item in self.chemical_severity:
                    chemical_risk += self.chemical_severity[item]
            
            # Normalize to 0-10 scale if there are chemicals, else 0
            if chemical_list:
                max_possible = sum(list(self.chemical_severity.values())[:len(chemical_list)])
                processed["chemical_risk_score"] = 10 * chemical_risk / max_possible if max_possible > 0 else 0
            else:
                processed["chemical_risk_score"] = 0
        else:
            processed["chemical_risk_score"] = 0
        
        return processed

    def _calculate_synthetic_risk(self, features):
        """Calculate a synthetic risk score based on features"""
        base_risk = 20  # Minimum risk
        
        # Age factor
        if features["age"] > 50:
            base_risk += 10 + (features["age"] - 50) * 0.5
        elif features["age"] > 40:
            base_risk += 5 + (features["age"] - 40) * 0.5
        
        # Work intensity
        work_intensity = features["work_hours_per_day"] * features["work_days_per_week"] / 35.0  # Normalize to standard 35 hour week
        if work_intensity > 1:
            base_risk += (work_intensity - 1) * 15  # 15% per unit over standard
        
        # Experience factor (less experience = higher risk)
        if features["work_experience"] < 5:
            base_risk += (5 - features["work_experience"]) * 3
        
        # Protection factor (subtract from risk)
        protection_effect = features["protection_score"] * 2.5  # Scale to 0-25 impact
        base_risk -= protection_effect
        
        # Chemical exposure (add to risk)
        chemical_effect = features["chemical_risk_score"] * 2  # Scale to 0-20 impact
        base_risk += chemical_effect
        
        # Health conditions (add to risk)
        if features["has_respiratory_conditions"]:
            base_risk += 15
        if features["has_skin_conditions"]:
            base_risk += 10
        if features["has_chronic_exposure"]:
            base_risk += 12
        
        # Children factor (small addition - more children means less time for self-care)
        if features["number_of_children"] > 3:
            base_risk += (features["number_of_children"] - 3) * 2
        
        # Socioeconomic factor (lower status = higher risk)
        if features["socio_economic_status"] == 0:  # 'bas'
            base_risk += 10
        elif features["socio_economic_status"] == 1:  # 'moyen'
            base_risk += 5
        
        # Employment status factor (seasonal workers may have less stable conditions)
        if features["employment_status"] == 0:  # 'saisonnière'
            base_risk += 8
        
        # Small random variation for realistic effect (+/- 5%)
        random_factor = (random.random() * 10) - 5
        base_risk += random_factor
        
        # Ensure risk is between 0 and 100
        return max(0, min(100, base_risk))

    def _calculate_respiratory_risk(self, features, overall_risk):
        """Calculate respiratory-specific risk"""
        base_respiratory_risk = overall_risk
        
        # Increase risk if respiratory conditions exist
        if features["has_respiratory_conditions"]:
            base_respiratory_risk += 15
        
        # Respiratory protection (mask) is especially important for this
        has_mask = False
        if "protective_equipment" in features:
            equipment_list = features["protective_equipment"]
            if isinstance(equipment_list, str):
                equipment_list = equipment_list.split(",")
            has_mask = "masque" in [item.strip().lower() for item in equipment_list]
        
        if not has_mask:
            base_respiratory_risk += 10
        
        # Chemical impact on respiratory risk
        chemical_impact = features["chemical_risk_score"] * 1.5
        base_respiratory_risk += chemical_impact
        
        # Age effect on respiratory risk
        if features["age"] > 60:
            base_respiratory_risk += 8
        elif features["age"] > 50:
            base_respiratory_risk += 5
        
        # Ensure risk is between 0 and 100
        return max(0, min(100, base_respiratory_risk))

    def _calculate_skin_risk(self, features, overall_risk):
        """Calculate skin-specific risk"""
        base_skin_risk = overall_risk * 0.9  # Slightly lower than overall by default
        
        # Increase risk if skin conditions exist
        if features["has_skin_conditions"]:
            base_skin_risk += 20
        
        # Skin protection (gloves) is especially important for this
        has_gloves = False
        if "protective_equipment" in features:
            equipment_list = features["protective_equipment"]
            if isinstance(equipment_list, str):
                equipment_list = equipment_list.split(",")
            has_gloves = "gants" in [item.strip().lower() for item in equipment_list]
        
        if not has_gloves:
            base_skin_risk += 15
        
        # Chemical impact on skin risk
        chemical_impact = features["chemical_risk_score"] * 1.2
        base_skin_risk += chemical_impact
        
        # Ensure risk is between a and 100
        return max(0, min(100, base_skin_risk))

    def _calculate_neurological_risk(self, features, overall_risk):
        """Calculate neurological-specific risk"""
        base_neuro_risk = overall_risk * 0.8  # Lower than overall by default
        
        # Chemical impact is high for neurological risk
        chemical_impact = features["chemical_risk_score"] * 2
        base_neuro_risk += chemical_impact
        
        # Chronic exposure has big impact
        if features["has_chronic_exposure"]:
            base_neuro_risk += 20
        
        # Age effect on neurological risk
        if features["age"] > 55:
            base_neuro_risk += 10
        
        # Work intensity affects neurological risk
        work_intensity = features["work_hours_per_day"] * features["work_days_per_week"] / 35.0
        if work_intensity > 1.2:  # High intensity
            base_neuro_risk += 8
        
        # Ensure risk is between 0 and 100
        return max(0, min(100, base_neuro_risk))

    def _generate_risk_factors(self, features, overall_risk):
        """Generate risk factors based on features"""
        risk_factors = []
        
        # Age risk factor
        if features["age"] > 50:
            risk_factors.append(f"Âge supérieur à 50 ans ({features['age']} ans)")
        
        # Work intensity risk factor
        hours_per_week = features["work_hours_per_day"] * features["work_days_per_week"]
        if hours_per_week > 40:
            risk_factors.append(f"Temps de travail élevé ({hours_per_week} heures par semaine)")
        
        # Protection equipment risk factor
        if features["protection_score"] < 5:
            risk_factors.append("Utilisation insuffisante d'équipement de protection")
        
        # Chemical exposure risk factor
        if features["chemical_risk_score"] > 5:
            risk_factors.append("Exposition élevée à des produits chimiques")
        
        # Health condition risk factors
        if features["has_respiratory_conditions"]:
            risk_factors.append("Présence de troubles respiratoires préexistants")
        if features["has_skin_conditions"]:
            risk_factors.append("Antécédents de problèmes cutanés")
        if features["has_chronic_exposure"]:
            risk_factors.append("Exposition chronique aux produits agricoles")
        
        # Socioeconomic risk factor
        if features["socio_economic_status"] == 0:  # 'bas'
            risk_factors.append("Niveau socio-économique bas (accès limité aux ressources)")
        
        # Employment status risk factor
        if features["employment_status"] == 0:  # 'saisonnière'
            risk_factors.append("Statut d'emploi saisonnier (conditions de travail moins stables)")
        
        # Ensure we return at least some risk factors
        if not risk_factors and overall_risk > 30:
            risk_factors.append("Combinaison de facteurs de risque agricoles")
        
        return risk_factors

    def _generate_recommendations(self, features, risk_factors):
        """Generate personalized recommendations based on risk factors"""
        recommendations = []
        
        # Protective equipment recommendations
        if "Utilisation insuffisante d'équipement de protection" in risk_factors:
            recommendations.append("Utiliser plus régulièrement des équipements de protection, particulièrement un masque et des gants")
        
        # Chemical exposure recommendations
        if "Exposition élevée à des produits chimiques" in risk_factors:
            recommendations.append("Limiter l'exposition aux produits chimiques en suivant les instructions d'utilisation et en portant un équipement de protection approprié")
        
        # Work hours recommendations
        hours_per_week = features["work_hours_per_day"] * features["work_days_per_week"]
        if hours_per_week > 40:
            recommendations.append(f"Réduire les heures de travail hebdomadaires (actuellement {hours_per_week}h) pour limiter la fatigue et l'exposition")
        
        # Health-based recommendations
        if features["has_respiratory_conditions"]:
            recommendations.append("Consulter régulièrement un médecin pour le suivi des troubles respiratoires")
            recommendations.append("Porter un masque de protection respiratoire adapté lors de l'utilisation de produits chimiques")
        
        if features["has_skin_conditions"]:
            recommendations.append("Utiliser des gants de protection pour éviter le contact direct avec les produits chimiques")
            recommendations.append("Se laver soigneusement les mains et la peau exposée après le travail")
        
        # Age-based recommendations
        if features["age"] > 55:
            recommendations.append("Prévoir des pauses plus fréquentes pendant le travail")
            recommendations.append("Éviter les tâches nécessitant des efforts physiques intenses")
        
        # Socioeconomic recommendations
        if features["socio_economic_status"] == 0:  # 'bas'
            recommendations.append("Se renseigner sur les programmes d'aide pour l'achat d'équipement de protection")
        
        # General recommendations
        recommendations.append("Maintenir une bonne hydratation pendant le travail, surtout par temps chaud")
        
        return recommendations[:5]  # Limit to top 5 recommendations
    
    def _calculate_feature_importance(self, features):
        """Calculate feature importance for visualization"""
        # In a real model, we would extract this from the trained model
        # Here we're providing synthetic importance scores
        importance_scores = [
            {"feature": "protection_score", "importance": 0.85},
            {"feature": "chemical_risk_score", "importance": 0.78},
            {"feature": "age", "importance": 0.72},
            {"feature": "has_respiratory_conditions", "importance": 0.65},
            {"feature": "work_hours_per_day", "importance": 0.58},
            {"feature": "work_experience", "importance": 0.52},
            {"feature": "socio_economic_status", "importance": 0.48},
            {"feature": "employment_status", "importance": 0.42},
            {"feature": "has_chronic_exposure", "importance": 0.38},
            {"feature": "has_skin_conditions", "importance": 0.35}
        ]
        
        return importance_scores
    
    def _generate_what_if_scenarios(self, features, overall_risk):
        """Generate what-if scenarios for risk reduction"""
        scenarios = []
        
        # Add protective equipment scenario
        if features["protection_score"] < 8:
            new_features = features.copy()
            new_features["protection_score"] = 8
            new_risk = self._calculate_synthetic_risk(new_features)
            scenarios.append({
                "label": "Avec protection complète",
                "score": new_risk
            })
        
        # Reduce work hours scenario
        if features["work_hours_per_day"] > 6:
            new_features = features.copy()
            new_features["work_hours_per_day"] = 6
            new_risk = self._calculate_synthetic_risk(new_features)
            scenarios.append({
                "label": "Avec réduction des heures de travail",
                "score": new_risk
            })
        
        # Add mask specifically for respiratory protection
        protective_equipment_list = []
        if "protective_equipment" in features:
            equipment_list = features["protective_equipment"]
            if isinstance(equipment_list, str):
                protective_equipment_list = equipment_list.split(",")
            else:
                protective_equipment_list = equipment_list
        
        if "masque" not in [item.strip().lower() for item in protective_equipment_list]:
            new_features = features.copy()
            new_features["protective_equipment"] = protective_equipment_list + ["masque"]
            new_features["protection_score"] = features["protection_score"] + (self.protection_effectiveness["masque"] / sum(self.protection_effectiveness.values()) * 10)
            new_risk = self._calculate_synthetic_risk(new_features)
            scenarios.append({
                "label": "Avec masque respiratoire",
                "score": new_risk
            })
        
        # Reduce chemical exposure scenario
        if features["chemical_risk_score"] > 0:
            new_features = features.copy()
            new_features["chemical_risk_score"] = max(0, features["chemical_risk_score"] - 5)
            new_risk = self._calculate_synthetic_risk(new_features)
            scenarios.append({
                "label": "Avec réduction de l'exposition chimique",
                "score": new_risk
            })
        
        return scenarios

def load_or_create_model():
    """Load a saved model or create a new one if none exists"""
    if os.path.exists(MODEL_FILE) and os.path.exists(SCALER_FILE):
        try:
            model = joblib.load(MODEL_FILE)
            scaler = joblib.load(SCALER_FILE)
            feature_names = joblib.load(FEATURE_IMPORTANCE_FILE) if os.path.exists(FEATURE_IMPORTANCE_FILE) else None
            return RiskModel(model=model, scaler=scaler, feature_names=feature_names)
        except Exception as e:
            print(f"Error loading model: {e}")
    
    # If no model exists or loading failed, create a new one
    return RiskModel()

def train_model(data):
    """Train the model with the provided data"""
    try:
        # Extract features and target from data
        # In a real scenario, you would have actual target values
        # Here we'll simulate it based on your domain knowledge
        
        # Extract numeric features
        X = pd.DataFrame({
            'age': data['Age'] if 'Age' in data else np.random.randint(20, 70, len(data)),
            'work_experience': data['Ancienneté agricole'] if 'Ancienneté agricole' in data else np.random.randint(1, 40, len(data)),
            'work_hours_per_day': data['H travail / jour'] if 'H travail / jour' in data else np.random.uniform(4, 12, len(data)),
            'work_days_per_week': data['J travail / Sem'] if 'J travail / Sem' in data else np.random.uniform(3, 7, len(data)),
        })
        
        # Extract and encode categorical features
        if 'Masque pour pesticides' in data:
            X['mask_usage'] = data['Masque pour pesticides'].map({
                'jamais': 0, 'parfois': 0.33, 'souvent': 0.67, 'toujours': 1
            }).fillna(0)
        else:
            X['mask_usage'] = np.random.choice([0, 0.33, 0.67, 1], len(data))
            
        if 'Gants' in data:
            X['gloves_usage'] = data['Gants'].map({
                'jamais': 0, 'parfois': 0.33, 'souvent': 0.67, 'toujours': 1
            }).fillna(0)
        else:
            X['gloves_usage'] = np.random.choice([0, 0.33, 0.67, 1], len(data))
            
        if 'Bottes' in data:
            X['boots_usage'] = data['Bottes'].map({
                'jamais': 0, 'parfois': 0.33, 'souvent': 0.67, 'toujours': 1
            }).fillna(0)
        else:
            X['boots_usage'] = np.random.choice([0, 0.33, 0.67, 1], len(data))
        
        # Calculate a protection score
        X['protection_score'] = (X['mask_usage'] + X['gloves_usage'] + X['boots_usage']) / 3 * 10
        
        # Add binary health condition features
        X['has_respiratory_conditions'] = data.apply(
            lambda row: 1 if row.get('Troubles cardio-respiratoires', '') != '' else 0, 
            axis=1
        )
        
        X['has_skin_conditions'] = data.apply(
            lambda row: 1 if row.get('Troubles cutanés/phanères', '') != '' else 0, 
            axis=1
        )
        
        X['has_neurological_conditions'] = data.apply(
            lambda row: 1 if row.get('Troubles neurologiques', '') != '' else 0, 
            axis=1
        )
        
        # Create a synthetic target variable based on domain knowledge
        # Higher values = higher risk
        y = 20 + \
            (X['age'] > 50).astype(int) * 15 + \
            (X['work_hours_per_day'] > 8).astype(int) * 10 + \
            (X['work_days_per_week'] > 6).astype(int) * 10 + \
            (10 - X['protection_score']) * 3 + \
            X['has_respiratory_conditions'] * 15 + \
            X['has_skin_conditions'] * 10 + \
            X['has_neurological_conditions'] * 12
            
        # Cap the target between 0 and 100
        y = np.clip(y, 0, 100)
        
        # Split data
        X_train, X_test, y_train, y_test = train_test_split(
            X, y, test_size=0.2, random_state=42
        )
        
        # Create and train the model
        risk_model = RiskModel()
        risk_model.fit(X_train, y_train)
        
        # Save the model and scaler
        joblib.dump(risk_model.model, MODEL_FILE)
        joblib.dump(risk_model.scaler, SCALER_FILE)
        joblib.dump(risk_model.feature_names, FEATURE_IMPORTANCE_FILE)
        
        return True
    except Exception as e:
        print(f"Error training model: {e}")
        return False
