import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { FONTS } from '../../constants/typography';

export default function RestaurantCard({ restaurant, onPress }) {
  // A square default logo
  const defaultLogo = 'https://ui-avatars.com/api/?name=' + encodeURIComponent(restaurant.name || 'Restaurante') + '&background=FFF4E5&color=FF8C00&size=200';
  
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(restaurant)}
      activeOpacity={0.9}
    >
      <Image
        source={{ uri: restaurant.cover_image || defaultLogo }}
        style={styles.logo}
      />
      
      <View style={styles.info}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={1}>{restaurant.name}</Text>
          <View style={styles.ratingBadge}>
            <Feather name="star" size={12} color={COLORS.star} />
            <Text style={styles.ratingText}>{restaurant.rating || '4.5'}</Text>
          </View>
        </View>

        <Text style={styles.cuisine} numberOfLines={1}>
          {restaurant.cuisine_type || 'Culinária Variada'}
        </Text>

        <View style={styles.meta}>
          <View style={styles.metaItem}>
            <Feather name="truck" size={12} color={COLORS.primary} />
            <Text style={styles.metaText}>Kz 500</Text>
          </View>
          <View style={styles.metaDot} />
          <View style={styles.metaItem}>
            <Feather name="clock" size={12} color={COLORS.textSecondary} />
            <Text style={styles.metaText}>{restaurant.prep_time_mins || 30} min</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: 0,
  },
  logo: {
    width: 64,
    height: 64,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundGray,
    marginRight: 16,
  },
  info: {
    flex: 1,
    justifyContent: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  name: {
    flex: 1,
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.dark,
    marginRight: 8,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#FFF8E1',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  ratingText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: '#F59E0B',
  },
  cuisine: {
    fontFamily: FONTS.medium,
    fontSize: 13,
    color: COLORS.textSecondary,
    marginBottom: 8,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
  metaDot: {
    width: 3,
    height: 3,
    borderRadius: 1.5,
    backgroundColor: COLORS.borderMedium,
    marginHorizontal: 8,
  },
});
