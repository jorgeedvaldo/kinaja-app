import React, { createContext, useContext, useState, useCallback } from 'react';
import { Alert } from 'react-native';

const CartContext = createContext(null);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used within CartProvider');
  return context;
};

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [restaurantId, setRestaurantId] = useState(null);
  const [restaurantName, setRestaurantName] = useState('');

  /**
   * Add a product to the cart.
   * If switching restaurants, prompts user to clear existing cart.
   */
  const addItem = useCallback((product, quantity = 1, notes = '', restaurant = null) => {
    // Check if adding from a different restaurant
    if (restaurantId && restaurant && restaurant.id !== restaurantId) {
      Alert.alert(
        'Limpar Carrinho?',
        `Seu carrinho contém itens de "${restaurantName}". Deseja limpar e adicionar itens de "${restaurant.name}"?`,
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Limpar e Adicionar',
            style: 'destructive',
            onPress: () => {
              setItems([{
                product,
                quantity,
                notes,
              }]);
              setRestaurantId(restaurant.id);
              setRestaurantName(restaurant.name);
            },
          },
        ]
      );
      return;
    }

    // Set restaurant if first item
    if (restaurant && !restaurantId) {
      setRestaurantId(restaurant.id);
      setRestaurantName(restaurant.name);
    }

    setItems((prev) => {
      const existingIndex = prev.findIndex(
        (item) => item.product.id === product.id
      );

      if (existingIndex >= 0) {
        // Update existing item quantity
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          notes: notes || updated[existingIndex].notes,
        };
        return updated;
      }

      // Add new item
      return [...prev, { product, quantity, notes }];
    });
  }, [restaurantId, restaurantName]);

  const removeItem = useCallback((productId) => {
    setItems((prev) => {
      const filtered = prev.filter((item) => item.product.id !== productId);
      if (filtered.length === 0) {
        setRestaurantId(null);
        setRestaurantName('');
      }
      return filtered;
    });
  }, []);

  const updateQuantity = useCallback((productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId
          ? { ...item, quantity }
          : item
      )
    );
  }, [removeItem]);

  const clearCart = useCallback(() => {
    setItems([]);
    setRestaurantId(null);
    setRestaurantName('');
  }, []);

  const getSubtotal = useCallback(() => {
    return items.reduce(
      (total, item) => total + parseFloat(item.product.price) * item.quantity,
      0
    );
  }, [items]);

  const getItemCount = useCallback(() => {
    return items.reduce((count, item) => count + item.quantity, 0);
  }, [items]);

  const value = {
    items,
    restaurantId,
    restaurantName,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    getSubtotal,
    getItemCount,
    itemCount: items.reduce((count, item) => count + item.quantity, 0),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export default CartContext;
