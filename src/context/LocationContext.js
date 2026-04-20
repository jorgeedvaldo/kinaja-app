import React, { createContext, useContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Location from 'expo-location';

const LocationContext = createContext();

export function LocationProvider({ children }) {
  const [currentLocation, setCurrentLocation] = useState(null);
  const [loadingLocation, setLoadingLocation] = useState(true);

  useEffect(() => {
    loadSavedLocation();
  }, []);

  const loadSavedLocation = async () => {
    try {
      setLoadingLocation(true);
      const saved = await AsyncStorage.getItem('@kinaja_address');
      
      let finalLocation = null;

      if (saved) {
        finalLocation = JSON.parse(saved);
      } else {
        // Default location fallback
        finalLocation = {
          address: 'Luanda, Talatona',
          subAddress: 'Rua principal, próximo ao mercado',
          latitude: -8.9220,
          longitude: 13.1869,
        };
      }
      
      // Auto-detect GPS location at app launch
      // requestForegroundPermissionsAsync will prompt if not asked yet.
      const { status } = await Location.requestForegroundPermissionsAsync();
      
      if (status === 'granted') {
        try {
          let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
          let lat = location.coords.latitude;
          let lng = location.coords.longitude;
          
          let geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
          let addressName = 'Localização Atual';
          let subAddressName = 'Morada detectada por GPS';

          if (geocode && geocode.length > 0) {
            let street = geocode[0].street || geocode[0].name || geocode[0].district || 'Rua desconhecida';
            let city = geocode[0].city || geocode[0].region || '';
            if (street.includes('Unnamed')) street = 'Lugar aproximado';
            
            addressName = city ? `${city}, ${street}` : street;
            subAddressName = geocode[0].country || 'Angola';
          }

          finalLocation = {
            address: addressName,
            subAddress: subAddressName,
            latitude: lat,
            longitude: lng,
          };
          
          // Save auto-detected location into storage
          await AsyncStorage.setItem('@kinaja_address', JSON.stringify(finalLocation));
        } catch (locationError) {
          console.warn('Silent location detection failed:', locationError);
        }
      }

      setCurrentLocation(finalLocation);

    } catch (e) {
      console.warn('Error loading location', e);
    } finally {
      setLoadingLocation(false);
    }
  };

  const saveLocation = async (locationData) => {
    try {
      await AsyncStorage.setItem('@kinaja_address', JSON.stringify(locationData));
      setCurrentLocation(locationData);
    } catch (e) {
      console.warn('Error saving location', e);
    }
  };

  return (
    <LocationContext.Provider
      value={{
        currentLocation,
        loadingLocation,
        saveLocation,
      }}
    >
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
