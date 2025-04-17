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
        "Principal Component Analysis (PCA) revealed 4 key dimensions capturing 63.1% of total variance",
        "PC1 (23.6%): Age/Experience Factor - captures age (loading 0.87) and experience (loading 0.77)",
        "PC2 (16.1%): Family Structure Factor - captures number of children and dependents",
        "PC3 (13.5%): Cardiovascular Health Factor - blood pressure indicators",
        "PC4 (9.9%): Work Intensity Factor - hours and days worked"
      ]
    },
    {
      icon: <PieChartOutlined className="text-green-600 text-3xl" />,
      title: "Cluster Analysis Findings",
      details: [
        "Identified 10 distinct worker risk clusters through MCA explaining 25.5% variance in first two dimensions",
        "4 primary worker profiles based on PCA dimensions with silhouette score of 0.68",
        "High-Risk Profiles (50% of sample) with 91-100% permanent workers and 73-92% never using masks",
        "Moderate-Protection Profiles (35%) and Higher-Protection Profiles (15%) with distinct patterns"
      ]
    },
    {
      icon: <BarChartOutlined className="text-purple-600 text-3xl" />,
      title: "Correlation and Risk Mapping",
      details: [
        "Strong correlations between age and experience (r=0.68, p{'<'}0.001), age and systolic pressure (r=0.44, p{'<'}0.001)",
        "BMI strongly associated with age groups (p=0.028) and walking as transportation (p=0.037)",
        "Children impact protection (p=0.048, F=2.76), most significant demographic factor",
        "Traditional Tabouna smoke exposure correlates with respiratory issues (p=0.029)"
      ]
    },
    {
      icon: <CloudOutlined className="text-red-600 text-3xl" />,
      title: "Advanced Statistical Techniques",
      details: [
        "Multiple Correspondence Analysis (MCA) uncovered 10 significant dimensions with two explaining 25.5% variance",
        "Integrated ANOVA analysis confirmed significant differences in protection by demographic (p{'<'}0.05)",
        "Machine learning risk model achieves robust prediction using hybrid knowledge-enhanced approach",
        "Cross-validated statistical findings with 5-fold validation for reliability"
      ]
    }
  ];

  const statisticalMethodsTable = [
    {
      method: "Principal Component Analysis (PCA)",
      keyFindings: "Identified 4 core health and work dimensions with eigenvalues {'>'}1",
      varianceExplained: "63.1% of total numerical variance",
      primaryInsights: "Age (0.87), experience (0.77), family structure (0.70) strongest loadings"
    },
    {
      method: "Multiple Correspondence Analysis (MCA)",
      keyFindings: "10 distinct worker risk clusters with clear separation",
      varianceExplained: "25.5% variance in first two dimensions",
      primaryInsights: "Regional profiles: Monastir (65%), Sfax (25%), Mahdia (10%) distinct patterns"
    },
    {
      method: "Cluster Analysis",
      keyFindings: "4 primary worker profile groups with silhouette score 0.68",
      varianceExplained: "Strong cluster separation confirmed",
      primaryInsights: "Cluster 0 (36.2%): younger, educated; Cluster 1 (30.0%): older, high-intensity"
    },
    {
      method: "Predictive Risk Modeling",
      keyFindings: "Comprehensive risk assessment using Random Forest Regressor (100 trees, max_depth=10)",
      varianceExplained: "Feature importance extraction for explainability",
      primaryInsights: "Children category (p=0.048) and Tabouna exposure (p=0.029) top predictors"
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