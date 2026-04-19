import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import Button from '../components/common/Button';

export default function ProductDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { product, restaurant } = route.params;
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [notes, setNotes] = useState('');

  const unitPrice = parseFloat(product.price);
  const totalPrice = unitPrice * quantity;

  const handleAddToCart = () => {
    addItem(product, quantity, notes, restaurant || null);
    Alert.alert(
      '✅ Adicionado!',
      `${quantity}x ${product.name} adicionado ao carrinho`,
      [
        { text: 'Continuar Comprando', style: 'cancel' },
        { text: 'Ver Carrinho', onPress: () => navigation.navigate('CartTab') },
      ]
    );
  };

  return (
    <View style={styles.container}>
      {/* Product Image */}
      <View style={styles.imageContainer}>
        {product.image ? (
          <Image source={{ uri: product.image }} style={styles.image} />
        ) : (
          <View style={[styles.image, styles.imagePlaceholder]}>
            <Feather name="image" size={60} color={COLORS.textLight} />
          </View>
        )}
        <View style={styles.imageOverlay} />

        {/* Back button */}
        <TouchableOpacity
          style={[styles.backButton, { top: insets.top + 8 }]}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={20} color={COLORS.dark} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.contentScroll}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.contentContainer}
      >
        {/* Product Info */}
        <View style={styles.infoSection}>
          <View style={styles.nameRow}>
            <Text style={styles.name}>{product.name}</Text>
            <View style={styles.ratingBadge}>
              <Feather name="star" size={12} color={COLORS.star} />
              <Text style={styles.ratingText}>4.5</Text>
            </View>
          </View>

          <Text style={styles.price}>
            Kz {unitPrice.toLocaleString('pt-AO')}
          </Text>

          {product.description && (
            <Text style={styles.description}>{product.description}</Text>
          )}
        </View>

        {/* Quantity Selector */}
        <View style={styles.quantitySection}>
          <Text style={styles.sectionLabel}>Quantidade</Text>
          <View style={styles.quantityControls}>
            <TouchableOpacity
              style={styles.qtyBtn}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
              activeOpacity={0.7}
            >
              <Feather name="minus" size={18} color={COLORS.primary} />
            </TouchableOpacity>
            <Text style={styles.qtyValue}>{quantity}</Text>
            <TouchableOpacity
              style={[styles.qtyBtn, styles.qtyBtnActive]}
              onPress={() => setQuantity(quantity + 1)}
              activeOpacity={0.7}
            >
              <Feather name="plus" size={18} color={COLORS.accent} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Special Notes */}
        <View style={styles.notesSection}>
          <Text style={styles.sectionLabel}>Observações (opcional)</Text>
          <TextInput
            style={styles.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Ex: Sem cebola, extra queijo..."
            placeholderTextColor={COLORS.textLight}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </ScrollView>

      {/* Bottom Bar - Add to Cart */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 16 }]}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalPrice}>
            Kz {totalPrice.toLocaleString('pt-AO')}
          </Text>
        </View>
        <Button
          title="Adicionar ao Carrinho"
          onPress={handleAddToCart}
          style={styles.addButton}
          icon={<Feather name="shopping-cart" size={18} color={COLORS.accent} />}
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
  imageContainer: {
    height: 280,
    position: 'relative',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  imagePlaceholder: {
    backgroundColor: COLORS.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.05)',
  },
  backButton: {
    position: 'absolute',
    left: 16,
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  contentScroll: {
    flex: 1,
    marginTop: -24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: COLORS.background,
  },
  contentContainer: {
    padding: 24,
    paddingBottom: 20,
  },
  infoSection: {
    marginBottom: 24,
  },
  nameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 24,
    color: COLORS.dark,
    flex: 1,
    marginRight: 12,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  ratingText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.primary,
    marginBottom: 12,
  },
  description: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: COLORS.surface,
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  sectionLabel: {
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.textPrimary,
    marginBottom: 4,
  },
  quantityControls: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qtyBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    borderWidth: 1.5,
    borderColor: COLORS.borderMedium,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyBtnActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  qtyValue: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
    minWidth: 24,
    textAlign: 'center',
  },
  notesSection: {
    marginBottom: 16,
  },
  notesInput: {
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    borderRadius: 14,
    padding: 14,
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textPrimary,
    minHeight: 80,
    marginTop: 8,
  },
  bottomBar: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 24,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -4 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 5,
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  totalPrice: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.primary,
  },
  addButton: {
    width: '100%',
  },
});
