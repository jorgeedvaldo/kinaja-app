import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated, Easing } from 'react-native';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';

export default function SplashScreen({ navigation }) {
  const logoScale = useRef(new Animated.Value(0.5)).current;
  const logoOpacity = useRef(new Animated.Value(0)).current;
  const taglineOpacity = useRef(new Animated.Value(0)).current;
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Logo pop animation
    Animated.parallel([
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 4,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(logoOpacity, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Tagline fade in
    Animated.timing(taglineOpacity, {
      toValue: 1,
      duration: 500,
      delay: 600,
      useNativeDriver: true,
    }).start();

    // Bouncing dots
    const bounceDot = (dot, delay) => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(dot, {
            toValue: -8,
            duration: 300,
            delay,
            easing: Easing.out(Easing.quad),
            useNativeDriver: true,
          }),
          Animated.timing(dot, {
            toValue: 0,
            duration: 300,
            easing: Easing.in(Easing.quad),
            useNativeDriver: true,
          }),
        ])
      ).start();
    };

    bounceDot(dot1, 100);
    bounceDot(dot2, 200);
    bounceDot(dot3, 300);

    // Navigate after splash
    const timer = setTimeout(() => {
      navigation.replace('Onboarding');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      {/* Decorative background blurs */}
      <View style={styles.bgCircle1} />
      <View style={styles.bgCircle2} />

      {/* Logo */}
      <Animated.View
        style={[
          styles.logoContainer,
          {
            transform: [{ scale: logoScale }],
            opacity: logoOpacity,
          },
        ]}
      >
        {/* KINA block */}
        <View style={styles.kinaBlock}>
          <Text style={styles.kinaText}>KINA</Text>
        </View>

        {/* JÁ block */}
        <View style={styles.jaBlock}>
          <Text style={styles.jaText}>JÁ</Text>
        </View>
      </Animated.View>

      {/* Tagline */}
      <Animated.View
        style={[styles.taglineContainer, { opacity: taglineOpacity }]}
      >
        <Text style={styles.tagline}>Rápido. Gostoso.</Text>
        <View style={styles.taglineLine} />
      </Animated.View>

      {/* Loading dots */}
      <View style={styles.dotsContainer}>
        <View style={styles.dots}>
          {[dot1, dot2, dot3].map((dot, i) => (
            <Animated.View
              key={i}
              style={[
                styles.dot,
                { transform: [{ translateY: dot }] },
              ]}
            />
          ))}
        </View>
        <Text style={styles.loadingText}>Preparando seu pedido...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bgCircle1: {
    position: 'absolute',
    top: '-10%',
    right: '-20%',
    width: 256,
    height: 256,
    borderRadius: 128,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  bgCircle2: {
    position: 'absolute',
    bottom: '-10%',
    left: '-20%',
    width: 320,
    height: 320,
    borderRadius: 160,
    backgroundColor: 'rgba(0,0,0,0.08)',
  },
  logoContainer: {
    alignItems: 'center',
    transform: [{ scale: 1.25 }],
  },
  kinaBlock: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 24,
    paddingVertical: 8,
    borderRadius: 20,
    transform: [{ rotate: '-2deg' }],
    marginBottom: -10,
    zIndex: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  kinaText: {
    fontFamily: FONTS.black,
    fontSize: 48,
    color: COLORS.primary,
    letterSpacing: -2,
  },
  jaBlock: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 32,
    paddingVertical: 8,
    borderRadius: 25,
    transform: [{ rotate: '3deg' }],
    borderWidth: 4,
    borderColor: COLORS.primary,
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  jaText: {
    fontFamily: FONTS.black,
    fontSize: 48,
    color: COLORS.accent,
    letterSpacing: -2,
  },
  taglineContainer: {
    marginTop: 64,
    alignItems: 'center',
  },
  tagline: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.accent,
    letterSpacing: 4,
    textTransform: 'uppercase',
    opacity: 0.9,
  },
  taglineLine: {
    width: 48,
    height: 4,
    backgroundColor: COLORS.accent,
    borderRadius: 2,
    marginTop: 8,
  },
  dotsContainer: {
    position: 'absolute',
    bottom: 80,
    alignItems: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: COLORS.accent,
  },
  loadingText: {
    fontFamily: FONTS.bold,
    fontSize: 10,
    color: 'rgba(251,239,184,0.7)',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginTop: 16,
  },
});
