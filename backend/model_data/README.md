# Model Data Directory

This directory stores the trained machine learning models and related files for the risk prediction system.

## Files Generated Here

When the model is trained, the following files will be created in this directory:

- `risk_model.joblib` - The trained Random Forest model
- `scaler.joblib` - The StandardScaler for feature normalization
- `feature_importance.joblib` - Feature names and importance values

## Note

These files are excluded from git via the .gitignore file since they can be large and are generated at runtime.
