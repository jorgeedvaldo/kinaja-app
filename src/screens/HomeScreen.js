import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import SearchBar from '../components/common/SearchBar';
import Badge from '../components/common/Badge';
import PromoBanner from '../components/home/PromoBanner';
import CategoryList from '../components/home/CategoryList';
import PopularItems from '../components/home/PopularItems';
import RestaurantCard from '../components/home/RestaurantCard';
import restaurantService from '../services/restaurantService';
import categoryService from '../services/categoryService';

export default function HomeScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { itemCount } = useCart();
  const { addItem } = useCart();

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadData = useCallback(async () => {
    try {
      const [resData, catData] = await Promise.all([
        restaurantService.getAll(),
        categoryService.getAll(),
      ]);

      const restaurantList = Array.isArray(resData) ? resData : [];
      setRestaurants(restaurantList);
      setCategories(Array.isArray(catData) ? catData : []);

      // Try to get popular products from first restaurant
      if (restaurantList.length > 0) {
        try {
          const products = await restaurantService.getProducts(restaurantList[0].id);
          setPopularProducts(Array.isArray(products) ? products.slice(0, 6) : []);
        } catch (e) {
          setPopularProducts([]);
        }
      }
    } catch (error) {
      console.warn('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  const handleAddToCart = (product) => {
    const restaurant = restaurants.find(r => {
      if (product.restaurant_id) return r.id === product.restaurant_id;
      return true;
    });
    addItem(product, 1, '', restaurant || null);
  };

  const firstName = user?.name?.split(' ')[0] || 'Usuário';

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.menuButton} activeOpacity={0.7}>
          <Feather name="menu" size={22} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <View style={styles.locationContainer}>
          <Text style={styles.locationLabel}>Entregar em</Text>
          <TouchableOpacity style={styles.locationRow} activeOpacity={0.7}>
            <Text style={styles.locationText}>Luanda, Talatona</Text>
            <Feather name="chevron-down" size={14} color={COLORS.textPrimary} />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('CartTab')}
          activeOpacity={0.8}
        >
          <Feather name="shopping-bag" size={18} color={COLORS.surface} />
          {itemCount > 0 && (
            <Badge count={itemCount} style={styles.cartBadge} />
          )}
        </TouchableOpacity>
      </View>

      {/* Main Scrollable Content */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
          />
        }
        contentContainerStyle={styles.scrollContent}
      >
        {/* Greeting & Search */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>
            Olá, {firstName}
          </Text>
          <Text style={styles.brandGreeting}>
            KINA JÁ! <Text style={styles.greetingEmoji}>🍔</Text>
          </Text>
        </View>

        <View style={styles.searchSection}>
          <SearchBar
            onPress={() => navigation.navigate('Search')}
            editable={false}
          />
        </View>

        {/* Promo Banner */}
        <PromoBanner />

        {/* Categories */}
        <CategoryList
          categories={categories}
          selectedId={selectedCategory}
          onSelect={setSelectedCategory}
          onViewAll={() => {}}
        />

        {/* Popular Items */}
        <PopularItems
          products={popularProducts}
          onItemPress={(product) =>
            navigation.navigate('ProductDetail', { product })
          }
          onAddToCart={handleAddToCart}
          onViewAll={() => {}}
        />

        {/* Open Restaurants */}
        <View style={styles.restaurantsSection}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Restaurantes Abertos</Text>
            <TouchableOpacity style={styles.viewAll} activeOpacity={0.7}>
              <Text style={styles.viewAllText}>Ver Todos</Text>
              <Feather name="chevron-right" size={14} color={COLORS.textSecondary} />
            </TouchableOpacity>
          </View>

          {restaurants.length > 0 ? (
            restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() =>
                  navigation.navigate('RestaurantDetail', { restaurant })
                }
              />
            ))
          ) : (
            <View style={styles.emptyState}>
              <Feather name="coffee" size={40} color={COLORS.textLight} />
              <Text style={styles.emptyText}>
                {loading
                  ? 'Carregando restaurantes...'
                  : 'Nenhum restaurante disponível'}
              </Text>
            </View>
          )}
        </View>
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
    paddingHorizontal: 24,
    paddingTop: 8,
    paddingBottom: 12,
  },
  menuButton: {
    padding: 8,
    marginLeft: -8,
    borderRadius: 20,
  },
  locationContainer: {
    alignItems: 'center',
  },
  locationLabel: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: COLORS.primary,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  locationText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  cartButton: {
    position: 'relative',
    padding: 10,
    backgroundColor: COLORS.dark,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  cartBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  greetingSection: {
    paddingHorizontal: 24,
    marginBottom: 16,
  },
  greeting: {
    fontFamily: FONTS.bold,
    fontSize: 22,
    color: COLORS.textPrimary,
  },
  brandGreeting: {
    fontFamily: FONTS.black,
    fontSize: 27,
    color: COLORS.primary,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  greetingEmoji: {
    fontSize: 22,
  },
  searchSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  restaurantsSection: {
    paddingHorizontal: 24,
    marginBottom: 24,
    gap: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  sectionTitle: {
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
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  emptyText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textMuted,
  },
});
