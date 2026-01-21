export interface UnifiedProduct {
  id: string;
  name: string;          // title → name으로 변경
  title: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  image: string;
  url: string;
  affiliateLink: string; // url을 affiliateLink로도 제공
  rating?: number;
  reviewCount?: number;
  category: string;
  mall: string;          // mallName → mall로 변경
  mallName?: string;
  brand?: string;
  source: 'naver';
  isPopular?: boolean;   // 추가
}

interface NaverShoppingItem {
  title: string;
  link: string;
  image: string;
  lprice: string;
  hprice: string;
  mallName: string;
  productId: string;
  brand?: string;
  maker?: string;
  category1?: string;
  category2?: string;
}

interface NaverShoppingResponse {
  lastBuildDate: string;
  total: number;
  start: number;
  display: number;
  items: NaverShoppingItem[];
}

export async function searchNaverShopping(
  query: string,
  display: number = 20
): Promise<NaverShoppingResponse> {
  try {
    const response = await fetch(
      `/api/naver-shopping?query=${encodeURIComponent(query)}&display=${display}`,
      {
        method: 'GET',
      }
    );

    if (!response.ok) {
      throw new Error('네이버 쇼핑 검색 실패');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('네이버 쇼핑 API 오류:', error);
    throw error;
  }
}

export function unifyNaverProducts(items: NaverShoppingItem[]): UnifiedProduct[] {
  return items.map((item, index) => {
    const lprice = parseInt(item.lprice) || 0;
    const hprice = parseInt(item.hprice) || 0;
    const discount = hprice > lprice ? Math.round(((hprice - lprice) / hprice) * 100) : 0;
    const cleanTitle = item.title.replace(/<\/?b>/g, '');

    return {
      id: item.productId || `naver-${index}`,
      name: cleanTitle,                    // ProductCard가 기대하는 name
      title: cleanTitle,                   // 호환성을 위해 title도 유지
      price: lprice,
      originalPrice: hprice > lprice ? hprice : undefined,
      discount: discount > 0 ? discount : undefined,
      image: item.image,
      url: item.link,
      affiliateLink: item.link,            // ProductCard가 기대하는 affiliateLink
      category: item.category1 || item.category2 || '기타',
      mall: item.mallName || '네이버쇼핑',  // ProductCard가 기대하는 mall
      mallName: item.mallName,             // 호환성을 위해 mallName도 유지
      brand: item.brand || item.maker,
      source: 'naver',
      isPopular: index < 5,                // 상위 5개를 인기 상품으로 표시
    };
  });
}