import { User, CartItem, Order } from '../types';

// User authentication
export const saveUser = (user: User): void => {
  localStorage.setItem('user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const removeUser = (): void => {
  localStorage.removeItem('user');
};

// Shopping cart
export const saveCart = (cartItems: CartItem[]): void => {
  localStorage.setItem('cart', JSON.stringify(cartItems));
};

export const getCart = (): CartItem[] => {
  const cart = localStorage.getItem('cart');
  return cart ? JSON.parse(cart) : [];
};

export const clearCart = (): void => {
  localStorage.removeItem('cart');
};

// Orders
export const saveOrder = (order: Order): void => {
  const orders = getOrders();
  orders.push(order);
  localStorage.setItem('orders', JSON.stringify(orders));
};

export const getOrders = (): Order[] => {
  const orders = localStorage.getItem('orders');
  return orders ? JSON.parse(orders) : [];
};

// User registration
export const registerUser = (email: string, password: string, firstName: string, lastName: string): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  
  if (users.find((u: any) => u.email === email)) {
    return false; // User already exists
  }
  
  const user = {
    id: Date.now().toString(),
    email,
    password, // In production, this would be hashed
    firstName,
    lastName,
    createdAt: new Date().toISOString()
  };
  
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
  
  const publicUser: User = {
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    createdAt: user.createdAt
  };
  
  saveUser(publicUser);
  return true;
};

export const loginUser = (email: string, password: string): boolean => {
  const users = JSON.parse(localStorage.getItem('users') || '[]');
  const user = users.find((u: any) => u.email === email && u.password === password);
  
  if (user) {
    const publicUser: User = {
      id: user.id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      createdAt: user.createdAt
    };
    
    saveUser(publicUser);
    return true;
  }
  
  return false;
};