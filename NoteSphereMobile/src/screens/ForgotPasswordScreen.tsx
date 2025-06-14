import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import { TextInput, Text, IconButton } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type ForgotPasswordScreenProps = {
  navigation: NativeStackNavigationProp<any>;
};

export const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const handleResetPassword = async () => {
    if (!email) {
      Alert.alert('Error', 'Please enter your email');
      return;
    }

    try {
      setLoading(true);
      // TODO: Implement password reset functionality
      Alert.alert(
        'Success',
        'Password reset link has been sent to your email address.'
      );
      navigation.goBack();
    } catch (error) {
      Alert.alert(
        'Hata',
        'Password reset failed. Please try again.'
      );
      console.error('Password reset error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <IconButton
            icon="arrow-left"
            size={24}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          />
          <Text style={styles.title}>FORGOT PASSWORD</Text>
        </View>

        <View style={styles.formContainer}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name="shield-lock"
              size={48}
              color={COLORS.primary}
            />
          </View>

          <Text style={styles.subtitle}>Trouble Logging in?</Text>
          <Text style={styles.description}>
            Enter your email and we'll send you a link to reset your password.
          </Text>

          <TextInput
            mode="outlined"
            label="Email"
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            keyboardType="email-address"
            autoCapitalize="none"
            disabled={loading}
            outlineStyle={styles.inputOutline}
            theme={{ colors: { primary: COLORS.primary } }}
          />

          <TouchableOpacity
            style={[styles.resetButton, loading && styles.resetButtonDisabled]}
            onPress={handleResetPassword}
            disabled={loading}
          >
            <Text style={styles.resetButtonText}>
              {loading ? 'Sending...' : 'Reset Password'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.returnButton}
            onPress={() => navigation.navigate('Login')}
          >
            <Text style={styles.returnButtonText}>Return to Login Page</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary,
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
    color: COLORS.surface,
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
  iconContainer: {
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  subtitle: {
    ...FONTS.bold,
    fontSize: 18,
    color: COLORS.text,
    textAlign: 'center',
    marginBottom: SIZES.sm,
  },
  description: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    textAlign: 'center',
    marginBottom: SIZES.xl,
  },
  input: {
    marginBottom: SIZES.xl,
    backgroundColor: COLORS.surface,
  },
  inputOutline: {
    borderRadius: 8,
    borderColor: COLORS.border,
  },
  resetButton: {
    backgroundColor: COLORS.primary,
    padding: SIZES.md,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: SIZES.lg,
  },
  resetButtonDisabled: {
    opacity: 0.7,
  },
  resetButtonText: {
    color: COLORS.surface,
    ...FONTS.medium,
    fontSize: 16,
  },
  returnButton: {
    alignItems: 'center',
  },
  returnButtonText: {
    color: COLORS.primary,
    ...FONTS.medium,
    fontSize: 14,
  },
});

export default ForgotPasswordScreen; 