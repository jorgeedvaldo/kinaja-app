import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import { useAddresses } from '../context/AddressContext';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';

export default function SavedAddressesScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { addresses, loading, deleteAddress } = useAddresses();

  const handleDelete = (id, name) => {
    Alert.alert(
      t('addresses.remove_title'),
      t('addresses.remove_confirm', { name }),
      [
        { text: t('common.cancel'), style: 'cancel' },
        { 
          text: t('common.delete'), 
          style: 'destructive',
          onPress: () => deleteAddress(id)
        },
      ]
    );
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('addresses.title')}</Text>
        <TouchableOpacity 
          onPress={() => navigation.navigate('LocationSelect', { mode: 'save' })}
          style={styles.addBtn}
        >
          <Feather name="plus-circle" size={24} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color={COLORS.primary} />
        </View>
      ) : addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIcon}>
            <Feather name="map-pin" size={48} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>{t('addresses.empty_title')}</Text>
          <Text style={styles.emptyText}>{t('addresses.empty_desc')}</Text>
          <TouchableOpacity 
            style={styles.btnPrimary}
            onPress={() => navigation.navigate('LocationSelect', { mode: 'save' })}
          >
            <Text style={styles.btnText}>{t('addresses.add_new')}</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {addresses.map((address) => (
            <View key={address.id} style={styles.addressCard}>
              <View style={styles.addressIconWrapper}>
                <Feather name="home" size={20} color={COLORS.primary} />
              </View>
              <View style={styles.addressInfo}>
                <Text style={styles.addressName}>{address.name}</Text>
                <Text style={styles.addressText} numberOfLines={2}>{address.address}</Text>
              </View>
              <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={() => handleDelete(address.id, address.name)}
              >
                <Feather name="trash-2" size={18} color={COLORS.error} />
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
  },
  backBtn: {
    padding: 8,
  },
  addBtn: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
  addressCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  addressInfo: {
    flex: 1,
  },
  addressName: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 2,
  },
  addressText: {
    fontFamily: FONTS.regular,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  deleteBtn: {
    padding: 8,
    marginLeft: 8,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  btnPrimary: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  btnText: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.accent,
  },
});
