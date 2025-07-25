import React from 'react';
import { Search, X } from 'lucide-react';
import { useChatStore } from '../../stores/chatStore';
import { useDebounce } from '../../hooks/useDebounce';

export const SearchBar: React.FC = () => {
  const { searchQuery, setSearchQuery } = useChatStore();
  const debouncedSearchQuery = useDebounce(searchQuery, 300);

  const handleClear = () => {
    setSearchQuery('');
  };

  return (
    <div className="relative group">
      <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-gray-400 group-focus-within:text-blue-500 transition-colors duration-300" />
      <input
        type="text"
        placeholder="Search conversations..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-9 sm:pl-11 pr-8 sm:pr-10 py-2.5 sm:py-3 border border-gray-300 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-all duration-300 shadow-sm hover:shadow-md focus:shadow-lg text-sm sm:text-base"
      />
      {searchQuery && (
        <button
          onClick={handleClear}
          className="absolute right-2 sm:right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-all duration-300 hover:scale-110"
        >
          <X className="w-3 h-3 sm:w-4 sm:h-4" />
        </button>
      )}
    </div>
  );
};