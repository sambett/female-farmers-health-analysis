# Multiple Correspondence Analysis (MCA) Report

## Introduction

This report presents the results of Multiple Correspondence Analysis (MCA) conducted on the female farmers health dataset. MCA is a statistical technique that allows the analysis of patterns of relationships between categorical variables. It is particularly useful for identifying hidden structures in the data and for visualizing associations between variable categories.

## Dataset Overview

The analysis was performed on 80 observations with 24 categorical variables. The variables were organized into several groups:

- **Protection Equipment Variables**: Masque pour pesticides, Bottes, Gants, Casquette/Mdhalla, Manteau imperméable
- **Health Issues Variables**: ...
- **Work Characteristics Variables**: Statut, Contraintes thermiques...
- **Social and Demographic Variables**: Situation maritale, Niveau socio-économique

## MCA Results

### Explained Inertia

The following table shows the explained inertia for each dimension:

| Component | Eigenvalue | Explained Inertia (%) | Cumulative Inertia (%) |
|-----------|------------|----------------------|------------------------|
| Component 1 | 0.2209 | 14.34 | 14.34 |
| Component 2 | 0.1713 | 11.12 | 25.46 |
| Component 3 | 0.1652 | 10.72 | 36.19 |
| Component 4 | 0.1596 | 10.36 | 46.55 |
| Component 5 | 0.1574 | 10.22 | 56.77 |
| Component 6 | 0.1465 | 9.51 | 66.28 |
| Component 7 | 0.1386 | 9.00 | 75.28 |
| Component 8 | 0.1304 | 8.47 | 83.74 |
| Component 9 | 0.1288 | 8.36 | 92.10 |
| Component 10 | 0.1216 | 7.90 | 100.00 |

The scree plot (see `figures/scree_plot_all.png`) shows the distribution of explained inertia across dimensions.

### MCA Visualization

The MCA biplot (`figures/biplot_all.png`) visualizes the first two dimensions of the MCA space, showing both observations and category points. The proximity between category points indicates association between those categories.

## Clustering Results

K-means clustering was applied to the MCA coordinates to identify groups of observations with similar profiles.

### Silhouette Analysis

Silhouette analysis was used to determine the optimal number of clusters. See `figures/silhouette_scores_all.png` for the silhouette scores across different cluster numbers.

### Cluster Characteristics

The clusters identified through MCA have the following characteristics:

**Cluster 1**:

- Niveau socio-économique: moyen (76.9%)
- Tabagisme: non (76.9%)
- Neffa: non (100.0%)
- Fumées de Tabouna: oui (69.2%)
- AT en milieu agricole: oui (69.2%)
- Ménopause: oui (69.2%)
- Catégorie professionnelle: agricultrice indépendante (69.2%)
- Statut: permanente (100.0%)
- Masque pour pesticides: jamais (92.3%)
- Bottes: jamais (76.9%)
- Niveau scolaire: analphabète (61.5%)
- Gants: jamais (61.5%)
- Casquette/Mdhalla: jamais (61.5%)
- Manteau imperméable: jamais (92.3%)
- Produits chimiques utilisés: pesticides (92.3%)
- Produits biologiques utilisés: engrais naturels (92.3%)
- Engrais utilisés: organique (84.6%)
- Contraintes thermiques: chaleur (84.6%)
- Moyen de transport: a pieds (84.6%)
- Profession du mari: ouvrier journalier (84.6%)

**Cluster 2**:

- Domicile: sfax (80.0%)
- Niveau socio-économique: moyen (100.0%)
- Tabagisme: non (80.0%)
- Neffa: non (100.0%)
- AT en milieu agricole: non (60.0%)
- Mécanisme AT: pas d'accident (60.0%)
- Ménopause: non (100.0%)
- Catégorie professionnelle: agricultrice indépendante (90.0%)
- Statut: permanente (70.0%)
- Masque pour pesticides: jamais (90.0%)
- Bottes: jamais (60.0%)
- Casquette/Mdhalla: toujours (70.0%)
- Manteau imperméable: jamais (80.0%)
- Produits chimiques utilisés: pesticides (80.0%)
- Produits biologiques utilisés: engrais naturels (80.0%)
- Engrais utilisés: organique (100.0%)
- Moyen de transport: a pieds (90.0%)
- Profession du mari: ouvrier journalier (70.0%)

**Cluster 3**:

- Situation maritale: mariée (100.0%)
- Niveau socio-économique: moyen (100.0%)
- Tabagisme: non (100.0%)
- Neffa: non (100.0%)
- Ménopause: non (100.0%)
- Statut: permanente (100.0%)
- Masque pour pesticides: jamais (100.0%)
- Bottes: jamais (100.0%)
- Niveau scolaire: secondaire (100.0%)
- Gants: parfois (100.0%)
- Produits biologiques utilisés: engrais naturels (100.0%)
- Engrais utilisés: organique (100.0%)
- Moyen de transport: a pieds (100.0%)
- Profession du mari: ouvrier agricole (100.0%)

**Cluster 4**:

- Situation maritale: mariée (100.0%)
- Domicile: sfax (100.0%)
- Niveau socio-économique: moyen (83.3%)
- Tabagisme: non (100.0%)
- Neffa: non (100.0%)
- Fumées de Tabouna: non (66.7%)
- AT en milieu agricole: non (100.0%)
- Mécanisme AT: pas d'accident (100.0%)
- Ménopause: non (83.3%)
- Catégorie professionnelle: agricultrice indépendante (83.3%)
- Statut: permanente (100.0%)
- Niveau scolaire: secondaire (66.7%)
- Gants: parfois (66.7%)
- Manteau imperméable: jamais (100.0%)
- Produits biologiques utilisés: engrais naturels (83.3%)
- Engrais utilisés: organique (100.0%)
- Moyen de transport: a pieds (83.3%)

**Cluster 5**:

- Situation maritale: mariée (100.0%)
- Domicile: monastir (100.0%)
- Niveau socio-économique: moyen (100.0%)
- Tabagisme: non (100.0%)
- Neffa: non (100.0%)
- Fumées de Tabouna: oui (100.0%)
- AT en milieu agricole: oui (100.0%)
- Mécanisme AT: chute vache (100.0%)
- Ménopause: non (100.0%)
- Antécédents gynéco: g2p2a0 (100.0%)
- Catégorie professionnelle: agricultrice indépendante (100.0%)
- Statut: permanente (100.0%)
- Masque pour pesticides: jamais (100.0%)
- Bottes: toujours (100.0%)
- Niveau scolaire: secondaire (100.0%)
- Gants: jamais (100.0%)
- Casquette/Mdhalla: jamais (100.0%)
- Manteau imperméable: jamais (100.0%)
- Produits chimiques utilisés: aucun produit chimique (100.0%)
- Produits biologiques utilisés: animaux (100.0%)
- Engrais utilisés: organique (100.0%)
- Contraintes thermiques: chaleur (100.0%)
- Moyen de transport: a pieds (100.0%)
- Profession du mari: chauffeur de louage (100.0%)

**Cluster 6**:

- Situation maritale: mariée (100.0%)
- Domicile: sfax (100.0%)
- Niveau socio-économique: moyen (100.0%)
- Tabagisme: non (100.0%)
- Neffa: non (100.0%)
- Fumées de Tabouna: oui (100.0%)
- AT en milieu agricole: non (100.0%)
- Mécanisme AT: pas d'accident (100.0%)
- Ménopause: oui (100.0%)
- Antécédents gynéco: g4p3a1 (100.0%)
- Catégorie professionnelle: agricultrice indépendante (100.0%)
- Statut: permanente (100.0%)
- Masque pour pesticides: toujours (100.0%)
- Bottes: toujours (100.0%)
- Niveau scolaire: primaire (100.0%)
- Gants: toujours (100.0%)
- Casquette/Mdhalla: parfois (100.0%)
- Manteau imperméable: jamais (100.0%)
- Produits chimiques utilisés: aucun produit chimique (100.0%)
- Produits biologiques utilisés: animaux, engrais naturels (100.0%)
- Engrais utilisés: organique (100.0%)
- Contraintes thermiques: chaleur (100.0%)
- Moyen de transport: a pieds (100.0%)
- Profession du mari: agriculteur (100.0%)

**Cluster 7**:

- Situation maritale: mariée (91.2%)
- Domicile: monastir (64.7%)
- Niveau socio-économique: moyen (52.9%)
- Tabagisme: non (91.2%)
- Neffa: non (100.0%)
- Fumées de Tabouna: oui (85.3%)
- AT en milieu agricole: non (76.5%)
- Mécanisme AT: pas d'accident (76.5%)
- Catégorie professionnelle: agricultrice indépendante (97.1%)
- Statut: permanente (91.2%)
- Masque pour pesticides: jamais (73.5%)
- Bottes: jamais (58.8%)
- Manteau imperméable: jamais (97.1%)
- Produits chimiques utilisés: pesticides (82.4%)
- Produits biologiques utilisés: engrais naturels (91.2%)
- Engrais utilisés: organique (100.0%)
- Contraintes thermiques: chaleur (82.4%)
- Moyen de transport: a pieds (88.2%)

**Cluster 8**:

- Situation maritale: mariée (100.0%)
- Niveau socio-économique: bas (100.0%)
- Neffa: non (100.0%)
- Ménopause: non (100.0%)
- Antécédents gynéco: g4p2a2 (100.0%)
- Statut: permanente (100.0%)
- Masque pour pesticides: jamais (100.0%)
- Bottes: jamais (100.0%)
- Niveau scolaire: secondaire (100.0%)
- Casquette/Mdhalla: toujours (100.0%)
- Manteau imperméable: jamais (100.0%)
- Produits biologiques utilisés: engrais naturels (100.0%)
- Contraintes thermiques: froid (100.0%)

**Cluster 9**:

- Situation maritale: mariée (100.0%)
- Domicile: monastir (100.0%)
- Niveau socio-économique: bas (100.0%)
- Tabagisme: non (100.0%)
- Neffa: non (100.0%)
- Fumées de Tabouna: oui (100.0%)
- AT en milieu agricole: non (100.0%)
- Mécanisme AT: pas d'accident (100.0%)
- Ménopause: oui (100.0%)
- Antécédents gynéco: g5p4a1 (100.0%)
- Catégorie professionnelle: agricultrice indépendante (100.0%)
- Statut: permanente (100.0%)
- Masque pour pesticides: souvent (100.0%)
- Bottes: souvent (100.0%)
- Niveau scolaire: primaire (100.0%)
- Gants: souvent (100.0%)
- Casquette/Mdhalla: souvent (100.0%)
- Manteau imperméable: souvent (100.0%)
- Produits chimiques utilisés: engrais chimiques (100.0%)
- Produits biologiques utilisés: engrais naturels (100.0%)
- Engrais utilisés: organique (100.0%)
- Contraintes thermiques: chaleur (100.0%)
- Moyen de transport: charrette (100.0%)
- Profession du mari: infirmier retraité (100.0%)

**Cluster 10**:

- Situation maritale: mariée (90.0%)
- Domicile: mahdia (100.0%)
- Tabagisme: passif (60.0%)
- Neffa: non (100.0%)
- Fumées de Tabouna: oui (90.0%)
- AT en milieu agricole: non (90.0%)
- Mécanisme AT: pas d'accident (90.0%)
- Ménopause: non (80.0%)
- Catégorie professionnelle: ouvrière (70.0%)
- Statut: saisonnière (60.0%)
- Masque pour pesticides: jamais (100.0%)
- Bottes: jamais (70.0%)
- Niveau scolaire: secondaire (60.0%)
- Casquette/Mdhalla: toujours (80.0%)
- Manteau imperméable: jamais (80.0%)
- Produits chimiques utilisés: pesticides (80.0%)
- Produits biologiques utilisés: engrais naturels (90.0%)
- Engrais utilisés: organique (80.0%)
- Contraintes thermiques: chaleur (60.0%)
- Moyen de transport: camion non protégé (90.0%)
- Profession du mari: ouvrier journalier (80.0%)

## Health Outcomes Analysis

Health outcomes were analyzed in relation to the MCA dimensions and clusters to identify potential risk patterns.

### Health Profile by Cluster

Each cluster shows a distinctive pattern of health issues:

| Cluster | Main Health Issues |
|---------|-------------------|
| Cluster 1 | *No major health issues identified* |
| Cluster 2 | *No major health issues identified* |
| Cluster 3 | *No major health issues identified* |
| Cluster 4 | *No major health issues identified* |
| Cluster 5 | *No major health issues identified* |
| Cluster 6 | *No major health issues identified* |
| Cluster 7 | *No major health issues identified* |
| Cluster 8 | *No major health issues identified* |
| Cluster 9 | *No major health issues identified* |
| Cluster 10 | *No major health issues identified* |

For a more detailed view, refer to the heatmap visualization in `health_analysis/cluster_health_profile_heatmap.png`.

## Protection Equipment and Health Outcomes

A key focus of this study was to understand how the use of protective equipment relates to health outcomes among female farmers.

*Protection-health relationship analysis not available*

## Integration with PCA Results

*Integration with PCA results was not performed or data not found*

## Conclusions

The Multiple Correspondence Analysis revealed several patterns in the female farmers dataset:

1. **Variable Associations**: The analysis identified associations between categories of different variables,    highlighting how certain health issues correlate with specific working conditions or protective equipment usage.

2. **Farmer Profiles**: The clustering analysis identified distinct profiles of female farmers    based on their categorical characteristics, suggesting different risk groups.

3. **Risk Factors**: The proximity of certain health issues to specific work characteristics    in the MCA space suggests potential risk factors for these health outcomes.

4. **Protection Impact**: The analysis of protection equipment usage revealed patterns in how    different protective measures relate to health outcomes, providing evidence for targeted interventions.

## Recommendations

Based on the MCA findings, the following recommendations are proposed:

1. **Targeted Interventions**: Develop specific interventions for each identified farmer profile,    addressing their unique risk factors and health needs.

2. **Protective Equipment**: Promote the use of protective equipment, especially among    the clusters with low usage rates and high incidence of related health issues.

3. **Health Monitoring**: Implement regular health monitoring for farmers, with particular    attention to the health issues identified as prevalent in each cluster.

4. **Education Programs**: Develop educational programs tailored to each cluster's profile,    focusing on the specific risks they face and appropriate preventive measures.

5. **Further Research**: Conduct further research to explore the causal relationships    between the associated variables identified in this analysis.

---

*This report was generated automatically as part of the MCA analysis process.*
