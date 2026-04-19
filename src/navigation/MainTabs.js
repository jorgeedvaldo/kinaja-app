import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
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

// Main Tab Navigator
export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          backgroundColor: COLORS.surface,
          borderTopLeftRadius: 28,
          borderTopRightRadius: 28,
          height: Platform.OS === 'ios' ? 85 : 70,
          paddingTop: 8,
          paddingHorizontal: 8,
          borderTopWidth: 0,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -8 },
          shadowOpacity: 0.05,
          shadowRadius: 16,
          elevation: 10,
          position: 'absolute',
        },
        tabBarIcon: ({ focused }) => {
          let iconName;
          let label;

          switch (route.name) {
            case 'HomeTab':
              iconName = 'home';
              label = 'Início';
              break;
            case 'OrdersTab':
              iconName = 'package';
              label = 'Pedidos';
              break;
            case 'CartTab':
              iconName = 'shopping-cart';
              label = 'Carrinho';
              break;
            case 'ProfileTab':
              iconName = 'user';
              label = 'Perfil';
              break;
          }

          if (focused) {
            return (
              <View style={styles.activeTab}>
                <Feather name={iconName} size={20} color={COLORS.primary} />
                <Text style={styles.activeTabLabel}>{label}</Text>
              </View>
            );
          }

          return (
            <View style={styles.inactiveTab}>
              <Feather name={iconName} size={22} color={COLORS.textMuted} />
              {route.name === 'CartTab' && <CartBadge />}
            </View>
          );
        },
      })}
    >
      <Tab.Screen name="HomeTab" component={HomeStackNav} />
      <Tab.Screen name="OrdersTab" component={OrdersStackNav} />
      <Tab.Screen name="CartTab" component={CartStackNav} />
      <Tab.Screen name="ProfileTab" component={ProfileStackNav} />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  activeTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 16,
    shadowColor: COLORS.accent,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 2,
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
    padding: 8,
    position: 'relative',
  },
});
