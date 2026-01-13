'use client';

import { useState } from 'react';
import { Plus, MessageSquare, ThumbsUp, Eye, Search } from 'lucide-react';
import { Post } from '@/types';
import { formatDateTime, getCountryFlag } from '@/utils/helpers';

// Mock post data
const mockPosts: Post[] = [
  {
    id: '1',
    userId: 'user1',
    userName: '김민수',
    country: 'US',
    category: '구매후기',
    title: '올리브영 스킨케어 세트 배송 후기!',
    content: '2주만에 무사히 도착했어요. 포장도 꼼꼼하고 제품 상태 완벽합니다!',
    likes: 24,
    comments: 8,
    createdAt: new Date('2026-01-10'),
    updatedAt: new Date('2026-01-10'),
  },
  {
    id: '2',
    userId: 'user2',
    userName: '박지연',
    country: 'CA',
    category: '생활정보',
    title: '캐나다 통관 TIP 공유합니다',
    content: '캐나다로 배송받을 때 주의사항들 정리해봤어요. 특히 식품류는...',
    likes: 45,
    comments: 12,
    createdAt: new Date('2026-01-09'),
    updatedAt: new Date('2026-01-09'),
  },
  {
    id: '3',
    userId: 'user3',
    userName: '이서준',
    country: 'JP',
    category: '질문',
    title: '일본에서 화장품 배송 얼마나 걸리나요?',
    content: '처음 주문하는데 배송 기간 궁금합니다!',
    likes: 8,
    comments: 15,
    createdAt: new Date('2026-01-08'),
    updatedAt: new Date('2026-01-08'),
  },
  {
    id: '4',
    userId: 'user4',
    userName: '최유진',
    country: 'US',
    category: '자유게시판',
    title: 'LA 한인타운 맛집 추천해요',
    content: '요즘 가본 곳 중에 제일 맛있었던 한식당 소개합니다',
    likes: 32,
    comments: 21,
    createdAt: new Date('2026-01-07'),
    updatedAt: new Date('2026-01-07'),
  },
  {
    id: '5',
    userId: 'user5',
    userName: '정현우',
    country: 'UK',
    category: '구매후기',
    title: '무신사 패딩 구매했는데 대박이네요',
    content: '영국 겨울에 딱 맞는 두께예요. 배송도 빨랐어요!',
    likes: 19,
    comments: 6,
    createdAt: new Date('2026-01-06'),
    updatedAt: new Date('2026-01-06'),
  },
];

const countries = [
  { code: 'ALL', name: '전체', flag: '🌍' },
  { code: 'US', name: '미국', flag: '🇺🇸' },
  { code: 'CA', name: '캐나다', flag: '🇨🇦' },
  { code: 'JP', name: '일본', flag: '🇯🇵' },
  { code: 'UK', name: '영국', flag: '🇬🇧' },
  { code: 'AU', name: '호주', flag: '🇦🇺' },
];

const categories = ['전체', '구매후기', '생활정보', '질문', '자유게시판', '중고거래'];

export default function CommunityPage() {
  const [selectedCountry, setSelectedCountry] = useState('ALL');
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredPosts = mockPosts.filter(post => {
    const matchesCountry = selectedCountry === 'ALL' || post.country === selectedCountry;
    const matchesCategory = selectedCategory === '전체' || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCountry && matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900 font-display">
              커뮤니티
            </h1>
            <button className="flex items-center gap-2 bg-primary-600 hover:bg-primary-700 text-white px-6 py-3 rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg">
              <Plus className="w-5 h-5" />
              글쓰기
            </button>
          </div>

          {/* Search */}
          <div className="relative mb-6">
            <input
              type="text"
              placeholder="게시글 검색..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent"
            />
            <Search className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" />
          </div>

          {/* Country Filter */}
          <div className="mb-4">
            <div className="flex flex-wrap gap-2">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => setSelectedCountry(country.code)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    selectedCountry === country.code
                      ? 'bg-primary-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                  }`}
                >
                  <span className="text-lg">{country.flag}</span>
                  <span>{country.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg transition-all duration-200 ${
                  selectedCategory === category
                    ? 'bg-gray-900 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Posts List */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <div
              key={post.id}
              className="card hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="badge bg-primary-100 text-primary-700">
                      {post.category}
                    </span>
                    <span className="text-2xl">
                      {getCountryFlag(post.country)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {post.userName}
                    </span>
                    <span className="text-sm text-gray-400">•</span>
                    <span className="text-sm text-gray-400">
                      {formatDateTime(post.createdAt)}
                    </span>
                  </div>

                  <h3 className="text-lg font-semibold text-gray-900 mb-2 hover:text-primary-600">
                    {post.title}
                  </h3>
                  <p className="text-gray-600 line-clamp-2 mb-3">
                    {post.content}
                  </p>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <ThumbsUp className="w-4 h-4" />
                      <span>{post.likes}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <MessageSquare className="w-4 h-4" />
                      <span>{post.comments}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredPosts.length === 0 && (
          <div className="text-center py-16">
            <MessageSquare className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">게시글이 없습니다</p>
            <p className="text-gray-400 mt-2">첫 번째 글을 작성해보세요!</p>
          </div>
        )}
      </div>
    </div>
  );
}
