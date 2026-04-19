import React from 'react';
import { View, Text, StyleSheet, Platform, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { Feather } from '@expo/vector-icons';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import { useCart } from '../context/CartContext';

// Screens
import HomeScreen from '../screens/HomeScreen';
import SearchScreen from '../screens/SearchScreen';
import RestaurantDetailScreen from '../screens/RestaurantDetailScreen';
import ProductDetailScreen from '../screens/ProductDetailScreen';
import CartScreen from '../screens/CartScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import OrdersScreen from '../screens/OrdersScreen';
import OrderDetailScreen from '../screens/OrderDetailScreen';
import ProfileScreen from '../screens/ProfileScreen';
import EditProfileScreen from '../screens/EditProfileScreen';

const Tab = createBottomTabNavigator();
const HomeStack = createNativeStackNavigator();
const CartStack = createNativeStackNavigator();
const OrdersStack = createNativeStackNavigator();
const ProfileStack = createNativeStackNavigator();

// Stack Navigators

function HomeStackNav() {
  return (
    <HomeStack.Navigator screenOptions={{ headerShown: false }}>
      <HomeStack.Screen name="HomeMain" component={HomeScreen} />
      <HomeStack.Screen name="Search" component={SearchScreen} />
      <HomeStack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <HomeStack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </HomeStack.Navigator>
  );
}

function CartStackNav() {
  return (
    <CartStack.Navigator screenOptions={{ headerShown: false }}>
      <CartStack.Screen name="CartMain" component={CartScreen} />
      <CartStack.Screen name="Checkout" component={CheckoutScreen} />
    </CartStack.Navigator>
  );
}

function OrdersStackNav() {
  return (
    <OrdersStack.Navigator screenOptions={{ headerShown: false }}>
      <OrdersStack.Screen name="OrdersList" component={OrdersScreen} />
      <OrdersStack.Screen name="OrderDetail" component={OrderDetailScreen} />
    </OrdersStack.Navigator>
  );
}

function ProfileStackNav() {
  return (
    <ProfileStack.Navigator screenOptions={{ headerShown: false }}>
      <ProfileStack.Screen name="ProfileMain" component={ProfileScreen} />
      <ProfileStack.Screen name="EditProfile" component={EditProfileScreen} />
    </ProfileStack.Navigator>
  );
}

// Custom Tab Bar Badge
function CartBadge() {
  const { itemCount } = useCart();
  if (itemCount <= 0) return null;
  return (
    <View style={tabBadgeStyles.badge}>
      <Text style={tabBadgeStyles.badgeText}>
        {itemCount > 99 ? '99+' : itemCount}
      </Text>
    </View>
  );
}

const tabBadgeStyles = StyleSheet.create({
  badge: {
    position: 'absolute',
    top: -2,
    right: -8,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: COLORS.surface,
  },
  badgeText: {
    fontFamily: FONTS.bold,
    fontSize: 9,
    color: COLORS.accent,
  },
});

// Custom Tab Bar Component
function CustomTabBar({ state, descriptors, navigation }) {
  const insets = useSafeAreaInsets();
  const { itemCount } = useCart();

  const tabs = [
    { name: 'HomeTab', icon: 'home', label: 'Início' },
    { name: 'OrdersTab', icon: 'package', label: 'Pedidos' },
    { name: 'CartTab', icon: 'shopping-cart', label: 'Carrinho' },
    { name: 'ProfileTab', icon: 'user', label: 'Perfil' },
  ];

  return (
    <View
      style={[
        styles.tabBarContainer,
        { paddingBottom: Platform.OS === 'ios' ? insets.bottom : 10 },
      ]}
    >
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tab = tabs[index];

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity
            key={route.key}
            onPress={onPress}
            activeOpacity={0.7}
            style={styles.tabItem}
          >
            {isFocused ? (
              <View style={styles.activeTab}>
                <Feather name={tab.icon} size={18} color={COLORS.primary} />
                <Text style={styles.activeTabLabel}>{tab.label}</Text>
              </View>
            ) : (
              <View style={styles.inactiveTab}>
                <Feather name={tab.icon} size={22} color={COLORS.textMuted} />
                <Text style={styles.inactiveTabLabel}>{tab.label}</Text>
                {route.name === 'CartTab' && itemCount > 0 && (
                  <View style={tabBadgeStyles.badge}>
                    <Text style={tabBadgeStyles.badgeText}>
                      {itemCount > 99 ? '99+' : itemCount}
                    </Text>
                  </View>
                )}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// Main Tab Navigator
export default function MainTabs() {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      sceneContainerStyle={{ backgroundColor: COLORS.background }}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNav} />
      <Tab.Screen name="OrdersTab" component={OrdersStackNav} />
      <Tab.Screen name="CartTab" component={CartStackNav} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNav} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  tabBarContainer: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    paddingTop: 10,
    paddingHorizontal: 8,
    borderTopWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -8 },
    shadowOpacity: 0.06,
    shadowRadius: 16,
    elevation: 10,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
  },
  activeTabLabel: {
    fontFamily: FONTS.bold,
    fontSize: 13,
    color: COLORS.primary,
    letterSpacing: 0.3,
  },
  inactiveTab: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 6,
    position: 'relative',
  },
  inactiveTabLabel: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: COLORS.textMuted,
    marginTop: 2,
  },
});
