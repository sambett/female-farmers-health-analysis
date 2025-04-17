import React from 'react';
import { 
  UserOutlined, 
  ClusterOutlined, 
  SafetyOutlined, 
  ProjectOutlined 
} from '@ant-design/icons';

const Overview: React.FC = () => {
  const keyInsights = [
    {
      icon: <ClusterOutlined className="text-blue-600 text-3xl" />,
      title: "Four Distinct Worker Profiles",
      description: "Identified through integrated PCA and MCA analysis, capturing 63.1% of total variance in numerical variables, revealing distinct risk profiles.",
      details: [
        "Enhanced Cluster 0 (36.2% of sample): Younger workers (38.5 years), higher education (58.6% secondary), better protection (8.5% above average)",
        "Enhanced Cluster 1 (30.0% of sample): Older workers (59.3 years), extensive experience (27.8 years), higher work intensity (7.3h/day)",
        "Enhanced Cluster 2 (2.5% of sample): Elderly workers (67 years), 42.5 years experience, severe cardiovascular indicators (GAD 2.02, 91.4% above average)",
        "Enhanced Cluster 3 (31.2% of sample): Mid-age workers (43.9 years) with higher family burden (3.1 children, 49.2% more dependents)"
      ]
    },
    {
      icon: <SafetyOutlined className="text-green-600 text-3xl" />,
      title: "Age-Experience-Protection Paradox",
      description: "Contrary to expectations, more experienced workers show lower protection levels (20% lower in older groups) despite higher health vulnerabilities (p=0.048).",
      details: [
        "Negative correlation between years of experience and protection scores (F-statistic: 0.40, p=0.807)",
        "Older workers ({'>'}50 years) demonstrate 20% lower protection despite higher cardiovascular risk (TAS 138.3 vs 113.1 mmHg)",
        "Education level strongly predicts protection (p=0.188), with secondary education showing 13.6% higher protection scores"
      ]
    },
    {
      icon: <ProjectOutlined className="text-purple-600 text-3xl" />,
      title: "Regional and Socioeconomic Variations",
      description: "Significant differences in occupational health patterns across regions and socioeconomic groups, persisting after controlling for education and economic status.",
      details: [
        "Monastir (65% of sample): Higher education levels, polarized protection patterns (very good or very poor)",
        "Sfax (25% of sample): Lower protection scores, 80-100% in Clusters 1, 3, and 5, higher pesticide exposure",
        "Mahdia (10% of sample): 100% in Cluster 9, 90% using 'camion non protégé' transportation, 60% seasonal workers",
        "Socioeconomic status: 'Moyen' (45%) and 'Bas' (30%) showing distinct protection behaviors"
      ]
    },
    {
      icon: <UserOutlined className="text-red-600 text-3xl" />,
      title: "Family and Cultural Dynamics",
      description: "Family structure and traditional practices significantly impact occupational health risks, with number of children being the strongest statistical predictor (p=0.048).",
      details: [
        "Higher family responsibilities correlate with reduced self-protection (p=0.048, F-statistic: 2.76)",
        "Tabouna smoke exposure affects 60% of women, with significant impact on respiratory health (p=0.029)",
        "Husband's profession significantly influences protection (100% better protection when husband is 'agriculteur')",
        "Children Category is the most statistically significant determinant of protection behaviors"
      ]
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Agricultural Workers Health Study</h1>
        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Dataset Overview</h2>
            <ul className="space-y-2 text-gray-700">
              <li>📊 81 Female Agricultural Workers</li>
              <li>🌍 Primarily from Monastir Region, Tunisia</li>
              <li>📋 61 Comprehensive Variables</li>
              <li>🔬 Advanced Statistical Analysis</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Research Objectives</h2>
            <ol className="space-y-2 text-gray-700 list-decimal pl-5">
              <li>Identify occupational health determinants</li>
              <li>Analyze working conditions and health correlations</li>
              <li>Develop predictive health risk models</li>
              <li>Create targeted intervention strategies</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">Key Research Insights</h2>
        
        {keyInsights.map((insight, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300 flex items-start space-x-4"
          >
            <div className="flex-shrink-0">{insight.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{insight.title}</h3>
              <p className="text-gray-600 mb-3">{insight.description}</p>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {insight.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-3">Methodological Approach</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Data Preparation</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Comprehensive data cleaning</li>
              <li>Variable standardization</li>
              <li>Advanced encoding techniques</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Statistical Analysis</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Principal Component Analysis (PCA)</li>
              <li>Multiple Correspondence Analysis (MCA)</li>
              <li>Cluster Analysis</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <h3 className="font-bold text-blue-700 mb-2">Key Focus Areas</h3>
            <ul className="list-disc pl-5 text-gray-700 space-y-1">
              <li>Occupational Exposures</li>
              <li>Protection Behaviors</li>
              <li>Health Risk Patterns</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;