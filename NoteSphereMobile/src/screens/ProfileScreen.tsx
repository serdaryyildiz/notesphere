import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  Platform,
  Image,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { User } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useAuth } from '../contexts/AuthContext';
import NoteList from '../components/NoteList';
import { BASE_URL } from 'config';

type ProfileScreenProps = {
  navigation: any;
  route?: any;
};

const ProfileScreen = ({ navigation, route }: ProfileScreenProps) => {
  const loggedInUserId = '1'; // !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!111!!!1!11!!1!!!!! Bu değer ileride auth context'ten alınmalı
  const viewedUserId = route?.params?.userId || loggedInUserId;
  const isOwnProfile = viewedUserId === loggedInUserId;
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { signOut } = useAuth();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${BASE_URL}/users/${viewedUserId}`);
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user profile:', error);
      Alert.alert('Error', 'An error occurred while loading profile information.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Logout error:', error);
      Alert.alert('Error', 'An error occurred while logging out.');
    }
  };

  const renderStatItem = (icon: string, label: string, value: string) => (
    <View style={styles.statItem}>
      <MaterialCommunityIcons name={icon as any} size={24} color={COLORS.primary} />
      <Text style={styles.statLabel}>{label}</Text>
      <Text style={styles.statValue}>{value}</Text>
    </View>
  );

  if (loading || !user) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Profile</Text>
        </View>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading profile...</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Profile</Text>
        <TouchableOpacity onPress={handleLogout} style={styles.logoutIcon}>
          <MaterialCommunityIcons name="logout" size={24} color={COLORS.surface} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content}>
        <View style={styles.profileSection}>
          <Image source={{ uri: user.avatar }} style={styles.avatar} />
          <Text style={styles.username}>{user.username}</Text>
          <Text style={styles.email}>{user.email}</Text>
        </View>

        <View style={styles.statsSection}>
          {renderStatItem('note', 'Notes', '12')}
          {renderStatItem('folder', 'Repositories', '5')}
          {renderStatItem('briefcase', 'Projects', '3')}
          {renderStatItem('account-group', 'Collaborators', '8')}
        </View>

        {isOwnProfile && (
          <View style={styles.actionsSection}>
            <Button
              mode="contained"
              onPress={() => Alert.alert('Info', 'Edit profile feature coming soon!')}
              style={styles.actionButton}
              contentStyle={styles.actionButtonContent}
            >
              Edit Profile
            </Button>

            <Button
              mode="outlined"
              onPress={handleLogout}
              style={[styles.actionButton, styles.logoutButton]}
              contentStyle={styles.actionButtonContent}
              textColor={COLORS.error}
            >
              Logout
            </Button>
          </View>
        )}

        <View style={{ padding: SIZES.lg }}>
          <Text style={[FONTS.bold, { fontSize: 18, marginBottom: SIZES.md }]}>My Notes</Text>
          <NoteList endpoint={`/users/${user.id}/notes`} />
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    backgroundColor: COLORS.primary,
    padding: SIZES.lg,
    paddingTop: Platform.OS === 'ios' ? SIZES.xxxl : SIZES.xl,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    ...FONTS.bold,
    fontSize: 28,
    color: COLORS.surface,
  },
  content: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
  },
  profileSection: {
    alignItems: 'center',
    padding: SIZES.xl,
    backgroundColor: COLORS.surface,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    marginBottom: SIZES.lg,
  },
  username: {
    ...FONTS.bold,
    fontSize: 24,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  email: {
    ...FONTS.regular,
    fontSize: 16,
    color: COLORS.textLight,
  },
  statsSection: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: SIZES.lg,
    backgroundColor: COLORS.surface,
    marginTop: SIZES.md,
  },
  statItem: {
    width: '50%',
    alignItems: 'center',
    marginVertical: SIZES.md,
  },
  statLabel: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
    marginTop: SIZES.xs,
  },
  statValue: {
    ...FONTS.bold,
    fontSize: 20,
    color: COLORS.text,
    marginTop: SIZES.xs,
  },
  actionsSection: {
    padding: SIZES.lg,
    backgroundColor: COLORS.surface,
    marginTop: SIZES.md,
  },
  actionButton: {
    marginBottom: SIZES.md,
  },
  actionButtonContent: {
    height: 48,
  },
  logoutIcon: {
    padding: SIZES.xs,
  },
  logoutButton: {
    borderColor: COLORS.error,
  },
});

export default ProfileScreen;
