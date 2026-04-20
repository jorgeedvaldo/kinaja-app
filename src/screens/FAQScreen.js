import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';

export default function FAQScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const sections = [
    {
      id: 'faq',
      title: t('faq.faq_title'),
      icon: 'help-circle',
    },
    {
      id: 'terms',
      title: t('faq.terms_title'),
      icon: 'file-text',
    },
    {
      id: 'privacy',
      title: t('faq.privacy_title'),
      icon: 'shield',
    },
  ];

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Feather name="arrow-left" size={24} color={COLORS.dark} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('faq.title')}</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.menuGroup}>
          {sections.map((section) => (
            <TouchableOpacity
              key={section.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate('FAQDetail', { type: section.id })}
              activeOpacity={0.7}
            >
              <View style={styles.iconWrapper}>
                <Feather name={section.icon} size={20} color={COLORS.primary} />
              </View>
              <Text style={styles.menuLabel}>{section.title}</Text>
              <Feather name="chevron-right" size={20} color={COLORS.textLight} />
            </TouchableOpacity>
          ))}
        </View>
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
  },
  backBtn: {
    padding: 8,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
  },
  content: {
    padding: 24,
  },
  menuGroup: {
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: COLORS.border,
    overflow: 'hidden',
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  iconWrapper: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  menuLabel: {
    flex: 1,
    fontFamily: FONTS.semiBold,
    fontSize: 15,
    color: COLORS.textPrimary,
  },
});
