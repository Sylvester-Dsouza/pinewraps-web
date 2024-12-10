'use client';

import { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import toast from '../toast';

interface CartItem {
  id: string;
  cartItemId?: string; // Unique identifier for cart item
  name: string;
  price: number;
  quantity: number;
  imageUrl?: string;
  variant?: string;
  selectedVariations?: {
    type: string;
    value: string;
    priceAdjustment: number;
  }[];
  cakeWriting?: string;
}

interface CartState {
  items: CartItem[];
  total: number;
}

type CartAction =
  | { type: 'ADD_ITEM'; payload: CartItem }
  | { type: 'REMOVE_ITEM'; payload: { cartItemId: string } }
  | { type: 'UPDATE_QUANTITY'; payload: { cartItemId: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'INIT_CART'; payload: CartState };

const initialState: CartState = {
  items: [],
  total: 0,
};

const CART_STORAGE_KEY = 'pinewraps_cart';

// Generate a unique cart item ID based on product details
function generateCartItemId(item: CartItem): string {
  const variationsString = item.selectedVariations 
    ? JSON.stringify(item.selectedVariations.sort((a, b) => a.type.localeCompare(b.type)))
    : '';
  return `${item.id}-${item.variant || ''}-${variationsString}-${item.cakeWriting || ''}`;
}

function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
}

function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case 'INIT_CART':
      return action.payload;

    case 'ADD_ITEM': {
      const newItem = {
        ...action.payload,
        cartItemId: generateCartItemId(action.payload),
      };

      const existingItemIndex = state.items.findIndex(
        item => item.cartItemId === newItem.cartItemId
      );

      let newItems;
      if (existingItemIndex > -1) {
        // Update quantity if item exists
        newItems = state.items.map((item, index) => 
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + newItem.quantity }
            : item
        );
      } else {
        // Add new item
        newItems = [...state.items, newItem];
      }

      const newState = {
        items: newItems,
        total: calculateTotal(newItems),
      };

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
        } catch (error) {
          console.error('Error saving cart to localStorage:', error);
        }
      }

      return newState;
    }

    case 'REMOVE_ITEM': {
      const newItems = state.items.filter(item => item.cartItemId !== action.payload.cartItemId);
      const newState = {
        items: newItems,
        total: calculateTotal(newItems),
      };

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
        } catch (error) {
          console.error('Error saving cart to localStorage:', error);
        }
      }

      return newState;
    }

    case 'UPDATE_QUANTITY': {
      const newItems = state.items.map(item =>
        item.cartItemId === action.payload.cartItemId
          ? { ...item, quantity: action.payload.quantity }
          : item
      );

      const newState = {
        items: newItems,
        total: calculateTotal(newItems),
      };

      // Save to localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newState));
        } catch (error) {
          console.error('Error saving cart to localStorage:', error);
        }
      }

      return newState;
    }

    case 'CLEAR_CART': {
      // Clear localStorage
      if (typeof window !== 'undefined') {
        try {
          localStorage.removeItem(CART_STORAGE_KEY);
        } catch (error) {
          console.error('Error clearing cart from localStorage:', error);
        }
      }
      return initialState;
    }

    default:
      return state;
  }
}

export const CartContext = createContext<{
  state: CartState;
  addItem: (item: CartItem) => void;
  removeItem: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, quantity: number) => void;
  clearCart: () => void;
}>({
  state: initialState,
  addItem: () => {},
  removeItem: () => {},
  updateQuantity: () => {},
  clearCart: () => {},
});

export function CartProvider({ children }: { children: ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState);

  // Initialize cart from localStorage
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const savedCart = localStorage.getItem(CART_STORAGE_KEY);
    if (!savedCart) return;

    try {
      const parsedCart = JSON.parse(savedCart);
      // Ensure all items have cartItemId
      parsedCart.items = parsedCart.items.map((item: CartItem) => ({
        ...item,
        cartItemId: item.cartItemId || generateCartItemId(item),
      }));
      dispatch({ type: 'INIT_CART', payload: parsedCart });
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
      localStorage.removeItem(CART_STORAGE_KEY);
    }
  }, []);

  const addItem = (item: CartItem) => {
    dispatch({ type: 'ADD_ITEM', payload: item });
    toast.success(
      state.items.some(i => i.cartItemId === generateCartItemId(item))
        ? 'Cart updated successfully'
        : 'Item added to cart'
    );
  };

  const removeItem = (cartItemId: string) => {
    dispatch({ type: 'REMOVE_ITEM', payload: { cartItemId } });
    toast.success('Item removed from cart');
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    dispatch({ type: 'UPDATE_QUANTITY', payload: { cartItemId, quantity } });
    toast.success('Cart updated successfully');
  };

  const clearCart = () => {
    dispatch({ type: 'CLEAR_CART' });
    toast.success('Cart cleared');
  };

  return (
    <CartContext.Provider value={{ state, addItem, removeItem, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
