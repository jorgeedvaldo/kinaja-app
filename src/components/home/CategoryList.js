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

// Fallback icons for categories without images
const CATEGORY_EMOJIS = {
  'burger': '🍔',
  'pizza': '🍕',
  'sandwich': '🥪',
  'bebidas': '🥤',
  'sobremesas': '🍰',
  'carnes': '🥩',
  'saladas': '🥗',
  'massas': '🍝',
  'sushi': '🍣',
  'frango': '🍗',
};

export default function CategoryList({
  categories = [],
  selectedId,
  onSelect,
  onViewAll,
}) {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
        <TouchableOpacity
          style={styles.viewAll}
          onPress={onViewAll}
          activeOpacity={0.7}
        >
          <Text style={styles.viewAllText}>Ver Todas</Text>
          <Feather name="chevron-right" size={14} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {categories.map((category) => {
          const isActive = category.id === selectedId;
          const emoji = CATEGORY_EMOJIS[category.name?.toLowerCase()] || '🍽️';

          return (
            <TouchableOpacity
              key={category.id}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => onSelect(category.id === selectedId ? null : category.id)}
              activeOpacity={0.8}
            >
              <View style={[styles.iconContainer, isActive && styles.iconContainerActive]}>
                <Text style={styles.emoji}>{emoji}</Text>
              </View>
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>
                {category.name}
              </Text>
            </TouchableOpacity>
          );
        })}
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
    marginBottom: 16,
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
    gap: 10,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    paddingVertical: 8,
    paddingLeft: 8,
    paddingRight: 16,
    borderRadius: 16,
  },
  chipActive: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.backgroundGray,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconContainerActive: {
    backgroundColor: COLORS.accent,
  },
  emoji: {
    fontSize: 16,
  },
  chipText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textPrimary,
  },
  chipTextActive: {
    color: COLORS.accent,
    fontFamily: FONTS.bold,
  },
});
