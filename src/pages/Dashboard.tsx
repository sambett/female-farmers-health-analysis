import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import FilterBar from '../components/FilterBar';

const Dashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('overview');

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Sidebar */}
      <div className="fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 ease-in-out">
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      </div>

      {/* Main Content */}
      <div className="flex-1 ml-64">
        <div className="container mx-auto px-4 py-6">
          <FilterBar />
          
          <div className="mt-4 bg-white p-4 rounded-lg shadow-md">
            <h2 className="text-xl font-bold mb-4">Tableau de Bord Agricole</h2>
            <p>Bienvenue dans le tableau de bord d'analyse des données des agricultrices.</p>
            <p className="mt-2">Tab actif: {activeTab}</p>
            
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div className="border p-3 rounded bg-blue-50">
                <h3 className="font-bold">Problèmes de Santé</h3>
                <p className="text-sm">Analyse des troubles cardio-respiratoires, neurologiques, cognitifs et cutanés.</p>
              </div>
              <div className="border p-3 rounded bg-green-50">
                <h3 className="font-bold">Expositions</h3>
                <p className="text-sm">Analyse des expositions aux produits chimiques et biologiques.</p>
              </div>
              <div className="border p-3 rounded bg-yellow-50">
                <h3 className="font-bold">Protection</h3>
                <p className="text-sm">Analyse de l'utilisation d'équipements de protection.</p>
              </div>
              <div className="border p-3 rounded bg-purple-50">
                <h3 className="font-bold">Prédiction IA</h3>
                <p className="text-sm">Outil de prédiction des risques basé sur l'analyse de texte.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;