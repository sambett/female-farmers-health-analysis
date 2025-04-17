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
      description: "Identified through integrated PCA and MCA analysis, ranging from younger workers with better protection to older high-risk workers with minimal safety measures.",
      details: [
        "Enhanced Cluster 0: Younger workers (38.5 years), higher education, better protection",
        "Enhanced Cluster 1: Older high-intensity workers (59.3 years), extensive agricultural experience",
        "Enhanced Cluster 2: Elderly high-risk workers (67 years), lowest protection scores",
        "Enhanced Cluster 3: Mid-age workers with higher family burdens"
      ]
    },
    {
      icon: <SafetyOutlined className="text-green-600 text-3xl" />,
      title: "Age-Experience-Protection Paradox",
      description: "Contrary to expectations, more experienced workers show lower protection levels and higher health risks.",
      details: [
        "Negative correlation between years of experience and protection scores",
        "Older workers (>50 years) demonstrate 20% lower protection despite higher health vulnerabilities",
        "Education level more strongly predicts protection behavior than work experience"
      ]
    },
    {
      icon: <ProjectOutlined className="text-purple-600 text-3xl" />,
      title: "Regional and Socioeconomic Variations",
      description: "Significant differences in occupational health patterns across regions and socioeconomic groups.",
      details: [
        "Monastir: Higher education levels, better protection awareness",
        "Sfax: Lower protection scores, more diverse chemical exposures",
        "Mahdia: Higher transportation-related risks, seasonal work patterns",
        "Socioeconomic status strongly correlates with health and protection behaviors"
      ]
    },
    {
      icon: <UserOutlined className="text-red-600 text-3xl" />,
      title: "Family and Cultural Dynamics",
      description: "Family structure and traditional practices significantly impact occupational health risks.",
      details: [
        "Higher family responsibilities correlate with reduced self-protection",
        "Tabouna smoke exposure creates additional health risks",
        "Husband's profession influences wife's protection behaviors",
        "Motherhood shows potential to reinforce safety awareness"
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