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
      prevalence: "Multiple Chemical Types Detected",
      details: [
        "63% exposed to pesticides",
        "47% use chemical fertilizers",
        "29% interact with herbicides",
        "41% exposed to multiple chemical types simultaneously",
        "Significant regional variations in chemical exposure"
      ]
    },
    {
      icon: <CloudOutlined className="text-blue-600 text-3xl" />,
      title: "Traditional Practice Exposures",
      prevalence: "Cultural Risk Factors",
      details: [
        "67% exposed to Tabouna smoke",
        "85.3% in Monastir region show Tabouna exposure",
        "23% use traditional Neffa (snuff)",
        "Higher respiratory risk in traditional practice groups",
        "Compounded health risks from cultural practices"
      ]
    },
    {
      icon: <UserOutlined className="text-green-600 text-3xl" />,
      title: "Physical and Thermal Constraints",
      prevalence: "Widespread Occupational Stress",
      details: [
        "79% report significant physical constraints",
        "Posture-related risks (prolonged bending, heavy lifting)",
        "Thermal exposure: heat (37.2°C in summer) and cold variations",
        "Average work hours: 6.5 hours/day",
        "Seasonal workers face more intense temporal constraints"
      ]
    },
    {
      icon: <GlobalOutlined className="text-purple-600 text-3xl" />,
      title: "Regional Exposure Variations",
      prevalence: "Geographically Distinct Patterns",
      details: [
        "Monastir: High traditional practice exposure",
        "Sfax: Diverse chemical exposure, lower traditional risks",
        "Mahdia: Intense seasonal work, transportation-related exposures",
        "Significant socioeconomic influences on exposure patterns",
        "Protection behaviors vary dramatically by region"
      ]
    }
  ];

  const detailedExposureTable = [
    {
      category: "Pesticides",
      frequency: "63% of Workers",
      primaryRoutes: "Respiratory, Dermal",
      mostAffectedRegion: "Sfax",
      majorRisks: "Respiratory, Neurological Disorders"
    },
    {
      category: "Chemical Fertilizers",
      frequency: "47% of Workers",
      primaryRoutes: "Dermal, Potential Ingestion",
      mostAffectedRegion: "Monastir",
      majorRisks: "Skin Irritation, Long-term Health Effects"
    },
    {
      category: "Herbicides",
      frequency: "29% of Workers",
      primaryRoutes: "Respiratory, Dermal",
      mostAffectedRegion: "Mixed (Primarily Sfax)",
      majorRisks: "Neurological Complications"
    },
    {
      category: "Tabouna Smoke",
      frequency: "67% of Workers",
      primaryRoutes: "Respiratory",
      mostAffectedRegion: "Monastir (85.3%)",
      majorRisks: "Chronic Respiratory Issues"
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
              <li>🧪 Comprehensive Chemical Exposure Assessment</li>
              <li>📊 Multi-Dimensional Risk Profiling</li>
              <li>🌍 Regional Exposure Variations</li>
              <li>🔬 Advanced Exposure Tracking</li>
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