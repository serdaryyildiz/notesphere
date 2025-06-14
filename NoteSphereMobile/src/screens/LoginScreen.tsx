import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
  Image,
  ActivityIndicator,
  Dimensions,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { TextInput, Text, Checkbox } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { authService } from '../services/api';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AuthStackParamList } from '../navigation/types';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../contexts/AuthContext';
import axios from 'axios';
import { BASE_URL } from '../config';
import Svg, { Defs, RadialGradient, Rect, Stop } from 'react-native-svg';

type LoginScreenProps = NativeStackScreenProps<AuthStackParamList, 'Login'>;

const { height: SCREEN_HEIGHT } = Dimensions.get('window');

export const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const { signIn } = useAuth();
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  useEffect(() => {
    // Kayıtlı email'i kontrol et
    const checkSavedEmail = async () => {
      try {
        const savedEmail = await AsyncStorage.getItem('email');
        if (savedEmail) {
          setUsernameOrEmail(savedEmail);
          setRememberMe(true);
        }
      } catch (error) {
        console.error('Error checking saved email:', error);
      }
    };
    checkSavedEmail();
  }, []);

  const handleLogin = async () => {
    setLoginError('');
    if (!usernameOrEmail || !password) {
      setLoginError('Please enter your username/email and password.');
      return;
    }

    try {
      setLoading(true);
      const response = await authService.login(usernameOrEmail, password);
      await signIn(response.accessToken);
      if (rememberMe) {
        await AsyncStorage.setItem('email', usernameOrEmail);
      } else {
        await AsyncStorage.removeItem('email');
      }
    } catch (error: any) {
      if (error.response) {
        switch (error.response.status) {
          case 401:
            setLoginError('Username/email or password is incorrect.');
            break;
          case 400:
            setLoginError('Invalid login information.');
            break;
          case 403:
            setLoginError('Your account has been deactivated.');
            break;
          default:
            setLoginError('An error occurred while logging in. Please try again.');
        }
      } else if (error.request) {
        setLoginError('Unable to connect to server. Please check your internet connection.');
      } else {
        setLoginError('An unexpected error occurred. Please try again.');
      }
      console.error('Login error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTestBackend = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/auth/test`);
      Alert.alert('Success', `Backend connection successful: ${response.data}`);
    } catch (error) {
      Alert.alert('Error', 'Backend connection failed!');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: COLORS.background }}>
      <View style={styles.content}>
        <View style={styles.logoContainer}>
          <Text style={[styles.logo, FONTS.script]}>n</Text>
          <Text style={styles.logoText}>NOTESPHERE</Text>
        </View>

        <View style={styles.formContainer}>
          {loginError ? (
            <Text style={styles.errorText}>{loginError}</Text>
          ) : null}
          
          <TextInput
            mode="outlined"
            label="Enter your username or email"
            value={usernameOrEmail}
            onChangeText={setUsernameOrEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={loading}
            outlineStyle={styles.inputOutline}
            theme={{ colors: { primary: COLORS.primary } }}
          />

          <TextInput
            mode="outlined"
            label="Enter your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            right={
              <TextInput.Icon
                icon={showPassword ? 'eye-off' : 'eye'}
                onPress={() => setShowPassword(!showPassword)}
              />
            }
            style={styles.input}
            disabled={loading}
            outlineStyle={styles.inputOutline}
            theme={{ colors: { primary: COLORS.primary } }}
          />

          <View style={styles.rememberMeContainer}>
            <Checkbox.Android
              status={rememberMe ? 'checked' : 'unchecked'}
              onPress={() => setRememberMe(!rememberMe)}
              color={COLORS.primary}
            />
            <Text style={styles.rememberMeText}>Remember Me</Text>
            <TouchableOpacity
              style={styles.forgotPasswordButton}
              onPress={() => navigation.navigate('ForgotPassword')}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={[styles.loginButton, loading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color={COLORS.white} />
            ) : (
              <Text style={styles.loginButtonText}>Login</Text>
            )}
          </TouchableOpacity>


          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.registerLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={{
              marginTop: 12,
              padding: 10,
              borderRadius: 8,
              borderWidth: 1,
              borderColor: COLORS.primary,
              alignItems: 'center',
            }}
            onPress={handleTestBackend}
          >
            <Text style={{ color: COLORS.primary }}>Test Backend Connection</Text>
          </TouchableOpacity>

        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  content: {
    flex: 1,
    padding: SIZES.xl,
    justifyContent: 'center',
    borderBottomLeftRadius: 40,
    borderBottomRightRadius: 40,
    backgroundColor: COLORS.background,
    paddingBottom: 32,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: SIZES.xxxl,
  },
  logo: {
    fontSize: 128,
    color: COLORS.primary,
    ...FONTS.script,
    marginBottom: SIZES.xs,
    paddingHorizontal: 24,
  },
  logoText: {
    fontSize: 36,
    color: COLORS.primary,
    ...FONTS.bold,
  },
  formContainer: {
    backgroundColor: COLORS.background,
    borderRadius: 16,
    elevation: 2,
    shadowColor: COLORS.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: SIZES.xl,
  },
  input: {
    marginBottom: SIZES.md,
    backgroundColor: COLORS.white,
    color: COLORS.text,
  },
  inputOutline: {
    borderRadius: 8,
    borderColor: COLORS.border,
  },
  errorText: {
    color: COLORS.error,
    marginBottom: SIZES.md,
    textAlign: 'center',
    ...FONTS.medium,
  },
  rememberMeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  rememberMeText: {
    ...FONTS.regular,
    color: COLORS.text,
    flex: 1,
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginBottom: SIZES.lg,
  },
  forgotPasswordText: {
    color: COLORS.primary,
    ...FONTS.medium,
    fontSize: 14,
  },
  loginButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: 24,
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  loginButtonDisabled: {
    opacity: 0.7,
  },
  loginButtonText: {
    color: COLORS.white,
    ...FONTS.bold,
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerText: {
    ...FONTS.regular,
    color: COLORS.text,
  },
  registerLink: {
    color: COLORS.primary,
    ...FONTS.bold,
  },
});

export default LoginScreen; 
