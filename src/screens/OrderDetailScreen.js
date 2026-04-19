import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import OrderTimeline from '../components/order/OrderTimeline';
import Button from '../components/common/Button';
import orderService from '../services/orderService';

const CANCELLABLE = ['pending', 'accepted'];

export default function OrderDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { order: initialOrder } = route.params;
  const [order, setOrder] = useState(initialOrder);
  const [loading, setLoading] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  useEffect(() => {
    loadOrder();
  }, []);

  const loadOrder = async () => {
    try {
      const data = await orderService.getById(order.id);
      if (data) setOrder(data);
    } catch (error) {
      console.warn('Error loading order:', error);
    }
  };

  const handleCancel = () => {
    console.log('[DEBUG-CANCEL] handleCancel triggered.');
    
    const onConfirm = async () => {
      console.log('[DEBUG-CANCEL] Starting handleCancel for order:', order.id);
      setCancelling(true);
      try {
        const result = await orderService.cancel(order.id);
        console.log('[DEBUG-CANCEL] Success response:', result);
        
        // Update local state immediately
        setOrder((prev) => ({ ...prev, status: 'cancelled' }));
        
        if (Platform.OS !== 'web') {
          Alert.alert('Pedido Cancelado', 'O seu pedido foi cancelado com sucesso.');
        } else {
          alert('Pedido Cancelado com sucesso!');
        }
      } catch (error) {
        console.error('[DEBUG-CANCEL] API Error:', error.response?.data || error.message);
        const msg = error.response?.data?.message || 'Erro ao cancelar pedido.';
        Alert.alert('Erro', msg);
      } finally {
        setCancelling(false);
      }
    };

    if (Platform.OS === 'web') {
      if (window.confirm('Tem certeza que deseja cancelar este pedido?')) {
        onConfirm();
      }
      return;
    }

    Alert.alert(
      'Cancelar Pedido',
      'Tem certeza que deseja cancelar este pedido?',
      [
        { text: 'Não', style: 'cancel' },
        {
          text: 'Sim, Cancelar',
          style: 'destructive',
          onPress: onConfirm,
        },
      ]
    );
  };

  const total = parseFloat(order.total_amount || 0) + parseFloat(order.delivery_fee || 0);

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
        <Text style={styles.headerTitle}>Pedido #{order.id}</Text>
        <TouchableOpacity onPress={loadOrder}>
          <Feather name="refresh-cw" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Status Timeline */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Estado do Pedido</Text>
          <View style={styles.timelineCard}>
            <OrderTimeline status={order.status} />
          </View>
        </View>

        {/* Restaurant */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurante</Text>
          <View style={styles.infoCard}>
            <Feather name="home" size={18} color={COLORS.primary} />
            <Text style={styles.infoText}>
              {order.restaurant?.name || 'Restaurante'}
            </Text>
          </View>
        </View>

        {/* Items */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Itens</Text>
          <View style={styles.itemsCard}>
            {(order.items || []).map((item, index) => (
              <View
                key={item.id || index}
                style={[
                  styles.itemRow,
                  index < (order.items?.length || 0) - 1 && styles.itemBorder,
                ]}
              >
                <View style={styles.itemQtyBadge}>
                  <Text style={styles.itemQtyText}>{item.quantity}x</Text>
                </View>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.product?.name || `Produto #${item.product_id}`}
                </Text>
                <Text style={styles.itemPrice}>
                  Kz {(parseFloat(item.unit_price) * item.quantity).toLocaleString('pt-AO')}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Resumo</Text>
          <View style={styles.summaryCard}>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Subtotal</Text>
              <Text style={styles.summaryValue}>
                Kz {parseFloat(order.total_amount || 0).toLocaleString('pt-AO')}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>Taxa de entrega</Text>
              <Text style={styles.summaryValue}>
                Kz {parseFloat(order.delivery_fee || 0).toLocaleString('pt-AO')}
              </Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.summaryRow}>
              <Text style={styles.totalLabel}>Total</Text>
              <Text style={styles.totalValue}>
                Kz {total.toLocaleString('pt-AO')}
              </Text>
            </View>
          </View>
        </View>

        {/* Cancel Button */}
        {CANCELLABLE.includes(order.status) && (
          <Button
            title="Cancelar Pedido"
            variant="outline"
            onPress={handleCancel}
            loading={cancelling}
            style={styles.cancelButton}
            textStyle={{ color: COLORS.error }}
            icon={<Feather name="x-circle" size={18} color={COLORS.error} />}
          />
        )}
      </ScrollView>
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
    paddingBottom: 120,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  timelineCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  infoText: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
  itemsCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  itemQtyBadge: {
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
  summaryCard: {
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: 14,
    borderWidth: 1,
    borderColor: COLORS.border,
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
    marginVertical: 8,
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
  cancelButton: {
    borderColor: COLORS.error,
    marginTop: 8,
  },
});
