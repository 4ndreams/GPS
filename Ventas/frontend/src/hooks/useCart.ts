import { useState, useEffect } from 'react';

interface CartItem {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  categoria: string;
  quantity: number;
  stock: number; // Stock disponible del producto
}

const CART_STORAGE_KEY = 'cart';

export const useCart = () => {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);

  // Función para cargar carrito desde localStorage
  const loadCartFromStorage = (): CartItem[] => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        return Array.isArray(parsedCart) ? parsedCart : [];
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    return [];
  };

  // Función para guardar carrito en localStorage
  const saveCartToStorage = (cart: CartItem[]) => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Error saving cart to localStorage:', error);
    }
  };

  // Cargar carrito al inicializar
  useEffect(() => {
    const savedCart = loadCartFromStorage();
    setCartItems(savedCart);
  }, []);

  // Guardar carrito cuando cambie
  useEffect(() => {
    saveCartToStorage(cartItems);
  }, [cartItems]);

  // Agregar al carrito
  const addToCart = (product: Omit<CartItem, 'quantity'> & { quantity?: number }) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((item) => item.id === product.id);
      if (existingItem) {
        // Incrementar cantidad respetando el stock
        const newQuantity = Math.min(
          existingItem.stock, 
          existingItem.quantity + (product.quantity || 1)
        );
        return prevItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: newQuantity }
            : item
        );
      } else {
        // Agregar nuevo producto respetando el stock
        const quantity = Math.min(product.stock, product.quantity || 1);
        return [...prevItems, { ...product, quantity }];
      }
    });
  };

  // Remover del carrito
  const removeFromCart = (productId: number) => {
    setCartItems(prevItems => prevItems.filter(item => item.id !== productId));
  };

  // Actualizar cantidad
  const updateCartItemQuantity = (productId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    
    setCartItems(prevItems => 
      prevItems.map(item => 
        item.id === productId 
          ? { ...item, quantity: Math.min(item.stock, newQuantity) } 
          : item
      )
    );
  };

  // Obtener cantidad de un producto
  const getCartItemQuantity = (productId: number): number => {
    const item = cartItems.find(item => item.id === productId);
    return item ? item.quantity : 0;
  };

  // Obtener total de items
  const cartItemCount = cartItems.reduce(
    (total, item) => total + item.quantity, 
    0
  );

  // Limpiar carrito
  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    addToCart,
    removeFromCart,
    updateCartItemQuantity,
    getCartItemQuantity,
    cartItemCount,
    clearCart,
  };
};
