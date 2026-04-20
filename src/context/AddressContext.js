import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddressContext = createContext(null);

export const useAddresses = () => {
  const context = useContext(AddressContext);
  if (!context) throw new Error('useAddresses must be used within AddressProvider');
  return context;
};

export function AddressProvider({ children }) {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadAddresses = useCallback(async () => {
    try {
      const stored = await AsyncStorage.getItem('@kina_ja_saved_addresses');
      if (stored) {
        setAddresses(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Error loading addresses:', e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAddresses();
  }, [loadAddresses]);

  const saveAddress = async (newAddress) => {
    try {
      const updated = [...addresses, { ...newAddress, id: Date.now().toString() }];
      setAddresses(updated);
      await AsyncStorage.setItem('@kina_ja_saved_addresses', JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('Error saving address:', e);
      return false;
    }
  };

  const deleteAddress = async (id) => {
    try {
      const updated = addresses.filter(addr => addr.id !== id);
      setAddresses(updated);
      await AsyncStorage.setItem('@kina_ja_saved_addresses', JSON.stringify(updated));
      return true;
    } catch (e) {
      console.error('Error deleting address:', e);
      return false;
    }
  };

  const value = {
    addresses,
    loading,
    saveAddress,
    deleteAddress,
    refreshAddresses: loadAddresses,
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
}

export default AddressContext;
