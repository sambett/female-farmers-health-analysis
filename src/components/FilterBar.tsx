import { ChevronDown } from 'lucide-react';

const FilterBar: React.FC = () => {
  return (
    <div className="flex items-center justify-between mb-6 p-4 bg-white rounded-lg shadow-md">
      <div className="flex space-x-4">
        {['Age Range', 'Employment Status', 'Socioeconomic Status'].map((label) => (
          <div key={label}>
            <label className="block text-sm text-slate mb-1">{label}</label>
            <div className="relative">
              <select className="appearance-none bg-white border border-lightSlate rounded py-1 px-3 text-sm text-slate focus:ring-teal focus:border-teal">
                <option>All</option>
              </select>
              <ChevronDown size={14} className="absolute right-2 top-1/2 -translate-y-1/2 text-slate" />
            </div>
          </div>
        ))}
      </div>
      <button className="bg-coral hover:bg-coral/90 text-white py-1 px-4 rounded text-sm transition-colors">
        Apply Filters
      </button>
    </div>
  );
};

export default FilterBar;