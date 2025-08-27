import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { User, CartItem, Product } from '../types';
import { getUser, getCart, saveCart } from '../utils/storage';

interface AppState {
  user: User | null;
  cart: CartItem[];
  searchQuery: string;
  selectedCategory: string;
  cartVisible: boolean;
}

type AppAction =
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'ADD_TO_CART'; payload: { product: Product; size: string; color: string; quantity: number } }
  | { type: 'REMOVE_FROM_CART'; payload: string }
  | { type: 'UPDATE_CART_QUANTITY'; payload: { productId: string; size: string; color: string; quantity: number } }
  | { type: 'CLEAR_CART' }
  | { type: 'SET_SEARCH_QUERY'; payload: string }
  | { type: 'SET_CATEGORY'; payload: string }
  | { type: 'TOGGLE_CART'; payload?: boolean };

const initialState: AppState = {
  user: null,
  cart: [],
  searchQuery: '',
  selectedCategory: '',
  cartVisible: false,
};

const AppContext = createContext<{
  state: AppState;
  dispatch: React.Dispatch<AppAction>;
} | null>(null);

const appReducer = (state: AppState, action: AppAction): AppState => {
  switch (action.type) {
    case 'SET_USER':
      return { ...state, user: action.payload };
    
    case 'ADD_TO_CART': {
      const { product, size, color, quantity } = action.payload;
      const existingItemIndex = state.cart.findIndex(
        item => item.product.id === product.id && item.size === size && item.color === color
      );
      
      let newCart;
      if (existingItemIndex >= 0) {
        newCart = state.cart.map((item, index) =>
          index === existingItemIndex
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        newCart = [...state.cart, { product, size, color, quantity }];
      }
      
      saveCart(newCart);
      return { ...state, cart: newCart };
    }
    
    case 'REMOVE_FROM_CART': {
      const newCart = state.cart.filter((_, index) => index.toString() !== action.payload);
      saveCart(newCart);
      return { ...state, cart: newCart };
    }
    
    case 'UPDATE_CART_QUANTITY': {
      const { productId, size, color, quantity } = action.payload;
      const newCart = state.cart.map(item =>
        item.product.id === productId && item.size === size && item.color === color
          ? { ...item, quantity }
          : item
      );
      saveCart(newCart);
      return { ...state, cart: newCart };
    }
    
    case 'CLEAR_CART':
      saveCart([]);
      return { ...state, cart: [] };
    
    case 'SET_SEARCH_QUERY':
      return { ...state, searchQuery: action.payload };
    
    case 'SET_CATEGORY':
      return { ...state, selectedCategory: action.payload };
    
    case 'TOGGLE_CART':
      return { ...state, cartVisible: action.payload ?? !state.cartVisible };
    
    default:
      return state;
  }
};

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(appReducer, initialState);

  useEffect(() => {
    const user = getUser();
    const cart = getCart();
    
    if (user) dispatch({ type: 'SET_USER', payload: user });
    if (cart.length > 0) {
      cart.forEach(item => {
        dispatch({ 
          type: 'ADD_TO_CART', 
          payload: { 
            product: item.product, 
            size: item.size, 
            color: item.color, 
            quantity: item.quantity 
          } 
        });
      });
    }
  }, []);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};