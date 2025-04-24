#!/usr/bin/env python
# -*- coding: utf-8 -*-

"""
Multiple Correspondence Analysis (MCA) for Female Farmers Health Study

This script performs MCA on the female farmers dataset to identify patterns and relationships
between categorical variables, particularly focusing on health outcomes, protective equipment usage,
and socioeconomic factors.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import prince  # MCA library
import seaborn as sns
from sklearn.preprocessing import StandardScaler

# Set plot style
plt.style.use('ggplot')
sns.set(font_scale=1.2)
sns.set_style("whitegrid")

# Load the data
df = pd.read_excel("fixed_female_farmers_data.xlsx")

print("Data loaded successfully with", len(df), "records and", len(df.columns), "columns")

# --------------------- DATA PREPARATION --------------------------

# Function to clean categorical variables and convert to proper format
def clean_categorical(df):
    # List of equipment usage variables
    equipment_cols = ['Masque pour pesticides', 'Bottes', 'Gants', 'Casquette/Mdhalla', 'Manteau imperméable']
    
    # Replace NaN values with 'non spécifié'
    for col in equipment_cols:
        df[col] = df[col].fillna('non spécifié')
    
    # Convert equipment usage to categorical
    for col in equipment_cols:
        df[col] = pd.Categorical(df[col], categories=['jamais', 'parfois', 'souvent', 'toujours', 'non spécifié'])
    
    # Clean socioeconomic level
    if 'Niveau socio-économique' in df.columns:
        df['Niveau socio-économique'] = df['Niveau socio-économique'].fillna('non spécifié')
        df['Niveau socio-économique'] = pd.Categorical(df['Niveau socio-économique'],
                                                 categories=['bas', 'moyen', 'bon', 'non spécifié'])

    # Clean health issues - create binary indicators for presence of health issues
    health_cols = ['Troubles cardio-respiratoires', 'Troubles cognitifs', 
                   'Troubles neurologiques', 'Troubles cutanés/phanères']
    
    for col in health_cols:
        # Create binary indicator for presence of health issues (1 if any text, 0 if empty or NaN)
        df[col + '_bin'] = (~df[col].isna() & (df[col] != "")).astype(int)
    
    # Clean employment status
    if 'Statut' in df.columns:
        df['Statut'] = df['Statut'].fillna('non spécifié')
        df['Statut'] = pd.Categorical(df['Statut'], 
                                    categories=['permanente', 'saisonnière', 'non spécifié'])
    
    # Clean marital status
    if 'Situation maritale' in df.columns:
        df['Situation maritale'] = df['Situation maritale'].fillna('non spécifié')

    # Create binary variables for traditional practices
    if 'Neffa' in df.columns:
        df['Neffa'] = df['Neffa'].fillna('non').map({'oui': 1, 'non': 0})
    
    if 'Fumées de Tabouna' in df.columns:
        df['Fumées de Tabouna'] = df['Fumées de Tabouna'].fillna('non').map({'oui': 1, 'non': 0})
    
    return df

# Clean the data
df_cleaned = clean_categorical(df)
print("Data cleaning completed")

# --------------------- PERFORM MCA --------------------------

# Define the categories to include in the MCA
# 1. Protection Equipment Variables
protection_vars = ['Masque pour pesticides', 'Bottes', 'Gants', 'Casquette/Mdhalla', 'Manteau imperméable']

# 2. Health Issues Variables (binary)
health_vars = ['Troubles cardio-respiratoires_bin', 'Troubles cognitifs_bin', 
               'Troubles neurologiques_bin', 'Troubles cutanés/phanères_bin']

# 3. Socioeconomic and Demographic Variables
socio_vars = ['Niveau socio-économique', 'Statut', 'Situation maritale']

# 4. Traditional Practices
traditional_vars = ['Neffa', 'Fumées de Tabouna']

# Combine all variables for MCA
mca_vars = protection_vars + health_vars + socio_vars + traditional_vars
print(f"Performing MCA with {len(mca_vars)} variables: {', '.join(mca_vars)}")

# Check for missing values in the variables for MCA
missing_values = df_cleaned[mca_vars].isnull().sum()
print("\nMissing values in MCA variables:")
print(missing_values[missing_values > 0])

# Handle any remaining missing values
for col in mca_vars:
    if col in protection_vars:
        df_cleaned[col] = df_cleaned[col].fillna('non spécifié')
    elif col in health_vars:
        df_cleaned[col] = df_cleaned[col].fillna(0)
    elif col in socio_vars:
        df_cleaned[col] = df_cleaned[col].fillna('non spécifié')
    elif col in traditional_vars:
        df_cleaned[col] = df_cleaned[col].fillna(0)

# Convert categorical variables to strings for MCA
for col in mca_vars:
    df_cleaned[col] = df_cleaned[col].astype(str)

# Perform MCA
mca = prince.MCA(n_components=5)
mca_result = mca.fit(df_cleaned[mca_vars])

# Get coordinates of the variables
var_coordinates = mca.column_coordinates(df_cleaned[mca_vars])
print("\nVariable coordinates computed successfully")

# Get coordinates of the individuals
ind_coordinates = mca.row_coordinates(df_cleaned[mca_vars])
print("Individual coordinates computed successfully")

# --------------------- ANALYZE AND VISUALIZE --------------------------

# Plot variable contributions
def plot_variable_contributions(mca, mca_vars, n_components=2):
    # Get contributions of variables to dimensions
    contrib = mca.column_contributions_
    
    plt.figure(figsize=(12, 10))
    
    for dim in range(n_components):
        plt.subplot(n_components, 1, dim+1)
        contrib_sorted = contrib.iloc[:, dim].sort_values(ascending=False)
        contrib_sorted.plot(kind='bar', figsize=(12, 8))
        plt.title(f'Variable Contributions to Dimension {dim+1}')
        plt.ylabel('Contribution (%)')
        plt.xlabel('Variable Categories')
        plt.xticks(rotation=90)
    
    plt.tight_layout()
    plt.savefig('results/variable_contributions.png', dpi=300, bbox_inches='tight')
    plt.close()

# Plot factor map
def plot_factor_map(mca_result, var_coordinates, ind_coordinates, protection_vars, health_vars):
    plt.figure(figsize=(14, 10))
    
    # Plot individuals
    plt.scatter(ind_coordinates.iloc[:, 0], ind_coordinates.iloc[:, 1], 
                alpha=0.3, color='gray', s=30)
    
    # Plot health variables
    health_mask = var_coordinates.index.str.contains('|'.join(h + '_bin' for h in ['Troubles cardio-respiratoires', 
                                                                     'Troubles cognitifs', 
                                                                     'Troubles neurologiques', 
                                                                     'Troubles cutanés/phanères']))
    health_coords = var_coordinates[health_mask]
    plt.scatter(health_coords.iloc[:, 0], health_coords.iloc[:, 1], 
                s=100, marker='*', label='Health Issues', color='red')
    
    # Plot protection equipment variables
    prot_mask = var_coordinates.index.str.contains('|'.join(protection_vars))
    prot_coords = var_coordinates[prot_mask]
    plt.scatter(prot_coords.iloc[:, 0], prot_coords.iloc[:, 1], 
                s=100, marker='o', label='Protection Equipment', color='blue')
    
    # Plot socioeconomic variables
    socio_mask = var_coordinates.index.str.contains('Niveau socio-économique|Statut|Situation maritale')
    socio_coords = var_coordinates[socio_mask]
    plt.scatter(socio_coords.iloc[:, 0], socio_coords.iloc[:, 1], 
                s=100, marker='s', label='Socioeconomic Factors', color='green')
    
    # Plot traditional practices
    trad_mask = var_coordinates.index.str.contains('Neffa|Fumées de Tabouna')
    trad_coords = var_coordinates[trad_mask]
    plt.scatter(trad_coords.iloc[:, 0], trad_coords.iloc[:, 1], 
                s=100, marker='^', label='Traditional Practices', color='purple')
    
    # Add annotations for key variables
    for i, label in enumerate(var_coordinates.index):
        if ((health_mask[i] and var_coordinates.index[i].endswith('_1')) or 
            (prot_mask[i] and ('toujours' in var_coordinates.index[i] or 'jamais' in var_coordinates.index[i])) or
            (socio_mask[i] and ('bas' in var_coordinates.index[i] or 'bon' in var_coordinates.index[i])) or
            trad_mask[i]):
            plt.annotate(label, 
                        (var_coordinates.iloc[i, 0], var_coordinates.iloc[i, 1]),
                        xytext=(5, 5), 
                        textcoords='offset points',
                        fontsize=9,
                        bbox=dict(boxstyle="round,pad=0.3", fc="white", alpha=0.7))
    
    # Add titles and labels
    plt.title('MCA - Variable Factor Map (Dimensions 1 and 2)', fontsize=16)
    plt.xlabel(f'Dimension 1 ({mca_result.eigenvalues_[0]:.1%} variance)', fontsize=14)
    plt.ylabel(f'Dimension 2 ({mca_result.eigenvalues_[1]:.1%} variance)', fontsize=14)
    plt.axhline(y=0, color='gray', linestyle='-', alpha=0.3)
    plt.axvline(x=0, color='gray', linestyle='-', alpha=0.3)
    plt.grid(True, alpha=0.3)
    plt.legend(fontsize=12)
    plt.tight_layout()
    
    # Save the plot
    plt.savefig('results/factor_map.png', dpi=300, bbox_inches='tight')
    plt.close()

# Create results dir if it doesn't exist
import os
if not os.path.exists('results'):
    os.makedirs('results')

# Execute the plotting functions
plot_variable_contributions(mca, mca_vars)
plot_factor_map(mca_result, var_coordinates, ind_coordinates, protection_vars, health_vars)

# --------------------- ANALYZE RELATIONSHIPS --------------------------

# Create function to identify key patterns and relationships
def analyze_mca_patterns(mca_result, var_coordinates, mca_vars, protection_vars, health_vars):
    # Get eigenvalues to understand dimension importance
    eigenvalues = mca_result.eigenvalues_
    
    # Analyze proximity of variables in the first 2 dimensions
    # Get pairwise distances between variables
    coords = var_coordinates.iloc[:, :2]
    
    # Create distance matrix
    from scipy.spatial.distance import pdist, squareform
    distances = squareform(pdist(coords))
    distance_df = pd.DataFrame(distances, index=coords.index, columns=coords.index)
    
    # Find closest pairs related to health and protection
    health_categories = [col for col in coords.index if any(h in col for h in health_vars)]
    protection_categories = [col for col in coords.index if any(p in col for p in protection_vars)]
    
    # For each health issue, find the closest protection equipment categories
    insights = []
    
    for health_cat in health_categories:
        if "_1" in health_cat:  # Only consider presence of health issues
            dist_to_prot = {prot_cat: distance_df.loc[health_cat, prot_cat] for prot_cat in protection_categories}
            closest_prot = sorted(dist_to_prot.items(), key=lambda x: x[1])[:3]
            furthest_prot = sorted(dist_to_prot.items(), key=lambda x: x[1], reverse=True)[:3]
            
            insights.append({
                'health_issue': health_cat,
                'closest_protection': closest_prot,
                'furthest_protection': furthest_prot
            })
    
    # Prepare the results as a formatted text
    output = "Key Insights from Multiple Correspondence Analysis (MCA)\n"
    output += "======================================================\n\n"
    
    output += f"Dimension 1 explains {eigenvalues[0]:.1%} of variance\n"
    output += f"Dimension 2 explains {eigenvalues[1]:.1%} of variance\n"
    output += f"Dimension 3 explains {eigenvalues[2]:.1%} of variance\n\n"
    
    output += "Relationships between Health Issues and Protection Equipment:\n"
    output += "-----------------------------------------------------------\n\n"
    
    for insight in insights:
        health_name = insight['health_issue'].split('_bin_')[0]
        output += f"For {health_name}:\n"
        
        output += "  Most closely associated with:\n"
        for prot, dist in insight['closest_protection']:
            output += f"    - {prot} (distance: {dist:.2f})\n"
        
        output += "\n  Least associated with:\n"
        for prot, dist in insight['furthest_protection']:
            output += f"    - {prot} (distance: {dist:.2f})\n"
        
        output += "\n"
    
    # Save insights to a text file
    with open('results/mca_insights.txt', 'w', encoding='utf-8') as f:
        f.write(output)
    
    return output

# Execute insights analysis
insights = analyze_mca_patterns(mca_result, var_coordinates, mca_vars, protection_vars, health_vars)
print("\nMCA insights generated and saved to results/mca_insights.txt")

print("\nMCA analysis completed successfully")
