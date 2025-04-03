import React from 'react';
import { 
  HeartOutlined, 
  MedicineBoxOutlined, 
  AimOutlined, 
  RadarChartOutlined 
} from '@ant-design/icons';

const HealthOutcomes: React.FC = () => {
  const healthRiskProfiles = [
    {
      icon: <HeartOutlined className="text-red-600 text-3xl" />,
      title: "Cardio-Respiratory Risks",
      prevalence: "37% of Workers",
      details: [
        "Higher blood pressure in older worker clusters",
        "Systolic blood pressure (TAS) correlates with age and experience",
        "Elevated risk in Enhanced Clusters 1 and 2",
        "Tabouna smoke exposure amplifies respiratory risks"
      ]
    },
    {
      icon: <MedicineBoxOutlined className="text-purple-600 text-3xl" />,
      title: "Neurological and Cognitive Issues",
      prevalence: "29% of Workers",
      details: [
        "Cognitive complaints more prevalent in older age groups",
        "Correlation with long-term chemical exposure",
        "Highest in Enhanced Cluster 2 (elderly workers)",
        "Potential link to cumulative occupational stress"
      ]
    },
    {
      icon: <AimOutlined className="text-green-600 text-3xl" />,
      title: "Skin and Dermatological Problems",
      prevalence: "41% of Workers",
      details: [
        "Chemical exposure primary driver of skin issues",
        "Higher in regions with intensive pesticide use (Sfax)",
        "Correlation with inadequate protective equipment",
        "More pronounced in workers with multiple chemical exposures"
      ]
    },
    {
      icon: <RadarChartOutlined className="text-blue-600 text-3xl" />,
      title: "Regional Health Variations",
      prevalence: "Geographically Distinct",
      details: [
        "Monastir: Higher respiratory issues, Tabouna smoke impact",
        "Sfax: Predominant skin and chemical exposure problems",
        "Mahdia: More musculoskeletal and fatigue-related complaints",
        "Socioeconomic status modulates health risk manifestation"
      ]
    }
  ];

  const riskFactorsTable = [
    {
      factor: "Pesticide Exposure",
      impact: "High respiratory and neurological risks",
      prevalence: "63% of Workers",
      mostAffectedGroup: "Permanent workers in Sfax"
    },
    {
      factor: "Chemical Fertilizers",
      impact: "Skin irritations, potential long-term effects",
      prevalence: "47% of Workers",
      mostAffectedGroup: "Workers with multiple chemical exposures"
    },
    {
      factor: "Physical Constraints",
      impact: "Musculoskeletal strain, fatigue",
      prevalence: "79% report significant physical constraints",
      mostAffectedGroup: "Older workers, seasonal laborers"
    },
    {
      factor: "Traditional Practices",
      impact: "Respiratory and thermal stress",
      prevalence: "67% exposed to Tabouna smoke",
      mostAffectedGroup: "Monastir region workers"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Health Outcomes Analysis</h1>
        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Key Health Metrics</h2>
            <ul className="space-y-2 text-gray-700">
              <li>🏥 Comprehensive Health Assessment</li>
              <li>📊 Statistically Significant Findings</li>
              <li>🔍 Multi-Dimensional Risk Analysis</li>
              <li>🌐 Regional Health Variations</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Primary Research Focus</h2>
            <ol className="space-y-2 text-gray-700 list-decimal pl-5">
              <li>Identify specific health risk profiles</li>
              <li>Understand occupational exposure impacts</li>
              <li>Analyze regional health disparities</li>
              <li>Develop targeted intervention strategies</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">Health Risk Profiles</h2>
        
        {healthRiskProfiles.map((profile, index) => (
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
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Risk Factors Detailed Analysis</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 text-left">Risk Factor</th>
                <th className="p-3 text-left">Health Impact</th>
                <th className="p-3 text-left">Prevalence</th>
                <th className="p-3 text-left">Most Affected Group</th>
              </tr>
            </thead>
            <tbody>
              {riskFactorsTable.map((risk, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{risk.factor}</td>
                  <td className="p-3">{risk.impact}</td>
                  <td className="p-3">{risk.prevalence}</td>
                  <td className="p-3">{risk.mostAffectedGroup}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default HealthOutcomes;