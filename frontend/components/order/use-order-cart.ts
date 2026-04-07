'use client';

import { useEffect, useMemo, useState } from 'react';
import type { MenuItem } from './order-data';

export type CartItem = Pick<MenuItem, 'id' | 'name' | 'price' | 'category'> & {
  quantity: number;
};

export type OrderCartState = {
  addItem: (item: MenuItem) => void;
  clearCart: () => void;
  decrementItem: (itemId: string) => void;
  hydrated: boolean;
  incrementItem: (itemId: string) => void;
  itemCount: number;
  items: CartItem[];
  points: number;
  removeItem: (itemId: string) => void;
  subtotal: number;
};

const STORAGE_KEY = 'pop-perote-order-cart';

function readCart(): CartItem[] {
  if (typeof window === 'undefined') {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return [];
    }

    const parsed = JSON.parse(raw) as CartItem[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function useOrderCart(): OrderCartState {
  const [items, setItems] = useState<CartItem[]>([]);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setItems(readCart());
    setHydrated(true);

    const syncCart = () => setItems(readCart());
    window.addEventListener('storage', syncCart);

    return () => {
      window.removeEventListener('storage', syncCart);
    };
  }, []);

  useEffect(() => {
    if (!hydrated) {
      return;
    }

    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [hydrated, items]);

  const itemCount = useMemo(
    () => items.reduce((total, item) => total + item.quantity, 0),
    [items],
  );

  const subtotal = useMemo(
    () => items.reduce((total, item) => total + item.price * item.quantity, 0),
    [items],
  );

  const points = useMemo(() => Math.floor(subtotal / 10), [subtotal]);

  const addItem = (item: MenuItem) => {
    setItems((currentItems) => {
      const existingItem = currentItems.find((cartItem) => cartItem.id === item.id);

      if (existingItem) {
        return currentItems.map((cartItem) =>
          cartItem.id === item.id
            ? { ...cartItem, quantity: cartItem.quantity + 1 }
            : cartItem,
        );
      }

      return [
        ...currentItems,
        {
          id: item.id,
          name: item.name,
          price: item.price,
          category: item.category,
          quantity: 1,
        },
      ];
    });
  };

  const incrementItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems.map((cartItem) =>
        cartItem.id === itemId
          ? { ...cartItem, quantity: cartItem.quantity + 1 }
          : cartItem,
      ),
    );
  };

  const decrementItem = (itemId: string) => {
    setItems((currentItems) =>
      currentItems
        .map((cartItem) =>
          cartItem.id === itemId
            ? { ...cartItem, quantity: cartItem.quantity - 1 }
            : cartItem,
        )
        .filter((cartItem) => cartItem.quantity > 0),
    );
  };

  const removeItem = (itemId: string) => {
    setItems((currentItems) => currentItems.filter((cartItem) => cartItem.id !== itemId));
  };

  const clearCart = () => setItems([]);

  return {
    addItem,
    clearCart,
    decrementItem,
    hydrated,
    incrementItem,
    itemCount,
    items,
    points,
    removeItem,
    subtotal,
  };
}
