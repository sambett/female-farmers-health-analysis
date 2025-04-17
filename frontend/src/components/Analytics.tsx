import React from 'react';
import { 
  LineChartOutlined, 
  PieChartOutlined, 
  BarChartOutlined, 
  CloudOutlined 
} from '@ant-design/icons';

const Analytics: React.FC = () => {
  const analyticsInsights = [
    {
      icon: <LineChartOutlined className="text-blue-600 text-3xl" />,
      title: "Multivariate Analysis Insights",
      details: [
        "Principal Component Analysis (PCA) revealed 4 key dimensions",
        "63% of variance explained by key numerical variables",
        "Age and experience strongly correlate with health outcomes",
        "Family structure impacts occupational risk profiles"
      ]
    },
    {
      icon: <PieChartOutlined className="text-green-600 text-3xl" />,
      title: "Cluster Analysis Findings",
      details: [
        "Identified 10 distinct worker risk clusters through MCA",
        "4 primary worker profiles based on PCA dimensions",
        "Significant variations in health and protection behaviors",
        "Regional and socioeconomic factors create unique risk patterns"
      ]
    },
    {
      icon: <BarChartOutlined className="text-purple-600 text-3xl" />,
      title: "Correlation and Risk Mapping",
      details: [
        "Strong correlations between age, work experience, and health risks",
        "Protection behaviors show complex relationship with demographics",
        "Socioeconomic status significantly modulates health outcomes",
        "Cultural practices create additional risk dimensions"
      ]
    },
    {
      icon: <CloudOutlined className="text-red-600 text-3xl" />,
      title: "Advanced Statistical Techniques",
      details: [
        "Multiple Correspondence Analysis (MCA) uncovered hidden patterns",
        "Integration of quantitative and categorical variable analysis",
        "Developed predictive risk profiling methodology",
        "Identified compound risk factors across multiple dimensions"
      ]
    }
  ];

  const statisticalMethodsTable = [
    {
      method: "Principal Component Analysis (PCA)",
      keyFindings: "Identified 4 core health and work dimensions",
      varianceExplained: "63% of total variance",
      primaryInsights: "Age, experience, family structure impact health"
    },
    {
      method: "Multiple Correspondence Analysis (MCA)",
      keyFindings: "10 distinct worker risk clusters",
      varianceExplained: "Categorical variable relationships",
      primaryInsights: "Regional and socioeconomic risk variations"
    },
    {
      method: "Cluster Analysis",
      keyFindings: "4 primary worker profile groups",
      varianceExplained: "Risk profile differentiation",
      primaryInsights: "Protection behavior and health risk correlations"
    },
    {
      method: "Predictive Risk Modeling",
      keyFindings: "Comprehensive risk assessment framework",
      varianceExplained: "Multidimensional risk prediction",
      primaryInsights: "Targeted intervention strategies"
    }
  ];

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Advanced Statistical Analysis</h1>
        <div className="grid md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Key Analytical Metrics</h2>
            <ul className="space-y-2 text-gray-700">
              <li>📊 Comprehensive Statistical Modeling</li>
              <li>🔬 Advanced Dimensional Analysis</li>
              <li>🌍 Multi-Dimensional Risk Profiling</li>
              <li>📈 Predictive Health Risk Assessment</li>
            </ul>
          </div>
          <div>
            <h2 className="text-xl font-semibold text-blue-700 mb-2">Research Analytical Objectives</h2>
            <ol className="space-y-2 text-gray-700 list-decimal pl-5">
              <li>Uncover hidden risk patterns</li>
              <li>Develop predictive risk models</li>
              <li>Analyze multidimensional health factors</li>
              <li>Create targeted intervention strategies</li>
            </ol>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 border-b-2 border-blue-500 pb-2">Analytical Insights</h2>
        
        {analyticsInsights.map((insight, index) => (
          <div 
            key={index} 
            className="bg-white border border-gray-200 rounded-lg p-5 hover:shadow-md transition-shadow duration-300 flex items-start space-x-4"
          >
            <div className="flex-shrink-0">{insight.icon}</div>
            <div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">{insight.title}</h3>
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
        <h2 className="text-xl font-semibold text-blue-800 mb-4">Statistical Methods Breakdown</h2>
        <div className="overflow-x-auto">
          <table className="w-full bg-white rounded-lg shadow-sm">
            <thead className="bg-blue-100">
              <tr>
                <th className="p-3 text-left">Statistical Method</th>
                <th className="p-3 text-left">Key Findings</th>
                <th className="p-3 text-left">Variance Explained</th>
                <th className="p-3 text-left">Primary Insights</th>
              </tr>
            </thead>
            <tbody>
              {statisticalMethodsTable.map((method, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="p-3 font-medium">{method.method}</td>
                  <td className="p-3">{method.keyFindings}</td>
                  <td className="p-3">{method.varianceExplained}</td>
                  <td className="p-3">{method.primaryInsights}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Analytics;