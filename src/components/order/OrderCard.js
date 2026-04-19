import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Feather } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { FONTS } from '../../constants/typography';

const STATUS_LABELS = {
  pending: { label: 'Pendente', color: COLORS.warning, bg: '#FEF3C7' },
  accepted: { label: 'Aceite', color: COLORS.info, bg: '#DBEAFE' },
  preparing: { label: 'Preparando', color: COLORS.info, bg: '#DBEAFE' },
  ready: { label: 'Pronto', color: COLORS.success, bg: '#D1FAE5' },
  in_transit: { label: 'A Caminho', color: COLORS.primary, bg: '#FEE2E2' },
  delivered: { label: 'Entregue', color: COLORS.success, bg: '#D1FAE5' },
  cancelled: { label: 'Cancelado', color: COLORS.error, bg: '#FEE2E2' },
};

export default function OrderCard({ order, onPress }) {
  const statusConfig = STATUS_LABELS[order.status] || STATUS_LABELS.pending;
  const date = new Date(order.created_at);
  const formattedDate = date.toLocaleDateString('pt-AO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(order)}
      activeOpacity={0.95}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.orderId}>Pedido #{order.id}</Text>
          <Text style={styles.restaurant}>
            {order.restaurant?.name || 'Restaurante'}
          </Text>
        </View>
        <View style={[styles.statusBadge, { backgroundColor: statusConfig.bg }]}>
          <Text style={[styles.statusText, { color: statusConfig.color }]}>
            {statusConfig.label}
          </Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.footer}>
        <View style={styles.footerItem}>
          <Feather name="calendar" size={14} color={COLORS.textMuted} />
          <Text style={styles.footerText}>{formattedDate}</Text>
        </View>
        <View style={styles.footerItem}>
          <Feather name="package" size={14} color={COLORS.textMuted} />
          <Text style={styles.footerText}>
            {order.items?.length || 0} {order.items?.length === 1 ? 'item' : 'itens'}
          </Text>
        </View>
        <Text style={styles.total}>
          Kz {parseFloat(order.total_amount || 0).toLocaleString('pt-AO')}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  orderId: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.dark,
  },
  restaurant: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: {
    fontFamily: FONTS.bold,
    fontSize: 11,
  },
  divider: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginRight: 16,
  },
  footerText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textMuted,
  },
  total: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
    marginLeft: 'auto',
  },
});
