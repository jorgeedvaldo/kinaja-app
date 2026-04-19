import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Image,
} from 'react-native';
import COLORS from '../../constants/colors';
import { FONTS } from '../../constants/typography';

const { width } = Dimensions.get('window');
const BANNER_WIDTH = width - 48;

const PROMOS = [
  {
    id: 1,
    title: 'Oferta Especial\nde Abril',
    subtitle: 'Os melhores hambúrgueres da cidade com entrega grátis.',
    cta: 'Pedir Agora',
    image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Pizzas com\n30% OFF',
    subtitle: 'Todas as pizzas da semana com desconto especial.',
    cta: 'Ver Ofertas',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=400&auto=format&fit=crop',
  },
  {
    id: 3,
    title: 'Entrega Grátis\nno Primeiro Pedido',
    subtitle: 'Crie sua conta e ganhe entrega grátis no primeiro pedido.',
    cta: 'Começar',
    image: 'https://images.unsplash.com/photo-1551782450-17144efb9c50?q=80&w=400&auto=format&fit=crop',
  },
];

export default function PromoBanner() {
  const scrollRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const handleScroll = (event) => {
    const x = event.nativeEvent.contentOffset.x;
    const index = Math.round(x / BANNER_WIDTH);
    setActiveIndex(index);
  };

  return (
    <View style={styles.container}>
      <ScrollView
        ref={scrollRef}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
        snapToInterval={BANNER_WIDTH + 12}
        decelerationRate="fast"
        contentContainerStyle={styles.scrollContent}
      >
        {PROMOS.map((promo) => (
          <View key={promo.id} style={styles.banner}>
            <View style={styles.textContent}>
              <Text style={styles.title}>{promo.title}</Text>
              <Text style={styles.subtitle}>{promo.subtitle}</Text>
              <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
                <Text style={styles.ctaText}>{promo.cta}</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.imageContainer}>
              <Image source={{ uri: promo.image }} style={styles.image} />
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Pagination Dots */}
      <View style={styles.dots}>
        {PROMOS.map((_, index) => (
          <View
            key={index}
            style={[styles.dot, index === activeIndex && styles.dotActive]}
          />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  scrollContent: {
    paddingHorizontal: 24,
    gap: 12,
  },
  banner: {
    width: BANNER_WIDTH,
    backgroundColor: COLORS.primary,
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.3,
    shadowRadius: 16,
    elevation: 8,
  },
  textContent: {
    flex: 0.6,
    justifyContent: 'center',
    zIndex: 2,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 20,
    color: COLORS.accent,
    lineHeight: 26,
    marginBottom: 6,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontFamily: FONTS.medium,
    fontSize: 10,
    color: 'rgba(255,255,255,0.9)',
    lineHeight: 14,
    marginBottom: 14,
  },
  ctaButton: {
    backgroundColor: COLORS.accent,
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignSelf: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  ctaText: {
    fontFamily: FONTS.bold,
    fontSize: 12,
    color: COLORS.primary,
  },
  imageContainer: {
    position: 'absolute',
    right: -48,
    bottom: -24,
    width: 200,
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
    borderRadius: 100,
    opacity: 0.85,
  },
  dots: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 6,
    marginTop: 16,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.textLight,
  },
  dotActive: {
    backgroundColor: COLORS.primary,
  },
});
