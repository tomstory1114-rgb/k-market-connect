'use client';

import { useState, useEffect } from 'react';

const POPULAR_KEYWORDS = [
  '신라면', '설화수', '갤럭시', '아이폰', '에어팟',
  '다이슨', '비비고', '정관장', '설화수', '후',
  '라네즈', '이니스프리', '에뛰드', '토니모리', '미샤',
];

export function useSearch() {
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [popularKeywords] = useState<string[]>(POPULAR_KEYWORDS);

  // 로컬 스토리지에서 최근 검색어 불러오기
  useEffect(() => {
    const stored = localStorage.getItem('recentSearches');
    if (stored) {
      try {
        setRecentSearches(JSON.parse(stored));
      } catch (error) {
        console.error('최근 검색어 로드 실패:', error);
      }
    }
  }, []);

  const addRecentSearch = (keyword: string) => {
    if (!keyword.trim()) return;

    setRecentSearches(prev => {
      // 중복 제거 및 최신순 정렬
      const filtered = prev.filter(k => k !== keyword);
      const updated = [keyword, ...filtered].slice(0, 10); // 최대 10개
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const removeRecentSearch = (keyword: string) => {
    setRecentSearches(prev => {
      const updated = prev.filter(k => k !== keyword);
      localStorage.setItem('recentSearches', JSON.stringify(updated));
      return updated;
    });
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
  };

  const getAutocompleteSuggestions = (query: string): string[] => {
    if (!query.trim()) return [];
    
    const lowercaseQuery = query.toLowerCase();
    
    // 최근 검색어에서 매칭
    const recentMatches = recentSearches.filter(keyword =>
      keyword.toLowerCase().includes(lowercaseQuery)
    );
    
    // 인기 검색어에서 매칭
    const popularMatches = popularKeywords.filter(keyword =>
      keyword.toLowerCase().includes(lowercaseQuery) &&
      !recentMatches.includes(keyword)
    );
    
    return [...recentMatches, ...popularMatches].slice(0, 8);
  };

  return {
    recentSearches,
    popularKeywords,
    addRecentSearch,
    removeRecentSearch,
    clearRecentSearches,
    getAutocompleteSuggestions,
  };
}