import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Feather } from '@expo/vector-icons';
import COLORS from '../../constants/colors';
import { FONTS } from '../../constants/typography';

export default function RestaurantCard({ restaurant, onPress }) {
  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(restaurant)}
      activeOpacity={0.95}
    >
      {/* Cover Image */}
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: restaurant.cover_image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?q=80&w=600&auto=format&fit=crop',
          }}
          style={styles.image}
        />
        {/* Rating badge */}
        <View style={styles.ratingBadge}>
          <Feather name="star" size={12} color={COLORS.star} />
          <Text style={styles.ratingText}>
            {restaurant.rating || '0.0'}
          </Text>
        </View>
      </View>

      {/* Info */}
      <View style={styles.info}>
        <Text style={styles.name}>{restaurant.name}</Text>
        <Text style={styles.cuisine}>
          {restaurant.cuisine_type || 'Variada'}
        </Text>

        <View style={styles.meta}>
          {/* Delivery info */}
          <View style={styles.metaItem}>
            <View style={[styles.metaIcon, styles.metaIconAccent]}>
              <Feather name="truck" size={12} color={COLORS.primary} />
            </View>
            <Text style={styles.metaText}>Entrega Grátis</Text>
          </View>

          {/* Prep time */}
          <View style={styles.metaItem}>
            <View style={styles.metaIcon}>
              <Feather name="clock" size={12} color={COLORS.textSecondary} />
            </View>
            <Text style={styles.metaText}>
              {restaurant.prep_time_mins || 30} min
            </Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.surface,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.04,
    shadowRadius: 20,
    elevation: 2,
  },
  imageContainer: {
    height: 144,
    width: '100%',
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  ratingBadge: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ratingText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.textPrimary,
  },
  info: {
    padding: 16,
  },
  name: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
  },
  cuisine: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.textSecondary,
    marginTop: 4,
    marginBottom: 12,
  },
  meta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: COLORS.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaIconAccent: {
    backgroundColor: COLORS.accent,
  },
  metaText: {
    fontFamily: FONTS.semiBold,
    fontSize: 12,
    color: COLORS.textSecondary,
  },
});
