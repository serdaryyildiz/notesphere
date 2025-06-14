import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { TextInput, Text, IconButton } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { AuthStackParamList } from '../navigation/types';
import { register } from '../services/auth';
import  AsyncStorage  from '@react-native-async-storage/async-storage';

type RegisterScreenProps = {
  navigation: NativeStackNavigationProp<AuthStackParamList, 'Register'>;
};

export const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showRepeatPassword, setShowRepeatPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<any>({});

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = 'The name field is required.';
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = 'Last name field is required.';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'EEmail field is required.';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address.';
    }

    if (!formData.username.trim()) {
      newErrors.username = 'Username field is required.';
    } else if (formData.username.length < 3) {
      newErrors.username = 'Username must be at least 3 characters.';
    }

    if (!formData.password) {
      newErrors.password = 'Password field is required.';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters.';
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Repeating the password is mandatory.';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) {
      return;
    }

    try {
      setLoading(true);
      const response = await register({
        email: formData.email,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.username,
        password: formData.password
      });
      
      if (response.accessToken) {
        await AsyncStorage.setItem('token', response.accessToken);
        Alert.alert(
          'Success',
          'Hesabınız başarıyla oluşturuldu. Giriş yapabilirsiniz.',
          [{ text: 'Tamam', onPress: () => navigation.navigate('Login') }]
        );
      } else {
        throw new Error('Token could not be received');
      }
    } catch (error: any) {
      if (error.response && error.response.data) {
        if (typeof error.response.data === 'object' && error.response.data.message) {
          setErrors({ general: error.response.data.message });
        } else {
          setErrors(error.response.data);
        }
      } else {
        setErrors({general: 'There was an error while registering. Please check your information.'});
      }
      console.error('Registration error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <View style={styles.header}>
            <IconButton
              icon="arrow-left"
              size={24}
              onPress={() => navigation.goBack()}
              style={styles.backButton}
            />
            <Text style={styles.title}>HESAP OLUŞTUR</Text>
          </View>

          <View style={styles.formContainer}>
            {errors.general && (
              <Text style={styles.errorText}>{errors.general}</Text>
            )}

            <TextInput
              label="Name"
              value={formData.firstName}
              onChangeText={(text) => setFormData({ ...formData, firstName: text })}
              style={styles.input}
              mode="outlined"
              error={!!errors.firstName}
              disabled={loading}
              theme={{ colors: { primary: COLORS.primary } }}
            />
            {errors.firstName && <Text style={styles.errorText}>{errors.firstName}</Text>}

            <TextInput
              label="Surname"
              value={formData.lastName}
              onChangeText={(text) => setFormData({ ...formData, lastName: text })}
              style={styles.input}
              mode="outlined"
              error={!!errors.lastName}
              disabled={loading}
              theme={{ colors: { primary: COLORS.primary } }}
            />
            {errors.lastName && <Text style={styles.errorText}>{errors.lastName}</Text>}

            <TextInput
              label="Email"
              value={formData.email}
              onChangeText={(text) => setFormData({ ...formData, email: text })}
              style={styles.input}
              mode="outlined"
              keyboardType="email-address"
              autoCapitalize="none"
              error={!!errors.email}
              disabled={loading}
              theme={{ colors: { primary: COLORS.primary } }}
            />
            {errors.email && <Text style={styles.errorText}>{errors.email}</Text>}

            <TextInput
              label="Username"
              value={formData.username}
              onChangeText={(text) => setFormData({ ...formData, username: text })}
              style={styles.input}
              mode="outlined"
              autoCapitalize="none"
              error={!!errors.username}
              disabled={loading}
              theme={{ colors: { primary: COLORS.primary } }}
            />
            {errors.username && <Text style={styles.errorText}>{errors.username}</Text>}

            <TextInput
              mode="outlined"
              label="Password"
              value={formData.password}
              onChangeText={(text) => setFormData({ ...formData, password: text })}
              secureTextEntry={!showPassword}
              right={
                <TextInput.Icon
                  icon={showPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowPassword(!showPassword)}
                />
              }
              style={styles.input}
              error={!!errors.password}
              disabled={loading}
              theme={{ colors: { primary: COLORS.primary } }}
            />
            {errors.password && <Text style={styles.errorText}>{errors.password}</Text>}

            <TextInput
              mode="outlined"
              label="Password again"
              value={formData.confirmPassword}
              onChangeText={(text) => setFormData({ ...formData, confirmPassword: text })}
              secureTextEntry={!showRepeatPassword}
              right={
                <TextInput.Icon
                  icon={showRepeatPassword ? 'eye-off' : 'eye'}
                  onPress={() => setShowRepeatPassword(!showRepeatPassword)}
                />
              }
              style={styles.input}
              error={!!errors.confirmPassword}
              disabled={loading}
              theme={{ colors: { primary: COLORS.primary } }}
            />
            {errors.confirmPassword && <Text style={styles.errorText}>{errors.confirmPassword}</Text>}

            <TouchableOpacity
              style={[styles.registerButton, loading && styles.registerButtonDisabled]}
              onPress={handleRegister}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={COLORS.white} />
              ) : (
                <Text style={styles.registerButtonText}>Hesap Oluştur</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: SIZES.xl,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.xl,
  },
  backButton: {
    marginRight: SIZES.sm,
  },
  title: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.primary,
    flex: 1,
  },
  formContainer: {
    backgroundColor: COLORS.surface,
    borderRadius: 16,
    padding: SIZES.xl,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  input: {
    marginBottom: SIZES.md,
    backgroundColor: COLORS.surface,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SIZES.md,
    ...FONTS.medium,
    fontSize: 12,
  },
  registerButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: SIZES.md,
  },
  registerButtonDisabled: {
    opacity: 0.7,
  },
  registerButtonText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 16,
  },
});

export default RegisterScreen; 