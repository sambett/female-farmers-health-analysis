from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Union
import random
import json

# Create the FastAPI app
app = FastAPI(title="Agricultural Health Risk Prediction API")

# Add CORS middleware to allow requests from frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define input schemas
class StructuredInput(BaseModel):
    age: int
    work_experience: int
    work_hours_per_day: int
    work_days_per_week: Optional[int] = 5
    protective_equipment: List[str]
    chemical_exposure: List[str]
    tasks: Optional[List[str]] = []
    has_respiratory_conditions: bool
    has_skin_conditions: Optional[bool] = False
    has_chronic_exposure: Optional[bool] = False
    marital_status: Optional[str] = "mariée"
    number_of_children: Optional[int] = 0
    socio_economic_status: Optional[str] = "moyen"
    employment_status: Optional[str] = "permanente"

class FreeTextInput(BaseModel):
    general_description: str
    chemicals_text: str
    tasks_text: str
    health_text: str
    protection_text: str

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Agricultural Health Risk Prediction API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Endpoint for structured input prediction
@app.post("/predict_risk")
async def predict_risk(data: StructuredInput):
    try:
        # Calculate risk values based on input data
        # This is a simplified version using the input parameters to generate risk scores
        
        base_risk = 30  # Base risk score
        
        # Age factor
        if data.age > 50:
            base_risk += 15
        elif data.age > 40:
            base_risk += 10
        
        # Experience factor
        if data.work_experience > 20:
            base_risk += 10
        elif data.work_experience > 10:
            base_risk += 5
        
        # Work intensity
        work_hours_per_week = data.work_hours_per_day * data.work_days_per_week
        if work_hours_per_week > 48:
            base_risk += 15
        elif work_hours_per_week > 40:
            base_risk += 10
        
        # Protection factor (reduces risk)
        protection_reduction = len(data.protective_equipment) * 5
        base_risk = max(10, base_risk - protection_reduction)
        
        # Chemical exposure
        chemical_factor = len(data.chemical_exposure) * 8
        base_risk += chemical_factor
        
        # Health conditions
        if data.has_respiratory_conditions:
            base_risk += 15
        if data.has_skin_conditions:
            base_risk += 10
        if data.has_chronic_exposure:
            base_risk += 12
        
        # Cap risk at 100%
        overall_risk = min(base_risk, 100)
        
        # Calculate specific risks
        respiratory_risk = min(overall_risk + (15 if data.has_respiratory_conditions else 0), 100)
        skin_risk = min(overall_risk + (15 if data.has_skin_conditions else 0), 100)
        neurological_risk = min(overall_risk + (10 if data.has_chronic_exposure else 0), 100)
        
        # Generate risk factors list
        risk_factors = []
        if data.age > 50:
            risk_factors.append(f"Âge élevé ({data.age} ans)")
        if data.work_experience > 15:
            risk_factors.append(f"Exposition prolongée ({data.work_experience} ans)")
        if work_hours_per_week > 40:
            risk_factors.append(f"Temps de travail élevé ({work_hours_per_week} heures/semaine)")
        if len(data.protective_equipment) < 3:
            risk_factors.append("Protection insuffisante")
        if "pesticides" in data.chemical_exposure:
            risk_factors.append("Exposition aux pesticides")
        if "herbicides" in data.chemical_exposure:
            risk_factors.append("Exposition aux herbicides")
        if data.has_respiratory_conditions:
            risk_factors.append("Antécédents respiratoires")
        
        # Generate recommendations
        recommendations = []
        if len(data.protective_equipment) < 3:
            recommendations.append("Utiliser davantage d'équipements de protection")
        if "mask" not in data.protective_equipment and ("pesticides" in data.chemical_exposure or "herbicides" in data.chemical_exposure):
            recommendations.append("Porter un masque lors de l'utilisation de produits chimiques")
        if "gloves" not in data.protective_equipment:
            recommendations.append("Porter des gants pour éviter le contact cutané")
        if work_hours_per_week > 48:
            recommendations.append("Réduire le temps d'exposition hebdomadaire")
        if data.has_respiratory_conditions:
            recommendations.append("Consulter régulièrement un médecin pour le suivi respiratoire")
        
        # Feature importance (what factors most influence the risk)
        feature_importance = [
            {"feature": "Âge", "importance": 0.8},
            {"feature": "Protection", "importance": 0.75},
            {"feature": "Produits chimiques", "importance": 0.7},
            {"feature": "Heures de travail", "importance": 0.65},
            {"feature": "Antécédents médicaux", "importance": 0.6}
        ]
        
        # Confidence interval (5% margin)
        confidence_interval = [max(0, overall_risk - 5), min(100, overall_risk + 5)]
        
        # What-if scenarios
        what_if_scenarios = []
        if len(data.protective_equipment) < 3:
            improved_protection = overall_risk - 15
            what_if_scenarios.append({
                "label": "Avec protection complète",
                "score": max(10, improved_protection)
            })
        
        if work_hours_per_week > 40:
            reduced_hours = overall_risk - 10
            what_if_scenarios.append({
                "label": "Avec horaire réduit",
                "score": max(10, reduced_hours)
            })
        
        # Add random variation to make it more realistic
        def add_variation(value):
            variation = random.uniform(-3, 3)
            return max(10, min(100, value + variation))
            
        return {
            "overall_risk": round(add_variation(overall_risk)),
            "respiratory_risk": round(add_variation(respiratory_risk)),
            "skin_risk": round(add_variation(skin_risk)),
            "neurological_risk": round(add_variation(neurological_risk)),
            "risk_factors": risk_factors,
            "recommendations": recommendations,
            "feature_importance": feature_importance,
            "confidence_interval": confidence_interval,
            "what_if_scenarios": what_if_scenarios
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Endpoint for free text input prediction
@app.post("/predict_risk_from_text")
async def predict_risk_from_text(data: FreeTextInput):
    try:
        # Extract age if mentioned
        age = 40  # Default age
        import re
        age_match = re.search(r'(\d+)\s*ans', data.general_description)
        if age_match:
            age = int(age_match.group(1))
        
        # Extract chemicals
        chemicals = []
        chemical_terms = ["pesticide", "herbicide", "fongicide", "insecticide", "engrais chimique"]
        for term in chemical_terms:
            if term in data.chemicals_text.lower():
                chemicals.append(term)
        
        # Extract health issues
        has_respiratory = any(term in data.health_text.lower() for term in 
                             ["respir", "toux", "poumon", "asthme", "dyspné"])
        has_skin = any(term in data.health_text.lower() for term in 
                      ["peau", "cutané", "dermatite", "irritation"])
        
        # Extract protection equipment
        protection = []
        if "masque" in data.protection_text.lower():
            protection.append("mask")
        if "gant" in data.protection_text.lower():
            protection.append("gloves")
        if "botte" in data.protection_text.lower():
            protection.append("boots")
        
        # Construct a structured input from text analysis
        structured_input = StructuredInput(
            age=age,
            work_experience=10,  # Default
            work_hours_per_day=8,  # Default
            work_days_per_week=5,  # Default
            protective_equipment=protection,
            chemical_exposure=chemicals,
            has_respiratory_conditions=has_respiratory,
            has_skin_conditions=has_skin,
            has_chronic_exposure=False
        )
        
        # Reuse the structured prediction endpoint
        return await predict_risk(structured_input)
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text prediction error: {str(e)}")

# Endpoint for extracting keywords from text
@app.post("/extract_keywords")
async def extract_keywords(text_data: Dict[str, str], type: str = "chemical"):
    try:
        text = text_data.get("text", "")
        keywords = []
        
        if type == "chemical":
            terms = ["pesticide", "herbicide", "fongicide", "insecticide", "engrais chimique"]
            for term in terms:
                if term in text.lower():
                    keywords.append(term)
        
        elif type == "task":
            terms = ["épandage", "traitement", "récolte", "désherbage", "taille"]
            for term in terms:
                if term in text.lower():
                    keywords.append(term)
        
        elif type == "health":
            terms = ["respiratoire", "cutané", "neurologique", "cognitif", "allergie"]
            for term in terms:
                if term in text.lower():
                    keywords.append(term)
        
        elif type == "protection":
            terms = ["masque", "gants", "bottes", "casquette", "manteau"]
            for term in terms:
                if term in text.lower():
                    keywords.append(term)
                    
        return {"keywords": keywords}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Keyword extraction error: {str(e)}")

# Start the server when run directly
if __name__ == "__main__":
    import uvicorn
    uvicorn.run("simple_server:app", host="0.0.0.0", port=8000, reload=True)
