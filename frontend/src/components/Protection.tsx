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
        "Significant variations in protection equipment usage with clear hierarchy",
        "Head coverings most commonly used (70-80% 'toujours' in some clusters)",
        "Respiratory protection critically low (70% never use masks despite pesticide exposure)",
        "Boots show moderate and variable adoption (23-100% depending on cluster)",
        "Waterproof coats least utilized (80-97% 'jamais' in most clusters)"
      ]
    },
    {
      icon: <ClusterOutlined className="text-blue-600 text-3xl" />,
      title: "Protection Behavior Clusters",
      details: [
        "Enhanced Cluster 0 (36.2% of sample): Younger workers with 8.5% higher protection scores",
        "Enhanced Cluster 1 (30.0% of sample): Older workers with minimal protection (2.2% below average)",
        "Enhanced Cluster 2 (2.5% of sample): Elderly workers with lowest protection levels (20.0% below average)",
        "Enhanced Cluster 3 (31.2% of sample): Mid-age workers with family burden showing 6.1% below average protection"
      ]
    },
    {
      icon: <UserOutlined className="text-purple-600 text-3xl" />,
      title: "Individual Risk Factors",
      details: [
        "Education strongly predicts protection behavior (p=0.188, F=1.64), with illiterate showing 20% lower rates",
        "Age correlates negatively with protection (F=1.26, p=0.291) despite higher risk awareness",
        "Number of children significantly impacts protection (p=0.048, F=2.76, strongest demographic predictor)",
        "Husband's profession decisive factor: 100% better protection when husband is 'agriculteur'"
      ]
    },
    {
      icon: <GlobalOutlined className="text-red-600 text-3xl" />,
      title: "Regional Protection Variations",
      details: [
        "Monastir: Polarized protection patterns - either very good or very poor, education effect strongest",
        "Sfax: Consistently low protection, 80-100% in Clusters 1, 3, 5 with poorest equipment usage",
        "Mahdia: 100% in Cluster 9, 90% 'camion non protégé', 0% mask usage despite 80% pesticide exposure",
        "Socioeconomic gradient: 'Bas' (30%) vs 'Moyen' (45%) vs 'Bon' (20%) with distinct protection behaviors"
      ]
    }
  ];

  const protectionEquipmentData = [
    {
      equipment: "Masks",
      usage: "Extremely Low (70% never use, only 7.7% frequent use despite 63% pesticide exposure)",
      criticalAreas: "Pesticide Application (92.3% in Cluster 0 report no mask use)",
      recommendedImprovement: "Mandatory Respiratory Protection with education on invisible risks"
    },
    {
      equipment: "Gloves",
      usage: "Moderate (61.5% never use, 30.8% use 'souvent' with regional variation)",
      criticalAreas: "Chemical Handling and Application Tasks",
      recommendedImprovement: "Standardized Dermal Protection with task-specific designs"
    },
    {
      equipment: "Boots",
      usage: "Moderate (76.9% never use, 23.1% use 'souvent', task-dependent)",
      criticalAreas: "Muddy/wet conditions, physical hazards",
      recommendedImprovement: "Task-specific ergonomic design with better accessibility"
    },
    {
      equipment: "Head Protection",
      usage: "Highest Among Protection Items (70-80% 'toujours' in some clusters)",
      criticalAreas: "Sun Exposure (visible immediate discomfort prioritized)",
      recommendedImprovement: "Comprehensive Thermal Protection with education on importance"
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
              <li>🛡️ Mask usage: 70% never use despite 63% pesticide exposure</li>
              <li>📊 Protection hierarchy: head {'>'} extremities {'>'} respiratory</li>
              <li>🌍 Children impact: strongest demographic predictor (p=0.048)</li>
              <li>🔬 Education effect: 13.6% higher protection with secondary education</li>
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