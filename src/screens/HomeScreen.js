import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  StatusBar,
  Animated,
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

  const scrollY = React.useRef(new Animated.Value(0)).current;

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

  const headerLocationHeight = scrollY.interpolate({
    inputRange: [0, 60],
    outputRange: [50, 0],
    extrapolate: 'clamp',
  });

  const headerLocationOpacity = scrollY.interpolate({
    inputRange: [0, 40],
    outputRange: [1, 0],
    extrapolate: 'clamp',
  });

  return (
    <View style={[styles.container]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* FIXED ANIMATED HEADER */}
      <View style={[styles.fixedHeader, { paddingTop: insets.top }]}>
        <Animated.View
          style={{
            height: headerLocationHeight,
            opacity: headerLocationOpacity,
            overflow: 'hidden',
          }}
        >
          <View style={styles.headerTopRow}>
            <View style={{ width: 38 }} />

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
        </Animated.View>

        {/* Search is always visible */}
        <View style={styles.searchSection}>
          <SearchBar
            onPress={() => navigation.navigate('Search')}
            editable={false}
          />
        </View>
      </View>

      {/* Main Scrollable Content */}
      <Animated.ScrollView
        showsVerticalScrollIndicator={false}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false }
        )}
        scrollEventThrottle={16}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={COLORS.primary}
            colors={[COLORS.primary]}
            progressViewOffset={130}
          />
        }
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 160 }]}
      >
        {/* Greeting */}
        <View style={styles.greetingSection}>
          <Text style={styles.greeting}>Olá, {firstName}</Text>
          <Text style={styles.brandGreeting}>
            KINA JÁ! <Text style={styles.greetingEmoji}>🍔</Text>
          </Text>
        </View>

        {/* Conditional Rendering for Empty State */}
        {restaurants.length === 0 ? (
          <View style={styles.emptyStateFull}>
            <Feather name="coffee" size={48} color={COLORS.textLight} />
            <Text style={styles.emptyTitleText}>Nenhum restaurante na área</Text>
            <Text style={styles.emptyDescText}>
              {loading
                ? 'Procurando restaurantes disponíveis...'
                : 'Poxa, ainda não temos parceiros abertos para a sua localização.'}
            </Text>
          </View>
        ) : (
          <>
            <PromoBanner />
            <CategoryList
              categories={categories}
              selectedId={selectedCategory}
              onSelect={setSelectedCategory}
              onViewAll={() => {}}
            />
            <PopularItems
              products={popularProducts}
              onItemPress={(product) =>
                navigation.navigate('ProductDetail', { product })
              }
              onAddToCart={handleAddToCart}
              onViewAll={() => {}}
            />
          </>
        )}

        {/* Open Restaurants */}
        {restaurants.length > 0 && (
          <View style={styles.restaurantsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Restaurantes Abertos</Text>
              <TouchableOpacity style={styles.viewAll} activeOpacity={0.7}>
                <Text style={styles.viewAllText}>Ver Todos</Text>
                <Feather name="chevron-right" size={14} color={COLORS.textSecondary} />
              </TouchableOpacity>
            </View>

            {restaurants.map((restaurant) => (
              <RestaurantCard
                key={restaurant.id}
                restaurant={restaurant}
                onPress={() =>
                  navigation.navigate('RestaurantDetail', { restaurant })
                }
              />
            ))}
          </View>
        )}
      </Animated.ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  fixedHeader: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.background,
    zIndex: 10,
    paddingBottom: 8,
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 24,
    height: 50,
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
    paddingBottom: 100,
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
  emptyStateFull: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 80,
    paddingHorizontal: 32,
    gap: 16,
  },
  emptyTitleText: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
    marginTop: 8,
  },
  emptyDescText: {
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textMuted,
    textAlign: 'center',
    lineHeight: 20,
  },
});
