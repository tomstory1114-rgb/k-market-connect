'use client';

import { createContext, useContext, useState, ReactNode } from 'react';
import { UnifiedProduct } from '@/utils/shopApi';

export interface OrderItem {
  product: UnifiedProduct;
  quantity: number;
}

export interface ShippingAddress {
  name: string;
  phone: string;
  email: string;
  country: string;
  address: string;
  addressDetail: string;
  zipCode: string;
}

export interface Order {
  id: string;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  shippingFee: number;
  serviceFee: number;
  finalAmount: number;
  status: 'pending' | 'confirmed' | 'purchased' | 'shipped' | 'delivered';
  createdAt: Date;
  paymentMethod?: 'card' | 'transfer';
}

interface OrderContextType {
  orders: Order[];
  currentOrder: Order | null;
  createOrder: (items: OrderItem[], shippingAddress: ShippingAddress) => Order;
  confirmOrder: (orderId: string) => void;
  getOrderById: (orderId: string) => Order | undefined;
}

const OrderContext = createContext<OrderContextType | undefined>(undefined);

const SERVICE_FEE_RATE = 0.15;

const shippingFees: Record<string, number> = {
  US: 25000,
  CA: 28000,
  JP: 15000,
  CN: 12000,
  AU: 30000,
  GB: 32000,
  DE: 30000,
  FR: 30000,
  KR: 3000,
};

export function OrderProvider({ children }: { children: ReactNode }) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const createOrder = (items: OrderItem[], shippingAddress: ShippingAddress): Order => {
    const totalAmount = items.reduce((sum, item) => {
      const price = item.product.discount
        ? item.product.price * (1 - item.product.discount / 100)
        : item.product.price;
      return sum + price * item.quantity;
    }, 0);

    const shippingFee = shippingFees[shippingAddress.country] || 25000;
    const serviceFee = Math.round(totalAmount * SERVICE_FEE_RATE);
    const finalAmount = totalAmount + shippingFee + serviceFee;

    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      items,
      shippingAddress,
      totalAmount,
      shippingFee,
      serviceFee,
      finalAmount,
      status: 'pending',
      createdAt: new Date(),
    };

    setCurrentOrder(newOrder);
    return newOrder;
  };

  const confirmOrder = (orderId: string) => {
    const order = orders.find(o => o.id === orderId) || currentOrder;
    if (order) {
      const confirmedOrder = { ...order, status: 'confirmed' as const };
      setOrders(prev => [...prev, confirmedOrder]);
      setCurrentOrder(null);
    }
  };

  const getOrderById = (orderId: string) => {
    return orders.find(o => o.id === orderId);
  };

  return (
    <OrderContext.Provider
      value={{
        orders,
        currentOrder,
        createOrder,
        confirmOrder,
        getOrderById,
      }}
    >
      {children}
    </OrderContext.Provider>
  );
}

export function useOrder() {
  const context = useContext(OrderContext);
  if (!context) {
    throw new Error('useOrder must be used within OrderProvider');
  }
  return context;
}