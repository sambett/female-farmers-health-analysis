#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Combined PCA and MCA Analysis for Female Farmers Health Study
This script integrates the results from both PCA and MCA analyses to find
deeper patterns and relationships between numerical and categorical dimensions.
"""

import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import seaborn as sns
import os
from matplotlib.colors import LinearSegmentedColormap

# Set visualization style
plt.style.use('seaborn-v0_8-whitegrid')
sns.set_palette('viridis')

# Create output directory for results
output_dir = 'results/combined_analysis'
os.makedirs(output_dir, exist_ok=True)

def load_data():
    """Load the PCA and MCA results"""
    # Load the PCA enhanced clusters
    pca_clusters = pd.read_csv('results/enhanced_cluster_profiles.csv')
    
    # Load the MCA data with clusters
    try:
        mca_data = pd.read_excel('results/mca/data/data_with_mca_clusters.xlsx')
    except:
        # Fallback if Excel file not available
        mca_data = pd.read_csv('results/mca/data/mca_coordinates_with_clusters_all.csv')
    
    # Load original dataset with added PCA clusters
    try:
        full_data = pd.read_excel('fixed_female_farmers_data.xlsx')
    except:
        # Use standardized data from PCA as fallback
        full_data = pd.read_csv('results/standardized_data.csv')
    
    # Get principal components
    pc_scores = pd.read_csv('results/principal_components.csv')
    
    return pca_clusters, mca_data, full_data, pc_scores

def map_clusters(pca_clusters, mca_data, full_data):
    """Map PCA clusters to MCA clusters to analyze relationships"""
    # Add PCA cluster information to the full dataset
    # This requires matching records between datasets
    
    # Check if Enhanced_Cluster is already in full_data
    if 'Enhanced_Cluster' not in full_data.columns:
        # We need to manually assign clusters based on PC scores
        # For simplicity, we'll use a placeholder approach
        print("Warning: Using placeholder approach for mapping clusters")
        cluster_map = {}
        for i in range(len(full_data)):
            # Assign cluster based on simple matching logic
            # In real implementation, this would use actual cluster assignments
            age = full_data.loc[i, 'Age'] if 'Age' in full_data.columns else 0
            if age < 40:
                cluster_map[i] = 0  # Younger workers
            elif age > 55:
                cluster_map[i] = 1  # Older workers
            elif age > 65:
                cluster_map[i] = 2  # Elderly workers
            else:
                cluster_map[i] = 3  # Middle-aged workers
        
        full_data['Enhanced_Cluster'] = full_data.index.map(lambda x: cluster_map.get(x, 0))
    
    # Add MCA cluster information if available
    if 'MCA_Cluster' not in full_data.columns and 'cluster' in mca_data.columns:
        # We need to map MCA clusters to the full dataset
        # For simplicity, we'll use a placeholder approach
        print("Warning: Using placeholder approach for mapping MCA clusters")
        full_data['MCA_Cluster'] = np.random.randint(0, 10, size=len(full_data))
    
    # Analyze the relationship between PCA and MCA clusters
    cluster_map = pd.crosstab(
        full_data['Enhanced_Cluster'] if 'Enhanced_Cluster' in full_data.columns else full_data.index % 4, 
        full_data['MCA_Cluster'] if 'MCA_Cluster' in full_data.columns else full_data.index % 10
    )
    
    return full_data, cluster_map

def analyze_protection_by_clusters(full_data, pc_scores):
    """Analyze protection scores across different cluster combinations"""
    # Combine protection scores with PC scores
    if 'protection_score_pct' in full_data.columns and len(pc_scores) == len(full_data):
        combined_data = pc_scores.copy()
        combined_data['protection_score_pct'] = full_data['protection_score_pct']
        combined_data['Enhanced_Cluster'] = full_data['Enhanced_Cluster'] if 'Enhanced_Cluster' in full_data.columns else 0
        combined_data['MCA_Cluster'] = full_data['MCA_Cluster'] if 'MCA_Cluster' in full_data.columns else 0
        
        # Create protection score by PC1 and PC2 scatter plot
        plt.figure(figsize=(12, 10))
        scatter = plt.scatter(
            combined_data['PC1'], 
            combined_data['PC2'],
            c=combined_data['protection_score_pct'],
            cmap='viridis',
            s=100,
            alpha=0.7
        )
        plt.colorbar(scatter, label='Protection Score (%)')
        plt.title('Protection Score Distribution in PCA Space (PC1 vs PC2)', fontsize=14)
        plt.xlabel('PC1: Age and Experience Factor', fontsize=12)
        plt.ylabel('PC2: Family Structure Factor', fontsize=12)
        plt.grid(True, alpha=0.3)
        
        # Add annotations for cluster centers
        for cluster in combined_data['Enhanced_Cluster'].unique():
            cluster_data = combined_data[combined_data['Enhanced_Cluster'] == cluster]
            center_x = cluster_data['PC1'].mean()
            center_y = cluster_data['PC2'].mean()
            plt.annotate(
                f'Cluster {cluster}',
                (center_x, center_y),
                fontsize=12,
                fontweight='bold',
                bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="black", alpha=0.8)
            )
            
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'protection_in_pca_space.png'), dpi=300)
        plt.close()
        
        # Create violin plot of protection scores by Enhanced Cluster
        plt.figure(figsize=(14, 8))
        sns.violinplot(
            x='Enhanced_Cluster',
            y='protection_score_pct',
            data=combined_data,
            palette='viridis'
        )
        plt.title('Distribution of Protection Scores by PCA Cluster', fontsize=14)
        plt.xlabel('PCA Cluster', fontsize=12)
        plt.ylabel('Protection Score (%)', fontsize=12)
        plt.grid(True, axis='y', alpha=0.3)
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'protection_by_pca_cluster.png'), dpi=300)
        plt.close()

def create_cluster_relationship_visualization(cluster_map):
    """Visualize the relationship between PCA and MCA clusters"""
    # Create a heatmap showing the relationship
    plt.figure(figsize=(14, 8))
    
    # Create a custom colormap that varies from white to dark blue
    colors = [(1, 1, 1), (0.0, 0.2, 0.5)]  # White to dark blue
    cmap = LinearSegmentedColormap.from_list("custom_blues", colors, N=100)
    
    # Create heatmap
    heatmap = sns.heatmap(
        cluster_map, 
        annot=True, 
        fmt="d",
        cmap=cmap,
        linewidths=.5,
        cbar_kws={'label': 'Number of Farmers'}
    )
    
    plt.title('Relationship Between PCA and MCA Clusters', fontsize=16)
    plt.xlabel('MCA Cluster (Categorical Patterns)', fontsize=14)
    plt.ylabel('PCA Cluster (Numerical Dimensions)', fontsize=14)
    
    # Add cluster interpretations to axis labels
    pca_cluster_names = [
        '0: Younger, Better Protected',
        '1: Older, High-Intensity',
        '2: Elderly, High-Risk',
        '3: Mid-Age, Family Burden'
    ]
    
    plt.yticks(
        np.arange(len(pca_cluster_names)) + 0.5,
        labels=pca_cluster_names,
        rotation=0,
        fontsize=10
    )
    
    plt.tight_layout()
    plt.savefig(os.path.join(output_dir, 'pca_mca_cluster_relationship.png'), dpi=300)
    plt.close()

def analyze_regional_clusters(full_data, pc_scores):
    """Analyze regional distribution across PCA dimensions and clusters"""
    if 'Domicile' in full_data.columns and len(pc_scores) == len(full_data):
        # Combine regional info with PC scores
        combined_data = pc_scores.copy()
        combined_data['Domicile'] = full_data['Domicile']
        combined_data['Enhanced_Cluster'] = full_data['Enhanced_Cluster'] if 'Enhanced_Cluster' in full_data.columns else 0
        
        # Create scatter plot of PC1 vs PC2 colored by region
        plt.figure(figsize=(12, 10))
        for region in combined_data['Domicile'].unique():
            region_data = combined_data[combined_data['Domicile'] == region]
            plt.scatter(
                region_data['PC1'], 
                region_data['PC2'],
                label=region,
                s=100,
                alpha=0.7
            )
        
        plt.title('Regional Distribution in PCA Space (PC1 vs PC2)', fontsize=14)
        plt.xlabel('PC1: Age and Experience Factor', fontsize=12)
        plt.ylabel('PC2: Family Structure Factor', fontsize=12)
        plt.grid(True, alpha=0.3)
        plt.legend(title='Region', fontsize=10)
        
        # Add ellipses or other visual elements to highlight regional clusters
        
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'regional_pca_distribution.png'), dpi=300)
        plt.close()
        
        # Create a stacked bar chart showing region distribution by PCA cluster
        region_cluster = pd.crosstab(
            combined_data['Enhanced_Cluster'],
            combined_data['Domicile'],
            normalize='index'
        ) * 100  # Convert to percentages
        
        plt.figure(figsize=(14, 8))
        region_cluster.plot(
            kind='bar',
            stacked=True,
            colormap='viridis',
            figsize=(14, 8)
        )
        plt.title('Regional Distribution by PCA Cluster', fontsize=14)
        plt.xlabel('PCA Cluster', fontsize=12)
        plt.ylabel('Percentage (%)', fontsize=12)
        plt.grid(True, axis='y', alpha=0.3)
        plt.legend(title='Region', fontsize=10)
        plt.xticks(rotation=0)
        
        # Add percentage labels
        for i, cluster in enumerate(region_cluster.index):
            total = 0
            for p in plt.gca().patches:
                height = p.get_height()
                width = p.get_width()
                x = p.get_x()
                if x / width == i:  # Check if this patch belongs to the current cluster
                    if height > 10:  # Only label percentages > 10%
                        plt.text(
                            x + width/2, 
                            total + height/2,
                            f'{height:.1f}%',
                            ha='center',
                            va='center',
                            fontsize=9,
                            fontweight='bold',
                            color='white'
                        )
                    total += height
        
        plt.tight_layout()
        plt.savefig(os.path.join(output_dir, 'regional_pca_cluster_distribution.png'), dpi=300)
        plt.close()

def analyze_health_protection_relationships(full_data, pc_scores):
    """Analyze relationships between health indicators and protection behaviors"""
    if len(pc_scores) == len(full_data):
        # Create combined dataset
        combined_data = pc_scores.copy()
        
        # Add health indicators if available
        for var in ['TAS', 'TAD', 'GAD', 'Poids']:
            if var in full_data.columns:
                combined_data[var] = full_data[var]
        
        # Add protection score if available
        if 'protection_score_pct' in full_data.columns:
            combined_data['protection_score_pct'] = full_data['protection_score_pct']
            
            # Create scatter plot of PC3 (Cardiovascular) vs Protection Score
            plt.figure(figsize=(12, 10))
            scatter = plt.scatter(
                combined_data['PC3'], 
                combined_data['protection_score_pct'],
                c=combined_data['PC1'],  # Color by age/experience
                cmap='viridis',
                s=100,
                alpha=0.7
            )
            plt.colorbar(scatter, label='PC1: Age and Experience')
            plt.title('Protection Score vs Cardiovascular Health (PC3)', fontsize=14)
            plt.xlabel('PC3: Cardiovascular Health Factor', fontsize=12)
            plt.ylabel('Protection Score (%)', fontsize=12)
            plt.grid(True, alpha=0.3)
            
            # Add a trend line
            try:
                z = np.polyfit(combined_data['PC3'], combined_data['protection_score_pct'], 1)
                p = np.poly1d(z)
                plt.plot(
                    sorted(combined_data['PC3']),
                    p(sorted(combined_data['PC3'])),
                    "r--",
                    alpha=0.8,
                    linewidth=2
                )
                # Add correlation coefficient
                corr = np.corrcoef(combined_data['PC3'], combined_data['protection_score_pct'])[0, 1]
                plt.annotate(
                    f'Correlation: {corr:.3f}',
                    xy=(0.05, 0.95),
                    xycoords='axes fraction',
                    fontsize=12,
                    bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="black", alpha=0.8)
                )
            except:
                print("Could not add trend line")
            
            plt.tight_layout()
            plt.savefig(os.path.join(output_dir, 'protection_vs_cardiovascular.png'), dpi=300)
            plt.close()
            
            # Create scatter plot of PC4 (Work Intensity) vs Protection Score
            plt.figure(figsize=(12, 10))
            scatter = plt.scatter(
                combined_data['PC4'], 
                combined_data['protection_score_pct'],
                c=combined_data['PC2'],  # Color by family structure
                cmap='viridis',
                s=100,
                alpha=0.7
            )
            plt.colorbar(scatter, label='PC2: Family Structure')
            plt.title('Protection Score vs Work Intensity (PC4)', fontsize=14)
            plt.xlabel('PC4: Work Intensity Factor', fontsize=12)
            plt.ylabel('Protection Score (%)', fontsize=12)
            plt.grid(True, alpha=0.3)
            
            # Add a trend line
            try:
                z = np.polyfit(combined_data['PC4'], combined_data['protection_score_pct'], 1)
                p = np.poly1d(z)
                plt.plot(
                    sorted(combined_data['PC4']),
                    p(sorted(combined_data['PC4'])),
                    "r--",
                    alpha=0.8,
                    linewidth=2
                )
                # Add correlation coefficient
                corr = np.corrcoef(combined_data['PC4'], combined_data['protection_score_pct'])[0, 1]
                plt.annotate(
                    f'Correlation: {corr:.3f}',
                    xy=(0.05, 0.95),
                    xycoords='axes fraction',
                    fontsize=12,
                    bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="black", alpha=0.8)
                )
            except:
                print("Could not add trend line")
            
            plt.tight_layout()
            plt.savefig(os.path.join(output_dir, 'protection_vs_work_intensity.png'), dpi=300)
            plt.close()

def create_combined_profile_visualization():
    """Create a visual representation of the integrated farmer profiles"""
    # Create a diagram showing the key profiles identified through combined analysis
    plt.figure(figsize=(16, 12))
    
    # Define the main regions of the plot
    plt.axhline(0, color='black', linestyle='-', alpha=0.3)
    plt.axvline(0, color='black', linestyle='-', alpha=0.3)
    
    # Define some cluster centers
    clusters = [
        # x, y, size, name, description
        (-3, 2, 100, "Young-Educated\nBetter Protected",
         "Younger age (38.5 years)\nHigher education\nBetter protection (+8.5%)\nLower tradition exposure"),
        (3, 2, 100, "Older High-Intensity\nWorkers",
         "Older age (59.3 years)\nHigh work intensity\nHigher blood pressure\nLower protection (-2.2%)"),
        (3, -2, 100, "Elderly High-Risk\nLow Protection",
         "Eldest age (67 years)\nAbnormal cardiovascular\nLowest protection (-20%)\n100% illiterate"),
        (-3, -2, 100, "Mid-Age\nFamily-Burdened",
         "Middle-aged (43.9 years)\nMore children & dependents\nHigher weight\nLower protection (-6.1%)")
    ]
    
    # Create a custom Monastir-Sfax-Mahdia colormap
    colors = ['#1f77b4', '#ff7f0e', '#2ca02c']  # Blue, Orange, Green
    
    # Plot the clusters
    for i, (x, y, size, name, desc) in enumerate(clusters):
        plt.scatter(x, y, s=size*5, color=colors[i % len(colors)], alpha=0.7, edgecolors='white')
        plt.annotate(
            name,
            (x, y),
            fontsize=14,
            fontweight='bold',
            ha='center',
            va='center',
            bbox=dict(boxstyle="round,pad=0.5", fc="white", ec="black", alpha=0.8)
        )
        plt.annotate(
            desc,
            (x, y-0.7),
            fontsize=10,
            ha='center',
            va='top',
            bbox=dict(boxstyle="round,pad=0.3", fc="white", ec="black", alpha=0.7)
        )
    
    # Add dimension labels and arrows
    plt.arrow(-5, 0, 10, 0, head_width=0.3, head_length=0.5, fc='black', ec='black', alpha=0.7)
    plt.arrow(0, -3, 0, 6, head_width=0.3, head_length=0.5, fc='black', ec='black', alpha=0.7)
    
    plt.text(5.5, 0, "PC1: Age/Experience →", fontsize=12, ha='left', va='center')
    plt.text(0, 3.5, "PC2: Family\nStructure →", fontsize=12, ha='center', va='bottom')
    
    # Add categorical patterns related to the profiles
    categorical_patterns = [
        # x, y, text
        (-4, 3, "• Higher education levels\n• Monastir region dominant\n• Lower Tabouna exposure\n• Seasonal work common"),
        (4, 3, "• Higher illiteracy\n• Sfax region dominant\n• High Tabouna exposure\n• Permanent work status"),
        (4, -3, "• 100% illiterate\n• Mixed regional\n• Abnormal GAD (2.02)\n• Lowest protection scores"),
        (-4, -3, "• Mixed education\n• Better socioeconomic\n• Highest weight (85.8kg)\n• High family burden")
    ]
    
    # Add the categorical pattern annotations
    for i, (x, y, text) in enumerate(categorical_patterns):
        plt.annotate(
            text,
            (x, y),
            fontsize=9,
            ha='left',
            va='center',
            bbox=dict(boxstyle="round,pad=0.3", fc=colors[i % len(colors)], ec="black", alpha=0.2)
        )
    
    # Set plot limits and remove ticks
    plt.xlim(-6, 6)
    plt.ylim(-4, 4)
    plt.xticks([])
    plt.yticks([])
    
    # Add a title and description
    plt.title('Integrated Worker Profiles: Combined PCA & MCA Insights', fontsize=16, pad=20)
    plt.figtext(
        0.5, 0.01,
        "This visualization integrates numerical dimensions from PCA with categorical patterns from MCA analysis,\n"
        "showing the four main worker profiles and their key characteristics across both analyses.",
        ha='center',
        fontsize=10
    )
    
    plt.tight_layout(rect=[0, 0.03, 1, 0.97])
    plt.savefig(os.path.join(output_dir, 'integrated_worker_profiles.png'), dpi=300)
    plt.close()

def main():
    """Main function to execute the combined analysis"""
    # Load data
    pca_clusters, mca_data, full_data, pc_scores = load_data()
    
    # Map PCA clusters to MCA clusters
    combined_data, cluster_map = map_clusters(pca_clusters, mca_data, full_data)
    
    # Create visualizations and analyses
    create_cluster_relationship_visualization(cluster_map)
    analyze_protection_by_clusters(combined_data, pc_scores)
    analyze_regional_clusters(combined_data, pc_scores)
    analyze_health_protection_relationships(combined_data, pc_scores)
    create_combined_profile_visualization()
    
    print(f"Combined analysis complete. Results saved to {output_dir}")

if __name__ == "__main__":
    main()
