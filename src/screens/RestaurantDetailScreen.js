import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useCart } from '../context/CartContext';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import ProductCard from '../components/restaurant/ProductCard';
import Badge from '../components/common/Badge';
import restaurantService from '../services/restaurantService';

export default function RestaurantDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { restaurant } = route.params;
  const { addItem, itemCount } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      const data = await restaurantService.getProducts(restaurant.id);
      setProducts(Array.isArray(data) ? data : []);
    } catch (error) {
      console.warn('Error loading products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddToCart = (product) => {
    addItem(product, 1, '', restaurant);
  };

  // Group products by category
  const groupedProducts = products.reduce((groups, product) => {
    const categoryName = product.category?.name || 'Outros';
    if (!groups[categoryName]) groups[categoryName] = [];
    groups[categoryName].push(product);
    return groups;
  }, {});

  return (
    <View style={styles.container}>
      {/* Cover Image */}
      <View style={styles.coverContainer}>
        <Image
          source={{
            uri: restaurant.cover_image ||
              'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600',
          }}
          style={styles.coverImage}
        />
        {/* Overlay */}
        <View style={styles.coverOverlay} />

        {/* Back & Cart buttons */}
        <View style={[styles.headerButtons, { top: insets.top + 8 }]}>
          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={20} color={COLORS.dark} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.headerBtn}
            onPress={() => navigation.navigate('CartTab')}
          >
            <Feather name="shopping-bag" size={18} color={COLORS.dark} />
            {itemCount > 0 && <Badge count={itemCount} style={styles.cartBadge} />}
          </TouchableOpacity>
        </View>
      </View>

      {/* Restaurant Info */}
      <View style={styles.infoCard}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>{restaurant.cuisine_type || 'Variada'}</Text>

        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Feather name="star" size={14} color={COLORS.star} />
            <Text style={styles.metaValue}>{restaurant.rating || '0.0'}</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Feather name="clock" size={14} color={COLORS.textSecondary} />
            <Text style={styles.metaValue}>{restaurant.prep_time_mins || 30} min</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Feather name="truck" size={14} color={COLORS.success} />
            <Text style={[styles.metaValue, { color: COLORS.success }]}>Entrega Grátis</Text>
          </View>
        </View>
      </View>

      {/* Menu */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.menuContent}
      >
        {loading ? (
          <ActivityIndicator
            size="large"
            color={COLORS.primary}
            style={styles.loader}
          />
        ) : Object.keys(groupedProducts).length > 0 ? (
          Object.entries(groupedProducts).map(([category, items]) => (
            <View key={category} style={styles.categoryGroup}>
              <Text style={styles.categoryTitle}>{category}</Text>
              {items.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onPress={(p) => navigation.navigate('ProductDetail', { product: p, restaurant })}
                  onAddToCart={() => handleAddToCart(product)}
                />
              ))}
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Feather name="book-open" size={40} color={COLORS.textLight} />
            <Text style={styles.emptyText}>Menu ainda não disponível</Text>
          </View>
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
  coverContainer: {
    height: 220,
    position: 'relative',
  },
  coverImage: {
    width: '100%',
    height: '100%',
  },
  coverOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.15)',
  },
  headerButtons: {
    position: 'absolute',
    left: 16,
    right: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  headerBtn: {
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
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  infoCard: {
    backgroundColor: COLORS.surface,
    marginHorizontal: 16,
    marginTop: -24,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 4,
    zIndex: 1,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.dark,
    marginBottom: 4,
  },
  cuisine: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaValue: {
    fontFamily: FONTS.semiBold,
    fontSize: 13,
    color: COLORS.textSecondary,
  },
  metaDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.textLight,
    marginHorizontal: 10,
  },
  menuContent: {
    padding: 16,
    paddingBottom: 110,
  },
  loader: {
    marginTop: 40,
  },
  categoryGroup: {
    marginBottom: 20,
  },
  categoryTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.textPrimary,
    marginBottom: 12,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    gap: 12,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
