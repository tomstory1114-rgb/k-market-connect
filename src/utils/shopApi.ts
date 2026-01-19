export async function searchNaverShopping(query: string, display: number = 20) {
  try {
    const response = await fetch(`/api/naver-shopping?query=${encodeURIComponent(query)}&display=${display}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('네이버 쇼핑 API 오류:', error);
    return { items: [] };
  }
}

export interface UnifiedProduct {
  id: string;
  name: string;
  price: number;
  originalPrice?: number;
  image: string;
  mall: string;
  link: string;
  discount?: number;
  category?: string;
  affiliateLink?: string;
  isPopular?: boolean;
}

export function unifyNaverProducts(naverItems: any[]): UnifiedProduct[] {
  return naverItems.map((item, index) => {
    const price = parseInt(item.lprice);
    const originalPrice = parseInt(item.hprice);
    const discount = originalPrice > price ? Math.round(((originalPrice - price) / originalPrice) * 100) : 0;

    return {
      id: `naver-${index}`,
      name: item.title.replace(/<[^>]*>/g, ''),
      price,
      originalPrice: originalPrice > price ? originalPrice : undefined,
      image: item.image,
      mall: item.mallName || '네이버쇼핑',
      link: item.link,
      affiliateLink: item.link,
      discount: discount > 0 ? discount : undefined,
      category: item.category1 || 'general',
      isPopular: discount > 20,
    };
  });
}