import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { FONTS } from '../../constants/typography';

export default function PopularItems({ products = [], onItemPress, onAddToCart, onViewAll }) {
  if (!products.length) return null;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Mais Pedidos</Text>
        <TouchableOpacity
          style={styles.viewAll}
          onPress={onViewAll}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>Ver Todos</Text>
          <Feather name="chevron-right" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {products.map((product) => (
          <TouchableOpacity
            key={product.id}
            style={styles.card}
            onPress={() => onItemPress(product)}
            activeOpacity={0.9}
          >
            {/* Floating circular image */}
            <View style={styles.imageWrapper}>
              <Image
                source={{
                  uri: product.image || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=300',
                }}
                style={styles.image}
              />
            </View>

            {/* Rating */}
            <View style={styles.rating}>
              <Feather name="star" size={12} color={COLORS.star} />
              <Text style={styles.ratingText}>
                {product.rating || '4.5'}
              </Text>
            </View>

            {/* Name & Description */}
            <Text style={styles.name} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.description} numberOfLines={2}>
              {product.description || 'Deliciosa opção'}
            </Text>

            {/* Price & Add button */}
            <View style={styles.footer}>
              <Text style={styles.price}>
                <Text style={styles.currency}>Kz </Text>
                {parseFloat(product.price).toLocaleString('pt-AO')}
              </Text>
              <TouchableOpacity
                style={styles.addButton}
                onPress={(e) => {
                  e.stopPropagation();
                  onAddToCart(product);
                }}
                activeOpacity={0.8}
              >
                <Feather name="plus" size={18} color={COLORS.accent} />
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    marginBottom: 20,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textPrimary,
  },
  viewAll: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  viewAllText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 16,
    gap: 16,
  },
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 16,
    width: 160,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.04,
    shadowRadius: 24,
    elevation: 3,
  },
  imageWrapper: {
    position: 'absolute',
    top: -40,
    left: '50%',
    marginLeft: -48,
    width: 96,
    height: 96,
    borderRadius: 48,
    backgroundColor: COLORS.surface,
    borderWidth: 4,
    borderColor: COLORS.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
    alignSelf: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 56,
    marginBottom: 6,
  },
  ratingText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.dark,
    marginBottom: 4,
  },
  description: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.textMuted,
    lineHeight: 14,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  price: {
    fontFamily: FONTS.bold,
    fontSize: 15,
    color: COLORS.primary,
  },
  currency: {
    fontSize: 10,
    fontFamily: FONTS.bold,
  },
  addButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
});
