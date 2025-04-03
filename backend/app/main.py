from fastapi import FastAPI, HTTPException, Depends, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Dict, Optional, Union, Any
import pandas as pd
import numpy as np
import json
import os
import joblib
from app.models.risk_prediction import RiskModel, load_or_create_model, train_model
from app.utils.nlp_processor import extract_keywords, analyze_text, extract_features_from_text

# Create the FastAPI app
app = FastAPI(title="Agricultural Health Risk Prediction API")

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model or create one if it doesn't exist
risk_model = load_or_create_model()

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

class RiskScoreResponse(BaseModel):
    overall_risk: float
    respiratory_risk: float
    skin_risk: float
    neurological_risk: float
    risk_factors: List[str]
    recommendations: List[str]
    feature_importance: List[Dict[str, Union[str, float]]]
    confidence_interval: List[float]
    what_if_scenarios: List[Dict[str, Union[str, float]]]

# Root endpoint
@app.get("/")
async def root():
    return {"message": "Agricultural Health Risk Prediction API"}

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "healthy"}

# Endpoint for structured input prediction
@app.post("/predict_risk", response_model=RiskScoreResponse)
async def predict_risk(data: StructuredInput):
    try:
        # Convert input data to features
        features = {
            "age": data.age,
            "work_experience": data.work_experience,
            "work_hours_per_day": data.work_hours_per_day,
            "work_days_per_week": data.work_days_per_week,
            "protective_equipment_count": len(data.protective_equipment),
            "protective_equipment": ",".join(data.protective_equipment),
            "chemical_exposure_count": len(data.chemical_exposure),
            "chemical_exposure": ",".join(data.chemical_exposure),
            "has_respiratory_conditions": 1 if data.has_respiratory_conditions else 0,
            "has_skin_conditions": 1 if data.has_skin_conditions else 0,
            "has_chronic_exposure": 1 if data.has_chronic_exposure else 0,
            "marital_status": data.marital_status,
            "number_of_children": data.number_of_children,
            "socio_economic_status": data.socio_economic_status,
            "employment_status": data.employment_status
        }

        # Get prediction from model
        result = risk_model.predict(features)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Endpoint for free text input prediction
@app.post("/predict_risk_from_text", response_model=RiskScoreResponse)
async def predict_risk_from_text(data: FreeTextInput):
    try:
        # Extract features from text
        extracted_features = extract_features_from_text(
            general_description=data.general_description,
            chemicals_text=data.chemicals_text,
            tasks_text=data.tasks_text,
            health_text=data.health_text,
            protection_text=data.protection_text
        )
        
        # Get prediction from model
        result = risk_model.predict(extracted_features)
        
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text prediction error: {str(e)}")

# Endpoint for text analysis
@app.post("/analyze_text")
async def analyze_text_endpoint(text_data: Dict[str, str]):
    try:
        text = text_data.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Text field is required")
        
        analysis_result = analyze_text(text)
        return analysis_result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Text analysis error: {str(e)}")

# Endpoint for extracting keywords from text
@app.post("/extract_keywords")
async def extract_keywords_endpoint(
    text_data: Dict[str, str],
    type: str = "chemical"  # chemical, task, health, or protection
):
    try:
        text = text_data.get("text", "")
        if not text:
            raise HTTPException(status_code=400, detail="Text field is required")
        
        keywords = extract_keywords(text, type)
        return {"keywords": keywords}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Keyword extraction error: {str(e)}")

# Endpoint to train/retrain the model with new data
@app.post("/train_model")
async def train_model_endpoint(file: UploadFile = File(...)):
    try:
        # Save the uploaded file
        file_location = f"temp_{file.filename}"
        with open(file_location, "wb+") as file_object:
            file_object.write(await file.read())
        
        # Train model with the new data
        if file_location.endswith('.xlsx') or file_location.endswith('.xls'):
            df = pd.read_excel(file_location)
        else:
            df = pd.read_csv(file_location)
        
        success = train_model(df)
        
        # Clean up
        if os.path.exists(file_location):
            os.remove(file_location)
        
        if success:
            # Reload the model
            global risk_model
            risk_model = load_or_create_model()
            return {"message": "Model trained successfully"}
        else:
            raise HTTPException(status_code=500, detail="Model training failed")
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Training error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
