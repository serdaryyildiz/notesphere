import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { COLORS } from './src/utils/theme';
import { AppNavigator } from './src/navigation/AppNavigator';
import { useFonts } from 'expo-font';
import { ActivityIndicator, View } from 'react-native';

const theme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: COLORS.primary,
    onPrimary: COLORS.surface,
    surface: COLORS.surface,
    background: COLORS.background,
    text: COLORS.text,
    placeholder: COLORS.textLight,
    error: COLORS.error,
    success: COLORS.success,
  },
};

export default function App() {
  const [fontsLoaded] = useFonts({
    'BukhariScript': require('./assets/fonts/Bukhari Script.ttf'),
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <PaperProvider theme={theme}>
        <AuthProvider>
          <NavigationContainer>
            <AppNavigator />
          </NavigationContainer>
        </AuthProvider>
      </PaperProvider>
    </SafeAreaProvider>
  );
}
