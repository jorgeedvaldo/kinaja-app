import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import Button from '../components/common/Button';

export default function EditProfileScreen({ navigation }) {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { t } = useTranslation();
  const [form, setForm] = useState({
    name: user?.name || '',
    phone: user?.phone || '',
    email: user?.email || '',
  });
  const [loading, setLoading] = useState(false);

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    if (!form.name.trim()) {
      Alert.alert(t('common.error'), t('profile.profile_update_error'));
      return;
    }
    setLoading(true);
    try {
      // TODO: Implement profile update API
      Alert.alert(t('common.success'), t('profile.profile_updated'));
      navigation.goBack();
    } catch (error) {
      Alert.alert(t('common.error'), t('profile.profile_update_error'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <View style={[styles.inner, { paddingTop: insets.top }]}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Feather name="arrow-left" size={20} color={COLORS.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('profile.edit_profile')}</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {form.name
                  .split(' ')
                  .map((n) => n[0])
                  .join('')
                  .substring(0, 2)
                  .toUpperCase() || 'U'}
              </Text>
            </View>
          </View>

          {/* Form */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.full_name')}</Text>
            <View style={styles.inputWrapper}>
              <Feather name="user" size={18} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                value={form.name}
                onChangeText={(t) => updateField('name', t)}
                placeholder="Seu nome"
                placeholderTextColor={COLORS.textLight}
                autoCapitalize="words"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.phone')}</Text>
            <View style={[styles.inputWrapper, styles.inputDisabled]}>
              <Feather name="phone" size={18} color={COLORS.textLight} />
              <TextInput
                style={[styles.input, { color: COLORS.textMuted }]}
                value={form.phone}
                editable={false}
              />
              <Feather name="lock" size={14} color={COLORS.textLight} />
            </View>
            <Text style={styles.helperText}>{t('profile.phone_locked')}</Text>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>{t('auth.email')}</Text>
            <View style={styles.inputWrapper}>
              <Feather name="mail" size={18} color={COLORS.textMuted} />
              <TextInput
                style={styles.input}
                value={form.email}
                onChangeText={(t) => updateField('email', t)}
                placeholder="email@exemplo.com"
                placeholderTextColor={COLORS.textLight}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <Button
            title={t('profile.save_changes')}
            onPress={handleSave}
            loading={loading}
            style={styles.saveButton}
          />
        </ScrollView>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  inner: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  headerTitle: {
    fontFamily: FONTS.bold,
    fontSize: 18,
    color: COLORS.dark,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 110,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 32,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: COLORS.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontFamily: FONTS.bold,
    fontSize: 28,
    color: COLORS.accent,
  },
  inputGroup: {
    marginBottom: 16,
  },
  label: {
    fontFamily: FONTS.semiBold,
    fontSize: 14,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.borderMedium,
    borderRadius: 14,
    paddingHorizontal: 14,
    paddingVertical: 12,
    gap: 10,
  },
  inputDisabled: {
    backgroundColor: COLORS.backgroundGray,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
  helperText: {
    fontFamily: FONTS.regular,
    fontSize: 11,
    color: COLORS.textLight,
    marginTop: 4,
  },
  saveButton: {
    marginTop: 16,
  },
});
