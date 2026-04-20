import React, { useCallback } from 'react';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import { useFonts } from 'expo-font';
import {
  Poppins_400Regular,
  Poppins_500Medium,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
  Poppins_900Black,
} from '@expo-google-fonts/poppins';

import { AuthProvider } from './src/context/AuthContext';
import { CartProvider } from './src/context/CartContext';
import { AlertProvider } from './src/context/AlertContext';
import { LocationProvider } from './src/context/LocationContext';
import { LanguageProvider } from './src/context/LanguageContext';
import { AddressProvider } from './src/context/AddressContext';
import AppNavigator from './src/navigation/AppNavigator';

// i18n initialization
import './src/i18n';

// Keep splash screen visible while fonts load
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
    Poppins_900Black,
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider onLayout={onLayoutRootView}>
      <LanguageProvider>
        <AddressProvider>
          <AlertProvider>
            <AuthProvider>
              <LocationProvider>
                <CartProvider>
                  <NavigationContainer>
                    <AppNavigator />
                    <StatusBar style="dark" />
                  </NavigationContainer>
                </CartProvider>
              </LocationProvider>
            </AuthProvider>
          </AlertProvider>
        </AddressProvider>
      </LanguageProvider>
    </SafeAreaProvider>
  );
}
