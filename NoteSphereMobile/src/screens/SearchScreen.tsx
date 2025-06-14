import React, { useState, useEffect } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { Text, Searchbar, Chip, Avatar } from 'react-native-paper';
import { COLORS, FONTS, SIZES } from '../utils/theme';
import { CompositeScreenProps } from '@react-navigation/native';
import { BottomTabScreenProps } from '@react-navigation/bottom-tabs';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { MainTabsParamList, RootStackParamList } from '../navigation/types';
import { Note, User } from '../types';
import { MaterialCommunityIcons } from '@expo/vector-icons';

type SearchScreenProps = CompositeScreenProps<
  BottomTabScreenProps<MainTabsParamList, 'Search'>,
  NativeStackScreenProps<RootStackParamList>
>;

type SearchType = 'topic' | 'user' | 'note';

export const SearchScreen: React.FC<SearchScreenProps> = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState<SearchType>('topic');
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<{
    topics: string[];
    users: User[];
    notes: Note[];
  }>({
    topics: [],
    users: [],
    notes: [],
  });

  useEffect(() => {
    if (searchQuery.length >= 2) {
      handleSearch();
    } else {
      setResults({ topics: [], users: [], notes: [] });
    }
  }, [searchQuery, activeTab]);

  const handleSearch = async () => {
    setLoading(true);
    try {
      // TODO: Implement search API calls
      // Temporary mock data
      const mockResults = {
        topics: ['matematik', 'fizik', 'kimya', 'biyoloji'],
        users: [
          {
            id: '1',
            username: 'math_teacher',
            email: 'math@example.com',
          },
          {
            id: '2',
            username: 'physics_prof',
            email: 'physics@example.com',
          },
        ],
        notes: [
          {
            id: '1',
            title: 'Matematik Formülleri',
            content: 'İntegral ve türev formülleri...',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            isPublic: true,
            owner: {
              id: '1',
              username: 'math_teacher',
              email: 'math@example.com',
            },
            collaborators: [],
            tags: ['matematik', 'formül'],
            likes: 156,
            comments: 23,
          },
        ],
      };
      setResults(mockResults);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTopicResults = () => (
    <View style={styles.resultsContainer}>
      {results.topics.map((topic, index) => (
        <Chip
          key={index}
          style={styles.topicChip}
          onPress={() => {
            setSearchQuery(topic);
            setActiveTab('note');
          }}
        >
          {topic}
        </Chip>
      ))}
    </View>
  );

  const renderUserResults = () => (
    <View style={styles.resultsContainer}>
      {results.users.map((user) => (
        <TouchableOpacity
          key={user.id}
          style={styles.userCard}
          onPress={() => navigation.navigate('Main', { screen: 'Profile', params: { userId: user.id } })}
        >
          <Avatar.Text
            size={40}
            label={user.username.substring(0, 2).toUpperCase()}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.username}>@{user.username}</Text>
            <Text style={styles.email}>{user.email}</Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderNoteResults = () => (
    <View style={styles.resultsContainer}>
      {results.notes.map((note) => (
        <TouchableOpacity
          key={note.id}
          style={styles.noteCard}
          onPress={() => navigation.navigate('Main', { screen: 'Note', params: { noteId: note.id } })}
        >
          <Text style={styles.noteTitle}>{note.title}</Text>
          <Text style={styles.noteContent} numberOfLines={2}>
            {note.content}
          </Text>
          <View style={styles.noteFooter}>
            <View style={styles.noteStats}>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="heart" size={16} color={COLORS.primary} />
                <Text style={styles.statText}>{note.likes}</Text>
              </View>
              <View style={styles.statItem}>
                <MaterialCommunityIcons name="comment" size={16} color={COLORS.primary} />
                <Text style={styles.statText}>{note.comments}</Text>
              </View>
            </View>
            <Text style={styles.noteDate}>
              {new Date(note.updatedAt).toLocaleDateString()}
            </Text>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Searchbar
          placeholder="Search..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          placeholderTextColor={COLORS.textLight}
          iconColor={COLORS.primary}
        />

        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'topic' && styles.activeTab]}
            onPress={() => setActiveTab('topic')}
          >
            <Text style={[styles.tabText, activeTab === 'topic' && styles.activeTabText]}>
              Topics
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'user' && styles.activeTab]}
            onPress={() => setActiveTab('user')}
          >
            <Text style={[styles.tabText, activeTab === 'user' && styles.activeTabText]}>
              Users
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.tab, activeTab === 'note' && styles.activeTab]}
            onPress={() => setActiveTab('note')}
          >
            <Text style={[styles.tabText, activeTab === 'note' && styles.activeTabText]}>
              Notes
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView style={styles.content}>
        {loading ? (
          <ActivityIndicator size="large" color={COLORS.primary} style={styles.loader} />
        ) : (
          <>
            {activeTab === 'topic' && renderTopicResults()}
            {activeTab === 'user' && renderUserResults()}
            {activeTab === 'note' && renderNoteResults()}
          </>
        )}
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
    backgroundColor: COLORS.surface,
    padding: SIZES.lg,
    paddingTop: Platform.OS === 'ios' ? SIZES.xxxl : SIZES.xl,
  },
  searchBar: {
    backgroundColor: COLORS.background,
    elevation: 0,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  searchInput: {
    ...FONTS.regular,
    fontSize: 16,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: SIZES.md,
  },
  tab: {
    flex: 1,
    paddingVertical: SIZES.sm,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: COLORS.primary,
  },
  tabText: {
    ...FONTS.medium,
    fontSize: 14,
    color: COLORS.textLight,
  },
  activeTabText: {
    color: COLORS.primary,
  },
  content: {
    flex: 1,
  },
  loader: {
    marginTop: SIZES.xl,
  },
  resultsContainer: {
    padding: SIZES.lg,
  },
  topicChip: {
    margin: SIZES.xs,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: 8,
    marginBottom: SIZES.md,
  },
  avatar: {
    backgroundColor: COLORS.primary,
  },
  userInfo: {
    marginLeft: SIZES.md,
  },
  username: {
    ...FONTS.medium,
    fontSize: 16,
    color: COLORS.text,
  },
  email: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
  },
  noteCard: {
    backgroundColor: COLORS.surface,
    padding: SIZES.md,
    borderRadius: 8,
    marginBottom: SIZES.md,
  },
  noteTitle: {
    ...FONTS.bold,
    fontSize: 16,
    color: COLORS.text,
    marginBottom: SIZES.xs,
  },
  noteContent: {
    ...FONTS.regular,
    fontSize: 14,
    color: COLORS.textLight,
    marginBottom: SIZES.sm,
  },
  noteFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  noteStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: SIZES.md,
  },
  statText: {
    ...FONTS.medium,
    fontSize: 12,
    color: COLORS.textLight,
    marginLeft: SIZES.xs,
  },
  noteDate: {
    ...FONTS.regular,
    fontSize: 12,
    color: COLORS.textLight,
  },
}); 