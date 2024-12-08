import React, { createContext, useState, useEffect } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    const existingProduct = cart.find((item) => item._id === product._id);
    if (existingProduct) {
      setCart((prev) =>
        prev.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + product.quantity }
            : item
        )
      );
    } else {
      setCart((prev) => [...prev, product]);
    }
  };

  const removeFromCart = (productId) => {
    setCart((prev) => prev.filter((item) => item._id !== productId));
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart }}>
      {children}
    </CartContext.Provider>
  );
};
