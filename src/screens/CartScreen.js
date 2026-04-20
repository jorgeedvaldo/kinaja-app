import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import { useTranslation } from 'react-i18next';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import CartItem from '../components/cart/CartItem';
import Button from '../components/common/Button';

export default function CartScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const {
    items,
    restaurantName,
    updateQuantity,
    removeItem,
    clearCart,
    getSubtotal,
    itemCount,
  } = useCart();
  const { t } = useTranslation();

  const subtotal = getSubtotal();
  const deliveryFee = subtotal > 0 ? 500 : 0;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <View style={[styles.container, styles.emptyContainer, { paddingTop: insets.top }]}>
        <View style={styles.emptyContent}>
          <View style={styles.emptyIconCircle}>
            <Feather name="shopping-cart" size={48} color={COLORS.textLight} />
          </View>
          <Text style={styles.emptyTitle}>{t('cart.empty_title')}</Text>
          <Text style={styles.emptyText}>
            {t('cart.empty_desc')}
          </Text>
          <Button
            title={t('cart.explore')}
            onPress={() => navigation.navigate('HomeTab')}
            style={styles.exploreButton}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>{t('cart.title')}</Text>
        <TouchableOpacity onPress={clearCart} activeOpacity={0.7}>
          <Text style={styles.clearText}>{t('cart.clear')}</Text>
        </TouchableOpacity>
      </View>

      {/* Restaurant Info */}
      <View style={styles.restaurantInfo}>
        <Feather name="map-pin" size={14} color={COLORS.primary} />
        <Text style={styles.restaurantName}>{restaurantName}</Text>
      </View>

      {/* Cart Items */}
      <FlatList
        data={items}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <CartItem
            item={item}
            onUpdateQuantity={updateQuantity}
            onRemove={removeItem}
          />
        )}
      />

      {/* Summary & Checkout */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 90 }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('cart.subtotal')}</Text>
          <Text style={styles.summaryValue}>
            Kz {subtotal.toLocaleString('pt-AO')}
          </Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>{t('cart.delivery_fee')}</Text>
          <Text style={styles.summaryValue}>
            {deliveryFee === 0 ? t('common.free') : `Kz ${deliveryFee.toLocaleString('pt-AO')}`}
          </Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>{t('cart.total')}</Text>
          <Text style={styles.totalValue}>
            Kz {total.toLocaleString('pt-AO')}
          </Text>
        </View>

        <Button
          title={`${t('cart.checkout')} (${itemCount} ${itemCount === 1 ? t('common.item') : t('common.items')})`}
          onPress={() => navigation.navigate('Checkout')}
          style={styles.checkoutButton}
          icon={<Feather name="arrow-right" size={18} color={COLORS.accent} />}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  emptyContainer: {
    justifyContent: 'center',
  },
  emptyContent: {
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  emptyIconCircle: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  emptyTitle: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  emptyText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    marginBottom: 24,
  },
  exploreButton: {
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.dark,
  },
  clearText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.error,
  },
  restaurantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 24,
    paddingBottom: 16,
  },
  restaurantName: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  listContent: {
    padding: 24,
    paddingTop: 8,
  },
  bottomSection: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingTop: 20,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  summaryValue: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.dark,
  },
  totalValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.primary,
  },
  checkoutButton: {
    marginTop: 16,
  },
});
