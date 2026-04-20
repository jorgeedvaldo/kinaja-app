import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, TextInput, Keyboard, Platform, Modal } from 'react-native';
import MapView from '../components/Map/MapView';
import * as Location from 'expo-location';
import { Feather } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import Button from '../components/common/Button';
import { useLocation } from '../context/LocationContext';
import { useCustomAlert } from '../context/AlertContext';
import { useAddresses } from '../context/AddressContext';
import { useTranslation } from 'react-i18next';

export default function LocationSelectScreen({ navigation, route }) {
  const insets = useSafeAreaInsets();
  const { currentLocation, saveLocation } = useLocation();
  const { saveAddress } = useAddresses();
  const { showAlert } = useCustomAlert();
  const { t } = useTranslation();
  const mapRef = useRef(null);

  const [region, setRegion] = useState(null);
  const [address, setAddress] = useState('Buscando localização...');
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  
  const [isSaveModalVisible, setIsSaveModalVisible] = useState(false);
  const [addressNickname, setAddressNickname] = useState('');

  const defaultLocation = {
    latitude: -8.8390,
    longitude: 13.2894,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLoading(false);
        setRegion(currentLocation ? {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        } : defaultLocation);
        setAddress(currentLocation?.address || 'Permissão de GPS negada');
        return;
      }

      goToMyLocation();
    })();
  }, []);

  const goToMyLocation = async () => {
    try {
      setLoading(true);
      let location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      
      const newRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
      };

      if (mapRef.current) {
        mapRef.current.animateToRegion(newRegion, 1000);
      } else {
        setRegion(newRegion);
        fetchAddress(location.coords.latitude, location.coords.longitude);
      }
    } catch (error) {
      console.warn('Erro ao buscar localização', error);
      if (!region) {
        setRegion(defaultLocation);
        setAddress('Morada não encontrada');
      }
      setLoading(false);
    }
  };

  const fetchAddress = async (lat, lng) => {
    try {
      setLoading(true);
      let geocode = await Location.reverseGeocodeAsync({ latitude: lat, longitude: lng });
      if (geocode && geocode.length > 0) {
        let street = geocode[0].street || geocode[0].name || geocode[0].district || 'Rua desconhecida';
        let city = geocode[0].city || geocode[0].region || '';
        if (street.includes('Unnamed')) street = 'Lugar aproximado';
        
        let fullAddr = city ? `${city}, ${street}` : street;
        setAddress(fullAddr);
      } else {
        setAddress('Localização selecionada no mapa');
      }
    } catch (e) {
      setAddress('Não foi possível ler o nome da rua');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    Keyboard.dismiss();
    setLoading(true);
    try {
      const results = await Location.geocodeAsync(searchQuery);
      if (results && results.length > 0) {
        const coords = results[0];
        mapRef.current?.animateToRegion({
          latitude: coords.latitude,
          longitude: coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01
        }, 1000);
      } else {
        showAlert('Local não encontrado', 'Não conseguimos localizar este endereço. Tente ser mais específico.');
      }
    } catch (e) {
      console.warn(e);
      showAlert('Erro', 'Ocorreu um erro ao buscar o endereço.');
    } finally {
      setLoading(false);
    }
  };

  const handleRegionChangeComplete = (newRegion) => {
    setRegion(newRegion);
    fetchAddress(newRegion.latitude, newRegion.longitude);
  };

  const handleConfirm = async () => {
    if (!region) return;

    if (route.params?.mode === 'save') {
      const defaultName = address.split(',')[1]?.trim() || address.split(',')[0] || '';
      setAddressNickname(defaultName);
      setIsSaveModalVisible(true);
      return;
    }

    let mainAddress = address.split(',')[0] || address;
    let subAddress = address.split(',')[1]?.trim() || 'Morada guardada';

    const locationData = {
      address: mainAddress,
      subAddress: subAddress,
      latitude: region.latitude,
      longitude: region.longitude,
    };
    await saveLocation(locationData);
    navigation.goBack();
  };

  const handleSaveConfirmed = async () => {
    if (!addressNickname.trim()) return;
    
    const success = await saveAddress({
      name: addressNickname,
      address: address,
      latitude: region.latitude,
      longitude: region.longitude,
    });

    if (success) {
      setIsSaveModalVisible(false);
      navigation.goBack();
    } else {
      showAlert('Erro', 'Não foi possível guardar o endereço.');
    }
  };

  return (
    <View style={styles.container}>
      {/* MAP */}
      {region ? (
        <MapView
          ref={mapRef}
          style={styles.map}
          initialRegion={region}
          onRegionChangeComplete={handleRegionChangeComplete}
          showsUserLocation={true}
          showsMyLocationButton={false}
        />
      ) : (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={COLORS.primary} />
          <Text style={styles.loadingText}>A obter satélites...</Text>
        </View>
      )}

      {/* CENTER PIN OVERLAY */}
      {region && (
        <View style={styles.pinContainer} pointerEvents="none">
          <Feather name="map-pin" size={40} color={COLORS.primary} />
        </View>
      )}

      {/* GPS BUTTON */}
      {region && (
        <TouchableOpacity 
          style={[styles.myLocationBtn, { bottom: 250 + insets.bottom }]} 
          onPress={goToMyLocation}
          activeOpacity={0.8}
        >
          <Feather name="crosshair" size={24} color={COLORS.dark} />
        </TouchableOpacity>
      )}

      {/* HEADER & SEARCH */}
      <View style={[styles.header, { paddingTop: insets.top + 10 }]}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={20} color={COLORS.dark} />
        </TouchableOpacity>
        
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Pesquisar rua ou bairro..."
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
            placeholderTextColor={COLORS.textMuted}
          />
          <TouchableOpacity onPress={handleSearch} style={styles.searchBtn}>
            <Feather name="search" size={18} color={COLORS.textSecondary} />
          </TouchableOpacity>
        </View>
      </View>

      {/* BOTTOM MODAL ACTION */}
      <View style={[styles.bottomSheet, { paddingBottom: Math.max(insets.bottom, 20) }]}>
        <Text style={styles.sheetTitle}>Morada apontada</Text>
        
        <View style={styles.addressBox}>
          <Feather name="map-pin" size={18} color={COLORS.primary} />
          <Text style={styles.currentAddressText} numberOfLines={2}>
            {address}
          </Text>
          {loading && <ActivityIndicator size="small" color={COLORS.primary} />}
        </View>

        <Button
          title={route.params?.mode === 'save' ? t('addresses.save_address') : t('addresses.confirm_location')}
          onPress={handleConfirm}
          disabled={!region}
          style={styles.confirmBtn}
        />
      </View>

      {/* SAVE NICKNAME MODAL */}
      <Modal
        visible={isSaveModalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setIsSaveModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{t('addresses.nickname_title')}</Text>
            <Text style={styles.modalDesc}>{t('addresses.nickname_hint')}</Text>
            
            <TextInput
              style={styles.nicknameInput}
              value={addressNickname}
              onChangeText={setAddressNickname}
              autoFocus
              placeholder={t('addresses.nickname_placeholder')}
            />

            <View style={styles.modalActions}>
              <TouchableOpacity 
                style={styles.cancelBtn} 
                onPress={() => setIsSaveModalVisible(false)}
              >
                <Text style={styles.cancelText}>{t('common.cancel')}</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveBtn} 
                onPress={handleSaveConfirmed}
              >
                <Text style={styles.saveText}>{t('common.save')}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  pinContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -20,
    marginTop: -40,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontFamily: FONTS.medium,
    marginTop: 12,
    color: COLORS.textSecondary,
  },
  header: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  backBtn: {
    backgroundColor: COLORS.surface,
    padding: 12,
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    paddingHorizontal: 16,
    borderRadius: 12,
    height: 44,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  searchInput: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
    height: '100%',
  },
  searchBtn: {
    padding: 4,
  },
  myLocationBtn: {
    position: 'absolute',
    right: 20,
    backgroundColor: COLORS.surface,
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  bottomSheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    paddingHorizontal: 24,
    paddingTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -5 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  sheetTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
    marginBottom: 16,
  },
  addressBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.backgroundGray,
    padding: 16,
    borderRadius: 16,
    marginBottom: 20,
    gap: 12,
    minHeight: 60,
  },
  currentAddressText: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  confirmBtn: {
    width: '100%',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    padding: 30,
  },
  modalContent: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    padding: 24,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.dark,
    marginBottom: 4,
  },
  modalDesc: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 20,
  },
  nicknameInput: {
    backgroundColor: COLORS.backgroundGray,
    borderRadius: 12,
    padding: 16,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.dark,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginBottom: 24,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
  },
  cancelBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  cancelText: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.textMuted,
  },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  saveText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.accent,
  },
});
