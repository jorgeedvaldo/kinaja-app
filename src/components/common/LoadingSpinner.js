import React from 'react';
import { ActivityIndicator, View, StyleSheet, Text } from 'react-native';
import COLORS from '../../constants/colors';
import { FONTS } from '../../constants/typography';

export default function LoadingSpinner({ message = 'Carregando...', fullScreen = true }) {
  if (!fullScreen) {
    return <ActivityIndicator size="small" color={COLORS.primary} />;
  }

  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={COLORS.primary} />
      {message && <Text style={styles.message}>{message}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.background,
  },
  message: {
    marginTop: 12,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
});
