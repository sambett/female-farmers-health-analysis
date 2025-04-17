import React, { useState, useEffect } from 'react';
import EnhancedRiskPredictionTool from './components/EnhancedRiskPredictionTool';
import { checkBackendHealth } from './services/ApiService';

function App() {
  const [backendReady, setBackendReady] = useState<boolean>(false);
  const [checkingBackend, setCheckingBackend] = useState<boolean>(true);

  // Sample data for risk factors
  const textRiskFactors = [
    {
      exposure: 'pesticides',
      healthIssue: 'troubles respiratoires',
      riskScore: 75,
      occurrenceCount: 42
    },
    {
      exposure: 'herbicides',
      healthIssue: 'problèmes cutanés',
      riskScore: 65,
      occurrenceCount: 35
    }
  ];

  // Check backend health when component mounts
  useEffect(() => {
    const checkBackend = async () => {
      try {
        setCheckingBackend(true);
        const isBackendReady = await checkBackendHealth();
        setBackendReady(isBackendReady);
      } catch (error) {
        console.error('Error checking backend:', error);
        setBackendReady(false);
      } finally {
        setCheckingBackend(false);
      }
    };

    checkBackend();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-white shadow-md p-4">
        <h1 className="text-2xl font-bold text-gray-800">Agricultural Health Dashboard</h1>
        <p className="text-gray-600 text-sm">Analysis of health data from female farmers</p>
      </header>
      
      <main className="flex-1 p-6">
        {checkingBackend ? (
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto text-center">
            <p className="text-lg">Checking backend connection...</p>
            <div className="mt-4 animate-pulse h-8 bg-gray-200 rounded w-32 mx-auto"></div>
          </div>
        ) : backendReady ? (
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
            <EnhancedRiskPredictionTool 
              data={[]}
              textRiskFactors={textRiskFactors}
            />
          </div>
        ) : (
          <div className="bg-white p-6 rounded-xl shadow-lg max-w-5xl mx-auto">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-yellow-800">Backend Not Connected</h3>
                  <div className="mt-2 text-sm text-yellow-700">
                    <p>The backend server is not running. Please start it with the following steps:</p>
                    <ol className="list-decimal pl-5 mt-2">
                      <li>Open a command prompt</li>
                      <li>Navigate to: <code className="bg-gray-100 px-1 rounded">backend</code> folder</li>
                      <li>Run: <code className="bg-gray-100 px-1 rounded">run_simple_server.bat</code></li>
                    </ol>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      
      <footer className="bg-white p-4 shadow-inner text-center text-gray-600 text-sm">
        Agricultural Workers Health Study - Updated: April 2025
      </footer>
    </div>
  );
}

export default App;