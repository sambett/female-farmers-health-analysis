# Female Farmers Health Analysis - Multivariate Techniques

This directory contains the multivariate analysis of the female farmers health dataset using Principal Component Analysis (PCA), Multiple Correspondence Analysis (MCA), and combined analysis approaches.

## Directory Structure

- **data/** - Contains the original datasets used for analysis
- **scripts/** - Contains Python scripts and notebooks for PCA and MCA
- **pca_results/** - Contains results from Principal Component Analysis
  - **data/** - CSV files with PCA results
  - **figures/** - Visualizations from PCA analysis
- **mca_results/** - Contains results from Multiple Correspondence Analysis 
  - **data/** - CSV files with MCA results
  - **figures/** - Visualizations from MCA analysis  
- **combined_results/** - Contains results from the integrated PCA-MCA analysis
  - **data/** - Data files from combined analysis
  - **figures/** - Visualizations that integrate both analyses
- **reports/** - Contains summary reports and findings from analyses

## Key Files

### Scripts
- `PCA.ipynb` - Jupyter notebook for Principal Component Analysis
- `MCA.ipynb` - Jupyter notebook for Multiple Correspondence Analysis
- `combined_analysis.py` - Python script for integrating PCA and MCA results

### Reports
- `Key_Insights_from_Principal_Component_Analysis_(PCA)_of_Female_Farmers_Health_Study.pdf` - Summary of PCA findings
- `mca_hidden_insights.pdf` - Summary of MCA findings
- `MCA_Analysis_Report.md` - Detailed report on MCA analysis

### Data
- `fixed_female_farmers_data.xlsx` - The preprocessed dataset used for analysis

## Key Findings

The multivariate analysis revealed several important insights:

1. **Four Key Dimensions** - PCA identified four principal components that explain 63% of variance:
   - Age and Experience (PC1, 23.6%)
   - Family Structure (PC2, 16.1%)
   - Cardiovascular Health (PC3, 13.5%)
   - Work Intensity (PC4, 9.9%)

2. **Four Worker Profiles** - Four distinct clusters of female agricultural workers:
   - Younger Workers with Better Protection (36.2%)
   - Older High-Intensity Workers (30.0%)
   - Elderly High-Risk Workers (2.5%)
   - Mid-Age Workers with Higher Family Burden (31.2%)

3. **Protection Patterns** - MCA identified distinct protection behavior profiles:
   - High-Risk Profile (50% of sample) - minimal protection despite chemical exposure
   - Moderate-Protection Profile (35%) - selective task-specific protection
   - Higher-Protection Profile (15%) - consistent protection use

4. **Integrated Insights** - Combined analysis revealed:
   - Age-Experience-Protection Paradox
   - Family Structure's Complex Impact on Protection
   - The "Husband Profession Effect"
   - Regional Protection-Health Risk Profiles

## How to Use This Analysis

1. Start by reviewing the reports in the reports/ directory
2. Examine the visualizations in the pca_results/figures/, mca_results/figures/, and combined_results/figures/ directories
3. For deeper understanding, review the data files in the respective data/ subdirectories
4. To replicate or extend the analysis, refer to the scripts in the scripts/ directory

For any questions about this analysis, please contact [Your Name/Contact Information].
