import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import COLORS from '../../constants/colors';
import { FONTS } from '../../constants/typography';

export default function Badge({ count, size = 'small', style }) {
  if (!count || count <= 0) return null;

  return (
    <View style={[styles.badge, styles[size], style]}>
      <Text style={[styles.text, styles[`text_${size}`]]}>
        {count > 99 ? '99+' : count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    backgroundColor: COLORS.primary,
    borderRadius: 100,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: COLORS.surface,
  },
  small: {
    minWidth: 18,
    height: 18,
    paddingHorizontal: 4,
  },
  medium: {
    minWidth: 22,
    height: 22,
    paddingHorizontal: 5,
  },
  text: {
    fontFamily: FONTS.bold,
    color: COLORS.accent,
  },
  text_small: {
    fontSize: 10,
  },
  text_medium: {
    fontSize: 11,
  },
});
