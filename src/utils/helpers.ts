export const generateUniqueId = (country: string, number: number): string => {
  const countryCode = country.toUpperCase().slice(0, 2);
  const paddedNumber = number.toString().padStart(7, '0');
  return `NW-${countryCode}-${paddedNumber}`;
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('ko-KR', {
    style: 'currency',
    currency: 'KRW',
  }).format(price);
};

export const formatDate = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(d);
};

export const formatDateTime = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date;
  return new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(d);
};

export const getLevelColor = (level: string): string => {
  const colors = {
    Bronze: 'text-orange-600',
    Silver: 'text-gray-400',
    Gold: 'text-yellow-500',
    Platinum: 'text-purple-600',
  };
  return colors[level as keyof typeof colors] || 'text-gray-600';
};

export const getLevelBadge = (level: string): string => {
  const badges = {
    Bronze: '🥉',
    Silver: '🥈',
    Gold: '🥇',
    Platinum: '💎',
  };
  return badges[level as keyof typeof badges] || '🏷️';
};

export const getCountryFlag = (country: string): string => {
  const flags: { [key: string]: string } = {
    US: '🇺🇸',
    CA: '🇨🇦',
    JP: '🇯🇵',
    UK: '🇬🇧',
    AU: '🇦🇺',
    DE: '🇩🇪',
    FR: '🇫🇷',
  };
  return flags[country] || '🌍';
};

export const calculateShippingCost = (weight: number, country: string): number => {
  const baseRates: { [key: string]: number } = {
    US: 35000,
    CA: 40000,
    JP: 25000,
    UK: 45000,
    AU: 50000,
  };
  
  const baseRate = baseRates[country] || 35000;
  const weightCharge = Math.max(0, weight - 1) * 5000;
  
  return baseRate + weightCharge;
};

export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return function executedFunction(...args: Parameters<T>) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};