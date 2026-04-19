import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    icon: '🍔',
    bgIcon: 'search',
    title: 'Descubra Restaurantes\nPerto de Si',
    description:
      'Encontre os melhores restaurantes da sua zona com menus variados e preços acessíveis.',
  },
  {
    icon: '⚡',
    bgIcon: 'smartphone',
    title: 'Peça com Rapidez\ne Facilidade',
    description:
      'Adicione os seus pratos favoritos ao carrinho e finalize o pedido em poucos toques.',
  },
  {
    icon: '🛵',
    bgIcon: 'map-pin',
    title: 'Acompanhe a Sua\nEntrega em Tempo Real',
    description:
      'Saiba exatamente onde está o seu pedido, do restaurante até a sua porta.',
  },
];

export default function OnboardingScreen({ navigation }) {
  const { completeOnboarding } = useAuth();
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    setActiveIndex(Math.round(x / width));
  };

  const goNext = async () => {
    if (activeIndex < SLIDES.length - 1) {
      scrollRef.current?.scrollTo({ x: width * (activeIndex + 1), animated: true });
    } else {
      await completeOnboarding();
      navigation.replace('Login');
    }
  };

  const skip = async () => {
    await completeOnboarding();
    navigation.replace('Login');
  };

  return (
    <View style={styles.container}>
      {/* Skip Button */}
      <TouchableOpacity style={styles.skipButton} onPress={skip} activeOpacity={0.7}>
        <Text style={styles.skipText}>Pular</Text>
      </TouchableOpacity>

      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        bounces={false}
      >
        {SLIDES.map((slide, index) => (
          <View key={index} style={[styles.slide, { width }]}>
            {/* Icon Circle */}
            <View style={styles.iconCircle}>
              <Feather name={slide.bgIcon} size={40} color={COLORS.accent} style={styles.bgIconStyle} />
              <Text style={styles.slideIcon}>{slide.icon}</Text>
            </View>

            <Text style={styles.slideTitle}>{slide.title}</Text>
            <Text style={styles.slideDescription}>{slide.description}</Text>
          </View>
        ))}
      </ScrollView>

      {/* Bottom area */}
      <View style={styles.bottomArea}>
        {/* Pagination Dots */}
        <View style={styles.dots}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                index === activeIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>

        {/* Next / Get Started Button */}
        <TouchableOpacity
          style={styles.nextButton}
          onPress={goNext}
          activeOpacity={0.8}
        >
          <Text style={styles.nextButtonText}>
            {activeIndex === SLIDES.length - 1 ? 'Começar' : 'Próximo'}
          </Text>
          <Feather
            name={activeIndex === SLIDES.length - 1 ? 'check' : 'arrow-right'}
            size={20}
            color={COLORS.accent}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  skipButton: {
    position: 'absolute',
    top: 60,
    right: 24,
    zIndex: 10,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  skipText: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  slide: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  bgIconStyle: {
    position: 'absolute',
    opacity: 0.2,
  },
  slideIcon: {
    fontSize: 56,
  },
  slideTitle: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: COLORS.textPrimary,
    textAlign: 'center',
    lineHeight: 34,
    marginBottom: 16,
  },
  slideDescription: {
    fontFamily: FONTS.regular,
    fontSize: 15,
    color: COLORS.textSecondary,
    textAlign: 'center',
    lineHeight: 22,
  },
  bottomArea: {
    paddingHorizontal: 24,
    paddingBottom: 50,
    alignItems: 'center',
    gap: 32,
  },
  dots: {
    flexDirection: 'row',
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textLight,
  },
  dotActive: {
    width: 32,
    backgroundColor: COLORS.primary,
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  nextButtonText: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.accent,
  },
});
