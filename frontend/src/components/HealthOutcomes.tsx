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
      prevalence: "45% of Workers",
      details: [
        "Higher blood pressure in older clusters: TAS 138.3 mmHg in Cluster 1 (11.0% above average)",
        "Systolic blood pressure correlates with age (r=0.44, p<0.001) and BMI (r=0.39, p=0.003)",
        "Severe cardiovascular risk in Cluster 2: GAD 2.02 (91.4% above average), abnormal TAD 35.0 mmHg",
        "Tabouna smoke exposure (67% of workers) significantly impacts respiratory health (p=0.029)"
      ]
    },
    {
      icon: <MedicineBoxOutlined className="text-purple-600 text-3xl" />,
      title: "Neurological and Cognitive Issues",
      prevalence: "25% of Workers report cognitive issues",
      details: [
        "Memory and concentration issues most common in workers >50 years (p=0.041)",
        "Strong association with pesticide exposure (odds ratio 2.7, 95% CI: 1.4-5.2)",
        "100% of Enhanced Cluster 2 (elderly workers) report cognitive symptoms",
        "Exacerbated by work intensity: 27.5% work >50 hours/week, showing higher symptom prevalence"
      ]
    },
    {
      icon: <AimOutlined className="text-green-600 text-3xl" />,
      title: "Skin and Dermatological Problems",
      prevalence: "35% of Workers report skin issues",
      details: [
        "Chemical exposure primary driver: 92.3% with skin issues report no glove use",
        "Regional variation: 80-100% of Sfax workers in Clusters 1, 3, 5 with higher incidence",
        "Strong inverse correlation with protective equipment usage (r=-0.56, p<0.001)",
        "41% exposed to multiple chemical types show significantly higher rates (p=0.017)"
      ]
    },
    {
      icon: <RadarChartOutlined className="text-blue-600 text-3xl" />,
      title: "Regional Health Variations",
      prevalence: "Geographically Distinct",
      details: [
        "Monastir (65% of sample): 85.3% Tabouna exposure with associated respiratory issues (OR 2.3)",
        "Sfax (25% of sample): Higher pesticide use (p=0.013) with elevated dermatological issues (35% vs 19%)",
        "Mahdia (10% of sample): 90% transportation risks ('camion non protégé'), 60% higher back pain incidence",
        "Socioeconomic gradient: 'Bas' status shows 31.2% higher health complaints than 'Bon' status (p=0.008)"
      ]
    }
  ];

  const riskFactorsTable = [
    {
      factor: "Pesticide Exposure",
      impact: "High respiratory (OR 2.1) and neurological risks (OR 2.7)",
      prevalence: "63% of Workers, with 41% exposed to multiple types",
      mostAffectedGroup: "91-100% of permanent workers in Clusters 0 and 1 (primarily Sfax)"
    },
    {
      factor: "Chemical Fertilizers",
      impact: "Skin irritations (35% of workers), potential long-term effects",
      prevalence: "47% of Workers use chemical fertilizers",
      mostAffectedGroup: "Cluster 0: 92.3% report no protective gloves despite chemical exposure"
    },
    {
      factor: "Physical Constraints",
      impact: "Musculoskeletal strain, fatigue, work-related injuries (30% report accidents)",
      prevalence: "79% report significant physical constraints, 27.5% work >50 hours/week",
      mostAffectedGroup: "Cluster 1: 7.3 hours/day (18.2% above average), 6.9 days/week (6.2% above average)"
    },
    {
      factor: "Traditional Practices",
      impact: "Respiratory issues (p=0.029) and thermal stress (65% report heat exposure)",
      prevalence: "67% exposed to Tabouna smoke, 60% in overall study",
      mostAffectedGroup: "Monastir region workers (85.3% exposure rate, significantly higher than other regions)"
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
              <li>🏥 BMI: 75% above normal range, 42.5% obese (BMI {'>'}30)</li>
              <li>📊 Blood Pressure: Mean TAS 124.6 mmHg, TAD 73.8 mmHg</li>
              <li>🔍 Health Issues: 45% respiratory, 35% skin, 25% cognitive</li>
              <li>🌐 Significant regional variations (p{'<'}0.05 across health domains)</li>
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