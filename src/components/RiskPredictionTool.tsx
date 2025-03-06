import { useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

interface RiskScores {
  respiratoryRisk: number;
  neurologicalRisk: number;
  skinRisk: number;
  cognitiveRisk: number;
  overallRisk: number;
}

const RiskPredictionTool: React.FC = () => {
  const [age, setAge] = useState<number>(40);
  const [workHours, setWorkHours] = useState<number>(8);
  const [experience, setExperience] = useState<number>(10);
  const [pesticidesExposure, setPesticidesExposure] = useState<string>('moderate');
  const [protectionUsage, setProtectionUsage] = useState<string>('sometimes');
  const [socioEconomic, setSocioEconomic] = useState<string>('medium');
  const [employmentType, setEmploymentType] = useState<string>('seasonal');
  const [showResults, setShowResults] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);

  const calculateRiskScores = (): RiskScores => {
    let respiratoryRisk = 20, neurologicalRisk = 15, skinRisk = 18, cognitiveRisk = 12;
    if (age > 50) { respiratoryRisk += 15; neurologicalRisk += 10; cognitiveRisk += 8; }
    if (workHours >= 10) { respiratoryRisk += 12; neurologicalRisk += 10; skinRisk += 8; cognitiveRisk += 10; }
    if (pesticidesExposure === 'high') { respiratoryRisk += 25; neurologicalRisk += 20; skinRisk += 18; cognitiveRisk += 15; }
    if (protectionUsage === 'always') { respiratoryRisk -= 20; neurologicalRisk -= 15; skinRisk -= 16; cognitiveRisk -= 10; }
    if (socioEconomic === 'low') { respiratoryRisk += 10; neurologicalRisk += 8; skinRisk += 7; cognitiveRisk += 6; }
    if (employmentType === 'seasonal') { respiratoryRisk += 8; neurologicalRisk += 5; skinRisk += 7; cognitiveRisk += 4; }
    const expFactor = Math.min(10, experience / 2);
    respiratoryRisk -= expFactor; neurologicalRisk -= expFactor; skinRisk -= expFactor; cognitiveRisk -= expFactor;

    return {
      respiratoryRisk: Math.max(0, Math.min(100, respiratoryRisk)),
      neurologicalRisk: Math.max(0, Math.min(100, neurologicalRisk)),
      skinRisk: Math.max(0, Math.min(100, skinRisk)),
      cognitiveRisk: Math.max(0, Math.min(100, cognitiveRisk)),
      overallRisk: Math.max(0, Math.min(100, (respiratoryRisk + neurologicalRisk + skinRisk + cognitiveRisk) / 4)),
    };
  };

  const handlePredict = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      setShowResults(true);
      setLoading(false);
    }, 1000);
  };

  const riskScores = calculateRiskScores();
  const pieData = [
    { name: 'Safe', value: 100 - riskScores.overallRisk },
    { name: 'Risk', value: riskScores.overallRisk },
  ];
  const barData = [
    { name: 'Respiratory', risk: riskScores.respiratoryRisk },
    { name: 'Neurological', risk: riskScores.neurologicalRisk },
    { name: 'Skin', risk: riskScores.skinRisk },
    { name: 'Cognitive', risk: riskScores.cognitiveRisk },
  ];
  const COLORS = ['#2B6A6E', '#FF6F61'];

  return (
    <div className="p-6 bg-white rounded-lg shadow-md animate-fade-in">
      <h2 className="text-2xl font-bold text-slate mb-6">AI Risk Prediction</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 bg-gray-50 p-4 rounded-lg border-l-4 border-teal">
          <form onSubmit={handlePredict} className="space-y-4">
            {[
              { label: `Age: ${age} yrs`, min: 20, max: 70, value: age, set: setAge },
              { label: `Hours: ${workHours}`, min: 4, max: 14, value: workHours, set: setWorkHours },
              { label: `Exp: ${experience} yrs`, min: 0, max: 40, value: experience, set: setExperience },
            ].map((input, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-slate mb-1">{input.label}</label>
                <input
                  type="range"
                  min={input.min}
                  max={input.max}
                  value={input.value}
                  onChange={(e) => input.set(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-lightSlate rounded-lg appearance-none cursor-pointer accent-teal transition-all hover:scale-105"
                />
              </div>
            ))}
            {[
              { label: 'Pesticides', value: pesticidesExposure, set: setPesticidesExposure, options: ['high', 'moderate', 'low', 'none'] },
              { label: 'Protection', value: protectionUsage, set: setProtectionUsage, options: ['always', 'often', 'sometimes', 'never'] },
              { label: 'Socioeconomic', value: socioEconomic, set: setSocioEconomic, options: ['high', 'medium', 'low'] },
              { label: 'Employment', value: employmentType, set: setEmploymentType, options: ['permanent', 'seasonal'] },
            ].map((select, idx) => (
              <div key={idx}>
                <label className="block text-sm font-medium text-slate mb-1">{select.label}</label>
                <select
                  value={select.value}
                  onChange={(e) => select.set(e.target.value)}
                  className="w-full rounded-md border-lightSlate text-sm text-slate focus:ring-teal focus:border-teal transition-all hover:scale-105"
                >
                  {select.options.map(opt => (
                    <option key={opt} value={opt}>{opt.charAt(0).toUpperCase() + opt.slice(1)}</option>
                  ))}
                </select>
              </div>
            ))}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-2 rounded text-white ${loading ? 'bg-teal/70' : 'bg-teal hover:bg-teal/90'} transition-all hover:scale-105 flex items-center justify-center`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2 text-white" viewBox="0 0 24 24">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" className="opacity-25" />
                    <path fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" className="opacity-75" />
                  </svg>
                  Predicting...
                </>
              ) : 'Predict Risks'}
            </button>
          </form>
        </div>
        <div className="md:col-span-2">
          {showResults ? (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="h-64 bg-white p-4 rounded-lg shadow gradient-border">
                  <h3 className="text-sm font-semibold text-slate mb-2">Overall Risk</h3>
                  <ResponsiveContainer>
                    <PieChart>
                      <Pie data={pieData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} dataKey="value">
                        {pieData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index]} />)}
                      </Pie>
                      <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="h-64 bg-white p-4 rounded-lg shadow gradient-border">
                  <h3 className="text-sm font-semibold text-slate mb-2">Risk Breakdown</h3>
                  <ResponsiveContainer>
                    <BarChart data={barData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip contentStyle={{ backgroundColor: '#2D3748', color: 'white', borderRadius: '0.5rem' }} />
                      <Bar dataKey="risk" fill="#FF6F61" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
              <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-teal">
                <h3 className="font-bold mb-2">Key Risk Factors</h3>
                <ul className="space-y-2">
                  {pesticidesExposure === 'high' && (
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center mr-2">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l7 7a1 1 0 01-1.414 1.414L10 5.414 3.707 11.707a1 1 0 01-1.414-1.414l7-7A1 1 0 0110 3z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>High pesticide exposure increases respiratory issues by 25%</span>
                    </li>
                  )}
                  {workHours >= 10 && (
                    <li className="flex items-start">
                      <span className="flex-shrink-0 h-5 w-5 rounded-full bg-red-500 flex items-center justify-center mr-2">
                        <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 3a1 1 0 01.707.293l7 7a1 1 0 01-1.414 1.414L10 5.414 3.707 11.707a1 1 0 01-1.414-1.414l7-7A1 1 0 0110 3z" clipRule="evenodd" />
                        </svg>
                      </span>
                      <span>Long work hours (10+ hours/day) contribute to overall fatigue and increased risk</span>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-lightSlate">Enter data to predict risks</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RiskPredictionTool;