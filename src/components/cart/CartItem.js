import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { FONTS } from '../../constants/typography';

export default function CartItem({ item, onUpdateQuantity, onRemove }) {
  const { product, quantity, notes } = item;
  const total = parseFloat(product.price) * quantity;

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={styles.imagePlaceholder}>
            <Feather name="shopping-bag" size={20} color={COLORS.textLight} />
          </View>
        )}
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.nameRow}>
          <Text style={styles.name} numberOfLines={1}>{product.name}</Text>
          <TouchableOpacity onPress={() => onRemove(product.id)} hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}>
            <Feather name="trash-2" size={16} color={COLORS.textMuted} />
          </TouchableOpacity>
        </View>

        {notes ? <Text style={styles.notes} numberOfLines={1}>📝 {notes}</Text> : null}

        <View style={styles.footer}>
          <Text style={styles.price}>
            Kz {total.toLocaleString('pt-AO')}
          </Text>

          {/* Quantity Controls */}
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.qtyButton}
              onPress={() => onUpdateQuantity(product.id, quantity - 1)}
              activeOpacity={0.7}
            >
              <Feather name="minus" size={14} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.qtyButton, styles.qtyButtonActive]}
              onPress={() => onUpdateQuantity(product.id, quantity + 1)}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={14} color={COLORS.accent} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  imageContainer: {
    width: 72,
    height: 72,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: COLORS.backgroundGray,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.dark,
    flex: 1,
    marginRight: 8,
  },
  notes: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textMuted,
    marginTop: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 8,
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyButtonActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  quantity: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.dark,
    minWidth: 20,
    textAlign: 'center',
  },
});
