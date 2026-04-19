import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useCustomAlert } from '../context/AlertContext';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import Button from '../components/common/Button';
import orderService from '../services/orderService';

export default function CheckoutScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { showAlert } = useCustomAlert();
  const {
    items,
    restaurantId,
    restaurantName,
    getSubtotal,
    clearCart,
  } = useCart();
  const [loading, setLoading] = useState(false);

  console.log('[DEBUG-CHECKOUT]', { items, restaurantId, restaurantName });

  const subtotal = getSubtotal();
  const deliveryFee = 500;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (loading) return; // Prevent multiple clicks
    
    setLoading(true);
    console.log('[DEBUG-CHECKOUT] Starting handlePlaceOrder...', { 
      restaurantId, 
      itemCount: items.length 
    });

    try {
      const orderData = {
        restaurant_id: restaurantId,
        delivery_fee: deliveryFee,
        items: items.map((item) => ({
          product_id: item.product.id,
          quantity: item.quantity,
          notes: item.notes || null,
        })),
      };

      console.log('[DEBUG-CHECKOUT] Sending to API:', orderData);
      const order = await orderService.create(orderData);
      console.log('[DEBUG-CHECKOUT] Success response:', order);

      clearCart();

      // For WEB/Test environment, navigate immediately to avoid Alert issues
      if (Platform.OS === 'web') {
        navigation.reset({
          index: 0,
          routes: [{ name: 'CartMain' }],
        });
        navigation.navigate('OrdersTab', {
          screen: 'OrderDetail',
          params: { order },
        });
        return;
      }

      showAlert(
        '🎉 Pedido Confirmado!',
        `O seu pedido #${order.id || ''} foi enviado com sucesso.`,
        [
          {
            text: 'Acompanhar Pedido',
            onPress: () => {
              navigation.reset({
                index: 0,
                routes: [{ name: 'CartMain' }],
              });
              navigation.navigate('OrdersTab', {
                screen: 'OrderDetail',
                params: { order },
              });
            },
          },
        ]
      );
    } catch (error) {
      console.error('[DEBUG-CHECKOUT] API Error:', error.response?.data || error.message);
      const message =
        error.response?.data?.message || 'Erro ao enviar pedido. Tente novamente.';
      showAlert('Erro', message, [{ text: 'OK' }]);
      setLoading(false); // Only reset loading on ERROR
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={20} color={COLORS.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Confirmar Pedido</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Delivery Address */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="map-pin" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Endereço de Entrega</Text>
          </View>
          <View style={styles.addressCard}>
            <Text style={styles.addressText}>Luanda, Talatona</Text>
            <Text style={styles.addressSub}>Rua principal, próximo ao mercado</Text>
          </View>
        </View>

        {/* Restaurant */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="home" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Restaurante</Text>
          </View>
          <Text style={styles.restaurantName}>{restaurantName}</Text>
        </View>

        {/* Order Items */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="shopping-bag" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Itens do Pedido</Text>
          </View>
          {items.map((item) => (
            <View key={item.product.id} style={styles.itemRow}>
              <View style={styles.itemQty}>
                <Text style={styles.itemQtyText}>{item.quantity}x</Text>
              </View>
              <Text style={styles.itemName} numberOfLines={1}>
                {item.product.name}
              </Text>
              <Text style={styles.itemPrice}>
                Kz {(parseFloat(item.product.price) * item.quantity).toLocaleString('pt-AO')}
              </Text>
            </View>
          ))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Feather name="credit-card" size={18} color={COLORS.primary} />
            <Text style={styles.sectionTitle}>Pagamento</Text>
          </View>
          <View style={styles.paymentCard}>
            <View style={styles.paymentOption}>
              <View style={styles.paymentRadio}>
                <View style={styles.paymentRadioInner} />
              </View>
              <Text style={styles.paymentText}>💵 Dinheiro na Entrega</Text>
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Bottom - Total & Confirm */}
      <View style={[styles.bottomSection, { paddingBottom: insets.bottom + 90 }]}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Subtotal</Text>
          <Text style={styles.summaryValue}>Kz {subtotal.toLocaleString('pt-AO')}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Taxa de entrega</Text>
          <Text style={styles.summaryValue}>Kz {deliveryFee.toLocaleString('pt-AO')}</Text>
        </View>
        <View style={styles.divider} />
        <View style={styles.summaryRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>Kz {total.toLocaleString('pt-AO')}</Text>
        </View>

        <Button
          title="Confirmar Pedido"
          onPress={handlePlaceOrder}
          loading={loading}
          style={styles.confirmButton}
          icon={<Feather name="check-circle" size={18} color={COLORS.accent} />}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 16,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
  },
  addressCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  addressText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.dark,
  },
  addressSub: {
    fontFamily: FONTS.regular,
    fontSize: 12,
    color: COLORS.textMuted,
    marginTop: 4,
  },
  restaurantName: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.textPrimary,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemQty: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  itemQtyText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.primary,
  },
  itemName: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  itemPrice: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  paymentCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  paymentOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  paymentRadio: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  paymentRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: COLORS.primary,
  },
  paymentText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
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
  confirmButton: {
    marginTop: 16,
  },
});
