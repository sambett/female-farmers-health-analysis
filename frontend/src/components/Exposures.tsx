import React from 'react';
import { 
  ExperimentOutlined, 
  CloudOutlined, 
  UserOutlined, 
  GlobalOutlined 
} from '@ant-design/icons';

const Exposures: React.FC = () => {
  const exposureProfiles = [
    {
      icon: <ExperimentOutlined className="text-red-600 text-3xl" />,
      title: "Chemical Exposure Patterns",
      prevalence: "41% Exposed to Multiple Chemicals",
      details: [
        "63% exposed to pesticides, with 92.3% in Cluster 0 reporting regular use",
        "47% use chemical fertilizers, significantly higher in Monastir region (p=0.013)",
        "29% interact with herbicides, with 80-100% of these workers in Sfax clusters",
        "41% exposed to multiple chemical types simultaneously, showing 2.7x higher risk (OR 2.7, 95% CI 1.4-5.2)",
        "Severe regional variations: Sfax shows 73% higher chemical diversity than Mahdia (p<0.001)"
      ]
    },
    {
      icon: <CloudOutlined className="text-blue-600 text-3xl" />,
      title: "Traditional Practice Exposures",
      prevalence: "67% Exposed to Tabouna Smoke",
      details: [
        "67% exposed to Tabouna smoke overall, 60% in the broader study population",
        "85.3% in Monastir region show Tabouna exposure vs. 40% in Sfax (p<0.001)",
        "23% use traditional Neffa (snuff), contributing to additional oral health risks",
        "Tabouna exposure significantly impacts respiratory health (p=0.029)",
        "Combined exposure (Tabouna + chemicals) shows synergistic effects (interaction term p=0.017)"
      ]
    },
    {
      icon: <UserOutlined className="text-green-600 text-3xl" />,
      title: "Physical and Thermal Constraints",
      prevalence: "79% Report Significant Physical Constraints",
      details: [
        "79% report significant physical constraints with biomechanical and postural strain",
        "Falls represent most common accident mechanism (35%), followed by cuts (25%)",
        "Thermal constraints: 65% heat exposure, 10% cold, 20% both heat and cold",
        "Average work hours: 40.6 hours/week (range: 6-77 hours), 27.5% work >50 hours/week",
        "Seasonal workers (25% of population) face 23% more intense temporal constraints (p=0.032)"
      ]
    },
    {
      icon: <GlobalOutlined className="text-purple-600 text-3xl" />,
      title: "Regional Exposure Variations",
      prevalence: "Distinct Regional Risk Profiles (p<0.001)",
      details: [
        "Monastir (65% of sample): 85.3% Tabouna exposure, 64-100% in Clusters 4, 7, 8",
        "Sfax (25% of sample): 80-100% in Clusters 1, 3, 5, diverse chemical profile",
        "Mahdia (10% of sample): 100% in Cluster 9, 90% using 'camion non protégé', 60% seasonal",
        "Socioeconomic gradient: 'Bas' (30%) shows 36.9% higher risky exposures than 'Bon' (20%)",
        "Protection usage by region: Monastir polarized pattern, Sfax consistently low, Mahdia prioritizes head protection only"
      ]
    }
  ];

  const detailedExposureTable = [
    {
      category: "Pesticides",
      frequency: "63% of Workers, 92.3% in Cluster 0",
      primaryRoutes: "Respiratory (73-92% never use masks), Dermal",
      mostAffectedRegion: "Sfax (80-100% in Clusters 1, 3, 5)",
      majorRisks: "Respiratory issues (OR 2.1), Neurological disorders (OR 2.7, 95% CI 1.4-5.2)"
    },
    {
      category: "Chemical Fertilizers",
      frequency: "47% of Workers, with significant regional variation (p=0.013)",
      primaryRoutes: "Dermal (61.5% never use gloves), Potential Ingestion",
      mostAffectedRegion: "Monastir (56.3% vs 38.4% in other regions)",
      majorRisks: "Skin Irritation (35% of workers), Long-term Health Effects"
    },
    {
      category: "Herbicides",
      frequency: "29% of Workers, with 41% exposed to multiple chemical types",
      primaryRoutes: "Respiratory (92.3% never use masks for herbicides), Dermal",
      mostAffectedRegion: "Sfax (76.9% of herbicide users from this region)",
      majorRisks: "Neurological Complications (p=0.008 association with cognitive symptoms)"
    },
    {
      category: "Tabouna Smoke",
      frequency: "67% of Workers overall, 60% in broader study",
      primaryRoutes: "Respiratory (significant impact p=0.029)",
      mostAffectedRegion: "Monastir (85.3% vs. 40% in Sfax, p<0.001)",
      majorRisks: "Chronic Respiratory Issues (OR 2.3), exacerbated by chemical exposure"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Occupational Exposures Analysis</h1>
        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Key Exposure Metrics</h2>
            <ul className="space-y-2 text-gray-700">
              <li>🧪 Chemical: 63% pesticides, 47% fertilizers, 29% herbicides, 41% multiple</li>
              <li>📊 Traditional: 67% Tabouna smoke, regional variation p{'<'}0.001</li>
              <li>🌍 Physical: 79% significant constraints, 65% heat exposure</li>
              <li>🔬 Temporal: 40.6 hrs/week average, 27.5% work {'>'}50 hrs/week</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Research Objectives</h2>
            <ol className="space-y-2 text-gray-700 list-decimal pl-5">
              <li>Identify primary exposure routes</li>
              <li>Quantify chemical and environmental risks</li>
              <li>Analyze regional exposure patterns</li>
              <li>Develop targeted protection strategies</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">Exposure Risk Profiles</h2>
        
        {exposureProfiles.map((profile, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300 flex items-start space-x-4"
          >
            <div className="flex-shrink-0">{profile.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {profile.title}
                <span className="text-sm text-gray-500 ml-2">({profile.prevalence})</span>
              </h3>
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
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Detailed Exposure Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 text-left">Exposure Category</th>
                <th className="p-3 text-left">Frequency</th>
                <th className="p-3 text-left">Primary Exposure Routes</th>
                <th className="p-3 text-left">Most Affected Region</th>
                <th className="p-3 text-left">Major Health Risks</th>
              </tr>
            </thead>
            <tbody>
              {detailedExposureTable.map((exposure, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{exposure.category}</td>
                  <td className="p-3">{exposure.frequency}</td>
                  <td className="p-3">{exposure.primaryRoutes}</td>
                  <td className="p-3">{exposure.mostAffectedRegion}</td>
                  <td className="p-3">{exposure.majorRisks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Exposures;