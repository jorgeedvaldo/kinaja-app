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
import { Feather } from '@expo/vector-icons';
import { useAuth } from '../context/AuthContext';
import COLORS from '../constants/colors';
import { FONTS } from '../constants/typography';
import Button from '../components/common/Button';

export default function LoginScreen({ navigation }) {
  const { login } = useAuth();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const errs = {};
    if (!phone.trim()) errs.phone = 'O telefone é obrigatório';
    if (!password) errs.password = 'A password é obrigatória';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleLogin = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await login(phone.trim(), password);
      // Navigation handled by AppNavigator
    } catch (error) {
      const message =
        error.response?.data?.message || 'Credenciais inválidas. Tente novamente.';
      Alert.alert('Erro no Login', message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <View style={styles.kinaBlock}>
            <Text style={styles.kinaText}>KINA</Text>
          </View>
          <View style={styles.jaBlock}>
            <Text style={styles.jaText}>JÁ</Text>
          </View>
        </View>

        <Text style={styles.title}>Bem-vindo de volta!</Text>
        <Text style={styles.subtitle}>
          Faça login para continuar a fazer pedidos
        </Text>

        {/* Phone Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Telefone</Text>
          <View style={[styles.inputWrapper, errors.phone && styles.inputError]}>
            <Feather name="phone" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={(t) => { setPhone(t); setErrors(e => ({ ...e, phone: null })); }}
              placeholder="+244 9XX XXX XXX"
              placeholderTextColor={COLORS.textLight}
              keyboardType="phone-pad"
              autoCapitalize="none"
            />
          </View>
          {errors.phone && <Text style={styles.errorText}>{errors.phone}</Text>}
        </View>

        {/* Password Input */}
        <View style={styles.inputGroup}>
          <Text style={styles.label}>Password</Text>
          <View style={[styles.inputWrapper, errors.password && styles.inputError]}>
            <Feather name="lock" size={18} color={COLORS.textMuted} />
            <TextInput
              style={styles.input}
              value={password}
              onChangeText={(t) => { setPassword(t); setErrors(e => ({ ...e, password: null })); }}
              placeholder="Sua password"
              placeholderTextColor={COLORS.textLight}
              secureTextEntry={!showPassword}
            />
            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
              <Feather
                name={showPassword ? 'eye' : 'eye-off'}
                size={18}
                color={COLORS.textMuted}
              />
            </TouchableOpacity>
          </View>
          {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}
        </View>

        {/* Login Button */}
        <Button
          title="Entrar"
          onPress={handleLogin}
          loading={loading}
          style={styles.loginButton}
        />

        {/* Register Link */}
        <View style={styles.registerRow}>
          <Text style={styles.registerText}>Não tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.registerLink}>Criar Conta</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 80,
    paddingBottom: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 32,
  },
  kinaBlock: {
    backgroundColor: COLORS.accent,
    paddingHorizontal: 16,
    paddingVertical: 4,
    borderRadius: 14,
    transform: [{ rotate: '-2deg' }],
    marginBottom: -6,
    zIndex: 2,
  },
  kinaText: {
    fontFamily: FONTS.black,
    fontSize: 32,
    color: COLORS.primary,
    letterSpacing: -1,
  },
  jaBlock: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 4,
    borderRadius: 16,
    transform: [{ rotate: '3deg' }],
    zIndex: 1,
  },
  jaText: {
    fontFamily: FONTS.black,
    fontSize: 32,
    color: COLORS.accent,
    letterSpacing: -1,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: COLORS.textPrimary,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
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
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    fontFamily: FONTS.medium,
    fontSize: 14,
    color: COLORS.textPrimary,
    padding: 0,
  },
  errorText: {
    fontFamily: FONTS.medium,
    fontSize: 12,
    color: COLORS.error,
    marginTop: 4,
  },
  loginButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  registerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  registerLink: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
  },
});
