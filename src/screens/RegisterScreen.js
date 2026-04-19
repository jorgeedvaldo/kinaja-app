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

export default function RegisterScreen({ navigation }) {
  const { register } = useAuth();
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const updateField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => ({ ...prev, [key]: null }));
  };

  const validate = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = 'O nome é obrigatório';
    if (!form.phone.trim()) errs.phone = 'O telefone é obrigatório';
    if (!form.password) errs.password = 'A password é obrigatória';
    else if (form.password.length < 8) errs.password = 'Mínimo 8 caracteres';
    if (form.password !== form.password_confirmation) {
      errs.password_confirmation = 'As passwords não coincidem';
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleRegister = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await register(form);
      // Navigation handled by AppNavigator
    } catch (error) {
      const apiErrors = error.response?.data?.errors;
      if (apiErrors) {
        const formattedErrors = {};
        Object.keys(apiErrors).forEach((key) => {
          formattedErrors[key] = apiErrors[key][0];
        });
        setErrors(formattedErrors);
      } else {
        const message =
          error.response?.data?.message || 'Erro ao criar conta. Tente novamente.';
        Alert.alert('Erro no Registo', message);
      }
    } finally {
      setLoading(false);
    }
  };

  const renderInput = (key, label, icon, options = {}) => (
    <View style={styles.inputGroup}>
      <Text style={styles.label}>{label}</Text>
      <View style={[styles.inputWrapper, errors[key] && styles.inputError]}>
        <Feather name={icon} size={18} color={COLORS.textMuted} />
        <TextInput
          style={styles.input}
          value={form[key]}
          onChangeText={(t) => updateField(key, t)}
          placeholder={options.placeholder || ''}
          placeholderTextColor={COLORS.textLight}
          keyboardType={options.keyboardType || 'default'}
          autoCapitalize={options.autoCapitalize || 'none'}
          secureTextEntry={options.secure && !showPassword}
        />
        {options.secure && (
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Feather
              name={showPassword ? 'eye' : 'eye-off'}
              size={18}
              color={COLORS.textMuted}
            />
          </TouchableOpacity>
        )}
      </View>
      {errors[key] && <Text style={styles.errorText}>{errors[key]}</Text>}
    </View>
  );

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
        {/* Back button */}
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Feather name="arrow-left" size={24} color={COLORS.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.title}>Criar Conta</Text>
        <Text style={styles.subtitle}>
          Preencha os dados abaixo para começar
        </Text>

        {renderInput('name', 'Nome Completo', 'user', {
          placeholder: 'João Silva',
          autoCapitalize: 'words',
        })}

        {renderInput('phone', 'Telefone', 'phone', {
          placeholder: '+244 9XX XXX XXX',
          keyboardType: 'phone-pad',
        })}

        {renderInput('email', 'Email (opcional)', 'mail', {
          placeholder: 'joao@email.com',
          keyboardType: 'email-address',
        })}

        {renderInput('password', 'Password', 'lock', {
          placeholder: 'Mínimo 8 caracteres',
          secure: true,
        })}

        {renderInput('password_confirmation', 'Confirmar Password', 'lock', {
          placeholder: 'Repita a password',
          secure: true,
        })}

        <Button
          title="Criar Conta"
          onPress={handleRegister}
          loading={loading}
          style={styles.registerButton}
        />

        <View style={styles.loginRow}>
          <Text style={styles.loginText}>Já tem conta? </Text>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.loginLink}>Entrar</Text>
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
    paddingTop: 60,
    paddingBottom: 40,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  title: {
    fontFamily: FONTS.bold,
    fontSize: 26,
    color: COLORS.textPrimary,
    marginBottom: 8,
  },
  subtitle: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
    marginBottom: 28,
  },
  inputGroup: {
    marginBottom: 14,
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
  registerButton: {
    marginTop: 8,
    marginBottom: 24,
  },
  loginRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loginText: {
    fontFamily: FONTS.regular,
    fontSize: 14,
    color: COLORS.textSecondary,
  },
  loginLink: {
    fontFamily: FONTS.bold,
    fontSize: 14,
    color: COLORS.primary,
  },
});
