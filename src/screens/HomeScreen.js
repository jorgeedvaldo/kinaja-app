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
  Platform,
  Modal,
  FlatList,
  ActivityIndicator,
  Image,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLocation } from '../context/LocationContext';
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
  const { itemCount, addItem } = useCart();
  const { currentLocation, loadingLocation } = useLocation();

  const [restaurants, setRestaurants] = useState([]);
  const [categories, setCategories] = useState([]);
  const [popularProducts, setPopularProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(true);

  const [isCategoryModalVisible, setIsCategoryModalVisible] = useState(false);
  const [isRestaurantModalVisible, setIsRestaurantModalVisible] = useState(false);

  const scrollY = React.useRef(new Animated.Value(0)).current;

  const loadData = useCallback(async (catId = null) => {
    try {
      setLoading(true);
      const [resData, catData] = await Promise.all([
        restaurantService.getAll(catId),
        // Only fetch categories if we don't have them yet
        categories.length > 0 ? Promise.resolve(categories) : categoryService.getAll(),
      ]);

      const restaurantList = Array.isArray(resData) ? resData : [];
      setRestaurants(restaurantList);
      
      if (categories.length === 0) {
        setCategories(Array.isArray(catData) ? catData : []);
      }

      // If filtering by category, maybe we don't want to change popular products, 
      // or we just fetch them from the first restaurant of the filtered list.
      if (restaurantList.length > 0) {
        try {
          const products = await restaurantService.getProducts(restaurantList[0].id);
          setPopularProducts(Array.isArray(products) ? products.slice(0, 6) : []);
        } catch (e) {
          setPopularProducts([]);
        }
      } else {
        setPopularProducts([]);
      }
    } catch (error) {
      console.warn('Error loading home data:', error);
    } finally {
      setLoading(false);
    }
  }, [categories.length]);

  useEffect(() => {
    loadData(selectedCategory);
  }, [selectedCategory, loadData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData(selectedCategory);
    setRefreshing(false);
  }, [loadData, selectedCategory]);

  const getRestaurantForProduct = (product) => {
    return restaurants.find(r => {
      // Loose conversion to handle possible string IDs from JSON
      if (product.restaurant_id) return Number(r.id) === Number(product.restaurant_id);
      return true; // fallback
    }) || restaurants[0];
  };

  const handleAddToCart = (product) => {
    const restaurant = getRestaurantForProduct(product);
    if(restaurant) {
       addItem(product, 1, '', restaurant);
    }
  };

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

  let displayAddress = 'A buscar satélite...';
  if (!loadingLocation && currentLocation) {
    displayAddress = currentLocation.address || `${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`;
  }

  return (
    <View style={[styles.container]}>
      <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

      {/* FIXED ANIMATED HEADER */}
      <View style={[
        styles.fixedHeader, 
        { paddingTop: Math.max(insets.top, Platform.OS === 'android' ? StatusBar.currentHeight || 24 : 0) }
      ]}>
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
              <TouchableOpacity 
                style={styles.locationRow} 
                activeOpacity={0.7}
                onPress={() => navigation.navigate('LocationSelect')}
              >
                <Text style={styles.locationText}>{displayAddress}</Text>
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
        contentContainerStyle={[styles.scrollContent, { paddingTop: insets.top + 150 }]}
      >

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
            
            {loading ? (
               <ActivityIndicator size="large" color={COLORS.primary} style={{ marginTop: 20 }} />
            ) : (
              <CategoryList
                categories={categories}
                selectedId={selectedCategory}
                onSelect={setSelectedCategory}
                onViewAll={() => setIsCategoryModalVisible(true)}
              />
            )}

            {!loading && popularProducts.length > 0 && (
              <PopularItems
                products={popularProducts}
                onItemPress={(product) => {
                  const restaurant = getRestaurantForProduct(product);
                  navigation.navigate('ProductDetail', { product, restaurant });
                }}
                onAddToCart={handleAddToCart}
                onViewAll={() => {}}
              />
            )}
          </>
        )}

        {/* Open Restaurants */}
        {restaurants.length > 0 && (
          <View style={styles.restaurantsSection}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Restaurantes Abertos</Text>
              <TouchableOpacity 
                style={styles.viewAll} 
                activeOpacity={0.7}
                onPress={() => setIsRestaurantModalVisible(true)}
              >
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

      {/* Category Modal */}
      <Modal
        visible={isCategoryModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsCategoryModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Todas as Categorias</Text>
            <TouchableOpacity onPress={() => setIsCategoryModalVisible(false)} style={styles.modalCloseBtn}>
              <Feather name="x" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={categories}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={styles.modalList}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.modalItemRow}
                onPress={() => {
                  setSelectedCategory(item.id);
                  setIsCategoryModalVisible(false);
                }}
              >
                <View style={styles.modalCategoryIconWrapper}>
                   <Image source={{ uri: item.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200' }} style={styles.modalCategoryIcon} />
                </View>
                <Text style={styles.modalItemName}>{item.name}</Text>
                {selectedCategory === item.id && (
                  <Feather name="check" size={20} color={COLORS.primary} />
                )}
              </TouchableOpacity>
            )}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
          />
        </View>
      </Modal>

      {/* Restaurant Modal */}
      <Modal
        visible={isRestaurantModalVisible}
        animationType="slide"
        presentationStyle="pageSheet"
        onRequestClose={() => setIsRestaurantModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Todos os Restaurantes</Text>
            <TouchableOpacity onPress={() => setIsRestaurantModalVisible(false)} style={styles.modalCloseBtn}>
              <Feather name="x" size={24} color={COLORS.dark} />
            </TouchableOpacity>
          </View>
          <FlatList
            data={restaurants}
            keyExtractor={item => item.id.toString()}
            contentContainerStyle={[styles.modalList, { gap: 16 }]}
            renderItem={({ item }) => (
              <RestaurantCard
                restaurant={item}
                onPress={() => {
                  setIsRestaurantModalVisible(false);
                  navigation.navigate('RestaurantDetail', { restaurant: item });
                }}
              />
            )}
          />
        </View>
      </Modal>

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
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.backgroundGray,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: COLORS.surface,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
  },
  modalCloseBtn: {
    position: 'absolute',
    right: 20,
    padding: 4,
  },
  modalList: {
    padding: 20,
    paddingBottom: 40,
  },
  modalItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
  },
  modalCategoryIconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: COLORS.surface,
    overflow: 'hidden',
    marginRight: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  modalCategoryIcon: {
    width: '100%',
    height: '100%',
  },
  modalItemName: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 16,
    color: COLORS.dark,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 4,
  },
});
