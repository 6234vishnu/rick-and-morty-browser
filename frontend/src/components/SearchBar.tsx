import React, { useState, useEffect } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
  onSearch: (searchTerm: string) => void;
  initialValue?: string;
}

const SearchBar: React.FC<SearchBarProps> = ({   // getting the search data as props 
  onSearch,
  initialValue = "",
}) => {
  const [searchTerm, setSearchTerm] = useState(initialValue);

  // Debounce input to reduce API calls or filtering load
  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      onSearch(searchTerm.trim());
    }, 500);

    return () => clearTimeout(delayDebounce);
  }, [searchTerm, onSearch]);

  return (
    <div className="max-w-2xl mx-auto mb-8 transform transition-all duration-500 hover:scale-105">
      <div className="relative bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search by name,species,status..."
          className="w-full pl-12 pr-4 py-4 text-black placeholder-gray-500 bg-transparent border-0 rounded-2xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:ring-opacity-20 transition-all duration-300"
        />
      </div>
    </div>
  );
};

export default SearchBar;
