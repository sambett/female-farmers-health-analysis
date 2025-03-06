import { ChevronDown } from 'lucide-react';

const FilterBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-md sticky top-0 z-10">
      <div className="flex space-x-4">
        {['Age Range', 'Employment Status', 'Socioeconomic Status'].map((label) => (
          <div key={label}>
            <label className="block text-sm text-slate mb-1">{label}</label>
            <div className="relative">
              <select className="appearance-none bg-white border border-lightSlate rounded py-1 px-3 text-sm text-slate focus:ring-teal focus:border-teal transition-all">
                <option>All</option>
                {label === 'Age Range' && (
                  <>
                    <option>20-40 years</option>
                    <option>41-60 years</option>
                    <option>60+ years</option>
                  </>
                )}
                {label === 'Employment Status' && (
                  <>
                    <option>Permanent</option>
                    <option>Seasonal</option>
                  </>
                )}
                {label === 'Socioeconomic Status' && (
                  <>
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </>
                )}
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate transition-transform hover:rotate-180" />
            </div>
          </div>
        ))}
      </div>
      <button className="bg-coral hover:bg-coral/90 text-white py-1 px-4 rounded text-sm transition-all hover:scale-105">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterBar;