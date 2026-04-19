import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import { FONTS } from '../../constants/typography';

const STATUS_CONFIG = {
  pending: { label: 'Pendente', color: COLORS.warning, icon: '⏳' },
  accepted: { label: 'Aceite', color: COLORS.info, icon: '✅' },
  preparing: { label: 'Preparando', color: COLORS.info, icon: '👨‍🍳' },
  ready: { label: 'Pronto', color: COLORS.success, icon: '📦' },
  in_transit: { label: 'A Caminho', color: COLORS.primary, icon: '🛵' },
  delivered: { label: 'Entregue', color: COLORS.success, icon: '🎉' },
  cancelled: { label: 'Cancelado', color: COLORS.error, icon: '❌' },
};

const STEPS = ['pending', 'accepted', 'preparing', 'ready', 'in_transit', 'delivered'];

export default function OrderTimeline({ status }) {
  const currentStepIndex = STEPS.indexOf(status);
  const isCancelled = status === 'cancelled';

  return (
    <View style={styles.container}>
      {STEPS.map((step, index) => {
        const config = STATUS_CONFIG[step];
        const isCompleted = !isCancelled && index <= currentStepIndex;
        const isActive = !isCancelled && index === currentStepIndex;
        const isLast = index === STEPS.length - 1;

        return (
          <View key={step} style={styles.stepRow}>
            {/* Dot & Line */}
            <View style={styles.lineColumn}>
              <View
                style={[
                  styles.dot,
                  isCompleted && { backgroundColor: config.color },
                  isActive && styles.dotActive,
                  isCancelled && { backgroundColor: COLORS.textLight },
                ]}
              >
                {isCompleted && (
                  <Text style={styles.dotIcon}>
                    {isActive ? config.icon : '✓'}
                  </Text>
                )}
              </View>
              {!isLast && (
                <View
                  style={[
                    styles.line,
                    isCompleted && index < currentStepIndex && { backgroundColor: config.color },
                  ]}
                />
              )}
            </View>

            {/* Label */}
            <View style={styles.labelContainer}>
              <Text
                style={[
                  styles.label,
                  isActive && styles.labelActive,
                  isCompleted && !isActive && styles.labelCompleted,
                ]}
              >
                {config.label}
              </Text>
            </View>
          </View>
        );
      })}

      {isCancelled && (
        <View style={styles.cancelledBanner}>
          <Text style={styles.cancelledText}>❌ Pedido Cancelado</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 8,
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  lineColumn: {
    alignItems: 'center',
    width: 32,
  },
  dot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: COLORS.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dotActive: {
    width: 32,
    height: 32,
    borderRadius: 16,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dotIcon: {
    fontSize: 12,
  },
  line: {
    width: 2,
    height: 24,
    backgroundColor: COLORS.borderMedium,
  },
  labelContainer: {
    marginLeft: 12,
    paddingTop: 4,
    paddingBottom: 20,
  },
  label: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
  },
  labelActive: {
    fontFamily: FONTS.bold,
    color: COLORS.textPrimary,
    fontSize: 15,
  },
  labelCompleted: {
    color: COLORS.textSecondary,
  },
  cancelledBanner: {
    marginTop: 8,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  cancelledText: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.error,
  },
});
