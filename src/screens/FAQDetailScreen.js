import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';

export default function FAQDetailScreen({ route, navigation }) {
  const insets = useSafeAreaInsets();
  const { type } = route.params;
  const { t } = useTranslation();

  const getContent = () => {
    switch (type) {
      case 'terms':
        return {
          title: t('faq.terms_title'),
          content: t('faq.terms_content', { returnObjects: true }),
        };
      case 'privacy':
        return {
          title: t('faq.privacy_title'),
          content: t('faq.privacy_content', { returnObjects: true }),
        };
      case 'faq':
      default:
        return {
          title: t('faq.faq_title'),
          content: t('faq.faq_content', { returnObjects: true }),
        };
    }
  };

  const { title, content } = getContent();
  const sections = Array.isArray(content) ? content : [];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{title}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollPadding}>
        {sections.map((item, index) => (
          <View key={index} style={styles.section}>
            <Text style={styles.subtitle}>{item.subtitle}</Text>
            <Text style={styles.text}>{item.text}</Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
  },
  scrollPadding: {
    padding: 24,
    paddingBottom: 100,
  },
  section: {
    marginBottom: 24,
  },
  subtitle: {
    fontFamily: FONTS.bold,
    fontSize: 16,
    color: COLORS.dark,
    marginBottom: 8,
  },
  text: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 22,
  },
});
