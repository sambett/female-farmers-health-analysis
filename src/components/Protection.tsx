import React from 'react';
import { 
  SafetyOutlined, 
  ClusterOutlined, 
  UserOutlined, 
  GlobalOutlined 
} from '@ant-design/icons';

const Protection: React.FC = () => {
  const protectionProfiles = [
    {
      icon: <SafetyOutlined className="text-green-600 text-3xl" />,
      title: "Equipment Usage Patterns",
      details: [
        "Significant variations in protection equipment usage",
        "Head coverings most commonly used",
        "Respiratory protection critically low",
        "Boots show moderate adoption",
        "Waterproof coats least utilized"
      ]
    },
    {
      icon: <ClusterOutlined className="text-blue-600 text-3xl" />,
      title: "Protection Behavior Clusters",
      details: [
        "Enhanced Cluster 0: Younger workers with higher protection scores",
        "Enhanced Cluster 1: Older workers with minimal protection",
        "Enhanced Cluster 2: Elderly workers with lowest protection levels",
        "Enhanced Cluster 3: Mid-age workers with family-related protection challenges"
      ]
    },
    {
      icon: <UserOutlined className="text-purple-600 text-3xl" />,
      title: "Individual Risk Factors",
      details: [
        "Education strongly predicts protection behavior",
        "Age moderates protection effectiveness",
        "Family responsibilities impact protection choices",
        "Husband's profession influences protection awareness"
      ]
    },
    {
      icon: <GlobalOutlined className="text-red-600 text-3xl" />,
      title: "Regional Protection Variations",
      details: [
        "Monastir: Higher education correlates with better protection",
        "Sfax: Minimal protection awareness",
        "Mahdia: Transportation-related protection challenges",
        "Significant socioeconomic influences on protection behaviors"
      ]
    }
  ];

  const protectionEquipmentData = [
    {
      equipment: "Masks",
      usage: "Extremely Low (7.7% frequent use)",
      criticalAreas: "Pesticide Exposure Zones",
      recommendedImprovement: "Mandatory Respiratory Protection"
    },
    {
      equipment: "Gloves",
      usage: "Moderate (Variable by Region)",
      criticalAreas: "Chemical Handling",
      recommendedImprovement: "Standardized Dermal Protection"
    },
    {
      equipment: "Boots",
      usage: "Moderate (Task-Specific)",
      criticalAreas: "Physical Strain Reduction",
      recommendedImprovement: "Ergonomic Design"
    },
    {
      equipment: "Head Protection",
      usage: "Highest Among Protection Items",
      criticalAreas: "Sun Exposure",
      recommendedImprovement: "Comprehensive Thermal Protection"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Protection Equipment Analysis</h1>
        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Key Protection Metrics</h2>
            <ul className="space-y-2 text-gray-700">
              <li>🛡️ Comprehensive Protection Assessment</li>
              <li>📊 Multi-Dimensional Risk Analysis</li>
              <li>🌍 Regional Protection Variations</li>
              <li>🔬 Targeted Improvement Strategies</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Research Objectives</h2>
            <ol className="space-y-2 text-gray-700 list-decimal pl-5">
              <li>Identify protection behavior patterns</li>
              <li>Analyze regional protection differences</li>
              <li>Understand individual risk factors</li>
              <li>Develop targeted protection strategies</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">Protection Risk Profiles</h2>
        
        {protectionProfiles.map((profile, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300 flex items-start space-x-4"
          >
            <div className="flex-shrink-0">{profile.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{profile.title}</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {profile.details.map((detail, i) => (
                  <li key={i}>{detail}</li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 bg-blue-50 p-4 rounded-lg">
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Detailed Protection Equipment Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 text-left">Equipment</th>
                <th className="p-3 text-left">Usage Pattern</th>
                <th className="p-3 text-left">Critical Areas</th>
                <th className="p-3 text-left">Recommended Improvement</th>
              </tr>
            </thead>
            <tbody>
              {protectionEquipmentData.map((item, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{item.equipment}</td>
                  <td className="p-3">{item.usage}</td>
                  <td className="p-3">{item.criticalAreas}</td>
                  <td className="p-3">{item.recommendedImprovement}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Protection;