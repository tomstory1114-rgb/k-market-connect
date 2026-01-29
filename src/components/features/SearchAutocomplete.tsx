'use client';

import { useState, useRef, useEffect } from 'react';
import { Search, Clock, TrendingUp, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSearch } from '@/hooks/useSearch';

interface SearchAutocompleteProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export default function SearchAutocomplete({ 
  onSearch, 
  placeholder = "상품명으로 검색하세요..." 
}: SearchAutocompleteProps) {
  const [query, setQuery] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  
  const {
    recentSearches,
    popularKeywords,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    getAutocompleteSuggestions,
  } = useSearch();

  const suggestions = getAutocompleteSuggestions(query);
  const showRecent = query.trim() === '' && recentSearches.length > 0;
  const showPopular = query.trim() === '' && popularKeywords.length > 0;

  // 외부 클릭 감지
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSearch = (searchQuery: string) => {
    if (!searchQuery.trim()) return;
    
    addRecentSearch(searchQuery);
    onSearch(searchQuery);
    setQuery('');
    setShowDropdown(false);
    inputRef.current?.blur();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedIndex >= 0 && suggestions.length > 0) {
      handleSearch(suggestions[selectedIndex]);
    } else if (query.trim()) {
      handleSearch(query);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!showDropdown) return;

    const itemCount = suggestions.length || 
                     (showRecent ? recentSearches.length : 0) || 
                     (showPopular ? popularKeywords.length : 0);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => (prev < itemCount - 1 ? prev + 1 : prev));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => (prev > 0 ? prev - 1 : -1));
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
      setSelectedIndex(-1);
    }
  };

  const highlightMatch = (text: string, query: string) => {
    if (!query.trim()) return text;
    
    const parts = text.split(new RegExp(`(${query})`, 'gi'));
    return parts.map((part, i) => 
      part.toLowerCase() === query.toLowerCase() 
        ? <mark key={i} className="bg-yellow-200 text-gray-900 font-bold">{part}</mark>
        : part
    );
  };

  return (
    <div className="relative w-full">
      <form onSubmit={handleSubmit} className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-gray-400" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setShowDropdown(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-14 pr-32 py-4 text-lg border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <button
          type="submit"
          disabled={!query.trim() && selectedIndex < 0}
          className="absolute right-2 top-1/2 -translate-y-1/2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          검색
        </button>
      </form>

      {/* 드롭다운 */}
      <AnimatePresence>
        {showDropdown && (
          <motion.div
            ref={dropdownRef}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-2xl border border-gray-200 overflow-hidden z-50 max-h-96 overflow-y-auto"
          >
            {/* 자동완성 제안 */}
            {suggestions.length > 0 && (
              <div className="p-2">
                <div className="text-xs text-gray-500 px-3 py-2 font-medium">추천 검색어</div>
                {suggestions.map((suggestion, index) => (
                  <button
                    key={suggestion}
                    onClick={() => handleSearch(suggestion)}
                    className={`w-full text-left px-4 py-3 rounded-lg transition-colors flex items-center gap-3 ${
                      index === selectedIndex
                        ? 'bg-primary-50 text-primary-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <Search className="w-4 h-4 text-gray-400" />
                    <span>{highlightMatch(suggestion, query)}</span>
                  </button>
                ))}
              </div>
            )}

            {/* 최근 검색어 */}
            {showRecent && (
              <div className="p-2 border-t border-gray-100">
                <div className="flex items-center justify-between px-3 py-2 mb-1">
                  <div className="text-xs text-gray-500 font-medium flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    최근 검색어
                  </div>
                  <button
                    onClick={clearRecentSearches}
                    className="text-xs text-gray-400 hover:text-gray-600"
                  >
                    전체 삭제
                  </button>
                </div>
                {recentSearches.map((keyword, index) => (
                  <div
                    key={keyword}
                    className={`flex items-center justify-between px-4 py-3 rounded-lg transition-colors ${
                      index === selectedIndex && !suggestions.length
                        ? 'bg-primary-50 text-primary-600'
                        : 'hover:bg-gray-50'
                    }`}
                  >
                    <button
                      onClick={() => handleSearch(keyword)}
                      className="flex-1 text-left flex items-center gap-3"
                    >
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span>{keyword}</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeRecentSearch(keyword);
                      }}
                      className="p-1 hover:bg-gray-200 rounded"
                    >
                      <X className="w-4 h-4 text-gray-400" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* 인기 검색어 */}
            {showPopular && !showRecent && (
              <div className="p-2">
                <div className="text-xs text-gray-500 px-3 py-2 font-medium flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  인기 검색어
                </div>
                <div className="grid grid-cols-2 gap-2 px-2">
                  {popularKeywords.slice(0, 10).map((keyword, index) => (
                    <button
                      key={keyword}
                      onClick={() => handleSearch(keyword)}
                      className="text-left px-3 py-2 rounded-lg hover:bg-primary-50 hover:text-primary-600 transition-colors flex items-center gap-2"
                    >
                      <span className="text-xs font-bold text-primary-600 min-w-[20px]">
                        {index + 1}
                      </span>
                      <span className="text-sm truncate">{keyword}</span>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 검색 결과 없음 */}
            {query.trim() && suggestions.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <Search className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>'{query}'에 대한 추천 검색어가 없습니다</p>
                <p className="text-sm mt-1">Enter를 눌러 검색해보세요</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}