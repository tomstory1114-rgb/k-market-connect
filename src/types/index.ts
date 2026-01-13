export interface User {
  uid: string;
  email: string;
  displayName: string;
  country: string;
  address: string;
  uniqueId: string; // NW-US-0001234
  points: number;
  level: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  totalSpent: number;
  createdAt: Date;
  lastLogin: Date;
  consecutiveLogins: number;
  isPremium: boolean;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  mall: string;
  affiliateLink: string;
  discount?: number;
  isPopular?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  userName: string;
  country: string;
  category: string;
  title: string;
  content: string;
  images?: string[];
  likes: number;
  comments: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: Date;
}

export interface Shipment {
  id: string;
  userId: string;
  uniqueId: string;
  status: 'pending' | 'warehouse' | 'shipping' | 'delivered';
  items: string[];
  trackingNumber?: string;
  estimatedDelivery?: Date;
  createdAt: Date;
}

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'earn' | 'spend';
  reason: string;
  createdAt: Date;
}

export interface RouletteReward {
  type: 'discount' | 'points' | 'nothing';
  value: number | string;
  label: string;
}

export interface Mall {
  id: string;
  name: string;
  logo: string;
  url: string;
  commission: number;
}
export interface Shipment {
  id: string;
  userId: string;
  trackingNumber: string;
  mall: string;
  productName: string;
  status: 'pending' | 'warehouse' | 'shipping' | 'delivered';
  createdAt: Date;
  updatedAt: Date;
}
