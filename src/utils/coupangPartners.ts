/**
 * 쿠팡 파트너스 링크 생성 함수
 */

const COUPANG_PARTNERS_ID = process.env.NEXT_PUBLIC_COUPANG_PARTNERS_ID || 'AF8287145';

/**
 * 쿠팡 제휴 링크 생성
 * @param productUrl 상품 URL 또는 키워드
 * @returns 쿠팡 파트너스 제휴 링크
 */
export function generateCoupangLink(productUrl?: string): string {
  const baseUrl = `https://link.coupang.com/a/${COUPANG_PARTNERS_ID}`;
  
  if (productUrl) {
    // URL 인코딩
    const encodedUrl = encodeURIComponent(productUrl);
    return `${baseUrl}?url=${encodedUrl}`;
  }
  
  // URL이 없으면 쿠팡 메인으로
  return baseUrl;
}

/**
 * 쿠팡 검색 링크 생성
 * @param keyword 검색 키워드
 * @returns 쿠팡 검색 제휴 링크
 */
export function generateCoupangSearchLink(keyword: string): string {
  const searchUrl = `https://www.coupang.com/np/search?q=${encodeURIComponent(keyword)}`;
  return generateCoupangLink(searchUrl);
}

/**
 * 쇼핑몰 이름으로 쿠팡인지 확인
 * @param mallName 쇼핑몰 이름
 * @returns 쿠팡 여부
 */
export function isCoupangProduct(mallName: string): boolean {
  return mallName.toLowerCase().includes('쿠팡') || 
         mallName.toLowerCase().includes('coupang');
}